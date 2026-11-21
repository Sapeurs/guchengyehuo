import Phaser from 'phaser';
import './style.css';
import './typography.css';
import './objects.css';
import './period-documents.css';
import {act,freshProgress,restoreProgress,SAVE_KEY,HINTS,hintStage,WEAPONS,WEAPON_NAMES,ITEM_NAMES,type Item,type Weapon,type Action} from './game';
import {icon} from './icons';
import {ITEM_ART,itemArtPath} from './items';
import {noteView,manifestView,orderView} from './documents';
import {musterView} from './muster';
import {Foley} from './foley';
import {installAndroidSupport,isAndroidApp} from './android-support';
import {mountWiping} from './wiping';
import {createCampaign,isCampaignActive,campaignHasProgress} from './campaign-ui';

type Modal='tag'|'ledger'|'box'|'noteA'|'noteB'|'detention'|'order'|'manifest'|'journal'|'hint'|'settings'|'help'|'end'|'basin'|null;
type Sequence='intro'|'search'|'ending'|null;
let state=freshProgress();try{state=restoreProgress(localStorage.getItem(SAVE_KEY));}catch{}
let modal:Modal=null,sequence:Sequence=null,sequenceIndex=0,menuOpen=true,bagOpen=false,hotspots=false;
let selected:Item|null=null,selectedWeapon:Weapon|null=null,ledgerPage=0,journalEntry='';
let reveal=false,openingBox=false,wetting=false,wiping=false,saveFailed=false,ledgerMagnified=false;
let toastTimer:ReturnType<typeof setTimeout>,quoteTimer:ReturnType<typeof setTimeout>,observationTimer:ReturnType<typeof setTimeout>;
let lastFocus:HTMLElement|null=null;
const hints:Record<string,number>={},foley=new Foley();
const asset=(name:string)=>import.meta.env.BASE_URL+'assets/'+name;
const has=(i:Item)=>state.items.includes(i);
const itemLabel=(i:Item)=>i==='tag'&&!state.tagClean?'沾污的腰牌':ITEM_NAMES[i];
const itemArt=(i:Item,extra='')=>`<img class="item-image item-${i} ${extra}" src="${asset(itemArtPath(i,state.tagClean))}" alt="" draggable="false">`;
const el=(id:string)=>document.getElementById(id)!;
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<main class="game-shell">
  <div class="scene-frame" id="scene-frame">
    <div id="scene-canvas" aria-hidden="true"></div><div class="scene-vignette" aria-hidden="true"></div>
    <div class="candle-halo" aria-hidden="true"></div><div class="torch-light" aria-hidden="true"></div>
    <div class="scene-location"><span class="location-mark">壹</span><div><small>亥时三刻</small><span>军营偏房</span></div></div>
    <nav id="toolbar" aria-label="游戏工具"></nav><div id="hotspots" class="hotspot-layer" aria-label="探索场景"></div>
    <div id="selected-cue" class="selected-cue"></div>
    <div id="quote" class="quote" aria-live="polite"></div>
    <button class="bag-toggle" data-action="bag" aria-label="随身物品" aria-expanded="false">${icon('bag')}<span>随身物品</span><b id="bag-count">0</b><i></i></button>
    <div class="scene-footnote">风声未歇，城外的火还没有灭。</div>
  </div>
  <aside id="inventory-dock" class="inventory-dock" aria-label="随身物品"><div class="inventory-heading"><span>随身物品</span><button data-action="bag" aria-label="收起背包">${icon('close')}</button></div><div id="inventory" class="inventory"></div><div id="inventory-tools" class="inventory-tools"></div></aside>
