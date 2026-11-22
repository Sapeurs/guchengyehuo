import {bottomView} from './crate-bottom-view';
import {sealView,militaryStamp} from './seal-view';
import {paperClarity, PAPER_START, TRACK_MARKS} from './chapter-one-world';
import type {CampaignProgress, Draft} from './campaign-state';
import type {Puzzle} from './campaign-data';

const A = (p:string) => import.meta.env.BASE_URL + 'assets/' + p;
const action = (label:string, cmd:string, cls='') => `<button class="${cls}" data-c="${cmd}">${label}</button>`;
export function oilLamp(stored=false) {
  return `<img src="${A('chapters/'+(stored?'hand-oil-lamp-stored-v11.png':'hand-oil-lamp-v10.png'))}" class="w-oil-lamp" alt="" aria-hidden="true" draggable="false">`;
}

function spot(cmd:string, label:string, rect:number[], body='', cls='') {
  // camp-hint 只驱动"这里能点"的呼吸微光，不携带任何解谜信息。
  return `<button data-c="${cmd}" aria-label="${label}" class="camp-spot camp-hint w-world-spot ${cls}" style="left:${rect[0]}%;top:${rect[1]}%;width:${rect[2]}%;height:${rect[3]}%">${body}<i class="camp-point" aria-hidden="true"></i></button>`;
}

export function firstChapterScene(s:CampaignProgress) {
  const opened=s.solved.includes('c1-p1'), lamp=s.bag.includes('c1-lamp');
  const drawer=s.world.includes('c1-drawer-open');
  if(s.scene===0) return `<div class="w-scene-changes ${opened?'w-chest-open':''}">
    <div class="w-yard-lampglow" aria-hidden="true"></div>
    ${spot(s.solved.includes('c1-p3')?'puzzle:c1-p3':'puzzle:c1-p1',s.solved.includes('c1-p3')?'复看箱口与底板':'甲三号箱',[41,52,25,25])}${opened&&!s.solved.includes('c1-p3')?spot('puzzle:c1-p3','察看箱底的新擦痕',[42,69,23,7]):''}


    ${spot('puzzle:c1-p6','察看湿泥中的车辙',[27,77,29,13])}
    ${['c1-p1','c1-p2','c1-p3','c1-p4'].every(id=>s.solved.includes(id))?spot('finish','提灯出门，前往西渡',[13,21,12,38],'<span class="w-leave-label">提灯出门</span>','w-leave-door'):''}

  </div>`;
  if(s.scene===1) return `<div class="w-scene-changes ${s.world.includes('c1-drawer-open')?'drawer-open':''}">
    ${spot('puzzle:c1-p2','案上的收讫簿',[12,57,25,15])}
    ${spot('world:drawer',drawer?'推回案下抽屉':'拉开案下抽屉',drawer?[21,84,11,6]:[19,78,15,15])}
    ${s.world.includes('c1-drawer-open')&&!lamp?spot('take:c1-lamp','取出备用手提油灯',[21,79,6.5,4.7],oilLamp(true),'w-drawer-lamp'):''}
    ${s.solved.includes('c1-p4')?spot('puzzle:c1-p5',s.solved.includes('c1-p5')?'回看两份留印':'察看旧签上的朱印',[4,69,14,9]):''}
    ${s.solved.includes('c1-p2')?'<span class="w-ledger-ribbon" aria-hidden="true"></span>':''}${s.solved.includes('c1-p5')?'<span class="w-desk-proof" aria-hidden="true"><i></i><i></i></span>':''}
    ${s.world.includes('c1-patrol-active')?`<div class="w-patrol-sweep" aria-hidden="true"></div><div class="w-patrol-vignette"></div>${spot('world:quiet','用灯罩遮住火光',[67,18,13,20],'<span class="w-cover-prompt">遮住灯焰</span>','w-cover-lamp')}<p class="w-patrol-caption">门外的脚步停住了。<br><span>老军匠压低声音：先把灯遮上。</span></p>`:''}
  </div>`;
  const done=s.solved.includes('c1-p4'),scraps=s.bag.includes('c1-scraps');
  const prepared=done||['c1-lamp','c1-scraps'].every(id=>s.used.includes('c1-p4:'+id));
  const d=done?[1,67,42]:s.drafts['c1-p4']||PAPER_START;
  const line=done?(s.solved.includes('c1-p3')?'陆昭：箱底能取货，面上的新签还能把去向盖掉。纸背写的是西渡。':'陆昭：原来的去向是西渡。货又是从哪里取走的？箱底那道擦痕得再看看。')
    :prepared?'封签正面写着东营。翻过来，把纸移到灯焰前，看看透出来的旧墨。'
    :!s.solved.includes('c1-p3')&&!scraps?'箱底的擦痕还没查清。先回前院，试试货能从哪里取走。'
    :!lamp?'簿房案下的抽屉里还有备用油灯。':!scraps?'旧签还留在甲三箱的衬布下。'
    :'签角有两层纸。上面写着东营，给它照照光，也许还能看见底下那层。';
  return `<div class="w-scene-changes">
    ${prepared?transillumination(d,done):lamp&&scraps
      ?`<div class="w-ink-cue">${action('把旧签和油灯摆到案上','world:prepare-ink','camp-text-button')}</div>`:''}
    <p class="v25-room-line" role="status">${line}</p>
  </div>`;
}

