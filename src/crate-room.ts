import {CHAPTERS} from './campaign-data';
import {propArt} from './scene-presentation';
import {LATCH_START,LATCH_OPEN,validLatch,latchMove,canWeight,latchComplete,type LatchDraft,type LatchPart} from './crate-latch';
import type {CampaignProgress} from './campaign-state';
import type {Foley} from './foley';
const A=(name:string)=>import.meta.env.BASE_URL+'assets/'+name;
const prop=(id:string)=>CHAPTERS[0].props.find(p=>p.id===id)!;

export function crateRoom(backdrop=''){
 return `<section class="crate-room" role="dialog" aria-modal="true" aria-label="近前察看甲三号箱">
  ${backdrop?`<img class="crate-yard-backdrop" src="${backdrop}" alt="" draggable="false">`:''}
  <div class="crate-world" aria-label="可以直接操纵的箱体">
   <img class="crate-open-painting" src="${A('chapters/crate-open-v13.png')}" alt="甲三号箱的空木质内腔" draggable="false">
   <img class="crate-body-painting" src="${A('chapters/crate-body-v13.png')}" alt="横木穿在铁箍里，箱盖被顶住" draggable="false">
   <svg class="crate-lid-skin" viewBox="0 0 1672 941" aria-hidden="true"><defs><clipPath id="crate-lid-clip"><path d="M190 291L555 83L1367 104L1443 213L1419 270L777 335L608 395L192 360Z"/></clipPath></defs><image href="${A('chapters/crate-body-v13.png')}" width="1672" height="941" clip-path="url(#crate-lid-clip)"/></svg>
   <div class="crate-moving-bar" aria-hidden="true"><svg viewBox="37 143 2097 448" preserveAspectRatio="none"><image href="${A('chapters/crate-bar-v13.png')}" width="2172" height="724"/></svg></div>
   <svg class="crate-fixed-keepers" viewBox="0 0 1672 941" aria-hidden="true"><defs><clipPath id="crate-keepers-clip"><path d="M938 273L983 263L1000 298L1006 444L961 458L944 441Z M1268 239L1306 230L1320 251L1324 389L1287 405L1273 389Z"/></clipPath></defs><image href="${A('chapters/c1-crate-closed-v12.png')}" width="1672" height="941" clip-path="url(#crate-keepers-clip)"/></svg>
   <div class="crate-pry-art" aria-hidden="true">${propArt(prop('c1-pry'))}</div>
   <svg class="crate-spring" viewBox="0 0 1672 941" aria-hidden="true"><defs><linearGradient id="crate-iron" x2="0" y2="1"><stop stop-color="#b19b71"/><stop offset=".5" stop-color="#5b5644"/><stop offset="1" stop-color="#2b2c26"/></linearGradient></defs><path d="M1192 281L1268 270L1281 285L1202 300Z" fill="url(#crate-iron)" stroke="#282c27" stroke-width="3"/><path d="M1268 270L1281 285L1280 305L1269 298Z" fill="#393c33"/></svg>
   <div class="crate-weight-art" aria-hidden="true">${propArt(prop('c1-weight'))}</div>
   <div class="crate-oil-breath" aria-hidden="true"></div>
   <div class="crate-liner-art" aria-hidden="true"><img src="${A('crafted/cloth-dry-v2.png')}" alt="" draggable="false"></div>
   <button class="crate-control crate-lid-control" data-crate-part="lid" aria-label="抬动箱盖，向上拖动或按上方向键"><i></i></button>
   <button class="crate-control crate-bar-control" data-crate-part="bar" aria-label="抽动横木，向左拖动或按左方向键"><i></i></button>
   <button class="crate-control crate-gap-control" data-crate-target="pry" aria-label="察看右铁箍旁的窄缝"><i></i></button>
   <button class="crate-control crate-lever-control" data-crate-part="lever" aria-label="压下撬棍手柄，向下拖动或按下方向键"><i></i></button>
   <button class="crate-control crate-tongue-control" data-crate-target="weight" aria-label="察看露出的回弹锁舌"><i></i></button>
   <button class="crate-control crate-floor-control" data-crate-inspect aria-label="察看空箱底部"><i></i></button>
   <button class="crate-control crate-lining-control" data-crate-lining aria-label="掀开箱底衬布，向右拖动或按右方向键"><i></i></button>
   <button class="crate-control crate-scraps-control" data-crate-scraps aria-label="取出衬布下的旧签"><img src="${A('crafted/torn-order-v2.png')}" alt="折损的旧封签" draggable="false"><i></i></button>
   <div class="crate-world-edge" aria-hidden="true"></div>
   <header class="crate-room-header"><span>军器库前院 <i>·</i> 甲三号箱</span><button data-crate-back aria-label="退后回到前院">← <span>退后</span></button></header>
   <div class="crate-caption" role="status" aria-live="polite"><span></span><p></p></div>
   <footer class="crate-room-footer"><div class="crate-pouch"><button class="crate-pouch-toggle" data-crate-bag aria-expanded="false">衣囊 <span>⌃</span></button><div class="crate-pouch-items">${['c1-pry','c1-weight'].map(id=>`<button data-crate-tool="${id}" aria-label="拿起${prop(id).name}" aria-pressed="false">${propArt(prop(id))}<small>${prop(id).name}</small></button>`).join('')}<p class="crate-pouch-empty">衣囊里没有别的物件。</p></div></div><div class="crate-quiet-tools"><button data-crate-observe aria-label="察看可触碰的位置">察看</button><button data-crate-mentor>问老军匠</button><button class="crate-bottom-link" data-c="puzzle:c1-p3">察看箱底的擦痕</button></div></footer>
   <div class="crate-carry" aria-hidden="true"></div>
  </div>
 </section>`;
}
interface CrateBridge {
 state:()=>CampaignProgress;foley:Foley;initialTool:string|null;
 draft:(draft:LatchDraft)=>void;tool:(id:string)=>boolean;opened:()=>boolean;
 lining:()=>void;scraps:()=>void;bottom:()=>void;exit:()=>void;
}
type Drag={pointer:number;kind:LatchPart|'tool'|'lining';startX:number;startY:number;startValue:number;rect:DOMRect;moved:boolean;tool?:string;blocked?:string|null};

