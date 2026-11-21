/**
 * 老军匠的表情差分。
 *
 * 立绘只有一张原图，另外三张是从它派生出来的：
 * 警觉 / 忧虑 / 沉思。派生方式只做全局光影与色温变化，
 * 不重绘五官，所以不会有局部接缝，也不假装肌肉动作——
 * 玩家看到的是「同一张脸在不同情绪的光线下」。
 */

export type ArtisanMood = 'neutral' | 'alert' | 'worried' | 'thoughtful';

export const ARTISAN_PORTRAIT: Record<ArtisanMood, string> = {
  neutral: 'chapters/artisan-neutral-v7.png',
  alert: 'chapters/artisan-alert-v7.png',
  worried: 'chapters/artisan-worried-v7.png',
  thoughtful: 'chapters/artisan-thoughtful-v7.png',
};

/** 巡查到来时他抬手示意安静，用最紧绷的那一张。 */
export const ARTISAN_ALERT_LINE = '老军匠';

/**
 * 依据台词内容判断该摆什么表情。
 * 顺序有意义：先判断最紧急的，再判断忧虑，最后才是日常。
 */
export function artisanMoodFor(speaker: string, line: string): ArtisanMood {
  if (speaker !== ARTISAN_ALERT_LINE) return 'neutral';
  const text = line || '';
  // 紧张、制止、门外有动静
  if (/别出声|别点灯|脚步|来人|搜|藏|快走|低声|门外|听见/.test(text)) return 'alert';
  // 担心陆昭、担心货、担心这条路走不通
  if (/危险|怕|小心|当心|连累|回不来|死|出事|不妥|麻烦/.test(text)) return 'worried';
  // 在回忆、在琢磨、话说得慢
  if (/想来|记得|那年|恐怕|也许|未必|说不好|当年|早先/.test(text)) return 'thoughtful';
  return 'neutral';
}
