import {BOTTOM_PROOF} from './crate-bottom.ts';
import type {CampaignProgress} from './campaign-state';
/** Old completed saves may predate the current physical drafts. Reconstruct the
 * proof for inspection only; never rewrite an unfinished draft or persisted save. */
export function worldViewDraft(id:string,draft:(string|number)[],done:boolean):(string|number)[] {
  if(!done)return draft;
  const proofs:Record<string,number[]>={
    'c1-p2':[1,3], 'c1-p3':[...BOTTOM_PROOF], 'c1-p4':[1,67,42],
    'c1-p5':[1,2,9,1], 'c1-p6':[3]
  };
  return proofs[id]?[...proofs[id]]:draft;
}
/** Persistent changes made to the first chapter's actual rooms. */
export const WORLD_FLAGS = ['c1-drawer-open', 'c1-lining-lifted', 'c1-patrol-active', 'c1-patrol-done', 'c1-patrol-pending'] as const;
export type WorldFlag = typeof WORLD_FLAGS[number];

export function changeRoom(s:CampaignProgress, action:'drawer'|'lining'|'quiet'):CampaignProgress {
  if(s.chapter!==1)return s;
  const flag = action==='drawer'&&s.scene===1 ? 'c1-drawer-open' : action==='lining'&&s.scene===0&&s.solved.includes('c1-p1') ? 'c1-lining-lifted' : action==='quiet'&&s.world.includes('c1-patrol-active') ? 'c1-patrol-done' : null;
  if(!flag || s.world.includes(flag))return s;
  return {...s,world:[...s.world.filter(f=>action!=='quiet'||f!=='c1-patrol-active'),flag]};
}

export const PAPER_START = [0, 24, 67];
export const PAPER_LIGHT = [67, 42];
export function paperClarity(d: (string | number)[]): number {
  if (d.length !== 3 || d.some(v => typeof v !== 'number' || !Number.isFinite(v))) return 0;
  const distance = Math.hypot((Number(d[1]) - PAPER_LIGHT[0]) / 23, (Number(d[2]) - PAPER_LIGHT[1]) / 27);
  return Math.max(0, 1 - distance) * (d[0] === 1 ? 1 : .18);
}
export function paperReadable(d: (string | number)[]) { return paperClarity(d) >= .72; }
export function validPaper(d: (string | number)[]) {
  return d.length === 3 && [0, 1].includes(Number(d[0])) && d.every(v => typeof v === 'number' && Number.isFinite(v)) && Number(d[1]) >= 12 && Number(d[1]) <= 88 && Number(d[2]) >= 20 && Number(d[2]) <= 80;
}
export function movePaper(d: (string | number)[], x: number, y: number) {
  return [Number(d[0]), Math.max(12, Math.min(88, x)), Math.max(20, Math.min(80, y))];
}

// Marks are positioned on the same courtyard floor shown in the wide view.
export const TRACK_MARKS = [{x: 39, y: 59, bit: 1}, {x: 56, y: 40, bit: 2}] as const;
export function inspectTrack(mask: number, mark: number, aim: [number, number]) {
  const point = TRACK_MARKS[mark];
  if (!point || !aim.every(Number.isFinite)) return mask;
  return Math.hypot(point.x - aim[0], point.y - aim[1]) <= 17 ? mask | point.bit : mask;
}
