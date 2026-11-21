import type {CampaignProgress, Draft} from './campaign-state';
import {passage, hoist, gateBeam} from './chapter-workshop';
import {towers} from './field-polish';
import {fieldViewDraft, rigLamps} from './field-state';

const chapterFields = new Set(['c4-p6', 'c5-p1', 'c5-p4', 'c6-p1', 'c6-p2', 'c6-p3']);
export const isStrongholdPuzzle = (id: string) => chapterFields.has(id);

export function strongholdField(s: CampaignProgress) {
  const has = (id: string) => s.solved.includes(id);
  if (s.chapter === 4 && s.scene === 2 && has('c4-p3') && has('c4-p5') && !has('c4-p6')) return 'c4-p6';
  if (s.chapter === 5 && s.scene === 1) return has('c5-p1') ? 'c5-p4' : 'c5-p1';
  if (s.chapter === 6 && s.scene === 0) return has('c6-p1') && has('c6-p2') ? 'c6-p3' : 'c6-p1';
  if (s.chapter === 6 && s.scene === 1) return 'c6-p2';
}

export function strongholdBackdrop(s: CampaignProgress) {
  switch (strongholdField(s)) {
    case 'c4-p6': return 'chapters/c4-passage-close-v24.png';
    case 'c5-p1': case 'c5-p4': return 'chapters/c5-hoist-close-v24.png';
    case 'c6-p2': return 'chapters/c6-towers-v21.png';
  }
}

export function strongholdLocation(s: CampaignProgress, scene: number) {
  if (s.chapter === 4 && scene === 2 && s.solved.includes('c4-p3') && s.solved.includes('c4-p5') && !s.solved.includes('c4-p6')) return '旧道出口';
}

export function strongholdObservation(s: CampaignProgress) {
  if (s.chapter === 4 && s.scene === 2 && s.solved.includes('c4-p4') && s.solved.includes('c4-p6')) return '陈九成：“沈鹤这张脸，我认得。带我的签押去东门，我和你一块走。”';
  if (s.chapter === 4 && s.scene === 2 && s.solved.includes('c4-p6')) return '陈九成：“让我坐一会儿……在驿站取走回文的人，我看清了脸。”';
  switch (strongholdField(s)) {
    case 'c4-p6': return '井边的旧齿撑不久。陈九成过门得有人扶，牵绳一松，这道石门会怎样？';
    case 'c5-p1': return '门外的人仍在等开门。绞索已经吃上劲，靠近木轮能听见断齿刮轴的响声。';
    case 'c5-p4': return s.solved.includes('c5-p4') ? '绞索能动，门闩仍压在石座上。带断齿回岗亭，请门军当面核对换防令。' : '木轮已经停住。门闩还吊在绞索上，再有人来拉绞轮会怎样？';
    case 'c6-p1': return s.solved.includes('c6-p1') ? '北台已经回灯。去城墙上把闭关号递给东台和西台，等两边亲自回应。' : '右灯的迎援号还在向城外漏光。压低它的灯罩，等北台能单独看见闭关号。';
    case 'c6-p2': return s.solved.includes('c6-p2') ? '东台、西台都已回灯。回号房查查，为什么每拉一次主柄，向城外的灯也跟着动。' : s.solved.includes('c6-p1') ? '北台已经回灯。等东台看见闭关号，西台才会接应。' : '两台都在等北台接号。先回号房看一看北台窗口。';
    case 'c6-p3': return s.solved.includes('c6-p3') ? '闭关灯仍亮着，向城外的灯已经熄了。内门有人撤开栅扣，等你带原件过去。' : '西渡两盏灯连过一根旁索。这里的闭关主柄，是否也会牵亮右边的迎援灯？';
  }
  return '';
}

function spot(label: string, action: string, rect: number[]) {
  const [x, y, width, height] = rect;
  return `<button class="field-part v21-touch" data-field="${action}" aria-label="${label}" style="left:${x}%;top:${y}%;width:${width}%;height:${height}%"><i></i><span>${label}</span></button>`;
}

function gear(d: Draft) {
  return `<div class="v26-moving-art">${gateBeam([24,0,0,0])}${d[1]?'':`<div class="v24-wheel-aperture v26-straining"><img class="v24-rotor" src="${import.meta.env.BASE_URL}assets/chapters/c5-hoist-close-v24.png" alt=""></div>`}${d[1]?'<i class="v26-wheel-wedge"></i>':''}${d[2]?'<i class="v26-oiled-axle"></i>':''}</div>`
    + (d[1]?'':spot('把承重楔塞到轮下','wedge',[13,60,10,12]))
    + (d[2]?'':spot('给锈轴滴油','oil',[7,43,10,17]))
    + spot('把备用木齿试进缺口','tooth',[36,38,6.5,19]);
}

