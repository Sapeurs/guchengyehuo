/**
 * 场景音乐与音效。
 *
 * 优先播放 `public/assets/audio/` 里的真实采样；任何一个采样没能加载（网络失败、
 * 浏览器不支持 ogg），对应事件就退回原来的程序合成音，保证不会突然变得没声音。
 * 所有音源在暂停、静音或页面隐藏时都会停止。
 */

export type SfxKind =
  | 'cloth' | 'paper' | 'wood' | 'wood-hit' | 'latch' | 'lock'
  | 'metal' | 'step' | 'step-earth' | 'knock' | 'door'
  | 'air' | 'thunder' | 'reveal' | 'water';

type Place = 'yard' | 'room' | 'lamp' | 'normal' | 'river' | 'temple' | 'tower';

const AUDIO_DIR = 'audio/';

/** 每个事件可用的采样，随机取一个以免重复听感发木。 */
const SAMPLES: Record<SfxKind, string[]> = {
  cloth: ['cloth'],
  paper: ['paper'],
  wood: ['wood'],
  'wood-hit': ['wood-hit'],
  latch: ['latch'],
  lock: ['lock'],
  metal: ['metal'],
  step: ['step', 'step-earth'],
  'step-earth': ['step-earth'],
  knock: ['knock'],
  door: ['door'],
  air: ['air', 'ambient-yard'],
  thunder: ['thunder'],
  reveal: ['reveal'],
  water: ['water'],
};

/** 场景底噪：每个地点一条循环音轨。 */
const AMBIENCE: Record<Place, string> = {
  yard: 'ambient-yard',
  room: 'ambient-room',
  lamp: 'ambient-room',
  normal: 'ambient-yard',
  river: 'ambient-river',
  temple: 'ambient-temple',
  tower: 'ambient-tower',
};

/** 底噪整体音量，按地点微调（室内更轻，城楼更响）。 */
const AMBIENCE_LEVEL: Record<Place, number> = {
  yard: 0.5, room: 0.28, lamp: 0.18, normal: 0.5, river: 0.55, temple: 0.36, tower: 0.62,
};

export class Foley {
  enabled = true;
  private context?: AudioContext;
  private master?: GainNode;
  /** 真实采样：名字 -> 已解码缓冲 */
  private buffers = new Map<string, AudioBuffer>();
  private loading = new Set<string>();
  /** 当前底噪循环 */
  private ambience?: { source: AudioBufferSourceNode; gain: GainNode };
  private ambienceName = '';
  private sceneWind = 0.45;
  private river?: GainNode;
  private sceneRiver = 0;
  private appPaused = false;
  private samplesReady = false;

  constructor() {
    try { this.enabled = localStorage.getItem('gucheng:sound') !== 'off'; } catch {}
    document.addEventListener('visibilitychange', () => this.mix());
  }

  /** 采样目录的前缀，兼容 Vite 的 base 路径与 file:// 打包。 */
  private base = (() => {
    try { return import.meta.env.BASE_URL ?? '/'; } catch { return '/'; }
  })();

  unlock() {
    try {
      if (!this.context) {
        const c = (this.context = new AudioContext());
        this.master = c.createGain();
        this.master.gain.value = 0.7;
        this.master.connect(c.destination);
        this.buildSynthBed(c);
        void this.preload();
        this.mix();
      }
      if (this.enabled && !this.appPaused && this.context.state === 'suspended') void this.context.resume();
    } catch {
      this.enabled = false;
    }
  }

  /** 把需要的采样全部解码进内存；失败的条目之后自动走合成兜底。 */
  private async preload() {
    const c = this.context;
    if (!c || this.samplesReady) return;
    this.samplesReady = true;
    const names = new Set<string>();
    for (const list of Object.values(SAMPLES)) for (const n of list) names.add(n);
    for (const n of Object.values(AMBIENCE)) names.add(n);
    await Promise.all([...names].map((n) => this.decode(n)));
  }

  private async decode(name: string): Promise<void> {
    const c = this.context;
    if (!c || this.buffers.has(name) || this.loading.has(name)) return;
    this.loading.add(name);
    try {
      const res = await fetch(`${this.base}assets/${AUDIO_DIR}${name}.ogg`);
      if (!res.ok) throw new Error(String(res.status));
      this.buffers.set(name, await c.decodeAudioData(await res.arrayBuffer()));
      // 底噪可能在采样到位前就已经请求过，这里补上。
      if (this.ambienceName === name && !this.ambience) this.startAmbience(name);
    } catch {
      // 缺素材是可以接受的降级，不打断玩家。
    } finally {
      this.loading.delete(name);
    }
  }

