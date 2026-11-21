/**
 * 「呼吸微光」提示开关。
 *
 * 场景里的可疑物件只给一层极弱的呼吸光，不显示名称、不加边框、不剧透答案，
 * 只回答「这里能不能点」。默认开启，可在暂停菜单/篇章选择里关掉，选择会存到本机。
 *
 * 序章与六关正篇共用这一份状态：两个入口都在页面里常驻，谁改了都会同步给另一边。
 */
const HINT_KEY = 'gucheng-nightfire:visual-hints:v1';

let enabled = true;
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    const raw = localStorage.getItem(HINT_KEY);
    return raw === null ? true : raw !== 'off';
  } catch {
    // 隐私模式下读不到存储，就按默认开启走完这一局。
    return true;
  }
}

function applyToDocument(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.hints = enabled ? 'on' : 'off';
}

export function initVisualHints(): void {
  enabled = readStored();
  applyToDocument();
}

export function visualHintsEnabled(): boolean {
  return enabled;
}

export function setVisualHints(next: boolean): void {
  if (enabled === next) return;
  enabled = next;
  applyToDocument();
  try {
    localStorage.setItem(HINT_KEY, next ? 'on' : 'off');
  } catch {
    // 存不下也只是这次不生效，不影响当前画面。
  }
  for (const fn of listeners) fn();
}

export function toggleVisualHints(): boolean {
  setVisualHints(!enabled);
  return enabled;
}

export function onVisualHintsChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