export function mountCrateRoom(root:HTMLElement,bridge:CrateBridge){
 const world=root.querySelector<HTMLElement>('.crate-world')!,room=root.querySelector<HTMLElement>('.crate-room')!;
 const old=bridge.state().drafts['c1-p1'];
 let d:LatchDraft=bridge.state().solved.includes('c1-p1')?[...LATCH_OPEN]:validLatch(old||[])?[...old] as LatchDraft:[...LATCH_START];
 if(bridge.state().used.includes('c1-p1:c1-weight'))d[1]=100;
 let chosen:string|null=bridge.initialTool&&['c1-pry','c1-weight'].includes(bridge.initialTool)&&!bridge.state().used.includes('c1-p1:'+bridge.initialTool)?bridge.initialTool:null;
 let interacted=false;
 let drag:Drag|null=null,ignoreClick=false,dead=false,leaving=false,opening=false,openedReported=bridge.state().solved.includes('c1-p1');
 let bag=!!chosen,friction:{set:(value:number)=>void;stop:()=>void}|undefined;
 const timers=new Set<ReturnType<typeof setTimeout>>();
 const later=(fn:()=>void,ms:number)=>{const t=setTimeout(()=>{timers.delete(t);if(!dead)fn();},ms);timers.add(t);return t;};
 let captionTimer:ReturnType<typeof setTimeout>|undefined;
 const tools=()=>({pry:bridge.state().used.includes('c1-p1:c1-pry'),weight:bridge.state().used.includes('c1-p1:c1-weight')});
 function say(who:string,line:string){const box=root.querySelector<HTMLElement>('.crate-caption')!;box.querySelector('span')!.textContent=who;box.querySelector('p')!.textContent=line;box.classList.add('visible');if(captionTimer)clearTimeout(captionTimer);captionTimer=later(()=>box.classList.remove('visible'),6200);}
 function persist(){bridge.draft([...d]);}
 function sync(){
  const t=tools(),s=bridge.state();
  world.style.setProperty('--lever',String(d[1]/100));world.style.setProperty('--bar',String(d[2]/100));world.style.setProperty('--lid',String(d[3]/100));world.style.setProperty('--open-blend',String(Math.min(1,d[3]/62)));
  world.classList.toggle('bar-released',d[2]>=98&&!drag);root.querySelector('.crate-body-painting')!.setAttribute('aria-hidden',String(d[3]>50));root.querySelector('.crate-open-painting')!.setAttribute('aria-hidden',String(d[3]<=50));
  world.classList.toggle('has-pry',t.pry);world.classList.toggle('has-weight',t.weight);world.classList.toggle('is-open',d[3]>=98);world.classList.toggle('is-opening',d[3]>0&&d[3]<98);
  world.classList.toggle('lining-lifted',s.world.includes('c1-lining-lifted'));world.classList.toggle('scraps-taken',s.bag.includes('c1-scraps'));
  world.classList.toggle('holding-pry',chosen==='c1-pry');world.classList.toggle('holding-weight',chosen==='c1-weight');world.classList.toggle('pouch-open',bag);
  root.querySelector('[data-crate-bag]')!.setAttribute('aria-expanded',String(bag));const pouch=root.querySelector<HTMLElement>('.crate-pouch-items')!;pouch.inert=!bag;pouch.setAttribute('aria-hidden',String(!bag));
  let count=0;
  root.querySelectorAll<HTMLButtonElement>('[data-crate-tool]').forEach(el=>{const id=el.dataset.crateTool!,applied=s.used.includes('c1-p1:'+id);el.hidden=!s.bag.includes(id)||applied;el.setAttribute('aria-pressed',String(chosen===id));if(!el.hidden)count++;});
  root.querySelector<HTMLElement>('.crate-pouch-empty')!.hidden=count>0;
  const show=(selector:string,visible:boolean)=>{const el=root.querySelector<HTMLButtonElement>(selector)!;el.hidden=!visible;};
  show('.crate-gap-control',!t.pry&&d[3]===0);show('.crate-lever-control',t.pry&&!t.weight&&d[3]===0);show('.crate-tongue-control',t.pry&&!t.weight&&d[1]>=70&&d[3]===0);
  show('.crate-bar-control',d[3]===0&&d[2]<98);show('.crate-lid-control',d[3]<100);show('.crate-floor-control',d[3]===100);show('.crate-lining-control',d[3]===100&&!s.world.includes('c1-lining-lifted'));show('.crate-scraps-control',d[3]===100&&s.world.includes('c1-lining-lifted')&&!s.bag.includes('c1-scraps'));
 }
 function bump(reason:string){world.classList.remove('resisted');void world.offsetWidth;world.classList.add('resisted');later(()=>world.classList.remove('resisted'),500);bridge.foley.play(reason==='spring'?'latch':'wood');say('陆昭',reason==='spring'?'刚松开，铁舌又弹回来了。':reason==='pry'?'横木咬在铁箍里，手指伸不进去。':'盖子只动了一线，被横木顶住了。');}
 /** 工具拖到了用不上的地方：回弹一下，并说清楚该往哪儿放。 */
 function bumpTool(tool:string){
  world.classList.remove('resisted');void world.offsetWidth;world.classList.add('resisted');
  later(()=>world.classList.remove('resisted'),500);
  bridge.foley.play('wood');
  if(tool==='c1-pry'){
   say('陆昭',tools().pry?'撬棍已经卡在窄缝里了，接着压手柄。':'撬棍得卡进右边铁箍旁那道窄缝。');
   return;
  }
  say('陆昭',tools().pry?'砝码要压在露出来的铁舌上，别的地方压不住。':'先把撬棍卡进窄缝，铁舌才露得出来。');
 }
 function attempt(part:LatchPart,value:number,announce=true){
  const old=[...d],result=latchMove(d,part,value,tools());
  if(result.blocked){if(announce&&result.blocked!=='open')bump(result.blocked);return result.blocked;}
  d=result.draft;sync();
  if(part==='lever'&&old[1]<80&&d[1]>=80){bridge.foley.play('wood');say('陆昭','横木楔住了。底下还有一片会回弹的铁舌。');}
  if(part==='bar'&&old[2]<98&&d[2]>=98){bridge.foley.play('latch');say('陆昭','脱开了。');}
  return null;
 }
 function reportOpened(){
  if(openedReported||!latchComplete(d))return;
  persist();if(!bridge.opened())return;
  openedReported=true;bridge.foley.play('wood');later(()=>say('陆昭','空的……'),450);later(()=>{if(!chosen)say('老军匠','我昨夜看他们搬进来时，箱口的封签还在。空箱……先别急着下结论。');},2800);
 }
 function settleLid(){
  if(d[3]===100){reportOpened();return;}
  if(d[3]<24)return;
  opening=true;world.classList.add('settling');d[3]=100;sync();persist();bridge.foley.play('wood');later(()=>{world.classList.remove('settling');opening=false;reportOpened();},760);
 }
 function useTool(id:string){
  if(id==='c1-weight'&&!canWeight(d)){bump(tools().pry?'spring':'pry');return false;}
  persist();if(!bridge.tool(id))return false;
  chosen=null;bag=false;sync();bridge.foley.play(id==='c1-weight'?'latch':'wood');
  say('陆昭',id==='c1-pry'?'前端进去了。':'铁舌压下去了，手松开也不会弹。');return true;
 }
 function atTarget(id:string,x:number,y:number){const rect=world.getBoundingClientRect(),px=(x-rect.left)/rect.width*100,py=(y-rect.top)/rect.height*100;
  return id==='c1-pry'?px>=61&&px<=86&&py>=25&&py<=54:px>=66&&px<=84&&py>=15&&py<=46;
 }
 function carry(x:number,y:number){const el=root.querySelector<HTMLElement>('.crate-carry')!,r=world.getBoundingClientRect();el.style.left=x-r.left+'px';el.style.top=y-r.top+'px';}
 function liftLining(){bridge.lining();world.classList.add('lining-lifted');sync();bridge.foley.play('cloth');say('陆昭','几片旧封签。藏在衬布下面。');}
 function exit(){if(leaving)return;persist();leaving=true;room.classList.add('leaving');later(bridge.exit,220);}
 const onDown=(e:PointerEvent)=>{
  if(e.button!==0||opening||leaving)return;
  interacted=true;
  const target=e.target as Element,tool=target.closest<HTMLElement>('[data-crate-tool]'),part=target.closest<HTMLElement>('[data-crate-part]'),lining=target.closest('[data-crate-lining]');
  if(tool){chosen=tool.dataset.crateTool!;sync();const floating=root.querySelector<HTMLElement>('.crate-carry')!;floating.innerHTML=propArt(prop(chosen));carry(e.clientX,e.clientY);world.classList.add('carrying');drag={pointer:e.pointerId,kind:'tool',tool:chosen,startX:e.clientX,startY:e.clientY,startValue:0,rect:world.getBoundingClientRect(),moved:false};}
  else if(chosen&&target.closest('.crate-control')){e.preventDefault();e.stopPropagation();if(atTarget(chosen,e.clientX,e.clientY))useTool(chosen);else bump('pry');ignoreClick=true;return;}
  else if(part||lining){const kind=lining?'lining':part!.dataset.cratePart as LatchPart;drag={pointer:e.pointerId,kind,startX:e.clientX,startY:e.clientY,startValue:kind==='lining'?0:d[{lever:1,bar:2,lid:3}[kind]],rect:world.getBoundingClientRect(),moved:false};if(kind!=='lining')friction=bridge.foley.friction();}
  else return;
  world.setPointerCapture(e.pointerId);world.classList.add('grabbing');e.preventDefault();e.stopPropagation();
 };
 const onMove=(e:PointerEvent)=>{
  if(!drag||e.pointerId!==drag.pointer)return;
  const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.hypot(dx,dy)>5)drag.moved=true;
  if(drag.kind==='tool'){carry(e.clientX,e.clientY);return;}
  if(drag.kind==='lining'){world.style.setProperty('--lining-drag',String(Math.max(0,Math.min(1,dx/(drag.rect.width*.16)))));return;}
  const amount=drag.kind==='lever'?dy/(drag.rect.height*.16)*100:drag.kind==='bar'?-dx/(drag.rect.width*.30)*100:-dy/(drag.rect.height*.24)*100;
  drag.blocked=attempt(drag.kind,drag.startValue+amount,false);friction?.set(Math.min(1,Math.abs(amount)/80));
  if(drag.blocked)world.style.setProperty('--resist',String(Math.max(-1,Math.min(1,amount/60))));
 };
 const endDrag=(e:PointerEvent,cancel=false)=>{
  if(!drag||e.pointerId!==drag.pointer){if(ignoreClick)later(()=>ignoreClick=false,0);return;}
  const previous=drag;drag=null;friction?.stop();friction=undefined;world.classList.remove('grabbing','carrying');world.style.setProperty('--resist','0');
  if(world.hasPointerCapture(e.pointerId))world.releasePointerCapture(e.pointerId);
  ignoreClick=true;later(()=>ignoreClick=false,0);
  if(previous.kind==='tool'){
   if(!cancel&&previous.moved&&atTarget(previous.tool!,e.clientX,e.clientY))useTool(previous.tool!);
   else if(!cancel&&!previous.moved){bag=true;sync();say('陆昭','拿近看看。');}
   // 拖着工具移动过、却没落到能用的位置：必须给回弹和一句说明，
   // 否则玩家会以为这一次操作没被接住，甚至以为界面卡住了。
   else if(!cancel){bumpTool(previous.tool!);}
  }
  else if(previous.kind==='lining'){if(!cancel&&(previous.moved?Number(world.style.getPropertyValue('--lining-drag'))>.35:true))liftLining();world.style.setProperty('--lining-drag','0');}
  else if(!cancel&&previous.moved){if(previous.blocked)bump(previous.blocked);sync();persist();if(previous.kind==='lid')settleLid();}
  else{if(!cancel){attempt(previous.kind,d[{lever:1,bar:2,lid:3}[previous.kind]]+25);if(previous.kind==='lid')settleLid();}persist();}
 };
 const onUp=(e:PointerEvent)=>endDrag(e);
 const onCancel=(e:PointerEvent)=>endDrag(e,true);
 const onClick=(e:MouseEvent)=>{
  const el=(e.target as Element).closest<HTMLElement>('button');if(!el)return;e.stopPropagation();if(ignoreClick||opening)return;
  if(el.matches('.crate-bottom-link')){if(d[3]===100)bridge.bottom();return;}
  if(el.matches('[data-crate-back]')){exit();return;}
  if(el.matches('[data-crate-bag]')){bag=!bag;sync();return;}
  if(el.matches('[data-crate-tool]')){chosen=el.dataset.crateTool!;bag=true;sync();return;}
  if(el.matches('[data-crate-observe]')){world.classList.add('observing');later(()=>world.classList.remove('observing'),1800);return;}
  if(el.matches('[data-crate-mentor]')){say('老军匠',d[3]===100?'箱底的衬布也掀起来看看。':!tools().pry?'右边铁箍底下有道缝。工具台上那根木撬，前端是扁的。':d[1]<80?'把撬棍的长端压下去，横木才抬得起来。':!tools().weight?'我案上有只铜砝码。拿来压住那片铁舌。':d[2]<98?'横木顺着铁箍，往左抽。':'横木已经脱开，试着抬盖。');return;}
  if(el.matches('[data-crate-target]')){if(chosen){useTool(chosen);return;}say('陆昭',el.dataset.crateTarget==='pry'?'这里露着一道窄缝。':'这片铁舌一直往上顶。');return;}
  if(el.matches('[data-crate-part]')){const part=el.dataset.cratePart as LatchPart;attempt(part,d[{lever:1,bar:2,lid:3}[part]]+25);persist();if(part==='lid')settleLid();return;}
  if(el.matches('[data-crate-lining]')){liftLining();return;}
  if(el.matches('[data-crate-scraps]')){bridge.scraps();chosen=null;sync();bridge.foley.play('paper');say('陆昭','收好了。纸角粘着两层，借灯光看看。');return;}
  if(el.matches('[data-crate-inspect]'))say('陆昭','箱里没有军器。底板边这一道新擦痕，却一直通到外侧。');
 };
 const onKey=(e:KeyboardEvent)=>{
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();exit();return;}
  if(e.key.toLowerCase()==='h'){e.preventDefault();e.stopPropagation();world.classList.add('observing');later(()=>world.classList.remove('observing'),1800);return;}
  const target=(e.target as Element).closest<HTMLElement>('[data-crate-part],[data-crate-lining]');
  if(!target||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();e.stopPropagation();if(target.hasAttribute('data-crate-lining')){if(e.key==='ArrowRight')liftLining();return;}
  const part=target.dataset.cratePart as LatchPart,dir=part==='lever'?(e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0):part==='bar'?(e.key==='ArrowLeft'?1:e.key==='ArrowRight'?-1:0):(e.key==='ArrowUp'?1:e.key==='ArrowDown'?-1:0);
  if(dir){attempt(part,d[{lever:1,bar:2,lid:3}[part]]+dir*25);persist();if(part==='lid')settleLid();}
 };
 const onBlur=()=>{if(drag){const pointer=drag.pointer;drag=null;if(world.hasPointerCapture(pointer))world.releasePointerCapture(pointer);friction?.stop();friction=undefined;world.classList.remove('grabbing','carrying');world.style.setProperty('--resist','0');}persist();};
 world.addEventListener('pointerdown',onDown);world.addEventListener('pointermove',onMove);world.addEventListener('pointerup',onUp);world.addEventListener('pointercancel',onCancel);root.addEventListener('click',onClick);root.addEventListener('keydown',onKey);window.addEventListener('blur',onBlur);window.addEventListener('pagehide',onBlur);
 sync();bridge.foley.locationMood('yard');if(latchComplete(d)&&!openedReported){reportOpened();}else if(!openedReported){bridge.foley.play('step');later(()=>{if(!interacted)say('陆昭',tools().pry?'木撬还楔在这里。':'甲三。封绳倒是新换的。');},650);}else later(()=>say('陆昭','箱子是空的。'),500);
 return ()=>{dead=true;persist();for(const t of timers)clearTimeout(t);friction?.stop();world.removeEventListener('pointerdown',onDown);world.removeEventListener('pointermove',onMove);world.removeEventListener('pointerup',onUp);world.removeEventListener('pointercancel',onCancel);root.removeEventListener('click',onClick);root.removeEventListener('keydown',onKey);window.removeEventListener('blur',onBlur);window.removeEventListener('pagehide',onBlur);};
}