  /** 原来那层风声与水声，只作为采样缺失时的底子。 */
  private buildSynthBed(c: AudioContext) {
    const buffer = c.createBuffer(1, c.sampleRate * 7, c.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + (Math.random() * 2 - 1) * 0.025) / 1.025;
      data[i] = last;
    }
    if (!this.master) return;
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 480;
    const wind = c.createGain();
    wind.gain.value = 0;
    source.connect(filter).connect(wind).connect(this.master);
    source.start();
    const lfo = c.createOscillator();
    const amount = c.createGain();
    lfo.frequency.value = 0.12;
    amount.gain.value = 0.08;
    lfo.connect(amount).connect(wind.gain);
    lfo.start();
    this.windNodes = wind;

    const wash = c.createBufferSource();
    wash.buffer = buffer;
    wash.loop = true;
    const waterFilter = c.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.value = 1250;
    waterFilter.Q.value = 0.4;
    this.river = c.createGain();
    this.river.gain.value = 0;
    wash.connect(waterFilter).connect(this.river).connect(this.master);
    wash.start();
  }

  private windNodes?: GainNode;

  toggle() {
    this.enabled = !this.enabled;
    this.unlock();
    this.mix();
    try { localStorage.setItem('gucheng:sound', this.enabled ? 'on' : 'off'); } catch {}
  }

  private mix() {
    if (this.master) {
      this.master.gain.setTargetAtTime(
        this.enabled && !document.hidden && !this.appPaused ? 0.7 : 0,
        this.context!.currentTime,
        0.15,
      );
    }
    this.applyAmbienceLevel();
  }

  private applyAmbienceLevel() {
    const c = this.context;
    if (!c || !this.ambience) return;
    const level = AMBIENCE_LEVEL[(this.place || 'normal') as Place] ?? 0.4;
    const target = this.enabled && !this.appPaused && !document.hidden ? level : 0;
    this.ambience.gain.gain.setTargetAtTime(target, c.currentTime, 0.6);
  }

  setAppPaused(paused: boolean) {
    this.appPaused = paused;
    this.mix();
    this.applyAmbienceLevel();
    if (this.context) {
      if (paused) void this.context.suspend().catch(() => {});
      else if (this.enabled && !document.hidden) void this.context.resume().catch(() => {});
    }
  }

  private place: Place = 'normal';

  locationMood(place: Place) {
    this.place = place;
    // 旧合成层降为很轻的底，真实采样接管主要听感；采样缺失时它仍在。
    this.sceneWind = { yard: 0.12, room: 0.06, lamp: 0.04, normal: 0.14, river: 0.06, temple: 0.03, tower: 0.16 }[place];
    this.sceneRiver = place === 'river' ? 0.25 : 0;
    const c = this.context;
    if (c) {
      if (this.windNodes) this.windNodes.gain.setTargetAtTime(this.sceneWind, c.currentTime, 0.8);
      if (this.river) this.river.gain.setTargetAtTime(this.sceneRiver, c.currentTime, 1.2);
    }
    this.requestAmbience(AMBIENCE[place]);
  }

  private requestAmbience(name: string) {
    if (this.ambienceName === name && this.ambience) return;
    this.ambienceName = name;
    if (this.ambience) {
      // 已经在放别的底噪：交叉淡出换过去。
      this.swapAmbience(name);
      return;
    }
    if (!this.buffers.has(name)) {
      void this.decode(name);
      return;
    }
    this.startAmbience(name);
  }

  private startAmbience(name: string) {
    const c = this.context;
    const m = this.master;
    const buffer = this.buffers.get(name);
    if (!c || !m || !buffer || this.ambience) return;
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = c.createGain();
    gain.gain.value = 0;
    source.connect(gain).connect(m);
    source.start();
    this.ambience = { source, gain };
    this.applyAmbienceLevel();
  }

  /** 切换场景时换成对应底噪。 */
  private swapAmbience(nextName: string) {
    const c = this.context;
    const m = this.master;
    if (!c || !m) return;
    const old = this.ambience;
    const buffer = this.buffers.get(nextName);
    if (!buffer) { void this.decode(nextName); return; }
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = c.createGain();
    gain.gain.value = 0;
    source.connect(gain).connect(m);
    source.start();
    this.ambience = { source, gain };
    if (old) {
      old.gain.gain.setTargetAtTime(0, c.currentTime, 0.5);
      const stopAt = c.currentTime + 2.4;
      try { old.source.stop(stopAt); } catch {}
    }
    this.applyAmbienceLevel();
  }

  /** 直接播放一段采样；返回是否成功（失败则调用方走合成兜底）。 */
  private playSample(kind: SfxKind, delay: number, volume: number): boolean {
    const c = this.context;
    const m = this.master;
    if (!c || !m) return false;
    const list = SAMPLES[kind];
    const name = list[Math.floor(Math.random() * list.length)];
    const buffer = this.buffers.get(name);
    if (!buffer) return false;
    const at = c.currentTime + delay;
    const source = c.createBufferSource();
    source.buffer = buffer;
    const gain = c.createGain();
    gain.gain.value = volume;
    source.connect(gain).connect(m);
    source.start(at);
    return true;
  }

  play(kind: SfxKind, delay = 0, volume = 0.85) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.context || !this.master) return;
    if (this.playSample(kind, delay, volume)) return;
    this.playSynth(kind, delay);
  }

  /** 采样缺失时的合成兜底，保留原有音色。 */
  private playSynth(kind: SfxKind, delay = 0) {
    const c = this.context;
    const m = this.master;
    if (!c || !m) return;
    const table: Record<string, [number, number, number]> = {
      cloth: [0.13, 1800, 0.11], paper: [0.35, 2300, 0.18], wood: [0.11, 700, 0.24],
      'wood-hit': [0.11, 700, 0.24], latch: [0.36, 1200, 0.28], lock: [0.4, 1000, 0.26],
      metal: [0.3, 3000, 0.16], water: [0.6, 1300, 0.2], step: [0.2, 180, 0.4],
      'step-earth': [0.2, 180, 0.4], knock: [0.12, 320, 0.55], door: [0.5, 300, 0.4],
      air: [0.5, 900, 0.12], thunder: [1.4, 200, 0.4], reveal: [1.7, 110, 0.2],
    };
    const config = table[kind] ?? [0.2, 800, 0.2];
    const [duration, cutoff, volume] = config;
    const now = c.currentTime + delay;
    const b = c.createBuffer(1, Math.ceil(c.sampleRate * duration), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (kind === 'paper' ? 0.5 + 0.5 * Math.sin(i / 400) : 1);
    const src = c.createBufferSource();
    src.buffer = b;
    const filter = c.createBiquadFilter();
    filter.type = kind === 'cloth' || kind === 'paper' ? 'highpass' : 'lowpass';
    filter.frequency.value = cutoff;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(volume, now + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter).connect(g).connect(m);
    src.start(now);
    src.stop(now + duration + 0.02);
    if (['wood', 'wood-hit', 'latch', 'knock', 'step', 'step-earth', 'reveal', 'lock', 'door'].includes(kind)) {
      const osc = c.createOscillator();
      const tone = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(kind === 'reveal' ? 62 : kind === 'latch' ? 190 : 105, now);
      osc.frequency.exponentialRampToValueAtTime(kind === 'reveal' ? 42 : 52, now + duration);
      tone.gain.setValueAtTime(0.0001, now);
      tone.gain.linearRampToValueAtTime(volume * 0.45, now + 0.009);
      tone.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(tone).connect(m);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }
  }

  discovery(theme: 'recognition' | 'signal' | 'dawn' | 'discovery') {
    if (!this.enabled) return;
    this.unlock();
    this.play('reveal', 0, 0.7);
    const c = this.context;
    const m = this.master;
    if (!c || !m) return;
    const notes = theme === 'signal' ? [196, 261.63, 196, 293.66]
      : theme === 'dawn' ? [146.83, 220, 293.66, 329.63]
      : theme === 'recognition' ? [130.81, 196, 164.81]
      : [110, 146.83];
    const spacing = theme === 'signal' ? 0.8 : 0.55;
    notes.forEach((hz, i) => {
      const t = c.currentTime + 0.25 + i * spacing;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.03, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      osc.connect(g).connect(m);
      osc.start(t);
      osc.stop(t + 1.85);
    });
  }

  storyCue() {
    if (!this.enabled) return;
    this.unlock();
    const c = this.context;
    const m = this.master;
    if (!c || !m) return;
    [146.83, 174.61, 220].forEach((frequency, i) => {
      const t = c.currentTime + i * 0.33;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.03, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.45);
      osc.connect(gain).connect(m);
      osc.start(t);
      osc.stop(t + 1.5);
    });
  }

  patrol() {
    [0, 0.65, 1.3, 2, 2.65, 3.3].forEach((t) => this.play('step-earth', t, 0.8));
    this.play('knock', 4, 0.9);
    this.play('knock', 4.3, 0.75);
  }

  /** 移动机关部件时的摩擦声，只在实际拖动期间存在。 */
  friction() {
    if (!this.enabled) return { set: (_n: number) => {}, stop: () => {} };
    this.unlock();
    const c = this.context;
    const m = this.master;
    if (!c || !m) return { set: (_n: number) => {}, stop: () => {} };
    const b = c.createBuffer(1, Math.ceil(c.sampleRate * 0.6), c.sampleRate);
    const data = b.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(i / 290));
    const src = c.createBufferSource();
    src.buffer = b;
    src.loop = true;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 380;
    filter.Q.value = 0.6;
    const gain = c.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(m);
    src.start();
    let stopped = false;
    return {
      set: (strength: number) => {
        if (!stopped) gain.gain.setTargetAtTime(Math.max(0, Math.min(1, strength)) * 0.085, c.currentTime, 0.035);
      },
      stop: () => {
        if (stopped) return;
        stopped = true;
        gain.gain.setTargetAtTime(0, c.currentTime, 0.018);
        src.stop(c.currentTime + 0.08);
      },
    };
  }
}