</main><div id="main-menu"></div><div id="modal-root"></div><div id="sequence-root"></div><div id="held-item" aria-hidden="true"></div><div id="acquisition" aria-live="polite"></div><div id="toast" class="toast" role="status"></div>`;
const campaign=createCampaign({foley,onExit:()=>{menuOpen=true;modal=null;render();},onPrologue:()=>{menuOpen=false;modal=null;commit({type:'START'});render();if(!state.introSeen)startSequence('intro');}});

installAndroidSupport({
 back:()=>{
  if(isCampaignActive())return campaign.back();
  if(sequence){finishSequence();return true;}
  if(modal){closeModal();return true;}
  if(bagOpen){bagOpen=false;renderInventory();return true;}
  if(selected){selected=null;renderInventory();renderHotspots();return true;}
  if(!menuOpen){openModal('settings');return true;}
  return false;
 },pause:()=>foley.setAppPaused(true),resume:()=>foley.setAppPaused(false)
});

function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{if(!saveFailed){saveFailed=true;toast('当前浏览器无法保存进度，本次仍可继续。');}}}
function commit(action:Action){const r=act(state,action);if(r.ok){state=r.state;persist();}return r;}
function toast(text:string){el('toast').textContent=text;el('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el('toast').classList.remove('visible'),3600);}
function say(text:string,speaker='陆昭',duration=6500){el('quote').innerHTML=`<span class="speaker">${speaker}</span><p>${text}</p><button data-action="dismiss-quote" aria-label="收起对白">${icon('close')}</button>`;el('quote').classList.add('visible');clearTimeout(quoteTimer);quoteTimer=setTimeout(()=>el('quote').classList.remove('visible'),duration);}
function syncInert(){document.querySelector('main')!.inert=menuOpen||!!modal||!!sequence;el('main-menu').inert=!!modal||!!sequence;el('modal-root').inert=!!sequence;}
function pickup(item:Item,action:Action){const r=commit(action);if(!r.ok)return;foley.play(item==='key'?'latch':'paper');render();el('acquisition').innerHTML=`<div class="acquired-item">${itemArt(item)}<small>已收好</small><span>${action.type==='TAKE_PAPERS'?'押运单 · 残缺军令':ITEM_NAMES[item]}</span></div>`;el('acquisition').classList.add('visible');setTimeout(()=>el('acquisition').classList.remove('visible'),1800);}

let roomPainting:Phaser.GameObjects.Image|undefined;
class RoomScene extends Phaser.Scene{
  constructor(){super('room');}preload(){this.load.image('room',asset('room-v3.png'));this.load.image('room-open',asset('room-open-v12.png'));}
  create(){
    roomPainting=this.add.image(836,470.5,state.boxSolved?'room-open':'room').setDisplaySize(1672,941);
    const glow=this.add.ellipse(1254,548,200,176,0xffbe70,.1).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({targets:glow,alpha:{from:.045,to:.12},scaleX:{from:.94,to:1.08},duration:1300,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)for(let i=0;i<24;i++){
      const x=400+(i*97)%1100,y=100+(i*71)%700,dust=this.add.circle(x,y,i%4===0?1.5:1,0xead4a9,.12);
      this.tweens.add({targets:dust,x:x+24,y:y-95,alpha:0,duration:12000+i*430,repeat:-1,delay:i*320});
    }
  }
}
new Phaser.Game({type:isAndroidApp()?Phaser.CANVAS:Phaser.AUTO,parent:'scene-canvas',width:1672,height:941,backgroundColor:'#25231e',scene:RoomScene,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true},audio:{noAudio:true},fps:{target:30,forceSetTimeOut:true}});

function renderToolbar(){el('toolbar').innerHTML=`
  <button class="tool-button" data-action="journal" title="线索册 L" aria-label="线索册">${icon('book')}<span>线索册</span></button>
  <button class="tool-button ${hotspots?'active':''}" data-action="hotspots" title="按住 H 察看" aria-label="察看互动位置" aria-pressed="${hotspots}">${icon('eye')}</button>
  <button class="tool-button" data-action="hint" title="提示" aria-label="借一点提示">${icon('candle')}</button>
  <button class="tool-button" data-action="sound" aria-label="环境声${foley.enabled?'开':'关'}" aria-pressed="${foley.enabled}">${icon(foley.enabled?'sound':'muted')}</button>
  <button class="tool-button" data-action="settings" aria-label="暂停菜单">${icon('menu')}</button>`;}
function spot(id:string,name:string,x:number,y:number,w:number,h:number,extra='',content=''){
  return `<button class="hotspot ${extra}" data-action="spot-${id}" aria-label="${name}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%">${content}<span class="hotspot-point" aria-hidden="true"><i></i></span></button>`;
}
function observe(show:boolean){
  clearTimeout(observationTimer);hotspots=show;el('hotspots').classList.toggle('show-hotspots',show);
  const control=el('toolbar').querySelector('[data-action="hotspots"]');
  control?.classList.toggle('active',show);control?.setAttribute('aria-pressed',String(show));
}
function pulseObservation(){observe(true);observationTimer=setTimeout(()=>observe(false),1400);}
function renderHotspots(){let html='';
  if(!has('tag'))html+=spot('tag','沾污的腰牌',48.3,76.8,6.6,10.5,'item-prop tag-prop',itemArt('tag','scene-item scene-token'));
  if(!has('cloth')&&!has('wetcloth'))html+=spot('cloth','干布条',89.5,72.2,8.4,8.1,'item-prop cloth-prop',itemArt('cloth','scene-item scene-cloth-art'));
  html+=spot('basin','水盆',79.5,50.5,18,18)+spot('ledger','案上的册子',56,64,29,24)+(state.boxSolved?spot('box','床脚木匣',15.5,64.5,17,24):spot('box','床脚木匣',9.5,69,20.5,14.5));
  const paperArt=`<span class="wall-paper"><img src="${asset(itemArtPath('manifest'))}" alt="" draggable="false"></span>`;
  html+=spot('noteA','墙上的纸条',40.4,26.5,5,12,'paper-prop',paperArt);
  html+=spot('noteB','随行布包',45.8,53,18,18)+spot('detention','墙上的文书',70.3,29.8,5,13,'paper-prop detention-prop',paperArt);
  html+=spot('candle','烛台',71.8,43,7.8,20)+spot('door','偏房木门',46.5,24,8.5,27,'door-spot');
  el('hotspots').innerHTML=html;el('hotspots').classList.toggle('show-hotspots',hotspots);
  el('selected-cue').innerHTML=selected?`${itemArt(selected)}<span>${itemLabel(selected)}</span><button data-action="cancel-item" aria-label="取消道具">${icon('close')}</button>`:'';
  el('selected-cue').classList.toggle('visible',!!selected);
  el('held-item').innerHTML=selected?itemArt(selected):'';
  if(!selected)el('held-item').classList.remove('visible');
}
function renderInventory(){
  el('inventory-dock').classList.toggle('open',bagOpen);
  document.querySelector('.bag-toggle')!.setAttribute('aria-expanded',String(bagOpen));el('bag-count').textContent=String(state.items.length);
  el('inventory').innerHTML=state.items.length?state.items.map(i=>`<button class="inventory-slot ${selected===i?'selected':''}" data-action="item-${i}" aria-label="${itemLabel(i)}" aria-pressed="${selected===i}">${itemArt(i)}<i class="selection-mark" aria-hidden="true"></i></button>`).join(''):'<p class="empty-inventory">衣囊里空空的。先看看案上的物件。</p>';
  el('inventory-tools').innerHTML=selected?`<span>${itemLabel(selected)}</span><button class="text-button" data-action="inspect-item">仔细查看 ${icon('eye')}</button>`:'<small>点选物品</small>';
}
function renderMenu(){const root=el('main-menu');root.classList.toggle('visible',menuOpen);root.innerHTML=menuOpen?`
  <section class="title-screen" aria-label="孤城夜火开始菜单"><div class="title-shadow"></div><div class="title-copy">
  <div class="title-kicker">南明 · 孤城 · 一夜</div><div class="game-title"><span>孤城</span><span>夜火<em>壹</em></span></div>
  <div class="title-rule"></div><p class="title-story">清军逼城，军械遭劫。<br>你带着半封军令归营，<br>等来的，却是一纸拘令。</p>
  <button class="start-button" data-action="start"><span>${campaignHasProgress()?'继续正篇':state.completed?'进入六关正篇':state.started?'继续序章':'入夜 · 序章'}</span>${icon('arrow')}</button>
  <button class="chapter-select-link" data-action="first-chapter-refined">重访军器库 ${icon('arrow')}</button><button class="chapter-select-link" data-action="campaign-picker">六关篇章 ${icon('arrow')}</button>
  ${state.started?'<button class="new-game-link" data-action="confirm-reset">重启序章</button>':'<p class="title-meta">原创历史悬疑解谜 · 序章与六关正篇</p>'}</div>
  <div class="title-corner"><span>孤城无眠</span><i></i><small>军营偏房</small></div><button class="title-sound" data-action="sound">${icon(foley.enabled?'sound':'muted')}环境声 ${foley.enabled?'开':'关'}</button></section>`:'';}

function tagArt(interactive=false){return `<div class="crafted-token ${state.tagClean?'clean':'dirty'}"><img src="${asset(itemArtPath('tag',true))}" alt="磨损的木腰牌与褐红绳结" draggable="false"><div translate="no" lang="zh-CN" class="engraving" aria-hidden="${!state.tagClean}"><small>甲字哨</small><strong>十七</strong><b>陆昭</b></div>${!state.tagClean?'<canvas id="grime" aria-label="腰牌上的泥污" class="'+(interactive?'interactive':'still')+'"></canvas>':''}</div>`;}
function tagView(){return `<div class="tag-inspection">${tagArt(wiping&&has('wetcloth'))}<div class="item-caption"><span class="eyebrow">${state.tagClean?'木纹旧痕':'逃亡时留下的泥污'}</span><h3>${state.tagClean?'甲字哨 · 十七 · 陆昭':'随身的腰牌'}</h3><p>${state.tagClean?'十七，是我入营时领到的牌号。':wiping?'按住腰牌上的污迹，来回擦拭。':'泥污干在牌面上，字迹辨不清了。'}</p>${!state.tagClean&&has('wetcloth')&&(selected==='wetcloth'||wiping)?wiping?'<span class="rub-guide">按住 · 来回擦拭</span><button class="text-button accessible-wipe" data-action="finish-wipe">改用点按完成擦拭</button>':'<button class="primary-button" data-action="begin-wipe">'+itemArt('wetcloth')+' 用湿布擦拭</button>':'<button class="secondary-button" data-action="close">收起腰牌</button>'}</div></div>`;}
function ledgerView(){return musterView(ledgerPage,state.tagClean,state.identityKnown,reveal,ledgerMagnified);}
function tile(w:Weapon){return `<span class="plaque-face">${icon(w)}<b>${({戈:'枪',铳:'铳',弓:'弓',盾:'牌'} as Record<Weapon,string>)[w]}</b></span>`;}
function boxView(){
  return `<div class="chest-stage ${openingBox?'opening':''}"><img class="chest-closed" aria-hidden="${state.boxSolved}" src="${asset('crafted/chest-closed.png')}" alt="四槽机关木匣" draggable="false"><img class="chest-open ${state.boxSolved?'shown':''}" aria-hidden="${!state.boxSolved}" src="${asset('crafted/chest-open.png')}" alt="已打开的木匣" draggable="false">
  <div class="chest-slots">${state.slots.map((w,i)=>`<button class="chest-slot ${w?'filled':''}" style="left:${21.5+i*15.05}%;top:52.7%;width:11.8%;height:17.2%" data-action="slot-${i}" aria-label="第${i+1}插位${w?'：'+WEAPON_NAMES[w]:'，空'}" ${state.boxSolved?'disabled':''}>${w?tile(w):'<span>'+['壹','贰','叁','肆'][i]+'</span>'}</button>`).join('')}</div>
  ${state.boxSolved?`<div class="chest-loot">${!has('key')?`<button class="loot-key" data-action="take-key" aria-label="收起军器库钥匙">${itemArt('key')}</button>`:''}${!has('manifest')?`<button class="loot-papers" data-action="take-papers" aria-label="收起押运单和残缺军令">${itemArt('manifest')}${itemArt('order')}</button>`:''}</div>`:''}</div>
  ${!state.boxSolved?`<div class="chest-below"><p class="box-inscription">“依点验次序排牌。”</p><div class="weapon-pool">${WEAPONS.map(w=>`<button class="weapon-tile ${selectedWeapon===w?'selected':''} ${state.slots.includes(w)?'placed':''}" data-action="weapon-${w}" draggable="true" data-weapon="${w}" aria-label="${WEAPON_NAMES[w]}木牌" aria-pressed="${selectedWeapon===w}">${tile(w)}<small>${WEAPON_NAMES[w]}</small></button>`).join('')}</div><div class="box-actions"><button class="text-button" data-action="clear-slots">取下木牌</button><button class="primary-button" data-action="try-box">拨动暗扣 ${icon('arrow')}</button><button class="text-button" data-action="journal">回看线索 ${icon('book')}</button></div><p id="puzzle-message" class="puzzle-message" aria-live="polite">${selectedWeapon?'把'+WEAPON_NAMES[selectedWeapon]+'木牌放进一个插位。':'点选木牌，再点插位；也可拖入。'}</p></div>`:`<div class="chest-below loot-caption"><h3>${has('key')&&has('manifest')?'遗物已经收好':'匣底还留着几样东西'}</h3><p>${has('key')&&has('manifest')?'百户最后的嘱托，藏在这两页纸上。':'他最后留下的东西，都在这里。'}</p>${has('manifest')?'<button class="secondary-button" data-action="view-order">展开残缺军令 '+icon('paper')+'</button>':''}</div>`}`;
}
function entries(){const list:{id:string;title:string;subtitle:string}[]=[];
  if(state.tagClean)list.push({id:'tag',title:'腰牌',subtitle:'甲字哨 · 十七'});
  if(state.identityKnown)list.push({id:'identity',title:'行伍册疑点',subtitle:'活人的阵亡记录'});
  if(state.clueA)list.push({id:'noteA',title:'点验便笺',subtitle:'长枪先验，藤牌收尾'});
  if(state.clueB)list.push({id:'noteB',title:'随行记事',subtitle:'火铳验毕，再点弓弩'});
  if(state.orderSeen)list.push({id:'detention',title:'札付',subtitle:'赵廷岳签发'});
  if(has('manifest'))list.push({id:'manifest',title:'押运单',subtitle:'六月初九 · 甲三'});
  if(has('order'))list.push({id:'order',title:'残缺军令',subtitle:'子时之前'});return list;}
function journalView(){const list=entries();if(!list.length)return '<div class="journal-empty">'+icon('book')+'<h3>纸页尚空</h3><p>查验物件之后，陆昭会把发现记在这里。</p></div>';
  if(!list.some(e=>e.id===journalEntry))journalEntry=list[0].id;
  let content='';if(journalEntry==='noteA')content=noteView('A');else if(journalEntry==='noteB')content=noteView('B',state.identityKnown);else if(journalEntry==='manifest')content=manifestView();else if(journalEntry==='order'||journalEntry==='detention')content=orderView(journalEntry==='detention');
  else if(journalEntry==='tag')content=`<div class="journal-fact">${tagArt()}<h3>甲字哨 · 十七 · 陆昭</h3><p>入营时领到的腰牌，编号一直未变。</p></div>`;
  else content='<div class="journal-fact"><span class="eyebrow">陆昭手记</span><h3>活人的阵亡记录</h3><p>腰牌：甲字哨 · 十七 · 陆昭</p><p>行伍册：甲字哨 · 十七 · 陆昭 · <b class="death-mark">阵亡</b></p><blockquote>“他们已经把我算作死人了。”</blockquote><p>是错录，还是有人不想让我回来？</p></div>';
  return `<div class="journal-layout"><nav class="journal-nav" aria-label="已发现线索">${list.map(e=>`<button class="${journalEntry===e.id?'active':''}" data-action="entry-${e.id}"><span>${e.title}<small>${e.subtitle}</small></span></button>`).join('')}</nav><div class="journal-content">${content}</div></div>`;}
function hintView(){const stage=hintStage(state),level=hints[stage]||0,e=HINTS[stage];return `<div class="hint-content"><div class="hint-lantern">${icon('candle')}</div><span class="eyebrow">借一点烛光</span><h3>${e.title}</h3><div class="hint-steps">${[0,1,2].map(i=>'<i class="'+(i<=level?'lit':'')+'"></i>').join('')}</div><p>${e.lines[level]}</p>${level<2?'<button class="secondary-button" data-action="more-hint">'+(level===0?'再给一点提示':'查看明确解法')+' '+icon('arrow')+'</button>':'<span class="evidence-saved">回到场景试一试</span>'}<small>提示不改变进度，可随时收起。</small></div>`;}
function basinView(){return `<div class="basin-inspection ${wetting?'wetting':''}"><div class="basin-crop" role="img" aria-label="案上的水盆"><i></i>${itemArt(wetting?'cloth':'wetcloth','dipping-cloth')}</div><div class="item-caption"><span class="eyebrow">桌上的水盆</span><h3>${has('wetcloth')?'布条浸透了水':'盆里的水还是清的'}</h3><p>烛影在水面上轻轻摇晃。</p>${has('cloth')&&selected==='cloth'?'<button class="primary-button" data-action="wet-cloth" '+(wetting?'disabled':'')+'>将布条蘸水 '+itemArt('cloth')+'</button>':'<button class="secondary-button" data-action="close">'+(has('wetcloth')?'收起湿布':'返回')+'</button>'}</div></div>`;}
function endingView(){return `<div class="ending-content"><span class="ending-seal">疑</span><span class="eyebrow">序章 · 偏房疑云</span><h2>活人的阵亡记录</h2><p>身后是写着你姓名的行伍册，<br>手中是百户没能送出的半封军令。</p><blockquote>子时，东门不可开。</blockquote><div class="ending-next"><small>第一关</small><strong>军器库夜查</strong><span>找到那批从未入库的军械。</span></div><p class="prototype-note">六关正篇已开放。此处进度会保留，可以随时回来。</p><button class="primary-button" data-action="enter-campaign">前往军器库 ${icon('arrow')}</button><button class="text-button" data-action="close">返回偏房</button><button class="text-button" data-action="journal">翻阅此夜手记</button></div>`;}
function renderModal(){const root=el('modal-root');const focusedAction=root.contains(document.activeElement)?(document.activeElement as HTMLElement)?.dataset.action:undefined;syncInert();if(!modal){root.innerHTML='';return;}
  const titles:Record<Exclude<Modal,null>,string>={tag:'随身腰牌',ledger:'东营行伍册',box:'百户遗下的木匣',noteA:'点验便笺',noteB:'随行布包',detention:'副将札付',order:'残缺军令',manifest:'军械押运单',journal:'陆昭手记',hint:'借一点烛光',settings:'暂停片刻',help:'如何调查',end:'序章终',basin:'一盆清水'};
  let content='';
  if(modal==='tag')content=tagView();else if(modal==='ledger')content=ledgerView();else if(modal==='box')content=boxView();else if(modal==='noteA')content=noteView('A');else if(modal==='noteB')content=noteView('B',state.identityKnown);else if(modal==='detention')content=orderView(true);else if(modal==='manifest')content=manifestView();else if(modal==='order')content=orderView();else if(modal==='journal')content=journalView();else if(modal==='hint')content=hintView();else if(modal==='basin')content=basinView();
  else if(modal==='settings')content=`<div class="settings-content"><span class="eyebrow">进度已自动留存于本机</span><h3>灯未灭，城未眠。</h3><button class="primary-button" data-action="close">继续此夜 ${icon('arrow')}</button><button class="secondary-button" data-action="sound">环境声 ${foley.enabled?'开':'关'} ${icon(foley.enabled?'sound':'muted')}</button><button class="secondary-button" data-action="fullscreen">全屏显示 ${icon('full')}</button><button class="secondary-button" data-action="help">操作说明</button><button class="text-button" data-action="menu">返回标题</button><button class="text-button restart-link" data-action="confirm-reset">重新开始本段</button></div>`;
  else if(modal==='help')content='<div class="help-content"><h3>留意物件，也留意字里行间。</h3><p>点按场景中的物件，进入近景。按住 H 可暂时察看互动位置。</p><p>点左下角衣囊展开背包，先选道具，再点目标使用。也可配合背包中的物品。</p><p>按 L 翻阅已发现的线索。木匣中的木牌可以点选放置，也可以拖动。</p><p>思路卡住时，点烛火图标获取逐级提示。没有倒计时，也不会因试错丢失道具。</p><small>B 背包 · H 察看 · L 手记 · Esc 返回</small></div>';
  else if(modal==='end')content=endingView();
  const immersive=['tag','box','ledger','basin','noteA','noteB','detention','order','manifest'].includes(modal);
  root.innerHTML=`<div class="modal-backdrop ${immersive?'immersive':''}" data-action="backdrop"><section class="inspection-modal modal-${modal}" role="dialog" aria-modal="true" aria-label="${titles[modal]}"><header class="modal-header"><div><span class="modal-marker"></span><h2>${titles[modal]}</h2></div><button class="close-button" data-action="close" aria-label="返回场景">${icon('close')}</button></header><div class="modal-body">${content}</div><footer class="modal-footer"><span>${immersive?'细看眼前之物':modal==='journal'?'见闻已记':'Esc 返回场景'}</span><button data-action="close">${icon('back')} 返回</button></footer></section></div>`;
  if(focusedAction)Array.from(root.querySelectorAll<HTMLElement>('[data-action]')).find(e=>e.dataset.action===focusedAction)?.focus({preventScroll:true});
  if(modal==='tag'&&!state.tagClean)mountWiping(el('grime') as HTMLCanvasElement,()=>foley.play('cloth'),finishWipe,wiping&&has('wetcloth'),asset(itemArtPath('tag')));
  if(modal==='journal'&&!state.tagClean&&document.getElementById('grime'))mountWiping(el('grime') as HTMLCanvasElement,()=>{},()=>{},false,asset(itemArtPath('tag')));
}
function openModal(m:Modal){observe(false);el('held-item').classList.remove('visible');lastFocus=document.activeElement as HTMLElement;modal=m;wiping=false;reveal=false;bagOpen=false;
  if(m==='noteA')commit({type:'READ_A'});if(m==='noteB')commit({type:'READ_B'});if(m==='detention')commit({type:'READ_ORDER'});
  if(m==='ledger'){ledgerPage=state.identityKnown?1:0;ledgerMagnified=false;}
  if(['ledger','noteA','noteB','detention','order','manifest','journal'].includes(m||''))foley.play('paper');
  render();requestAnimationFrame(()=>el('modal-root').querySelector<HTMLButtonElement>('.close-button')?.focus({preventScroll:true}));
}
function closeModal(){if(openingBox||wetting)return;const was=modal;modal=null;wiping=false;reveal=false;renderModal();lastFocus?.focus({preventScroll:true});
  if(was==='ledger'&&state.identityKnown&&!state.searchSeen)setTimeout(()=>{if(!modal&&!menuOpen&&!sequence)startSequence('search');},450);
}
function render(){roomPainting?.setTexture(state.boxSolved?'room-open':'room');renderToolbar();renderHotspots();renderInventory();renderMenu();renderModal();syncInert();}
function finishWipe(){if(modal!=='tag'||state.tagClean)return;commit({type:'CLEAN_TAG'});wiping=false;selected=null;render();foley.play('cloth');say('甲字哨，十七，陆昭。还认得出。');}

const sequenceLines={
  intro:[['南明 · 孤城','六月十一日　亥时三刻'],['两日前','军械押送遇袭。\n同行共十二人，只有你回来了。'],['老军匠','副将的人还在搜。别点大灯。\n你的东西，我都收在桌上。']],
  search:[['门外 · 巡兵','这两间都查过了？'],['另一人','副将有令，活要见人。\n沿着东营，再搜一遍。'],['老军匠 · 低声','别出声。\n脚步远了，再走。']],
  ending:[['陆昭','子时……东门不可开。'],['门外','巡夜的脚步渐渐远去。\n你握住库钥，推开了偏房的门。']]
};
function startSequence(s:Exclude<Sequence,null>){observe(false);el('held-item').classList.remove('visible');modal=null;sequence=s;sequenceIndex=0;bagOpen=false;el('quote').classList.remove('visible');el('scene-frame').classList.toggle('searching',s==='search');el('scene-frame').classList.toggle('departing',s==='ending');if(s==='search')foley.patrol();if(s==='ending')foley.play('wood');render();renderSequence();}
function renderSequence(){if(!sequence){el('sequence-root').innerHTML='';syncInert();return;}const line=sequenceLines[sequence][sequenceIndex];el('sequence-root').innerHTML=`<section class="cinematic cinematic-${sequence}" aria-label="剧情" role="dialog" aria-modal="true"><button class="skip-sequence" data-action="skip-sequence">跳过 ${icon('arrow')}</button><div class="cinematic-content"><span>${line[0]}</span><p>${line[1].replaceAll('\n','<br>')}</p><div class="cinematic-rule"></div><button data-action="next-sequence">${sequenceIndex===sequenceLines[sequence].length-1?'继续':'下一句'} <i></i></button></div><small>${sequence==='intro'?'孤城夜火 · 序章':'屏息片刻'}</small></section>`;syncInert();el('sequence-root').querySelector<HTMLButtonElement>('[data-action="next-sequence"]')?.focus();}
function finishSequence(){const was=sequence;sequence=null;el('scene-frame').classList.remove('searching','departing');if(was==='intro')commit({type:'MARK_INTRO'});if(was==='search')commit({type:'MARK_SEARCH'});renderSequence();render();if(was==='intro')say('百户没能回营。他留下的东西，还在床脚。','老军匠');if(was==='search')say('他们还在找我。百户留下的军令，必须送出去。');if(was==='ending')openModal('end');}
function resetGame(){state=freshProgress();selected=null;selectedWeapon=null;modal=null;journalEntry='';hotspots=false;Object.keys(hints).forEach(k=>delete hints[k]);commit({type:'START'});menuOpen=false;startSequence('intro');}
function inspectItem(i:Item){if(i==='tag')openModal('tag');else if(i==='manifest')openModal('manifest');else if(i==='order')openModal('order');else toast(i==='key'?'军器库的铜钥匙。库房就在偏房外。':i==='cloth'?'一段干布条，还算干净。':'布条浸透了水。');}
function wetCloth(){if(wetting||!has('cloth'))return;wetting=true;renderModal();foley.play('water');setTimeout(()=>{commit({type:'WET_CLOTH'});wetting=false;selected='wetcloth';render();toast('布条浸透了水。');},1050);}
function handleSpot(name:string){
  if(name==='tag'){pickup('tag',{type:'TAKE_TAG'});openModal('tag');return;}
  if(name==='cloth'){pickup('cloth',{type:'TAKE_CLOTH'});say('干布还算干净。');return;}
  if(name==='basin'){openModal('basin');if(selected==='cloth')wetCloth();return;}
  if(name==='ledger'||name==='box'||name==='noteA'||name==='noteB'||name==='detention'){openModal(name);return;}
  if(name==='candle'){say('这点光，已经足够了。门外的人不能看见。');foley.play('wood');return;}
  if(name==='door'){const r=commit({type:'COMPLETE'});if(r.ok)startSequence('ending');else say(r.message);}
}
function place(index:number,w:Weapon|null){if(openingBox)return;commit({type:'PLACE',index,weapon:w});selectedWeapon=null;foley.play('wood');renderModal();el('modal-root').querySelector(`[data-action="slot-${index}"]`)?.classList.add('just-placed');}
function identify(){if(ledgerPage!==1)return;if(!state.tagClean){toast('腰牌的字还没看清，不能确定是同一个人。');return;}if(state.identityKnown){toast('牌号、姓名，分毫不差。');return;}commit({type:'IDENTIFY'});reveal=true;foley.play('reveal');renderModal();say('……阵亡？我还活着，他们却已经把我记作死人。','陆昭',9000);setTimeout(()=>{if(modal==='ledger'){reveal=false;el('modal-root').querySelector('.muster-spread')?.classList.remove('identity-reveal');}},2000);}

document.addEventListener('click',e=>{
  if(isCampaignActive())return;
  const t=(e.target as Element).closest<HTMLElement>('[data-action]');if(!t)return;const a=t.dataset.action!;
  if(a==='next-sequence'){if(sequence&&++sequenceIndex<sequenceLines[sequence].length)renderSequence();else finishSequence();return;}
  if(a==='skip-sequence'){finishSequence();return;}
  if(sequence)return;
  if(a==='backdrop'){if(e.target===t)closeModal();return;}
  if(a==='campaign-picker'){campaign.openPicker();return;}
  if(a==='first-chapter-refined'){campaign.replayFirst();return;}
  if(a==='enter-campaign'){modal=null;render();campaign.start(1);return;}
  if(a==='start'){if(campaignHasProgress()){campaign.continue();return;}if(state.completed){campaign.start(1);return;}foley.unlock();commit({type:'START'});menuOpen=false;render();if(!state.introSeen)startSequence('intro');else if(state.identityKnown&&!state.searchSeen)startSequence('search');return;}
  if(a==='menu'){observe(false);el('held-item').classList.remove('visible');modal=null;menuOpen=true;render();return;}
  if(a==='close'){closeModal();return;}
  if(a==='confirm-reset'){if(confirm('重启此夜会清除本机的本段调查进度。确定重新开始吗？'))resetGame();return;}
  if(a==='sound'){foley.toggle();renderToolbar();renderMenu();if(modal==='settings')renderModal();return;}
  if(a==='fullscreen'){if(document.fullscreenElement)void document.exitFullscreen();else document.documentElement.requestFullscreen?.().catch(()=>toast('当前浏览器无法全屏，可继续窗口游玩。'));return;}
  if(a==='bag'){bagOpen=!bagOpen;renderInventory();return;}
  if(a==='hotspots'){pulseObservation();return;}
  if(a==='journal'||a==='settings'||a==='hint'||a==='help'){openModal(a);return;}
  if(a==='dismiss-quote'){el('quote').classList.remove('visible');return;}
  if(a==='cancel-item'){selected=null;renderInventory();renderHotspots();return;}
  if(a.startsWith('spot-')){handleSpot(a.slice(5));return;}
  if(a.startsWith('item-')){const i=a.slice(5) as Item;if((i==='tag'&&selected==='wetcloth')||(i==='wetcloth'&&selected==='tag')){openModal('tag');wiping=true;renderModal();return;}selected=selected===i?null:i;renderInventory();renderHotspots();return;}
  if(a==='inspect-item'){if(selected)inspectItem(selected);return;}
  if(a==='wet-cloth'){wetCloth();return;}
  if(a==='use-wetcloth'){if(!has('tag')){closeModal();toast('先把桌上的腰牌收好。');return;}openModal('tag');wiping=true;renderModal();return;}
  if(a==='begin-wipe'){wiping=true;renderModal();return;}
  if(a==='finish-wipe'){finishWipe();return;}
  if(a==='view-ledger'){openModal('ledger');return;}
  if(a==='magnify-ledger'){ledgerMagnified=!ledgerMagnified;renderModal();return;}
  if(a==='turn-page'){ledgerPage=ledgerPage===0?1:0;foley.play('paper');renderModal();el('modal-root').querySelector('.muster-right')?.classList.add('page-turn');return;}
  if(a.startsWith('ledger-row-')){if(ledgerPage===1&&a==='ledger-row-3')identify();else toast('姓名与牌号都对不上。');return;}
  if(a.startsWith('weapon-')){selectedWeapon=a.slice(7) as Weapon;foley.play('wood');renderModal();return;}
  if(a.startsWith('slot-')){const i=Number(a.slice(5));if(selectedWeapon)place(i,selectedWeapon);else if(state.slots[i]){selectedWeapon=state.slots[i];commit({type:'PLACE',index:i,weapon:null});foley.play('wood');renderModal();}else toast('先点一枚木牌，再放入插位。');return;}
  if(a==='clear-slots'){selectedWeapon=null;commit({type:'RESET_SLOTS'});foley.play('wood');renderModal();return;}
  if(a==='try-box'){if(openingBox)return;const r=commit({type:'OPEN_BOX'});if(!r.ok){el('puzzle-message').textContent=r.message;el('modal-root').querySelector('.chest-stage')?.classList.add('shake');setTimeout(()=>el('modal-root').querySelector('.chest-stage')?.classList.remove('shake'),350);foley.play('wood');return;}openingBox=true;selectedWeapon=null;foley.play('latch');render();setTimeout(()=>{openingBox=false;renderModal();say('这匣子是老军匠替百户制的。库钥和那两页纸，都还在。');},1100);return;}
  if(a==='take-key'){pickup('key',{type:'TAKE_KEY'});return;}
  if(a==='take-papers'){pickup('manifest',{type:'TAKE_PAPERS'});say('军令只剩半页。“子时……东门……不可开。”');return;}
  if(a==='view-order'){openModal('order');return;}
  if(a==='view-manifest'){openModal('manifest');return;}
  if(a.startsWith('entry-')){journalEntry=a.slice(6);foley.play('paper');renderModal();return;}
  if(a==='more-hint'){const stage=hintStage(state);hints[stage]=Math.min(2,(hints[stage]||0)+1);renderModal();return;}
});
document.addEventListener('dragstart',e=>{const t=(e.target as Element).closest<HTMLElement>('[data-weapon]');if(t){selectedWeapon=t.dataset.weapon as Weapon;e.dataTransfer?.setData('text/plain',selectedWeapon);}});
document.addEventListener('dragover',e=>{const t=(e.target as Element).closest<HTMLElement>('.chest-slot');if(t){e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='move';}});
document.addEventListener('drop',e=>{const t=(e.target as Element).closest<HTMLElement>('.chest-slot');if(t){e.preventDefault();const w=e.dataTransfer?.getData('text/plain') as Weapon;if(WEAPONS.includes(w))place(Number(t.dataset.action!.slice(5)),w);}});
document.addEventListener('pointermove',e=>{
  const carried=el('held-item');
  const inScene=(e.target as Element).closest('.hotspot-layer');
  const visible=!!selected&&!!inScene&&!menuOpen&&!modal&&!sequence&&e.pointerType==='mouse';
  carried.classList.toggle('visible',visible);
  if(visible){carried.style.left=e.clientX+'px';carried.style.top=e.clientY+'px';}
});
window.addEventListener('blur',()=>{observe(false);el('held-item').classList.remove('visible');});
document.addEventListener('visibilitychange',()=>{if(document.hidden)observe(false);});
document.addEventListener('dblclick',e=>{const slot=(e.target as Element).closest<HTMLElement>('.inventory-slot');if(slot){const i=slot.dataset.action!.slice(5) as Item;selected=i;inspectItem(i);}});
document.addEventListener('keyup',e=>{if(e.key.toLowerCase()==='h')observe(false);});
document.addEventListener('keydown',e=>{
  if(isCampaignActive())return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const root=sequence?el('sequence-root'):modal?el('modal-root'):menuOpen?el('main-menu'):null;
  if(e.key==='Tab'&&root){const focusable=Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]')),first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
  if(sequence){if(e.key==='Escape')finishSequence();return;}
  if(e.key==='Escape'){if(modal)closeModal();else if(bagOpen){bagOpen=false;renderInventory();}else if(selected){selected=null;renderInventory();renderHotspots();}else if(!menuOpen)openModal('settings');return;}
  if(menuOpen)return;if(e.key.toLowerCase()==='l'){if(modal==='journal')closeModal();else openModal('journal');}
  if(!modal&&e.key.toLowerCase()==='h'){if(!e.repeat)observe(true);}
  if(!modal&&e.key.toLowerCase()==='b'){bagOpen=!bagOpen;renderInventory();}
});
for(const path of new Set([...Object.values(ITEM_ART),itemArtPath('tag',true),'crafted/chest-closed.png','crafted/chest-open.png','crafted/muster-folio-v3.png','crafted/paper-leaf-blank-v3.png','crafted/torn-letter-blank-v3.png'])){const img=new Image();img.src=asset(path);}
render();