function ledger(d:Draft,hasManifest:boolean,done:boolean) {
  const inactive=!hasManifest||done?'disabled':'';
  return `<div class="w-ledger-desk">${hasManifest?`<article class="w-manifest"><small>解运底单 · 六月</small><h3><button data-c="toggle:4" class="${d.includes(4)?'ink-marked':''}" ${inactive}>甲字三号</button></h3><button data-c="toggle:1" class="${d.includes(1)?'ink-marked':''}" ${inactive}>初九日起解</button><p><button data-c="toggle:5" class="${d.includes(5)?'ink-marked':''}" ${inactive}>交东营军器库验收</button></p><i class="w-ink-stamp">解运</i></article>`:`<div class="w-empty-place"><span>案边可摊放随身原件</span></div>`}<article class="w-ledger-leaf"><h3>收讫簿 · 六月</h3>${[[0,'甲一','初七'],[3,'甲三','初八'],[2,'乙三','初十']].map(([id,batch,date])=>`<button class="w-ledger-entry ${d.includes(Number(id))?'ink-marked':''}" data-c="toggle:${id}" aria-label="${batch}，${date}收讫" ${inactive}><span>${batch}</span><span>${date}收讫</span><small>${id===3?'讫':'画押'}</small></button>`).join('')}<span class="w-binding"></span></article>${hasManifest&&!done?`<button class="w-ledger-compare" data-c="world:compare-ledger" ${d.length!==2?'disabled':''}>并看圈出的记录</button>`:''}${done?'<span class="w-ledger-realization">初八 · 收讫　←　初九 · 起解</span>':''}</div>`;
}
function transillumination(d:Draft,done:boolean) {
  const clarity=done?1:paperClarity(d);
  return `<div class="w-light-table" style="--clarity:${clarity}" aria-label="在灯前移动封签"><div class="w-light-pool"></div><div class="w-inspection-lamp">${oilLamp()}</div><button class="w-moving-paper ${Number(d[0])?'back':''}" data-paper-drag="true" style="left:${d[1]}%;top:${d[2]}%" ${done?'disabled':''} aria-label="举起的封签，用方向键移动，空格翻面"><span class="w-surface-ink">甲字三 · 东营</span><span class="w-old-ink" aria-hidden="${clarity<.72}">西渡</span><i></i></button>${done?`<button class="w-revealed-seal" data-c="world:carry-seal" aria-label="细看纸下露出的旧印">${militaryStamp('transmitted')}<span>细看旧印</span></button>`:''}${done?'':`<button class="w-read-ink" data-c="world:read-ink" ${clarity<.72?'disabled':''}>辨认旧去向</button><div class="w-paper-controls">${action('翻到'+(Number(d[0])?'正面':'背面'),'flip','camp-text-button')}${done?'':action('放回原状','reset-puzzle','camp-text-button')}</div>`}</div>`;
}
function tracks(d:Draft,aim:[number,number],lit:boolean,done:boolean) {
  return `<div class="w-trace-floor ${lit?'lit':''}" data-lantern-drag="true" tabindex="0" role="group" aria-label="提灯照地面，用方向键移动灯光" style="--aim-x:${aim[0]}%;--aim-y:${aim[1]}%"><div class="w-track-light"></div>${TRACK_MARKS.map((m,i)=>`<button class="w-track-mark mark-${i} ${Number(d[0])&m.bit?'examined':''}" style="left:${m.x}%;top:${m.y}%" data-c="world:track:${i}" ${!lit?'disabled aria-hidden="true"':''} aria-label="察看灯光下的${i===0?'车轮擦痕':'芦苇草梗'}"><i></i></button>`).join('')}<div class="w-held-floor-lamp">${lit?oilLamp():''}</div>${done?'<span class="w-track-found" aria-hidden="true"></span>':''}</div>`;
}
function sealObservation(d:Draft):[string,string]{
 const mask=Number(d[2]);
 if(!Number(d[3]))return ['陆昭','拘我的札付……先把原件并在一起，看看是不是只因印文相似。'];
 if(mask&&!(mask&(mask-1)))return ['陆昭','先圈下这一处。还要核对另一处独立痕迹，才能认定印模。'];
 if(mask&&mask!==9)return ['陆昭','有些圈下的地方并未同时留下损伤。可点已圈处擦去，重新比看。'];
 return ['陆昭','同样的印文，还不足以认定同一印模。'];
}
const roomLines:Record<string,[string,string]>={
 'c1-p2':['陆昭','甲三……簿里这一笔，真能与我带来的底单对上么？'],
 'c1-p3':['老军匠','箱盖搭回去了。我把两角垫住。你看，底板边这道擦痕还很新。'],
 'c1-p4':['陆昭','旧签已经展开。东营两个字下面，怎么还透着一层墨？'],
 'c1-p5':['陆昭','这枚旧印，看着眼熟。'],
 'c1-p6':['陆昭','把灯压低些。湿泥里，兴许还留着车的来路。']
};
const doneLines:Record<string,[string,string]>={
 'c1-p2':['陆昭','初九才起解，初八就收讫了。原来，“已经交清”这句话，连日子都对不上。'],
 'c1-p3':['陆昭','盖子没动，底下却通了。验过箱口，原来不等于验过箱里的货。'],
 'c1-p4':['陆昭','西渡……新纸盖住了原来的去向。旧纸角上，还留着朱印。'],
 'c1-p5':['陆昭','原来拘我的这道札付，也连着箱底的旧签。得去查实际用印的人。'],
 'c1-p6':['老军匠','芦苇只长在河滩。车是从西边来的，正好再去核一核“西渡”。']
};
export function worldFocus(s:CampaignProgress,p:Puzzle,d:Draft,_selected:number,token:number|string|null,aim:[number,number],tools:string,message:string,bagOpen=false) {
  const done=s.solved.includes(p.id),missing=p.requires.some(id=>!s.solved.includes(id));
  const needsTools=!missing&&!done&&p.tools.some(id=>!s.used.includes(p.id+':'+id));
  let content='',line=done?doneLines[p.id]:roomLines[p.id];
  if(p.id==='c1-p3'&&!done&&Number(d[3])>0)line=['陆昭',Number(d[1])?'底板还伸出一截，上盖横木已经扣回。继续试试看。':'底板还伸在外面，上盖的横木尚未扣回。'];
  if(missing)line=['陆昭',p.id==='c1-p3'?'先打开甲三箱，看看里面的衬布与底板。':p.id==='c1-p4'?'还没找到能放到灯前的旧封签。':p.id==='c1-p5'?'还没有能放到案上核对的旧印。':'先打开甲三号箱，看看箱里留下了什么。'];
  else if(p.id==='c1-p2')content=ledger(d,s.used.includes('c1-p2:c1-manifest')||done,done);
  else if(p.id==='c1-p3'&&!needsTools)content=bottomView(d,done);
  else if(p.id==='c1-p4'&&!needsTools)content=transillumination(done?p.config.target:d,done);
  else if(p.id==='c1-p5'){content=sealView(d,done,!needsTools);if(!done&&!needsTools)line=sealObservation(d);}
  else if(p.id==='c1-p6')content=tracks(d,aim,!needsTools,done);
  if(needsTools)line=['陆昭',p.id==='c1-p2'?(s.bag.includes('c1-manifest')?'收讫簿在这里。把衣囊中的押运底单摊开，一起核对。':'底单贴身收着。把它摊到案上，才能与原册核对。'):p.id==='c1-p3'?'案面空出来了。把箱底找到的残签铺上来。':p.id==='c1-p4'?'把箱底的旧签展开，再把小油灯放在手边。箱底试验后会收好旧签，也可从衬布下取出。':p.id==='c1-p5'?'旧印似曾相识。身上哪份原件，也曾盖过印？':'月光照不清。需要把灯提低些。'];
  if(done&&p.id==='c1-p6'&&!s.solved.includes('c1-p4'))line=['老军匠','这草只长在西边河滩。车应当走过水边，去向还得找别的物证核准。'];
  const background=p.id==='c1-p3'?'c1-bottom-closed-v23.png':p.id==='c1-p6'?'c1-wheel-tracks-v10.png':p.scene===1?'c1-ledger-desk-v14.png':'c1-worktable-v14.png';
  return `<section class="w-focus w-focus-${p.id} ${done?'w-object-solved':''}" role="dialog" aria-modal="true" aria-label="${p.title}"><div class="w-room-frame"><img class="w-focus-backdrop" src="${A('chapters/'+background)}" alt="${p.id==='c1-p3'?'垫起空箱后，可以分别试动上盖横木与底板':p.id==='c1-p6'?'前院湿泥里的两道车辙':p.scene===1?'簿房旧木案的近景':'侧库工作台的近景'}"><div class="w-focus-shade"></div><header class="w-focus-header"><span>${p.id==='c1-p3'?'前院 · 试验箱体':['前院 · 提灯照地','簿房 · 案前','侧库 · 工作台'][p.scene]}</span>${action('退后 · Esc','close','w-step-back')}</header><div class="w-object-stage">${content}</div><div class="w-room-caption" role="status"><small>${message?'陆昭':line[0]}</small><p>${message||line[1]}</p></div><footer class="w-focus-footer"><div class="w-room-pouch">${p.tools.length&&!done?action('衣囊'+(bagOpen?' · 收起':needsTools?' · 取出物件':''),'bag','w-pouch-toggle'):''}${bagOpen&&p.tools.length&&!done?tools:''}${needsTools?p.tools.filter(id=>s.bag.includes(id)&&!s.used.includes(p.id+':'+id)).map(id=>action(id==='c1-lamp'?'把小油灯放在手边':id==='c1-scraps'?'展开旧封签':'取出'+(id==='c1-manifest'?'押运底单':'原件'),'field-tool:'+id,'camp-text-button')).join(''):''}</div><div class="w-focus-options">${p.id==='c1-p3'&&!done?action('察看结构','world:bottom-observe','camp-text-button'):''}${!done?action('求助','hint-puzzle','camp-text-button'):action(p.id==='c1-p2'?'收好底单':'收好原件，退后','close','camp-text-button')}${!missing&&!done?action('重新摆放','reset-puzzle','camp-text-button'):''}</div></footer><p class="w-gesture-note">${done||missing||needsTools?'':p.id==='c1-p2'?'在原件上圈两处 · 再并看记录':p.id==='c1-p3'?'直接触碰横木、短销与箱盖 · 拖底板或用下方木槽调整':p.id==='c1-p4'?'拖动纸张 · 方向键移动 · 空格翻面':p.id==='c1-p5'?'点“对照两份原件”或拖动左纸到右纸 · 圈出相同的两处磨损':p.id==='c1-p6'?'拖动地面移动灯光 · 点亮处察看':''}</p></div></section>`;
}
