/** Quiet, local-only procedural foley. All sources stop on mute or page hiding. */
export class Foley {
  enabled = true;
  private context?: AudioContext;
  private master?: GainNode;
  private wind?: GainNode;
  private sceneWind=.45;
  private river?:GainNode;
  private sceneRiver=0;
  private appPaused=false;
  constructor() {
    try { this.enabled = localStorage.getItem('gucheng:sound') !== 'off'; } catch {}
    document.addEventListener('visibilitychange',()=>this.mix());
  }
  unlock() {
    try {
      if (!this.context) {
        const c=this.context=new AudioContext();
        this.master=c.createGain();this.master.gain.value=.7;this.master.connect(c.destination);
        const buffer=c.createBuffer(1,c.sampleRate*7,c.sampleRate),data=buffer.getChannelData(0);
        let last=0;for(let i=0;i<data.length;i++){last=(last+(Math.random()*2-1)*.025)/1.025;data[i]=last;}
        const source=c.createBufferSource();source.buffer=buffer;source.loop=true;
        const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=480;
        this.wind=c.createGain();source.connect(filter).connect(this.wind).connect(this.master);source.start();
        const lfo=c.createOscillator(),amount=c.createGain();lfo.frequency.value=.12;amount.gain.value=.08;
        lfo.connect(amount).connect(this.wind.gain);lfo.start();
        const wash=c.createBufferSource();wash.buffer=buffer;wash.loop=true;
        const waterFilter=c.createBiquadFilter();waterFilter.type='bandpass';waterFilter.frequency.value=1250;waterFilter.Q.value=.4;
        this.river=c.createGain();this.river.gain.value=0;wash.connect(waterFilter).connect(this.river).connect(this.master);wash.start();
        const tide=c.createOscillator(),swell=c.createGain(),ripple=c.createGain();tide.frequency.value=.27;swell.gain.value=.12;ripple.gain.value=.35;wash.disconnect();wash.connect(waterFilter);waterFilter.disconnect();waterFilter.connect(ripple).connect(this.river);tide.connect(swell).connect(ripple.gain);tide.start();this.mix();
      }
      if(this.enabled&&!this.appPaused&&this.context.state==='suspended')void this.context.resume();
    } catch { this.enabled=false; }
  }
  toggle(){this.enabled=!this.enabled;this.unlock();this.mix();try{localStorage.setItem('gucheng:sound',this.enabled?'on':'off');}catch{}}
  private mix(){if(this.master)this.master.gain.setTargetAtTime(this.enabled&&!document.hidden&&!this.appPaused ? .7 : 0,this.context!.currentTime,.15);if(this.wind)this.wind.gain.value=this.sceneWind;if(this.river)this.river.gain.value=this.sceneRiver;}
  setAppPaused(paused:boolean){this.appPaused=paused;this.mix();if(this.context){if(paused)void this.context.suspend().catch(()=>{});else if(this.enabled&&!document.hidden)void this.context.resume().catch(()=>{});}}
  locationMood(place:'yard'|'room'|'lamp'|'normal'|'river'|'temple'|'tower'){
    this.sceneWind={yard:.42,room:.2,lamp:.12,normal:.45,river:.26,temple:.08,tower:.58}[place];this.sceneRiver=place==='river'?.8:0;
    if(this.context){if(this.wind)this.wind.gain.setTargetAtTime(this.sceneWind,this.context.currentTime,.8);if(this.river)this.river.gain.setTargetAtTime(this.sceneRiver,this.context.currentTime,1.2);}
  }
  discovery(theme:'recognition'|'signal'|'dawn'|'discovery'){
    if(!this.enabled)return;this.unlock();const c=this.context,m=this.master;if(!c||!m)return;
    const notes=theme==='signal'?[196,261.63,196,293.66]:theme==='dawn'?[146.83,220,293.66,329.63]:theme==='recognition'?[130.81,196,164.81]:[110,146.83];
    const spacing=theme==='signal'?.8:.55;
    notes.forEach((hz,i)=>{const t=c.currentTime+i*spacing,osc=c.createOscillator(),g=c.createGain();osc.type='sine';osc.frequency.value=hz;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.035,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+1.8);osc.connect(g).connect(m);osc.start(t);osc.stop(t+1.85);});
    if(theme==='recognition'){this.play('cloth',.25);this.play('knock',.65);}
  }
  storyCue(){if(!this.enabled)return;this.unlock();const c=this.context,m=this.master;if(!c||!m)return;[146.83,174.61,220].forEach((frequency,i)=>{const t=c.currentTime+i*.33,osc=c.createOscillator(),gain=c.createGain();osc.type='triangle';osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(.035,t+.05);gain.gain.exponentialRampToValueAtTime(.0001,t+1.45);osc.connect(gain).connect(m);osc.start(t);osc.stop(t+1.5);});}
  play(kind:'cloth'|'paper'|'wood'|'latch'|'water'|'step'|'knock'|'reveal',delay=0){
    if(!this.enabled)return;this.unlock();const c=this.context,m=this.master;if(!c||!m)return;
    const config={cloth:[.13,1800,.11],paper:[.35,2300,.18],wood:[.11,700,.24],latch:[.36,1200,.28],water:[.6,1300,.2],step:[.2,180,.4],knock:[.12,320,.55],reveal:[1.7,110,.2]}[kind];
    const [duration,cutoff,volume]=config,now=c.currentTime+delay;
    const b=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(kind==='paper'?(.5+.5*Math.sin(i/400)):1);
    const src=c.createBufferSource();src.buffer=b;
    const filter=c.createBiquadFilter();filter.type=kind==='cloth'||kind==='paper'?'highpass':'lowpass';filter.frequency.value=cutoff;
    const g=c.createGain();g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(volume,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+duration);
    src.connect(filter).connect(g).connect(m);src.start(now);src.stop(now+duration+.02);
    if(['wood','latch','knock','step','reveal'].includes(kind)){
      const osc=c.createOscillator(),tone=c.createGain();osc.type='triangle';osc.frequency.setValueAtTime(kind==='reveal'?62:kind==='latch'?190:105,now);osc.frequency.exponentialRampToValueAtTime(kind==='reveal'?42:52,now+duration);
      tone.gain.setValueAtTime(.0001,now);tone.gain.linearRampToValueAtTime(volume*.45,now+.009);tone.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.connect(tone).connect(m);osc.start(now);osc.stop(now+duration+.02);
    }
  }
  patrol(){[0,.65,1.3,2,2.65,3.3].forEach(t=>this.play('step',t));this.play('knock',4);this.play('knock',4.3);}
  /** A quiet contact sound lasts only while the player is moving a part. */
  friction(){
    if(!this.enabled)return {set:(_n:number)=>{},stop:()=>{}};
    this.unlock();const c=this.context,m=this.master;if(!c||!m)return {set:(_n:number)=>{},stop:()=>{}};
    const b=c.createBuffer(1,Math.ceil(c.sampleRate*.6),c.sampleRate),data=b.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(.6+.4*Math.sin(i/290));
    const src=c.createBufferSource();src.buffer=b;src.loop=true;
    const filter=c.createBiquadFilter();filter.type='bandpass';filter.frequency.value=380;filter.Q.value=.6;
    const gain=c.createGain();gain.gain.value=0;src.connect(filter).connect(gain).connect(m);src.start();let stopped=false;
    return {set:(strength:number)=>{if(!stopped)gain.gain.setTargetAtTime(Math.max(0,Math.min(1,strength))*.085,c.currentTime,.035);},stop:()=>{if(stopped)return;stopped=true;gain.gain.setTargetAtTime(0,c.currentTime,.018);src.stop(c.currentTime+.08);}};
  }
}
