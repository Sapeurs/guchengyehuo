/**
 * 拖拽与点击共用的手势阈值。
 *
 * 之前这些数字散在四个地方（4、5、6 CSS px），同一个「点击 vs 拖动」的判定
 * 在不同机关里不一样。手指在触屏上轻微抖动就常常超过 5–6 px，导致本该算作的
 * 点击被判成拖动、或者拖动被判成点击。统一收到这里，只改一个数。
 */

/**
 * 指针移动超过这个距离才算「拖拽」，否则按点击处理。
 * 8px 是常见的触屏容错值：比鼠标手抖宽，又不至于让轻微拖动失效。
 */
export const DRAG_THRESHOLD = 8;

/** 判断一次指针位移是否已达到拖拽程度。 */
export function isDrag(gdx: number, gdy: number): boolean {
  return Math.hypot(gdx, gdy) >= DRAG_THRESHOLD;
}

/** 只关心单轴时用这个，避免横向拖动被纵向抖动影响。 */
export function isDragX(dx: number): boolean {
  return Math.abs(dx) >= DRAG_THRESHOLD;
}
