import type {CampaignProgress} from './campaign-state';
import {fieldViewDraft} from './field-state';
import {rig} from './chapter-workshop';
import {riverField, riverObservation, witnessReleaseLight} from './river-route';

function spot(label: string, action: string, x: number, y: number, width: number, height: number) {
  return `<button data-field="${action}" class="field-part" aria-label="${label}" style="left:${x}%;top:${y}%;width:${width}%;height:${height}%"><i></i><span>${label}</span></button>`;
}

/** Controls stay on their original objects. Nothing opens a second room. */
export function riverScene(s: CampaignProgress, line: string) {
  const field = riverField(s);
  const done = field ? s.solved.includes(field) : false;
  const draft = field ? fieldViewDraft(field, s.drafts[field] || [], done) : [];
  let objects = '';
  if (s.chapter === 2 && s.scene === 0 && witnessReleaseLight(s)) {
    objects += '<i class="v25-release-on-water" aria-hidden="true"></i>';
  }
  if (field === 'c2-p6') {
    objects += '<i class="v25-tube" aria-hidden="true"></i>';
    if (draft[3]) {
      objects += '<svg class="v25-stop-line" viewBox="0 0 1000 563" aria-hidden="true"><path d="M87 460 Q125 478 146 446 C225 458 287 420 370 352"/><path d="M87 459 Q125 477 146 445 C225 457 287 419 370 351"/></svg>';
    }
    if (!done) {
      objects += spot('查船头的回文筒','tube',48,48,13,12);
      if (!draft[3]) objects += spot('在缆桩加上止索','secure',3,65,15,24);
    }
  }
  if (field === 'c2-p3' && !done) {
    objects = spot('捏一捏盐袋','sack',51,39,10,14)
      + spot('察看篾篓','basket',34,36,11,17)
      + spot('敲一敲箱壁','knock',60,68,11,7)
      + spot('解开绳，掀起箱盖','open-crate',58,59,13,9);
  }
  if (field === 'c2-p3' && done) objects = '<span class="v25-cargo-mark" aria-hidden="true">甲三</span>';
  if (field === 'c2-p5') objects = rig(draft, false, true, done, done && line.length > 0);
  if (field === 'c3-p3') objects = spot('点燃烽堠号灯','light',32,42,14,21);
  if (field === 'c3-p5') {
    const inward = draft[1] === 1;
    const flashed = draft[2] === 1;
    const answered = draft[3] === 1;
    if (flashed) {
      const path = inward ? 'M396 316 L251 161 L267 167 Z' : 'M396 316 L845 240 L880 259 Z';
      objects += `<svg class="v25-signal-ray ${answered?'closing':''}" viewBox="0 0 1000 563" aria-hidden="true"><path d="${path}"/></svg>`;
    }
    if (answered) objects += '<i class="v25-response" title="东门回灯" aria-hidden="true"></i>';
    objects += '<span class="v24-label" style="left:25%;top:34%">东门</span>';
    if (!done) {
      objects += `<span class="v25-slotted-rope ${inward?'inward':''}" aria-hidden="true"></span>`;
      objects += spot('把导索拨入内侧槽','aim:1',57,49,8,13);
      objects += spot('把导索拨回外侧槽','aim:0',76,49,8,13);
      const ready = s.solved.includes('c3-p6');
      objects += spot(ready?'掀遮板，打出闭关号':'短掀遮板看光向',ready?'pull':'preview',32,42,14,18);
    }
  }
  const observation = line || riverObservation(s);
  if (!objects && !observation) return '';
  const escape = (str: string) => str.replaceAll('&','&amp;').replaceAll('<','&lt;');
  return `<div class="v25-room-actions" aria-label="现场物件">${objects}${observation?`<p class="v25-room-line" role="status">${escape(observation)}</p>`:''}</div>`;
}