function signalRoom(d: Draft, relay: boolean, ready: boolean, done: boolean, inspected: boolean) {
  const firstSignal = !relay && !!d[2];
  const cover = relay ? 0 : Number(d[1]);
  const [inside, outside] = relay ? rigLamps(Number(d[2]),0) : [firstSignal, true];
  const drawCord = (id: string, path: string) => `<path class="v26-cord ${id}" d="${path}"/>`;
  let objects = `<div class="v26-moving-art">
    <i class="v26-paper-lamp inside ${inside?'lit':''}"></i>
    <i class="v26-paper-lamp outside ${outside?'lit':''}"></i>
    <i class="v26-lamp-cover" style="--cover:${cover/100}"></i>
    <i class="v26-north-window ${relay||firstSignal?'lit':''}"></i>
    <svg class="v26-lamp-cords" viewBox="0 0 1000 563" aria-hidden="true">
    ${drawCord('main',relay&&(Number(d[2])&1)?'M839 205 Q810 263 822 294':'M839 205 Q835 258 803 300')}
    ${drawCord('outside',relay&&(Number(d[2])&2)?'M895 200 Q917 223 911 257':'M895 200 Q886 246 829 277 L803 300')}
    
    </svg>
    ${relay&&d[1]&&!done?'<i class="v26-rack-brace"></i>':''}
    </div>`;
  if (done) return objects;
  if (relay) {
    return objects + (!d[1]?spot('托住灯架','hold',[83,52,8,13]):'')
      + spot('解下或扣回闭关主索','main',[80,38,5,11])
      + spot('解下或扣回横接迎援灯的旁索','bypass',[86,38,9,11])
      + spot('试拉闭关主柄','test',[77,48,7,11]);
  }
  if (!ready) return objects;
  return objects + (firstSignal?'':`<label class="field-rail v26-cover-rail"><span>放下右灯的遮光罩</span><input type="range" min="0" max="100" value="${cover}" data-field-range="cover" aria-label="放下右灯的遮光罩"></label>`)
    + (firstSignal?spot('察看北台窗里回灯','reply',[60,23,10,12]):spot('拉左灯主柄，向北台发闭关号','signal',[77,48,7,11]))
    + (inspected?'<span class="v26-room-direction">北台</span>':'');
}

export function strongholdScene(s: CampaignProgress, line: string) {
  const id = strongholdField(s);
  const done = !!id && s.solved.includes(id);
  const d = id ? fieldViewDraft(id,s.drafts[id] || [],done) : [];
  let objects = '';
  switch (id) {
    case 'c4-p6': objects = passage(d,true); break;
    case 'c5-p1': objects = gear(d); break;
    case 'c5-p4': objects = hoist(d,true,done); break;
    case 'c6-p1': objects = s.solved.includes(id)
      ? signalRoom(d,false,true,true,true)
      : signalRoom(d,false,true,false,!!d[2]); break;
    case 'c6-p2': objects = towers(d,true,done,s.solved.includes('c6-p1')); break;
    case 'c6-p3': objects = signalRoom(d,true,true,done,false); break;
  }
  const observation = line || strongholdObservation(s);
  if (!objects && !observation) return '';
  const text = observation.replaceAll('&','&amp;').replaceAll('<','&lt;');
  return `<div class="v25-room-actions v26-room-actions ${id || ''}" aria-label="现场物件">${objects}<p class="v25-room-line" role="status">${text}</p></div>`;
}

/** Update the artwork while the native range retains pointer and keyboard focus. */
export function syncStrongholdScene(root: HTMLElement, s: CampaignProgress, line: string) {
  const template = document.createElement('template');
  template.innerHTML = strongholdScene(s,line);
  const art = strongholdField(s)==='c4-p6'?'.v24-trestle':'.v26-moving-art';
  for (const part of [art, '.v25-room-line']) {
    const live = root.querySelector<HTMLElement>('.v26-room-actions '+part);
    const next = template.content.querySelector<HTMLElement>('.v26-room-actions '+part);
    if (!live || !next) continue;
    if (part==='.v24-trestle') live.style.transform=next.style.transform;
    else if (part==='.v25-room-line') live.textContent=next.textContent;
    else live.replaceWith(next);
  }
}
