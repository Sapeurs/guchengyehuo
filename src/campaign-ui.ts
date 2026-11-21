import {MAIN_PATH,chapterOutro} from './chapter-flow';
import './crate-bottom.css';
import {moveBottom,bottomCorrect} from './crate-bottom';
import {bottomBar} from './crate-bottom-view';
import {firstEnding,firstDeparture} from './c1-investigation';
import {FIELD_MOMENTS} from './field-direction';
import {finishFieldMoment,eastGateAdmitted,admitAtEastGate} from './campaign-state';
import './field-polish.css';
import {gateBeam,workshopMoment} from './chapter-workshop';
import {fieldFocus,fieldSceneDecor,fieldSummary,fieldBackdrop,syncFieldVisual,waistToken} from './field-view';
import {fieldMove,fieldCorrect,brushStroke,fieldSceneBlock,fieldActionBlock,fieldPuzzleVisible,fieldSceneLabel} from './field-state';
import {restartChapter,restoreChapter} from './campaign-state';
import {compareLedger,caseLead,caseThreads} from './c1-investigation';
import {warrantView} from './seal-view';
import './campaign.css';
import {propArt,propSpot,clueSpot,clueDetail,sceneAsset,sceneMarks} from './scene-presentation';
import './chapter-one.css';
import './chapter-one-world.css';
import './scene-polish.css';
import './crate-room.css';
import './chapter-rooms.css';
import './c1-investigation.css';
import './field-world.css';
import './chapter-workshop.css';
import './river-scene.css';
import {riverBackdrop, riverField, riverObservation, isRiverPuzzle} from './river-route';
import {riverScene} from './river-scene';
import './stronghold-scene.css';
import {isStrongholdPuzzle,strongholdBackdrop,strongholdField,strongholdLocation,strongholdObservation,strongholdScene,syncStrongholdScene} from './stronghold-scene';
import {crateRoom,mountCrateRoom} from './crate-room';
import {firstChapterScene,worldFocus,oilLamp} from './chapter-one-world-view';
import {movePaper,paperClarity,inspectTrack,changeRoom,TRACK_MARKS,worldViewDraft} from './chapter-one-world';
import {CHAPTERS,CHAPTER_BY_ID,type Chapter,type Puzzle,type Prop,type Clue} from './campaign-data';
import {CAMPAIGN_KEY,freshCampaign,restoreCampaign,initialDraft,missingRequirements,puzzleReady,chapterComplete,enterChapter,takeProp,readClue,applyTool,solve,correctSolution,markStory,restartFirstChapter,restoreFirstChapter,type CampaignProgress,type Draft} from './campaign-state';
import {moveCrate,CRATE_BLOCKS,ARTISAN_TOPICS,C1_SCENES,directSealDraft,sealReviewDraft} from './chapter-one';
import {crateView,sealView} from './chapter-one-view';
import {icon} from './icons';
import type {Foley} from './foley';
const isScenePuzzle=(id:string)=>id==='c1-p4'||isRiverPuzzle(id)||isStrongholdPuzzle(id);
const A=(p:string)=>import.meta.env.BASE_URL+'assets/'+p;
const esc=(s:unknown)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let active=false;
export const isCampaignActive=()=>active;
export function campaignHasProgress(){try{return restoreCampaign(localStorage.getItem(CAMPAIGN_KEY)).started;}catch{return false;}}
const numerals=['零','壹','贰','叁','肆','伍','陆'];
// Object rectangles follow the actual painted background rather than an invisible grid.
const placements:Record<string,[number,number,number,number]>={
 'c1-p1':[41,52,25,25],'c1-p2':[12,57,24,16],'c1-p3':[39,68,20,15],'c1-p4':[83,9,14,55],'c1-p5':[81,48,18,21],'c1-p6':[1,41,29,42],
 'c2-p1':[1,61,17,33],'c2-p2':[1,7,8,52],'c2-p3':[59,58,12,16],'c2-p4':[78,45,21,47],'c2-p5':[61,28,30,40],'c2-p6':[34,61,26,16],
 'c3-p1':[44,44,28,44],'c3-p2':[82,14,18,41],'c3-p3':[45,53,28,26],'c3-p4':[36,66,43,20],'c3-p5':[77,28,22,45],'c3-p6':[7,45,23,31],
 'c4-p1':[35,29,23,44],'c4-p2':[75,20,20,38],'c4-p3':[2,54,25,16],'c4-p4':[51,71,16,13],'c4-p5':[76,44,23,47],'c4-p6':[70,13,20,64],
 'c5-p1':[34,42,34,40],'c5-p2':[71,58,25,20],'c5-p3':[44,58,30,18],'c5-p4':[69,68,14,16],'c5-p5':[66,9,31,48],'c5-p6':[6,22,28,40],
 'c6-p1':[46,62,28,15],'c6-p2':[77,40,19,45],'c6-p3':[77,13,19,47],'c6-p4':[31,61,28,22],'c6-p5':[8,56,46,28],'c6-p6':[62,61,29,22]
};
const observations=[
 ['甲三号箱停在院中。湿泥里的轮槽还没干。','簿上留着三笔收讫，案下的抽屉有一只铜拉环。','案面平整，旁边的灯架很高。'],
 ['缆桩旧，绳结新。今夜有人把船拖到这里又重新系过。','所谓盐货里没有盐味，箱角却露着熟悉的军械烙记。','河关灯架上的烟痕不一致，有一盏灯刚换过罩。'],
 ['马槽的草还湿着，鞍带上的泥却来自河边。','递送架不缺木夹，缺的是本该挂在那里的正本。','信灯倒挂时朝向城外，正挂时才向门楼可见。'],
 ['脚印到了井边就变浅。来人扶着墙，走得很慢。','陈九成怕把巡兵引到这里，没有点香，也没敢留名。','暗门后有人轻咳两声：陆昭，是你吗？'],
 ['告示板留下旧签的钉眼，新换防签只用了两枚钉。','铁链没有断，制动齿却像是刚被人取走的。','夹道里能听见守军交接口令，回答的人迟疑了一息。'],
 ['真灯序的纸被压在假回文下，边角还有驿卒的手印。','城外几盏灯位置太低，像是一队人在等城门回应。','曙光落在案上。今晚每一份原件都应留下，不能只留下结论。']
];
export function createCampaign(options:{foley:Foley;onExit:()=>void;onPrologue:()=>void}){
 let s:CampaignProgress=freshCampaign();try{s=restoreCampaign(localStorage.getItem(CAMPAIGN_KEY));}catch{}
 const root=document.createElement('div');root.id='campaign-root';root.hidden=true;document.body.append(root);
 let modal:{type:string;id?:string}|null=null,bag=false,chosen:string|null=null,token:number|string|null=null,left=-1,hintLevel=0,showPoints=false,message='',savedWarning=false,zoom=false,sequenceLine=0,crateSelected=0,storyLine=0;
 const replayBackupKey=CAMPAIGN_KEY+':chapter-one-backup';
 let riverLine='';
 let lampAim:[number,number]=[27,70],sceneMotion='';
 let sealReviewOverlay=true;
 let crateCleanup:(()=>void)|null=null;
 let sceneMotionTimer:ReturnType<typeof setTimeout>;
 let noticeTimer:ReturnType<typeof setTimeout>,pointsTimer:ReturnType<typeof setTimeout>;
 const chapter=()=>CHAPTER_BY_ID(s.chapter);
 const inkScene=()=>!modal&&s.chapter===1&&s.scene===2;
 const activeWorldId=()=>modal?.type==='world'?modal.id:inkScene()?'c1-p4':undefined;
 const save=()=>{try{localStorage.setItem(CAMPAIGN_KEY,JSON.stringify(s));}catch{savedWarning=true;}};
 const update=(next:CampaignProgress)=>{s=next;save();};
 const propById=(id:string)=>CHAPTERS.flatMap(c=>c.props).find(p=>p.id===id)!;
 const puzzleById=(id:string)=>CHAPTERS.flatMap(c=>c.puzzles).find(p=>p.id===id)!;
 const clueById=(id:string)=>CHAPTERS.flatMap(c=>c.clues).find(p=>p.id===id)!;
 const art=(p:Prop,cls='')=>p.id==='c6-token'?waistToken():p.id==='c1-warrant'?`<span class="w-warrant-icon ${cls}" aria-hidden="true">札付<i>印</i></span>`:p.id==='c1-lamp'?`<span class="w-bag-lamp ${cls}">${oilLamp()}</span>`:propArt(p,cls);
 function activate(){active=true;root.hidden=false;document.getElementById('app')!.hidden=true;document.getElementById('main-menu')!.hidden=true;document.getElementById('modal-root')!.hidden=true;document.getElementById('sequence-root')!.hidden=true;options.foley.unlock();}
 function exit(toPrologue=false){crateCleanup?.();crateCleanup=null;active=false;root.hidden=true;root.innerHTML='';options.foley.locationMood('normal');document.title='孤城夜火 · 序章与六关正篇';for(const id of ['app','main-menu','modal-root','sequence-root'])document.getElementById(id)!.hidden=false;toPrologue?options.onPrologue():options.onExit();}
 function begin(id:number,resume=false){riverLine='';update(resume&&id===s.chapter?{...s,started:true}:enterChapter(s,id));if(s.chapter===1&&s.world.includes('c1-patrol-active'))update({...s,scene:1});document.title='孤城夜火 · '+chapter().title;modal=s.introSeen.includes(id)?null:{type:'intro'};if(s.moment)modal={type:'moment',id:s.moment};if(!modal&&!eastGateAdmitted(s))modal={type:'gate-guard'};if(id===1&&s.world.includes('c1-patrol-pending')){update({...s,scene:1});modal={type:'world',id:'c1-p2'};}bag=false;chosen=null;token=null;left=-1;message='';sequenceLine=0;activate();render();preload();setAtmosphere();if(s.moment)options.foley.discovery(FIELD_MOMENTS[s.moment].theme);}
 function setAtmosphere(){options.foley.locationMood(s.chapter===1?(['yard','room','lamp'] as const)[s.scene]:s.chapter===2?'river':s.chapter===4?'temple':s.chapter===6?'tower':'room');}
 function preload(){const files=[0,1,2].map(i=>sceneAsset(s.chapter,i));
 if(s.chapter===2)files.push('chapters/c2-cargo-open-v25.png','chapters/c2-lamp-rig-v24.png');
 if(s.chapter===4)files.push('chapters/c4-passage-close-v24.png','chapters/c4-shelter-v22.png');
 if(s.chapter===5)files.push('chapters/c5-hoist-close-v24.png');
 if(s.chapter===6)files.push('chapters/c6-towers-v21.png');
 if(s.chapter===3)files.push('chapters/c3-signal-cold-v25.png','chapters/c3-signal-close-v24.png');if(s.chapter===1)files.push(...['c1-s0-closed-v7','c1-s0-open-v7','c1-s2-revealed-v7','artisan-neutral-v7','artisan-alert-v7','c1-s1-covered-v10','hand-oil-lamp-v10','c1-s2-cleared-v10','c1-s1-drawer-open-v11','c1-s1-drawer-covered-v11','hand-oil-lamp-stored-v11','crate-body-v13','crate-open-v13','crate-bar-v13','c1-ledger-desk-v14','c1-worktable-v14','c1-departure-v14'].map(n=>'chapters/'+n+'.png'));for(const file of files){const img=new Image();img.src=A(file);}}
 function sceneImage(){const staged=riverBackdrop(s)||strongholdBackdrop(s);if(staged)return staged;if(s.chapter===1){if(s.scene===2)return 'chapters/c1-worktable-v14.png';if(s.scene===1){const drawer=s.world.includes('c1-drawer-open'),covered=s.world.includes('c1-patrol-done');return 'chapters/'+(drawer?(covered?'c1-s1-drawer-covered-v11.png':'c1-s1-drawer-open-v11.png'):(covered?'c1-s1-covered-v10.png':'c1-s1.png'));}if(s.scene===0&&s.solved.includes('c1-p3'))return 'chapters/c1-yard-bottom-v23.png';if(s.scene===0&&chapterComplete(s,1))return 'chapters/c1-departure-v14.png';if(s.scene===0)return 'chapters/'+(s.solved.includes('c1-p1')?'c1-s0-open-v7.png':'c1-s0-closed-v7.png');}return s.chapter>=2?fieldBackdrop(s):sceneAsset(s.chapter,s.scene);}
 function sceneLocked(index:number){return s.chapter===1?index===2&&!s.solved.includes('c1-p1'):!!fieldSceneBlock(s.chapter,index,s.solved);}
 function startStory(id:string){storyLine=0;open('story',id);if(id==='patrol'){options.foley.play('step');options.foley.play('step',.55);options.foley.play('step',1.1);options.foley.play('knock',1.65);}else if(id==='opened')options.foley.play('latch');else if(id==='ink')options.foley.storyCue();}
 function storyLines(){const id=modal?.id||'';if(id==='departure')return firstDeparture(s);if(id.startsWith('talk-'))return ARTISAN_TOPICS[id.slice(5) as keyof typeof ARTISAN_TOPICS].lines;return C1_SCENES[id as keyof typeof C1_SCENES]||[['老军匠','把原件和底单放好。西渡那边，还得有人亲眼去看。'],['陆昭','等我回来。']];}
 function finishStory(){const id=modal?.id||'',key=id==='opened'?'c1-opened':id==='patrol'?'c1-patrol':id==='ink'?'c1-ink':id==='departure'?'c1-departure':'c1-mentor';update(markStory(s,key));if(id.startsWith('talk-')){open('artisan');return;}if(id==='departure'){sequenceLine=0;open('outro');return;}open('puzzle',id==='opened'?'c1-p1':id==='patrol'?'c1-p2':'c1-p4');}
 function sceneNavigate(index:number){if(!eastGateAdmitted(s)){open('gate-guard');return;}if(s.chapter===1&&s.world.includes('c1-patrol-active')){notice('脚步就在门外。先遮住灯火。');return;}if(sceneLocked(index)){notice(fieldSceneBlock(s.chapter,index,s.solved)||'老军匠：先查清这只甲三箱，我再带你进侧库接纸。');return;}update({...s,scene:index});riverLine='';bag=false;showPoints=false;modal=null;render();options.foley.play('step');setAtmosphere();}
 function closeInspection(){
  if(modal?.type==='gate-guard')return;
  if(modal?.type==='moment'){finishMoment();return;}
  modal=null;message='';token=null;
  if(s.chapter===1&&s.world.includes('c1-patrol-pending')&&!s.world.includes('c1-patrol-done')){
   worldFlag('c1-patrol-active','c1-patrol-pending');update({...s,scene:1});options.foley.play('step');options.foley.play('knock',1);
  }
  render();
 }
 function notice(text:string){const n=root.querySelector<HTMLElement>('.camp-notice');if(!n)return;n.textContent=text;n.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.classList.remove('visible'),4000);}
 function open(type:string,id?:string){
  if(type==='puzzle'&&id&&isScenePuzzle(id)&&eastGateAdmitted(s)){
   const p=puzzleById(id);
   if(sceneLocked(p.scene)){notice(fieldSceneBlock(s.chapter,p.scene,s.solved)||'还走不到那里。');return;}
   if(s.scene!==p.scene)riverLine='';
   update({...s,scene:p.scene});modal=null;bag=false;showPoints=true;render();setAtmosphere();
   root.querySelector<HTMLElement>('.v25-room-actions button')?.focus({preventScroll:true});
   return;
  }
  if(!eastGateAdmitted(s)&&['puzzle','field','prop'].includes(type)){type='gate-guard';id=undefined;}if(type==='puzzle')type=s.chapter===1?(id==='c1-p1'?'crate':'world'):'field';modal={type,id};sealReviewOverlay=true;message='';token=null;left=-1;zoom=false;hintLevel=0;bag=false;showPoints=false;if(type==='field'&&id==='c4-p4')update(applyTool(s,puzzleById(id),'c4-testimony'));if(type==='world'&&id==='c1-p2'){update(readClue(s,'c1-e'));if(s.bag.includes('c1-manifest')||s.solved.includes('c1-p2'))update(readClue(s,'c1-a'));}if(type==='clue'&&id){update(readClue(s,id));options.foley.play('paper');}if((type==='puzzle'||type==='world'||type==='crate'||type==='field')&&id&&!s.drafts[id]){s.drafts[id]=initialDraft(puzzleById(id));save();}render();requestAnimationFrame(()=>root.querySelector<HTMLElement>(type==='story'?'[data-c="story-next"]':type==='crate'?'[data-crate-back]':type==='world'?'.w-step-back':type==='field'?'.field-header button':'.camp-dialog .camp-close')?.focus());}
 function useTool(p:Puzzle){if(!chosen){notice('先从随身物品中点选一件道具。');return;}const next=applyTool(s,p,chosen);if(next===s){notice(p.id==='c1-p1'&&chosen==='c1-weight'?'横木还没撬起，砝码放不到锁舌上。':'这件物品暂时用不上，先收好。');return;}const name=propById(chosen).name;update(next);if(p.id==='c1-p2')update(readClue(s,'c1-a'));chosen=null;bag=false;message='';options.foley.play(p.id==='c1-p3'||p.id==='c1-p2'?'paper':'wood');render();if(s.chapter!==1)notice(name+'已摆在手边。');}
 function hotspot(id:string,label:string,rect:[number,number,number,number],extra='',body=''){return `<button class="camp-spot ${extra}" data-c="${id}" aria-label="${esc(label)}" style="left:${rect[0]}%;top:${rect[1]}%;width:${rect[2]}%;height:${rect[3]}%">${body}<i class="camp-point" aria-hidden="true"></i></button>`;}
 function sceneHtml(c:Chapter){
  const sceneName=(i:number)=>strongholdLocation(s,i)||fieldSceneLabel(c.id,i,s.solved,c.scenes[i].name);
  const ps=c.puzzles.filter(p=>p.scene===s.scene&&!isScenePuzzle(p.id)&&fieldPuzzleVisible(p.id,s.solved)),cs=c.id===1?c.clues.filter(p=>p.scene===s.scene):[],items=c.props.filter(p=>p.scene===s.scene&&!s.bag.includes(p.id)&&!(p.requires||[]).some(id=>!s.solved.includes(id))&&!p.carried);
  return `<div class="camp-scene ${showPoints?'camp-observing':''} ${c.id===1?'c1-refined w-motion-'+sceneMotion+(chapterComplete(s,1)?' c1-ready-leave':''):''}" aria-label="${sceneName(s.scene)}"><img class="camp-background" src="${A(sceneImage())}" alt="${esc(c.id===1&&s.scene===0&&s.solved.includes('c1-p3')?'甲三箱的上盖扣着横木，底板已从下面抽出。':c.id===1&&s.scene===0&&s.solved.includes('c1-p1')?'甲三货箱已经打开，箱中空无军械。':c.id===1&&s.scene===2&&s.solved.includes('c1-p4')?'工作台上展开旧封签与小油灯，纸下旧字已经显现。':c.id===4&&s.scene===2&&s.solved.includes('c4-p6')?'陈九成坐在旧道外的石凳上，伤臂已包好，门下撑着支木。':riverObservation(s)||strongholdObservation(s)||c.scenes[s.scene].description)}" fetchpriority="high"><div class="camp-shade"></div>${c.id===1?sceneMarks(c.id,s.scene):fieldSceneDecor(s)}${c.id===1&&s.scene===0&&sceneMotion==='open'?`<img class="w-opening-cover" src="${A('chapters/c1-s0-closed-v7.png')}" alt="">`:''}
   ${c.id===1&&s.scene===0?'<button class="c1-artisan-spot" data-c="artisan" aria-label="老军匠"><img src="'+A('chapters/artisan-neutral-v7.png')+'" alt="" draggable="false"><i class="camp-point" aria-hidden="true"></i></button>':''}
   ${c.id===1?firstChapterScene(s):c.id<=3?riverScene(s,riverLine):strongholdScene(s,riverLine)}
   <header class="camp-location"><span>${numerals[c.id]}</span><div><small>${c.time} · ${c.title}</small><h1>${sceneName(s.scene)}</h1></div></header>
   <nav class="camp-tools" aria-label="调查工具"><button data-c="journal" aria-label="陆昭手记">${icon('book')}<span>手记</span></button><button data-c="points" aria-label="察看互动位置" aria-pressed="${showPoints}">${icon('eye')}</button><button data-c="hint" aria-label="借一点提示">${icon('candle')}</button><button data-c="sound" aria-label="环境声${options.foley.enabled?'开':'关'}">${icon(options.foley.enabled?'sound':'muted')}</button><button data-c="picker" aria-label="篇章选择">${icon('menu')}</button></nav>
   <div class="camp-targets" aria-label="可调查的场景物件">${(c.id===1?[]:ps).map(p=>hotspot('puzzle:'+p.id,p.title,p.id==='c4-p4'?[38,28,21,44]:[p.x-8,p.y-9,16,18])).join('')}
   ${(c.id===1?[]:cs).map(clueSpot).join('')}
   ${items.filter(p=>c.id!==1||['c1-pry','c1-weight'].includes(p.id)).map(p=>propSpot(p,art(p))).join('')}
   ${hotspot('observe','查看周围',[48,30,9,15])}</div>
   ${chosen?`<div class="camp-held">${art(propById(chosen))}<span>${propById(chosen).name}</span><button data-c="unselect" aria-label="收起手中道具">${icon('close')}</button></div>`:''}
   <footer class="camp-scene-footer"><button class="camp-bag-toggle" data-c="bag" aria-expanded="${bag}">${icon('bag')}<span>随身物品</span><small>${c.props.filter(p=>s.bag.includes(p.id)).length}</small></button><nav class="camp-exits" aria-label="附近场景">${c.scenes.map((v,i)=>`<button data-c="scene:${i}" class="${sceneLocked(i)?'c1-unopened':''}" ${i===s.scene?'aria-current="location"':''}><small>${['一','二','三'][i]}</small>${sceneName(i)}${sceneLocked(i)?'<em>未开</em>':''}${i===s.scene?'<i></i>':''}</button>`).join('')}</nav><button class="camp-chapter-progress" data-c="summary">调查所得</button></footer>
   ${chapterComplete(s,c.id)?'<button class="camp-complete-button" data-c="finish">'+(c.id===1?'去西渡验证货的下落':c.id===2?'循回文去驿站':c.id===3?'循口信去废祠':'主线已核实 · 继续前行')+' '+icon('arrow')+'</button>':''}
  </div>`;
 }
 function bagHtml(inPuzzle=false){const items=chapter().props.filter(p=>s.bag.includes(p.id)),alreadyUsed=inPuzzle&&modal?.type==='field'&&chosen&&s.used.includes(modal.id+':'+chosen);return `<div class="camp-bag ${inPuzzle?'camp-work-tools':''}" aria-label="随身物品"><div class="camp-bag-items">${items.map(p=>`<button data-c="item:${p.id}" aria-label="${esc(p.name)}" aria-pressed="${chosen===p.id}" class="${chosen===p.id?'selected':''}">${art(p)}</button>`).join('')||'<p>衣囊里还没有本关物品。</p>'}</div><div class="camp-bag-description">${chosen?`<span>${esc(propById(chosen).name)}</span><button class="camp-text-button" data-c="inspect:${chosen}">仔细查看</button>${inPuzzle?'<button class="camp-action" data-c="use-tool" '+(alreadyUsed?'disabled':'')+'>'+(alreadyUsed?'已摆在手边':modal?.type==='field'?'摆在手边':s.chapter===1?({'c1-p2':'摊开底单','c1-p3':'铺开残签','c1-p4':'把灯放上案','c1-p6':'提灯照地','c1-p5':'把原件放在旁边'}[modal?.id||'']||'用在这里'):'用在这里')+'</button>':''}`:'<small>点选物品，再点目标使用</small>'}</div></div>`;}
 function paper(q:Clue){const ink=(text:string,seed:number)=>`<span class="camp-ink-text">${text}</span>`+[...text].map((c,i)=>`<span class="camp-ink-glyph" aria-hidden="true" style="--ink-turn:${[-.6,.4,-.9,.7,.1][(seed+i)%5]}deg;--ink-alpha:${[.91,1,.86,.97,.93][(seed+i)%5]};--ink-size:${[1.02,.98,1.01,.97,1][(seed+i)%5]}">${c}</span>`).join('');return `<article class="camp-paper ${zoom?'camp-paper-zoom':''}" lang="zh-CN" translate="no"><h3>${ink(q.title,2)}</h3><div>${q.lines.map((l,i)=>`<p style="--line:${i}">${ink(l,i*3)}</p>`).join('')}</div><small>陆昭抄记 · 原文留存</small></article>`;}
 function clueHtml(q:Clue){const detail=clueDetail(q,chapter().id);return `<div class="camp-document ${detail?'camp-document-object':''}"><div>${detail||paper(q)}${!detail?`<button class="camp-text-button" data-c="zoom">${zoom?'恢复大小':'放大细看'}</button>`:''}</div><div class="camp-document-note"><span class="camp-eyebrow">${chapter().scenes[q.scene].name} · 已记入手记</span><h3>${q.title}</h3>${detail?`<blockquote class="camp-observation-lines">${q.lines.map(l=>`<p>${l}</p>`).join('')}</blockquote>`:''}<p>${q.note}</p><button class="camp-text-button" data-c="journal">回看手记 ${icon('book')}</button></div></div>`;}
 function drafts(p:Puzzle){return s.drafts[p.id]||initialDraft(p);}
 function button(text:string,cmd:string,cls='',attr=''){return `<button class="${cls}" data-c="${cmd}" ${attr}>${text}</button>`;}
 function mechanics(p:Puzzle){const d=drafts(p),c=p.config;
  switch(p.kind){
   case 'field':return '';
   case 'crate':return crateView(d,crateSelected);
   case 'seal':return sealView(d);
   case 'order':return `<div class="camp-order"><div class="camp-order-slots">${c.tokens.map((_:unknown,i:number)=>button(`<small>${i+1}</small><span>${d[i]||'·'}</span>`,'remove:'+i,'camp-order-slot',!d[i]?'disabled':'')).join('')}</div><div class="camp-token-pool">${c.tokens.map((t:string)=>button(t,'token:'+t,'camp-wood-token',d.includes(t)?'disabled':'draggable="true" data-token="'+t+'"')).join('')}</div><p class="camp-control-note">点木牌放入下一槽；点槽取回。也可拖入指定槽。</p></div>`;
   case 'balance':{const sum=d.reduce<number>((a,i)=>a+c.weights[Number(i)],0),angle=Math.max(-9,Math.min(9,(c.target-sum)*1.5)),drop=Math.sin(angle*Math.PI/180)*156;return `<div class="camp-scale"><div class="camp-scale-beam" style="transform:rotate(${angle}deg)"><i></i></div><div class="camp-scale-pivot"></div><div class="camp-scale-pan" style="--pan-drop:${-drop}px"><small>所放份量</small><strong>${sum}</strong><span>${c.unit}</span></div><div class="camp-scale-pan right" style="--pan-drop:${drop}px"><small>目标</small><strong>${c.target}</strong><span>${c.unit}</span></div></div><div class="camp-weight-pool">${c.weights.map((w:number,i:number)=>button(`<span>${w}</span><small>${c.unit}</small>`,'toggle:'+i,'camp-weight '+(d.includes(i)?'selected':''),'aria-pressed="'+d.includes(i)+'"')).join('')}</div><p class="camp-control-note">选择两份，点按可放入或取下。份量刻在物件上。</p>`;}
   case 'dials':return `<div class="camp-dials motif-${c.motif}">${c.labels.map((l:string,i:number)=>`<div><small>${l}</small>${button(`<span>${c.choices[Number(d[i])]}</span><i style="transform:rotate(${Number(d[i])*90}deg)"></i>`,'dial:'+i,'camp-dial',`aria-label="${l}，当前${c.choices[Number(d[i])]}，转动"`)}<span class="camp-dial-direction">${c.choices.map((v:string,n:number)=>`<em class="${n===d[i]?'active':''}">${v}</em>`).join('')}</span></div>`).join('')}</div><p class="camp-control-note">每点一次转一格，按刻痕与文书设置方向。</p>`;
   case 'mosaic':return `<div class="camp-fragments pattern-${c.pattern}">${d.map((v,i)=>button(`<span class="fragment-rule fragment-${v}"></span><b>${c.labels[Number(v)]}</b><i class="fragment-ink" style="--piece:${v}"></i>`,'piece:'+i,'camp-fragment '+(token===i?'selected':''),`aria-label="第${i+1}格，${c.labels[Number(v)]}，选择交换" aria-pressed="${token===i}"`)).join('')}</div><p class="camp-control-note">点选一片，再点另一片交换。沿字行、边框与印痕接合。</p>`;
   case 'route':return `<div class="camp-route" aria-label="四行四列路线图">${c.cells.map((label:string,i:number)=>{const at=d.indexOf(i),blocked=c.blocked.includes(i);return button(`<span>${label}</span>${at>=0?`<b>${at+1}</b>`:''}`,'route:'+i,'camp-route-cell '+(blocked?'blocked ':'')+(at>=0?'traced ':''),(blocked?'disabled ':'')+`aria-label="${label}${blocked?'，不可通过':at>=0?'，路线第'+(at+1)+'步':''}"`);}).join('')}</div><p class="camp-control-note">每步走相邻一格。点已走过的格可退回。起点与终点已标明。</p>`;
   case 'light':{const found=d.every((v,i)=>v===c.target[i]);return `<div class="camp-light-view ${found?'aligned':''}"><div class="camp-light-source"></div><div class="camp-lit-paper" style="--lift:${(Number(d[1])-2)*4}px;--lean:${(Number(d[2])-2)*2}deg"><span class="camp-under-ink">${found?c.reveal:'隐约旧墨'}</span><span class="camp-top-ink">${Number(d[0])===0?'新纸覆面':'纸背'}</span></div></div><div class="camp-light-controls"><label>${c.labels[0]} ${button(Number(d[0])?'背面朝光':'正面朝光','flip','camp-action')}</label>${[1,2].map(i=>`<label>${c.labels[i]} <input data-c-range="${i}" type="range" min="0" max="4" step="1" value="${d[i]}" aria-label="${c.labels[i]}"><output>${d[i]} 格${p.id==='c1-p4'&&i===1&&d[i]===3?' · 一掌': ''}</output></label>`).join('')}</div><p class="camp-control-note">拖动调节，或聚焦滑杆后用方向键。旧字清晰时按“确认发现”。</p>`;}
   case 'match':return `<div class="camp-matches"><div>${c.left.map((t:string,i:number)=>button(`<span>${t}</span><small>${Number(d[i])>=0?'已接：'+c.right[Number(d[i])]:'待对应'}</small>`,'left:'+i,'camp-match-card '+(left===i?'selected':'')+(Number(d[i])>=0?' linked':''))).join('')}</div><div>${c.right.map((t:string,i:number)=>button(`<span>${t}</span><small>${d.includes(i)?'已配对':'证据'}</small>`,'right:'+i,'camp-match-card '+(d.includes(i)?'linked':''))).join('')}</div></div><p class="camp-control-note">先点左侧判断，再点右侧证据；可以随时重配。</p>`;
   case 'network':return `<div class="camp-linkage">${d.map((v,i)=>`<div class="camp-joint"><small>${c.labels[i]}</small><svg viewBox="0 0 100 100" aria-hidden="true"><path class="camp-groove" d="M50 8V50H92" transform="rotate(${c.answer[i]*90} 50 50)"/><path class="camp-joint-arm" d="M50 8V50H92" transform="rotate(${Number(v)*90} 50 50)"/><circle cx="50" cy="50" r="9"/></svg>${button('转动接头','joint:'+i,'camp-text-button',`aria-label="${c.labels[i]}接头，当前${['右上','右下','左下','左上'][Number(v)]}，转动"`)}</div>`).join('')}</div><p class="camp-control-note">浅槽是原有压痕，铜杆是当前方向。逐个旋转，让铜头落回各自的旧槽。</p>`;
   case 'select':return `${c.rows?`<div class="camp-cipher-lines">${c.rows.map((r:string)=>`<p>${[...r].map((g,i)=>`<span><small>${i+1}</small>${g}</span>`).join('')}</p>`).join('')}</div>`:''}<div class="camp-selection ${c.rows?'camp-character-choice':''}">${c.options.map((t:string,i:number)=>button(`${c.rows?'':'<i></i>'}<span>${t}</span>`,'toggle:'+i,'camp-select-card '+(d.includes(i)?'selected':''),`aria-pressed="${d.includes(i)}"`)).join('')}</div><p class="camp-control-note">选中 ${c.answer.length} 项后确认；再点一次取消。</p>`;
  }
 }
 function puzzleHtml(p:Puzzle){const solved=s.solved.includes(p.id),m=missingRequirements(s,p),ready=puzzleReady(s,p),available=chapter().props.filter(t=>s.bag.includes(t.id));
  if(solved)return `<div class="camp-puzzle-result"><span class="camp-result-mark">${icon('check')}</span><small>已记入手记</small><h3>${p.fact}</h3><p>${p.result}</p>${chapterComplete(s,s.chapter)?button('收束本关 '+icon('arrow'),'finish','camp-action'):button('继续探索 '+icon('back'),'close','camp-action')}<button class="camp-text-button" data-c="journal">回看调查手记</button></div>`;
  return `<div class="camp-puzzle-intro"><p>${p.intro}</p><span>${p.instruction}</span></div>${m.puzzles.length?`<div class="camp-blocked"><p>眼前还缺少前一步的调查结果。</p>${m.puzzles.map(id=>`<span>${puzzleById(id).title}</span>`).join('')}<button class="camp-text-button" data-c="summary">查看本关进展</button></div>`:m.tools.length?`<div class="camp-blocked"><p>先将相应的随身物件用到这里。</p><small>${m.tools.map(id=>s.bag.includes(id)?propById(id).name+' · 尚未安置':propById(id).name+' · 还未收好').join('　')}</small>${available.length?bagHtml(true):'<p>回场景看看可收取的物件。</p>'}</div>`:`<div class="camp-mechanism mechanism-${p.kind}">${mechanics(p)}</div>`}
  ${p.tools.length&&ready?`<div class="camp-used-tools">${p.tools.map(id=>'<span>'+icon('check')+propById(id).name+'</span>').join('')}</div>`:''}
  <p class="camp-feedback" role="status">${esc(message)}</p><div class="camp-puzzle-actions">${ready?button('确认发现 '+icon('arrow'),'check','camp-action'):''}${ready?button('重新摆放','reset-puzzle','camp-text-button'):''}${button('回看手记','journal','camp-text-button')}${button('借一点提示','hint-puzzle','camp-text-button')}</div>`;
 }
 function journalHtml(){const c=chapter(),qs=c.clues.filter(q=>s.read.includes(q.id)),facts=c.puzzles.filter(p=>s.solved.includes(p.id));return `<div class="camp-journal"><div class="camp-journal-title"><span class="camp-eyebrow">${numerals[c.id]} · ${c.title}</span><h3>见过的，才写下来。</h3><p>${c.id===1?caseLead(s):'原始记录与调查结果分别留存，可以随时回看。'}</p></div><div class="camp-journal-columns"><section><h4>原始记录 <small>${qs.length}</small></h4>${qs.length?qs.map(q=>button(`<span>${q.title}</span><small>${c.scenes[q.scene].name}</small>`,'clue:'+q.id,'camp-journal-row')).join(''):'<p>还没有抄下本关文书。</p>'}</section><section><h4>调查所得 <small>${facts.length}</small></h4>${facts.length?facts.map(p=>`<article><h5>${p.fact}</h5><p>${p.result}</p></article>`).join(''):'<p>先查看物件，再把能证实的事留下。</p>'}</section></div></div>`;}
 function summaryHtml(){const c=chapter();if(c.id>=2)return fieldSummary(s);if(c.id===1)return `<div class="camp-summary c1-case-notes"><span class="camp-eyebrow">军器库 · 留下的物证</span><h3>${caseLead(s)}</h3><p>原件可以随时重看。疑点先留下，能证实的事才写定。</p>${caseThreads(s).map(t=>button(`<strong>${t.title}</strong><span>${t.text}</span><small>回到原处 →</small>`,'locate:'+t.target,'c1-case-thread')).join('')}${chapterComplete(s,1)?button('带上原件，去西渡','finish','camp-action'):''}</div>`;return `<div class="camp-summary"><span class="camp-eyebrow">${c.title} · 三处场景</span><h3>${c.puzzles.filter(p=>s.solved.includes(p.id)).length} / 6 项调查已完成</h3><p>三处场景可以往返。物证与已解机关都会自动留存。</p>${c.puzzles.map(p=>button(`<i>${s.solved.includes(p.id)?icon('check'):icon('eye')}</i><span>${p.title}<small>${c.scenes[p.scene].name}</small></span><em>${s.solved.includes(p.id)?'已查清':puzzleReady(s,p)?'可察看':'待调查'}</em>`,'locate:'+p.id,'camp-summary-row')).join('')}${chapterComplete(s,c.id)?button('收束本关','finish','camp-action'):''}</div>`;}
 function hintHtml(){const c=chapter(),pool=MAIN_PATH[c.id].map(id=>c.puzzles.find(p=>p.id===id)!),p=modal?.id?puzzleById(modal.id):pool.find(p=>!s.solved.includes(p.id)&&p.scene===s.scene&&fieldPuzzleVisible(p.id,s.solved)&&p.requires.every(id=>s.solved.includes(id)))||pool.find(p=>!s.solved.includes(p.id)&&fieldPuzzleVisible(p.id,s.solved)&&p.requires.every(id=>s.solved.includes(id)))||pool.find(p=>!s.solved.includes(p.id)&&fieldPuzzleVisible(p.id,s.solved));if(!p)return `<div class="camp-hint"><h3>主线已经核实</h3>${button('收束本关','finish','camp-action')}</div>`;return `<div class="camp-hint"><span class="camp-eyebrow">${p.title} · ${hintLevel+1} / 3</span><h3>借一点烛光</h3><p>${p.hints[hintLevel]}</p>${button('回到物件','back-puzzle:'+p.id,'camp-action')}${hintLevel<2?button(hintLevel===0?'再给一点提示':'查看明确解法','more-hint','camp-text-button'):''}<small>提示不会代替操作，也不清空你的摆放。</small></div>`;}
 function pickerHtml(){return `<div class="camp-picker"><span class="camp-eyebrow">孤城夜火 · 六关正篇</span><h2>这一夜，还未结束。</h2><p>三处场景往返调查，物件与线索互相关联。可从任一关开始；各关进度分别保留。</p><div class="camp-chapter-grid">${CHAPTERS.map(c=>button(`<img src="${A(sceneAsset(c.id,0))}" alt="" loading="lazy"><span class="camp-chapter-card-shade"></span><div><small>第${['','一','二','三','四','五','六'][c.id]}关 · ${c.time}</small><h3>${c.title}</h3><p>${c.tagline}</p><em>${chapterComplete(s,c.id)?(c.puzzles.every(p=>s.solved.includes(p.id))?'已查清':'可继续前行'):c.puzzles.some(p=>s.solved.includes(p.id))?'调查中':'尚待查明'} ${icon('arrow')}</em></div>`,'chapter:'+c.id,'camp-chapter-card')).join('')}</div><div class="field-replay-row">${CHAPTERS.filter(c=>c.id>=2).map(c=>button('重玩第'+['','一','二','三','四','五','六'][c.id]+'关','chapter-replay:'+c.id,'camp-text-button')).join('')}</div><div class="camp-picker-footer">${s.started?button('继续当前调查','resume','camp-action'):''}${button('回到序章','prologue','camp-text-button')}${button('返回标题','exit','camp-text-button')}</div></div>`;}
 function sequenceHtml(){const c=chapter(),intro=modal?.type==='intro',lines=intro?c.intro:c.id===1?firstEnding(s):chapterOutro(s,c.outro);return `<section class="camp-sequence" role="dialog" aria-modal="true" aria-label="${intro?'关卡开场':'关卡结尾'}"><img src="${A(c.id===4&&!intro?'chapters/c4-shelter-v22.png':sceneAsset(c.id,intro?0:2))}" alt=""><div class="camp-sequence-shade"></div><button class="camp-skip" data-c="skip-sequence">跳过 ${icon('arrow')}</button><div><span>第${['','一','二','三','四','五','六'][c.id]}关 · ${intro?c.title:'查毕'}</span><h2>${intro?c.title:chapterComplete(s,6)&&c.id===6?'生还者的姓名':c.title+' · 终'}</h2><p>${lines[sequenceLine]}</p><button class="camp-action" data-c="next-sequence">${sequenceLine===lines.length-1?intro?'开始调查':c.id<6?'前往下一关':'查看结局':'下一句'} ${icon('arrow')}</button><small>${sequenceLine+1} / ${lines.length}</small></div></section>`;}
 function endingHtml(){return `<div class="camp-final"><span class="camp-eyebrow">六关终 · 孤城夜火</span><h2>天亮以后，<br>活着的人要回营。</h2><p>军械的去向、被换的回文、东门的假令，<br>终于被原件与活证接在了一起。</p><div class="camp-corrected-name"><span>甲字哨 · 十七 · 陆昭</span><del>阵亡</del><b>生还</b></div><p>这个夜晚暂告结束。已解谜题、原始文书和各关进度仍可回看。</p><div>${button('回看六关调查','picker','camp-action')}${button('返回标题','exit','camp-text-button')}</div></div>`;}
 function artisanHtml(){const keys:(keyof typeof ARTISAN_TOPICS)[]=[s.solved.includes('c1-p1')?'crate':'guide',...(s.solved.includes('c1-p2')?['ledger' as const]:[]),...(s.solved.includes('c1-p5')?['ink' as const]:[]),...(s.solved.includes('c1-p6')?['track' as const]:[]),'road'];return `<div class="c1-artisan-conversation"><img src="${A('chapters/artisan-neutral-v7.png')}" alt="守在门边的老军匠"><div><span class="camp-eyebrow">门边 · 老军匠</span><h3>${chapterComplete(s,1)?'门我给你留着。':'灯别点得太亮。'}</h3><p>${chapterComplete(s,1)?'他把门推开一道缝，侧耳听过巷里的动静，才向你点了点头。':s.solved.includes('c1-p1')?'他蹲下看了看空箱，又朝门外望了一眼。':'他听了听门外，又把目光落回那只甲三号箱。'}</p>${keys.map(id=>`<button class="c1-dialogue-choice" data-c="talk:${id}" aria-label="${esc(ARTISAN_TOPICS[id].question)}">${ARTISAN_TOPICS[id].question}</button>`).join('')}${button('我再查查。','close','camp-text-button')}</div></div>`;}
 function storyHtml(){const lines=storyLines(),line=lines[Math.min(storyLine,lines.length-1)],id=modal?.id||'',alert=id==='patrol',title=id==='opened'?'箱盖之下':id==='ink'?'灯下旧字':alert?'屏息':id==='departure'?'去西渡':'门边低语';return `<section class="c1-story ${alert?'patrol-story':''}" role="dialog" aria-modal="true" aria-label="${title}"><img class="c1-story-background" src="${A(sceneImage())}" alt=""><div class="c1-story-shade"></div>${alert?'<div class="c1-patrol-light" aria-hidden="true"></div>':''}<img class="c1-story-portrait ${line[0]==='老军匠'?'speaking':''}" src="${A('chapters/artisan-'+(alert?'alert':'neutral')+'-v7.png')}" alt="老军匠${alert?'抬手示意安静':''}"><button class="camp-skip" data-c="story-skip">略过这段 ${icon('arrow')}</button><div class="c1-story-caption"><span>${line[0]}</span><p>${line[1]}</p><div><small>${storyLine+1} / ${lines.length}</small><button class="camp-action" data-c="story-next">${storyLine===lines.length-1?id==='departure'?'收好原件，出发':id.startsWith('talk-')?'再问一句':'继续调查':'下一句'} ${icon('arrow')}</button></div></div></section>`;}
 function replayHtml(){return `<div class="camp-summary c1-replay"><span class="camp-eyebrow">重访军器库</span><h3>从前院重新查起</h3><p>这次将从关卡开场重新收集与解谜。当前第一关记录会先备份，序章和其他五关进度保留。</p>${button('备份记录，重玩第一关','c1-replay-confirm','camp-action')}${button('继续现有调查','close','camp-text-button')}</div>`;}
 function hasReplayBackup(){try{return !!localStorage.getItem(replayBackupKey);}catch{return false;}}
 function momentHtml(id:string){const event=FIELD_MOMENTS[id];if(!event)return '';return `<section class="field-moment moment-${event.theme} moment-${id}" role="dialog" aria-modal="true" aria-label="${event.title}"><div class="field-moment-room"><img class="field-moment-image" src="${A(event.image)}" alt="${event.title}"><span class="field-moment-title">${event.title}</span>${id==='c1-p3'?bottomBar(true):''}${workshopMoment(id)}${id==='c3-p5'?'<i class="v24-east-window on"></i>':''}${id==='c5-p4'?gateBeam([24,100,1,2]):''}${event.theme==='signal'?'<i class="v21-window east"></i><i class="v21-window west"></i>':''}${event.theme==='dawn'?'<div class="v21-return-slip">甲字哨 · 十七<strong>陆昭 <del>阵亡</del></strong><span>生还 · 陈九成亲见</span></div>':''}<div class="field-moment-caption"><small>${event.speaker||'城墙之上'}</small><p>${event.line}</p><span>${event.after}</span><button data-c="moment-close">继续 →</button></div></div></section>`;}
 function playMoment(id:string){const event=FIELD_MOMENTS[id];if(!event)return;modal={type:'moment',id};options.foley.discovery(event.theme);render();requestAnimationFrame(()=>root.querySelector<HTMLElement>('[data-c="moment-close"]')?.focus());}
 function finishMoment(){const id=s.moment||modal?.id;update(finishFieldMoment(s));if(id==='c4-p2')update({...s,scene:2});modal=null;render();}
 function gateGuardHtml(){return `<section class="camp-sequence v22-guard-dialogue" role="dialog" aria-modal="true" aria-label="东门盘问"><img src="${A('chapters/c5-guards-v19.png')}" alt="东门两班守军挡在岗亭前"><div class="camp-sequence-shade"></div><div><span>东门内街 · 枪尖前</span><h2>先别往里走。</h2><p>新班门军盯住你的札付：“要拿的人，自己送上门了？”</p><p>老军认出你腰牌上的哨号，又看了看陈九成：“这两人我认得。先押在我眼前，跑不了。”</p><p>木轮又响了一声。老军压低嗓子：“再转下去，门就要松了。你去垫轮，我的人跟着。修门归修门，你身上的事，等守备来问。”</p><button class="camp-action" data-c="gate-vouch">我去稳住木轮，你派人看着。</button><button class="camp-text-button" data-c="picker">回到篇章选择</button></div></section>`;}
 function modalHtml(){if(!modal)return '';const type=modal.type;if(type==='gate-guard')return gateGuardHtml();if(type==='moment')return momentHtml(modal.id!);if(type==='field'){const p=puzzleById(modal.id!);return fieldFocus(s,p,drafts(p),bagHtml(true),message,bag);}if(type==='crate')return crateRoom();if(type==='world'){const p=puzzleById(modal.id!);return worldFocus(s,p,p.id==='c1-p5'&&s.solved.includes(p.id)?sealReviewDraft(sealReviewOverlay):worldViewDraft(p.id,drafts(p),s.solved.includes(p.id)),crateSelected,token,lampAim,bagHtml(true),esc(message),bag);}if(type==='picker')return `<div class="camp-picker-layer">${pickerHtml()}<div class="c1-picker-replay">${button('重访军器库','c1-replay','camp-text-button')}${hasReplayBackup()?button('恢复重玩前的第一关记录','c1-restore','camp-text-button'):''}</div></div>`;if(type==='intro'||type==='outro')return sequenceHtml();if(type==='story')return storyHtml();
  let title='',html='';if(type==='chapter-replay'){title='重玩本关';html=`<div class="camp-summary"><h3>重新调查${CHAPTER_BY_ID(Number(modal.id)).title}</h3><p>先备份本关记录，再从新设计的现场开始。其他关进度保留。</p>${button('备份本关，重新开始','chapter-replay-confirm:'+modal.id,'camp-action')}${button('恢复本关重玩前记录','chapter-restore:'+modal.id,'camp-text-button')}</div>`;}else if(type==='artisan'){title='老军匠';html=artisanHtml();}else if(type==='replay'){title='重访军器库';html=replayHtml();}else if(type==='clue'){const q=clueById(modal.id!);title=q.title;html=clueHtml(q);}else if(type==='puzzle'){const p=puzzleById(modal.id!);title=p.title;html=puzzleHtml(p);}else if(type==='journal'){title='陆昭手记';html=journalHtml();}else if(type==='summary'){title='本关调查';html=summaryHtml();}else if(type==='hint'){title='借一点烛光';html=hintHtml();}else if(type==='prop'){const p=propById(modal.id!);title=p.name;html=`<div class="camp-item-inspection ${p.id==='c6-token'?'field-token-inspection':p.id==='c1-warrant'?'w-warrant-inspection':''}">${p.id==='c6-token'?waistToken():p.id==='c1-warrant'?warrantView():art(p)}<div><span class="camp-eyebrow">随身物件</span><h3>${p.name}</h3><p>${p.description}</p></div></div>`;}else if(type==='final'){title='破晓';html=endingHtml();}
  return `<div class="camp-overlay"><section class="camp-dialog camp-dialog-${type}" role="dialog" aria-modal="true" aria-label="${title}"><header><span class="camp-eyebrow">${title}</span><button class="camp-close" data-c="close" aria-label="返回场景">${icon('close')}</button></header><div class="camp-dialog-body">${html}</div><footer><small>${savedWarning?'浏览器暂时无法保存进度，请保持当前页面。':'进度已自动留存'}</small><button class="camp-text-button" data-c="close">${icon('back')} 返回场景</button></footer></section></div>`;
 }
 function render(){if(!active)return;crateCleanup?.();crateCleanup=null;const focused=root.contains(document.activeElement)?document.activeElement as HTMLElement:null,key=focused?.dataset.c,fieldKey=focused?.dataset.field,range=focused?.dataset.cRange,fieldRange=focused?.dataset.fieldRange;root.innerHTML=`<main class="campaign-shell">${sceneHtml(chapter())}${bag&&!modal?bagHtml():''}</main><div class="camp-modal-root">${modalHtml()}</div><div class="camp-notice" role="status"></div>`;const main=root.querySelector<HTMLElement>('main')!;main.inert=!!modal;if(modal?.type==='crate')crateCleanup=mountCrateRoom(root.querySelector<HTMLElement>('.camp-modal-root')!,{
   state:()=>s,foley:options.foley,initialTool:chosen,
   draft:d=>update({...s,drafts:{...s.drafts,'c1-p1':d}}),
   tool:id=>{const next=applyTool(s,puzzleById('c1-p1'),id);if(next===s)return false;update(next);chosen=null;return true;},
   opened:()=>{const result=solve(s,'c1-p1');if(!result.ok)return false;update(markStory({...result.state,scene:0},'c1-opened'));return true;},
   lining:()=>update(changeRoom({...s,scene:0},'lining')),
   scraps:()=>update(takeProp({...s,scene:0},'c1-scraps')),
   bottom:()=>{chosen=null;open('puzzle','c1-p3');},
   exit:()=>{modal=null;chosen=null;render();}
  });if(fieldKey)Array.from(root.querySelectorAll<HTMLElement>('[data-field]')).find(el=>el.dataset.field===fieldKey&&!el.closest('[inert]'))?.focus({preventScroll:true});else if(key)Array.from(root.querySelectorAll<HTMLElement>('[data-c]')).find(el=>el.dataset.c===key&&!el.closest('[inert]'))?.focus({preventScroll:true});else if(fieldRange)Array.from(root.querySelectorAll<HTMLElement>('[data-field-range]')).find(el=>el.dataset.fieldRange===fieldRange)?.focus({preventScroll:true});else if(range)Array.from(root.querySelectorAll<HTMLElement>('[data-c-range]')).find(el=>el.dataset.cRange===range)?.focus({preventScroll:true});if(modal?.type==='world'&&modal.id==='c1-p6')syncLantern();}
 function finishSequence(){const c=chapter();if(modal?.type==='intro'){if(!s.introSeen.includes(c.id))s.introSeen.push(c.id);save();modal=eastGateAdmitted(s)?null:{type:'gate-guard'};render();return;}if(!s.outroSeen.includes(c.id))s.outroSeen.push(c.id);save();if(c.id<6)begin(c.id+1);else{modal={type:'final'};render();}}
 function modifyDraft(fn:(d:Draft,p:Puzzle)=>Draft){const id=modal?.type==='puzzle'?modal.id:activeWorldId();if(!id)return;const p=puzzleById(id);if(!puzzleReady(s,p)||s.solved.includes(p.id))return;update({...s,drafts:{...s.drafts,[p.id]:fn([...drafts(p)],p)}});message='';if(s.chapter===1&&modal?.type==='world'){const p=puzzleById(modal.id!);if(!['c1-p2','c1-p4'].includes(p.id)&&correctSolution(p,drafts(p))){finishWorld(p);return;}}render();}

 function sceneAnimation(name:string){sceneMotion=name;clearTimeout(sceneMotionTimer);sceneMotionTimer=setTimeout(()=>{sceneMotion='';root.querySelector('.camp-scene')?.classList.remove('w-motion-'+name);root.querySelector('.w-opening-cover')?.remove();},1400);}
 function worldFlag(flag:string,remove?:string){update({...s,world:[...new Set([...s.world.filter(v=>v!==remove),flag])]});}
 function finishWorld(p:Puzzle){
  if(s.solved.includes(p.id))return;
  const result=solve(s,p.id);if(!result.ok)return;
  update(result.state);message='';chosen=null;token=null;bag=false;if(p.id==='c1-p1')modal=null;
  if(p.id==='c1-p1'){sceneAnimation('open');update(markStory({...s,scene:0},'c1-opened'));options.foley.play('latch');options.foley.play('wood',.35);}
  if(p.id==='c1-p2'&&!s.world.includes('c1-patrol-done'))worldFlag('c1-patrol-pending');
  if(p.id==='c1-p3')update({...s,scene:0});
  if(p.id==='c1-p4'){update(markStory({...s,scene:2},'c1-ink'));options.foley.storyCue();}
  if(p.id==='c1-p6')update({...s,scene:0});
  if(p.id==='c1-p5')update({...s,scene:1});
  if(p.id==='c1-p3'&&s.moment){playMoment(p.id);return;}
  render();options.foley.play(p.id==='c1-p5'?'paper':p.id==='c1-p3'?'wood':'cloth');
  if(p.id==='c1-p1')notice(p.id==='c1-p1'?'箱盖抬起。老军匠：先别走，掀开里面的衬布看看。':p.id==='c1-p2'?'初九才启运，初八就收讫了……门外忽然传来脚步。':p.id==='c1-p3'?'箱口的横木还扣着，箱底却能抽开。':p.id==='c1-p4'?'西渡。新纸底下，藏着旧去向和半枚官印。':p.result);
 }
 function worldAction(id:string){
  const [part,value]=id.split(':');
  if(part.startsWith('bottom-')){bottomAction(part.slice(7));return;}
  if(part==='carry-seal'&&activeWorldId()==='c1-p4'&&s.solved.includes('c1-p4')){update({...s,scene:1});open('puzzle','c1-p5');options.foley.play('paper');return;}
  if(part==='compare-ledger'&&modal?.id==='c1-p2'){const p=puzzleById('c1-p2');if(!puzzleReady(s,p)||s.solved.includes(p.id))return;const result=compareLedger(drafts(p));if(result.ok)finishWorld(p);else{message=result.line;options.foley.play('paper');render();}return;}
  if(part==='drawer'){if(s.chapter!==1||s.scene!==1)return;const closing=s.world.includes('c1-drawer-open');sceneAnimation('drawer');update(closing?{...s,world:s.world.filter(f=>f!=='c1-drawer-open')}:changeRoom(s,'drawer'));options.foley.play('wood');render();notice(closing?'抽屉沿着木槽推回案下。':s.bag.includes('c1-lamp')?'抽屉拉开，里面已经空了。':'抽屉拉开，里面收着一盏备用油灯。');return;}
  if(part==='lining'){if(s.chapter!==1||!s.solved.includes('c1-p1'))return;const lifted=s.world.includes('c1-lining-lifted');sceneAnimation('lining');update(changeRoom({...s,scene:0},'lining'));update({...s,scene:0});modal=null;options.foley.play('cloth');render();notice(lifted?'箱里没有军器。底板边这一道擦痕，还需要亲手试一试。':'衬布掀到一旁，露出一张折损旧签。底板边有一道新擦痕。');return;}
  if(part==='quiet'){if(!s.world.includes('c1-patrol-active'))return;sceneAnimation('quiet');update(changeRoom(s,'quiet'));update(markStory(s,'c1-patrol'));options.foley.play('cloth');options.foley.play('step',.6);options.foley.play('step',1.15);render();notice('灯光暗下去。巡兵在门外站了一会儿，脚步终于远了。');return;}
  if(part==='test-latch'){message=s.used.includes('c1-p1:c1-pry')?'锁舌弹回原位。撬棍能抬起横木，却压不住里面的舌头。':'箱盖被外层横木顶住，木缝里没有能直接下手的位置。';options.foley.play('wood');render();return;}
  if(part==='prepare-ink'&&inkScene()){
   const p=puzzleById('c1-p4');
   let next=s;
   for(const tool of p.tools)next=applyTool(next,p,tool);
   if(puzzleReady(next,p)){update(next);options.foley.play('paper');render();root.querySelector<HTMLElement>('.w-moving-paper')?.focus({preventScroll:true});}
   return;
  }
  if(part==='read-ink'&&activeWorldId()==='c1-p4'){finishWorld(puzzleById('c1-p4'));return;}
  if(part==='track'&&modal?.id==='c1-p6'){
   const p=puzzleById('c1-p6');if(!puzzleReady(s,p))return;if(s.solved.includes(p.id)){message=Number(value)===0?'两道轮槽一齐向西折入。新擦痕还没有被雨水冲平。':'折断的芦苇嵌在轮槽里，草梗上还带着河泥。';render();return;}
   const mask=Number(drafts(p)[0]),next=inspectTrack(mask,Number(value),lampAim);
   if(next===mask){message=(mask&(1<<Number(value)))?'这处痕迹已经看清了。':'灯还没照近，泥里的细节看不真。';render();return;}
   update({...s,drafts:{...s.drafts,[p.id]:[next]}});message=Number(value)===0?'两道轮槽在这里一齐向西折入，泥边还有新擦痕。':'轮槽里夹着折断的芦苇。老军匠：这草只长在西渡那片河滩。';
   options.foley.play('cloth');if(next===3){finishWorld(p);return;}render();return;
  }
 }

 function syncBottom(){const d=drafts(puzzleById('c1-p3'));root.querySelector<HTMLElement>('.c1-bottom-scene')?.style.setProperty('--bottom-travel',String(Number(d[3])/100));const range=root.querySelector<HTMLInputElement>('[data-bottom-range]');if(range)range.value=String(d[3]);const caption=root.querySelector('.w-room-caption p');if(caption&&message)caption.textContent=message;}
 function bottomAction(action:string,value=0,quiet=false){
  if(modal?.type!=='world'||modal.id!=='c1-p3')return;
  if(action==='observe'){root.querySelector('.c1-bottom-scene')?.classList.add('observing');setTimeout(()=>root.querySelector('.c1-bottom-scene')?.classList.remove('observing'),2200);return;}
  const p=puzzleById(modal.id);if(!puzzleReady(s,p)||s.solved.includes(p.id))return;
  const change=moveBottom(drafts(p),action,value);update({...s,drafts:{...s.drafts,[p.id]:change.draft}});message=change.line;
  if(bottomCorrect(change.draft)){finishWorld(p);return;}
  if(quiet){syncBottom();return;}options.foley.play(change.sound);render();
 }
 root.addEventListener('input',e=>{const el=e.target as HTMLInputElement;if(el.matches('[data-bottom-range]'))bottomAction('slide',Number(el.value),true);});
 root.addEventListener('change',e=>{const el=e.target as HTMLInputElement;if(el.matches('[data-bottom-range]'))bottomAction('slide',Number(el.value));});
 let bottomDrag:{pointer:number;el:HTMLElement;x:number;start:number;width:number;moved:boolean}|null=null;
 root.addEventListener('pointerdown',e=>{const el=(e.target as Element).closest<HTMLElement>('[data-bottom-drag]');if(!el||modal?.id!=='c1-p3'||s.solved.includes('c1-p3'))return;bottomDrag={pointer:e.pointerId,el,x:e.clientX,start:Number(drafts(puzzleById('c1-p3'))[3]),width:el.getBoundingClientRect().width,moved:false};el.setPointerCapture(e.pointerId);});
 root.addEventListener('pointermove',e=>{const d=bottomDrag;if(!d||d.pointer!==e.pointerId)return;if(Math.abs(e.clientX-d.x)<4&&!d.moved)return;d.moved=true;bottomAction('slide',d.start+(d.x-e.clientX)/d.width*100,true);});
 const endBottom=(e:PointerEvent)=>{const d=bottomDrag;if(!d||d.pointer!==e.pointerId)return;bottomDrag=null;if(d.el.hasPointerCapture(e.pointerId))d.el.releasePointerCapture(e.pointerId);if(d.moved){suppressTableClick=true;setTimeout(()=>{suppressTableClick=false;},0);render();}};
 root.addEventListener('pointerup',endBottom);root.addEventListener('pointercancel',endBottom);
 function syncPaper(){
  if(activeWorldId()!=='c1-p4')return;
  const d=drafts(puzzleById('c1-p4')),stage=root.querySelector<HTMLElement>('.w-light-table'),paper=root.querySelector<HTMLElement>('.w-moving-paper');if(!stage||!paper)return;
  stage.style.setProperty('--clarity',String(paperClarity(d)));paper.style.left=d[1]+'%';paper.style.top=d[2]+'%';const read=root.querySelector<HTMLButtonElement>('.w-read-ink');if(read)read.disabled=paperClarity(d)<.72;root.querySelector('.w-old-ink')?.setAttribute('aria-hidden',String(paperClarity(d)<.72));
 }
 function syncLantern(){root.querySelectorAll<HTMLElement>('.w-track-mark').forEach((el,i)=>{const m=TRACK_MARKS[i];el.style.opacity=String(Math.max(.07,1-Math.hypot(lampAim[0]-m.x,lampAim[1]-m.y)/24));});const floor=root.querySelector<HTMLElement>('.w-trace-floor');if(floor){floor.style.setProperty('--aim-x',lampAim[0]+'%');floor.style.setProperty('--aim-y',lampAim[1]+'%');}}
 // Capture only after real motion, so tap-to-swap and keyboard controls remain usable.
 let suppressTableClick=false;
 let tableDrag:{kind:'fragment'|'seal';pointer:number;el:HTMLElement;x:number;y:number;from:number;moved:boolean}|null=null;
 root.addEventListener('pointerdown',e=>{
  if(modal?.type!=='world'||!modal.id||s.solved.includes(modal.id)||!puzzleReady(s,puzzleById(modal.id)))return;
  const target=e.target as Element,el=target.closest<HTMLElement>('[data-fragment],[data-seal-drag]');
  if(!el)return;
  tableDrag={kind:el.hasAttribute('data-fragment')?'fragment':'seal',pointer:e.pointerId,el,x:e.clientX,y:e.clientY,from:Number(el.dataset.fragment),moved:false};
 });
 root.addEventListener('pointermove',e=>{
  const drag=tableDrag;if(!drag||drag.pointer!==e.pointerId)return;
  const x=e.clientX-drag.x,y=e.clientY-drag.y;
  if(!drag.moved&&Math.hypot(x,y)<6)return;
  if(!drag.moved){drag.moved=true;drag.el.setPointerCapture(e.pointerId);drag.el.classList.add('dragging');options.foley.play('paper');}
  e.preventDefault();drag.el.style.translate=`${x}px ${y}px`;
  root.querySelectorAll<HTMLElement>('[data-fragment],.w-candidate-paper').forEach(el=>{
   if(el===drag.el)return;const r=el.getBoundingClientRect();el.classList.toggle('drop-near',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);
  });
 });
 const endTableDrag=(e:PointerEvent)=>{
  const drag=tableDrag;if(!drag||drag.pointer!==e.pointerId)return;tableDrag=null;
  if(!drag.moved)return;
  suppressTableClick=true;setTimeout(()=>{suppressTableClick=false;},0);
  if(drag.el.hasPointerCapture(e.pointerId))drag.el.releasePointerCapture(e.pointerId);
  drag.el.style.translate='';drag.el.classList.remove('dragging');
  const candidates=Array.from(root.querySelectorAll<HTMLElement>(drag.kind==='fragment'?'[data-fragment]':'.w-candidate-paper'));
  candidates.forEach(el=>el.classList.remove('drop-near'));
  if(e.type==='pointercancel')return;
  const target=candidates.find(el=>{if(el===drag.el)return false;const r=el.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});
  if(!target)return;
  token=null;
  if(drag.kind==='fragment'){const to=Number(target.dataset.fragment);modifyDraft(d=>{[d[drag.from],d[to]]=[d[to],d[drag.from]];return d;});}
  else modifyDraft(d=>directSealDraft([d[0],d[1],d[2],1]));
  options.foley.play('paper');
 };
 root.addEventListener('pointerup',endTableDrag);root.addEventListener('pointercancel',endTableDrag);
 let worldDrag:{kind:'paper'|'lamp';pointer:number;stage:HTMLElement;rect:DOMRect;dx:number;dy:number}|null=null;
 root.addEventListener('pointerdown',e=>{
  const id=activeWorldId();
  if(!id||(s.solved.includes(id)&&id!=='c1-p6')||!puzzleReady(s,puzzleById(id)))return;
  const target=e.target as Element,paper=target.closest<HTMLElement>('[data-paper-drag]'),floor=target.closest<HTMLElement>('[data-lantern-drag]');
  if(paper){const stage=paper.closest<HTMLElement>('.w-light-table')!,rect=stage.getBoundingClientRect(),d=drafts(puzzleById(id));worldDrag={kind:'paper',pointer:e.pointerId,stage,rect,dx:(e.clientX-rect.left)/rect.width*100-Number(d[1]),dy:(e.clientY-rect.top)/rect.height*100-Number(d[2])};stage.setPointerCapture(e.pointerId);e.preventDefault();}
  else if(floor&&!target.closest('.w-track-mark')&&(s.used.includes('c1-p6:c1-lamp')||s.solved.includes('c1-p6'))){const rect=floor.getBoundingClientRect();worldDrag={kind:'lamp',pointer:e.pointerId,stage:floor,rect,dx:0,dy:0};lampAim=[(e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100];syncLantern();floor.setPointerCapture(e.pointerId);e.preventDefault();}
 });
 root.addEventListener('pointermove',e=>{
  const id=activeWorldId();
  if(!worldDrag||e.pointerId!==worldDrag.pointer||!id)return;
  const {rect,dx,dy,kind}=worldDrag,x=(e.clientX-rect.left)/rect.width*100-dx,y=(e.clientY-rect.top)/rect.height*100-dy;
  if(kind==='paper'){s={...s,drafts:{...s.drafts,[id]:movePaper(drafts(puzzleById(id)),x,y)}};syncPaper();}
  else{lampAim=[Math.max(0,Math.min(100,x)),Math.max(0,Math.min(100,y))];syncLantern();}
 });
 const endWorldDrag=(e:PointerEvent)=>{if(!worldDrag||e.pointerId!==worldDrag.pointer)return;const {kind,stage}=worldDrag;worldDrag=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);save();root.querySelector<HTMLElement>(kind==='paper'?'.w-moving-paper':'.w-trace-floor')?.focus({preventScroll:true});};
 root.addEventListener('pointerup',endWorldDrag);root.addEventListener('pointercancel',endWorldDrag);
 function worldKey(e:KeyboardEvent){
  const id=activeWorldId();
  if(!id||(s.solved.includes(id)&&id!=='c1-p6')||!puzzleReady(s,puzzleById(id)))return false;
  const arrow={ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,-4],ArrowDown:[0,4]}[e.key] as number[]|undefined;
  if(id==='c1-p4'&&(e.target as HTMLElement).matches('[data-paper-drag]')){
   if(e.key===' '){e.preventDefault();modifyDraft(d=>[1-Number(d[0]),d[1],d[2]]);root.querySelector<HTMLElement>('.w-moving-paper')?.focus({preventScroll:true});return true;}
   if(arrow){e.preventDefault();const d=drafts(puzzleById(id));update({...s,drafts:{...s.drafts,[id]:movePaper(d,Number(d[1])+arrow[0],Number(d[2])+arrow[1])}});syncPaper();return true;}
  }
  if(id==='c1-p6'&&arrow&&(s.used.includes('c1-p6:c1-lamp')||s.solved.includes('c1-p6'))){e.preventDefault();lampAim=[Math.max(0,Math.min(100,lampAim[0]+arrow[0])),Math.max(0,Math.min(100,lampAim[1]+arrow[1]))];syncLantern();return true;}
  return false;
 }

 root.addEventListener('click',e=>{if(suppressTableClick){e.preventDefault();return;}const target=(e.target as Element).closest<HTMLElement>('[data-c]');if(!target)return;if((target as HTMLButtonElement).disabled)return;const [cmd,...rest]=target.dataset.c!.split(':'),id=rest.join(':'),n=Number(id);
  if(s.chapter===1&&s.world.includes('c1-patrol-active')&&['scene','locate','puzzle','artisan','finish'].includes(cmd)){notice('门外还有人。先遮住灯火。');return;}
  if(cmd==='artisan'){open('artisan');return;}if(cmd==='talk'){startStory('talk-'+id);return;}if(cmd==='story-next'){if(++storyLine<storyLines().length)render();else finishStory();return;}if(cmd==='story-skip'){finishStory();return;}
  if(cmd==='c1-replay'){open('replay');return;}if(cmd==='c1-replay-confirm'){try{localStorage.setItem(replayBackupKey,JSON.stringify(s));}catch{notice('无法保存备份，已保留当前进度。');return;}update(restartFirstChapter(s));begin(1);return;}if(cmd==='c1-restore'){let raw:string|null=null;try{raw=localStorage.getItem(replayBackupKey);}catch{}if(!raw){notice('还没有重玩前的备份记录。');return;}update(restoreFirstChapter(s,restoreCampaign(raw)));begin(1,true);notice('已恢复重玩前的第一关记录。');return;}
  if(cmd==='chapter-replay'){open('chapter-replay',id);return;}if(cmd==='chapter-replay-confirm'){try{localStorage.setItem(CAMPAIGN_KEY+':replay-'+n,JSON.stringify(s));}catch{notice('备份未成功，当前记录已保留。');return;}update(restartChapter(s,n));begin(n);return;}if(cmd==='chapter-restore'){let raw=null;try{raw=localStorage.getItem(CAMPAIGN_KEY+':replay-'+n);}catch{}if(!raw){notice('还没有本关的备份记录。');return;}update(restoreChapter(s,restoreCampaign(raw),n));begin(n,true);return;}if(cmd==='chapter'){begin(n);return;}if(cmd==='resume'){modal=null;render();return;}if(cmd==='exit'){exit();return;}if(cmd==='prologue'){exit(true);return;}
  if(cmd==='next-sequence'){const lines=modal?.type==='intro'?chapter().intro:s.chapter===1?firstEnding(s):chapterOutro(s,chapter().outro);if(++sequenceLine<lines.length)render();else finishSequence();return;}if(cmd==='skip-sequence'){finishSequence();return;}
  if(cmd==='gate-vouch'){update(admitAtEastGate(s));modal=null;render();options.foley.play('step');return;}
  if(cmd==='moment-close'){finishMoment();return;}if(cmd==='close'){closeInspection();return;}if(cmd==='picker'){open('picker');return;}if(cmd==='scene'){if(n>=0&&n<3)sceneNavigate(n);return;}
  if(cmd==='points'){showPoints=true;render();clearTimeout(pointsTimer);pointsTimer=setTimeout(()=>{showPoints=false;root.querySelector('.camp-scene')?.classList.remove('camp-observing');},1500);return;}
  if(cmd==='bag'){bag=!bag;render();return;}if(cmd==='unselect'){chosen=null;render();return;}if(cmd==='sound'){options.foley.toggle();render();return;}
  if(cmd==='field-tool'&&['field','world'].includes(modal?.type||'')&&modal?.id){const p=puzzleById(modal.id);if(p.tools.includes(id)&&s.bag.includes(id)){chosen=id;useTool(p);}return;}if(cmd==='world'){worldAction(id);return;}if(cmd==='field-observe'){root.querySelector('.field-focus')?.classList.add('field-observing');setTimeout(()=>root.querySelector('.field-focus')?.classList.remove('field-observing'),1800);return;}if(cmd==='field-reset'&&modal?.id){const p=puzzleById(modal.id);if(!s.solved.includes(p.id)){update({...s,drafts:{...s.drafts,[p.id]:initialDraft(p)}});message='物件放回原位，已收好的工具与原件仍在。';render();}return;}if(cmd==='field-next'){const p=puzzleById(id);if(sceneLocked(p.scene)){notice(fieldSceneBlock(s.chapter,p.scene,s.solved)||'此处尚未开启。');return;}if(s.scene!==p.scene)riverLine='';update({...s,scene:p.scene});open('puzzle',id);return;}
  if(cmd==='take'){const p=propById(id),next=takeProp(s,id);if(next!==s){update(next);if(id==='c1-manifest')update(readClue(s,'c1-a'));chosen=id;options.foley.play('paper');render();notice('已收好 '+p.name);}return;}
  if(cmd==='item'){chosen=chosen===id?null:id;render();return;}if(cmd==='inspect'){if(id==='c1-manifest'){open('clue','c1-a');return;}open('prop',id);return;}if(cmd==='observe'){if(s.chapter===4&&s.scene===2&&s.solved.includes('c4-p6')){notice('陈九成坐在背风处，手边摊着带出来的半页纸。他似乎有话要说。');return;}options.foley.play('paper');notice(riverObservation(s)||strongholdObservation(s)||(s.chapter>=2?chapter().scenes[s.scene].description:observations[s.chapter-1][s.scene]));return;}
  if(cmd==='puzzle'){const p=puzzleById(id);if(id!=='c1-p1'&&chosen&&p.tools.includes(chosen))useTool(p);open('puzzle',id);return;}if(cmd==='use-tool'&&modal?.id){useTool(puzzleById(modal.id));return;}
  if(cmd==='clue'){open('clue',id);return;}if(cmd==='zoom'){zoom=!zoom;render();return;}if(cmd==='journal'||cmd==='summary'){open(cmd);return;}
  if(cmd==='locate'){const p=puzzleById(id);if(sceneLocked(p.scene)){notice(fieldSceneBlock(s.chapter,p.scene,s.solved)||'侧库尚未开启，先查清甲三箱。');return;}if(s.scene!==p.scene)riverLine='';update({...s,scene:p.scene});open('puzzle',id);return;}
  if(cmd==='hint'){open('hint');return;}if(cmd==='hint-puzzle'){const p=modal?.id;open('hint',p);return;}if(cmd==='more-hint'){hintLevel=Math.min(2,hintLevel+1);render();return;}if(cmd==='back-puzzle'){open('puzzle',id);return;}
  if(cmd==='finish'){if(!chapterComplete(s,s.chapter)){notice(s.chapter===1?'先核清空箱、交割记录和旧签去向。印痕与车辙可以再查，也可以回来查。':'本关还有未完成的调查。');return;}if(s.chapter===1&&!s.storySeen.includes('c1-departure')){startStory('departure');return;}sequenceLine=0;open('outro');return;}
  if(cmd==='check'&&modal?.id){const puzzleId=modal.id,r=solve(s,puzzleId);if(r.ok){update(r.state);options.foley.play('reveal');token=null;if(s.chapter===1){const event=puzzleId==='c1-p1'?'opened':puzzleId==='c1-p2'?'patrol':puzzleId==='c1-p4'?'ink':null,key=event==='opened'?'c1-opened':event==='patrol'?'c1-patrol':'c1-ink';if(event&&!s.storySeen.includes(key)){startStory(event);return;}}render();}else{message=r.message;options.foley.play('wood');render();}return;}
  if(cmd==='crate-select'){crateSelected=n;render();return;}if(cmd==='crate-move'&&modal?.id){const d=drafts(puzzleById(modal.id)),next=moveCrate(d,crateSelected,n);if(next){modifyDraft(()=>next);options.foley.play('wood');}return;}
  if(cmd==='seal-overlay'){if(modal?.type==='world'&&modal.id==='c1-p5'&&s.solved.includes('c1-p5')){sealReviewOverlay=!sealReviewOverlay;message='';render();}else modifyDraft(d=>directSealDraft([d[0],d[1],d[2],1-Number(d[3])]));options.foley.play('paper');return;}if(cmd==='seal-feature'){if(modal?.id&&Number(drafts(puzzleById(modal.id))[3])!==1){message='先把两处印迹对照，再在右边旧印上圈出相同的损伤。';render();return;}modifyDraft(d=>directSealDraft([d[0],d[1],Number(d[2])^(1<<n),d[3]]));options.foley.play('paper');return;}
  if(cmd==='reset-puzzle'&&modal?.id){const p=puzzleById(modal.id);modifyDraft(()=>initialDraft(p));token=null;return;}
  if(cmd==='token'){modifyDraft(d=>d.includes(id)?d:[...d,id]);options.foley.play('wood');return;}if(cmd==='remove'){modifyDraft(d=>d.filter((_,i)=>i!==n));return;}
  if(cmd==='toggle'){modifyDraft(d=>d.includes(n)?d.filter(x=>x!==n):modal?.id==='c1-p2'?[...d.slice(-1),n]:[...d,n]);return;}if(cmd==='dial'){modifyDraft((d,p)=>{d[n]=(Number(d[n])+1)%p.config.choices.length;return d;});options.foley.play('wood');return;}
  if(cmd==='piece'){if(modal?.id&&!puzzleReady(s,puzzleById(modal.id)))return;options.foley.play('paper');if(token===null){token=n;render();}else{const from=Number(token);token=null;modifyDraft(d=>{[d[from],d[n]]=[d[n],d[from]];return d;});}return;}
  if(cmd==='route'){modifyDraft((d,p)=>{if(p.config.blocked.includes(n))return d;const at=d.indexOf(n);if(at>=0)return d.slice(0,at+1);const last=Number(d.at(-1));return Math.abs(last%4-n%4)+Math.abs(Math.floor(last/4)-Math.floor(n/4))===1?[...d,n]:d;});return;}
  if(cmd==='flip'){modifyDraft(d=>{d[0]=1-Number(d[0]);return d;});return;}
  if(cmd==='left'){left=n;render();return;}if(cmd==='right'){if(left<0){notice('先点一条判断，再选择对应证据。');return;}const from=left;left=-1;modifyDraft(d=>{const prior=d.indexOf(n);if(prior>=0)d[prior]=-1;d[from]=n;return d;});return;}
  if(cmd==='joint'){modifyDraft(d=>{d[n]=(Number(d[n])+1)%4;return d;});options.foley.play('wood');}
 });
 function fieldAction(action:string,value=0,quiet=false){
  const inlineId=modal?undefined:riverField(s)||strongholdField(s);
  const id=inlineId??(modal?.type==='field'?modal.id:undefined);
  if(!id)return;
  const p=puzzleById(id);
  const revisiting=id==='c4-p4'&&s.solved.includes(id)&&action==='show';
  if(s.solved.includes(id)&&!revisiting)return;
  if(inlineId){
   for(const tool of p.tools)if(s.bag.includes(tool))update(applyTool(s,p,tool));
   const missing=p.tools.filter(tool=>!s.bag.includes(tool));
   if(missing.length){
    riverLine='手边还缺'+missing.map(tool=>propById(tool).name).join('和')+'。';
    render();return;
   }
  }
  const testingDirection=inlineId==='c3-p5'&&(action==='aim'||action==='preview');
  if(!testingDirection&&!puzzleReady(s,p))return;
  const blocked=fieldActionBlock(id,action,s.solved,value);
  if(blocked){if(inlineId)riverLine=blocked;else message=blocked;render();return;}
  const change=fieldMove(id,drafts(p),action,value);
  update({...s,drafts:{...s.drafts,[id]:change.draft}});
  if(id==='c2-p6'&&action==='tube')update(readClue(s,'c2-a'));
  if(inlineId)riverLine=change.line;else message=change.line;
  if(revisiting){options.foley.play(change.sound);render();return;}
  if(fieldCorrect(id,change.draft)){
   const result=solve(s,id);
   if(result.ok){
    update(result.state);bag=false;chosen=null;message='';
    if(inlineId)riverLine=strongholdObservation(s)||result.message;
    options.foley.play(change.sound);
    if(s.moment){playMoment(s.moment);return;}
    if(['c2-p3','c3-p2','c4-p4'].includes(id))options.foley.storyCue();
    if(id==='c3-p5'){options.foley.play('knock',1.1);options.foley.play('knock',1.45);}
    render();return;
   }
  }
  if(quiet){
   if(inlineId&&isStrongholdPuzzle(id))syncStrongholdScene(root,s,riverLine);
   else {const stage=root.querySelector<HTMLElement>('.field-stage');if(stage)syncFieldVisual(stage,p,change.draft,s);}
   return;
  }
  options.foley.play(change.sound);render();
 }
 root.addEventListener('click',e=>{if(suppressTableClick){e.preventDefault();return;}const el=(e.target as Element).closest<HTMLElement>('[data-field]');if(!el)return;const [action,value]=el.dataset.field!.split(':');fieldAction(action,Number(value)||0);});
 root.addEventListener('input',e=>{const el=e.target as HTMLInputElement;if(el.matches('[data-field-range]'))fieldAction(el.dataset.fieldRange!,Number(el.value),true);});
 root.addEventListener('change',e=>{
  const el=e.target as HTMLInputElement,key=el.dataset.fieldRange;
  if(!key)return;
  const focused=el===document.activeElement;
  fieldAction(key,Number(el.value));
  if(focused&&!el.isConnected)root.querySelector<HTMLInputElement>(`[data-field-range="${key}"]`)?.focus({preventScroll:true});
 });
 let careDrag:{pointer:number;el:HTMLElement;x:number;width:number;moved:boolean}|null=null;
 root.addEventListener('pointerdown',e=>{const el=(e.target as Element).closest<HTMLElement>('.v21-care-grip');if(!el||modal?.id!=='c4-p3'||!puzzleReady(s,puzzleById('c4-p3'))||s.solved.includes('c4-p3'))return;careDrag={pointer:e.pointerId,el,x:e.clientX,width:el.getBoundingClientRect().width,moved:false};el.setPointerCapture(e.pointerId);});
 root.addEventListener('pointermove',e=>{const d=careDrag;if(!d||e.pointerId!==d.pointer)return;if(Math.abs(e.clientX-d.x)>6){d.moved=true;e.preventDefault();d.el.style.setProperty('--care-pull',Math.min(1,Math.max(0,(e.clientX-d.x)/d.width)).toString());}});
 const endCare=(e:PointerEvent)=>{const d=careDrag;if(!d||d.pointer!==e.pointerId)return;careDrag=null;if(d.el.hasPointerCapture(e.pointerId))d.el.releasePointerCapture(e.pointerId);if(!d.moved)return;suppressTableClick=true;setTimeout(()=>{suppressTableClick=false;},0);if(e.type==='pointerup'&&(e.clientX-d.x)>d.width*.18)fieldAction('bind');else render();};
 root.addEventListener('pointerup',endCare);root.addEventListener('pointercancel',endCare);
 let inkDrag:{pointer:number;el:HTMLElement;rect:DOMRect;points:number[]}|null=null;
 root.addEventListener('pointerdown',e=>{const el=(e.target as Element).closest<HTMLElement>('[data-field-brush]');if(!el||modal?.id!=='c6-p6'||s.solved.includes('c6-p6')||!puzzleReady(s,puzzleById('c6-p6')))return;const rect=el.getBoundingClientRect();inkDrag={pointer:e.pointerId,el,rect,points:[(e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100]};el.setPointerCapture(e.pointerId);e.preventDefault();});
 root.addEventListener('pointermove',e=>{if(!inkDrag||inkDrag.pointer!==e.pointerId)return;const t=inkDrag;t.points.push((e.clientX-t.rect.left)/t.rect.width*100,(e.clientY-t.rect.top)/t.rect.height*100);const line=t.el.querySelector('polyline');line?.setAttribute('points',Array.from({length:t.points.length/2},(_,i)=>t.points[i*2]+','+t.points[i*2+1]).join(' '));});
 const endInk=(e:PointerEvent)=>{const t=inkDrag;if(!t||t.pointer!==e.pointerId)return;inkDrag=null;if(t.el.hasPointerCapture(e.pointerId))t.el.releasePointerCapture(e.pointerId);if(e.type==='pointercancel'){render();return;}const change=brushStroke(drafts(puzzleById('c6-p6')),t.points);update({...s,drafts:{...s.drafts,'c6-p6':change.draft}});message=change.line;options.foley.play(change.sound);render();};
 root.addEventListener('pointerup',endInk);root.addEventListener('pointercancel',endInk);
 root.addEventListener('keydown',e=>{const target=e.target as Element;if(target.closest('[data-field-brush]')&&e.key===' '){e.preventDefault();e.stopPropagation();fieldAction('stroke',1);}if(modal?.type==='field'&&e.key.toLowerCase()==='h'){root.querySelector('.field-focus')?.classList.add('field-observing');setTimeout(()=>root.querySelector('.field-focus')?.classList.remove('field-observing'),1800);}});
 root.addEventListener('change',e=>{const t=e.target as HTMLInputElement;if(t.matches('[data-c-range]')){const i=Number(t.dataset.cRange),value=Number(t.value);modifyDraft(d=>{d[i]=value;return d;});}});
 root.addEventListener('input',e=>{const t=e.target as HTMLInputElement;if(t.matches('[data-c-range]'))t.parentElement!.querySelector('output')!.textContent=t.value+' 格';});
 root.addEventListener('dragstart',e=>{const t=(e.target as Element).closest<HTMLElement>('[data-token]');if(t)e.dataTransfer?.setData('text/plain',t.dataset.token!);});
 root.addEventListener('dragover',e=>{if((e.target as Element).closest('.camp-order-slot'))e.preventDefault();});
 root.addEventListener('drop',e=>{const t=(e.target as Element).closest<HTMLElement>('.camp-order-slot');if(!t)return;e.preventDefault();const value=e.dataTransfer?.getData('text/plain');modifyDraft((d,p)=>{if(!p.config.tokens.includes(value))return d;const i=Number(t.dataset.c!.split(':')[1]);const list=d.filter(v=>v!==value);list.splice(Math.min(i,list.length),0,value!);return list;});});
 document.addEventListener('keydown',e=>{if(!active||e.ctrlKey||e.metaKey||e.altKey||(e.target as HTMLElement).matches('input'))return;if(modal?.type==='crate'&&e.key!=='Escape'&&e.key!=='Tab')return;if(worldKey(e))return;if(modal?.type==='moment'&&e.key!=='Tab'){if(e.key==='Escape'){e.preventDefault();finishMoment();}return;}if(modal?.type==='story'&&e.key!=='Tab'){if(e.key==='Escape'){e.preventDefault();finishStory();}return;}if(e.key==='Escape'){e.preventDefault();if(modal?.type==='intro'||modal?.type==='outro'){finishSequence();return;}if(modal?.type==='picker'){if(s.started){modal=null;render();}else exit();return;}bag=false;chosen=null;closeInspection();return;}if(e.key.toLowerCase()==='h'&&!modal){showPoints=true;root.querySelector('.camp-scene')?.classList.add('camp-observing');}if(e.key.toLowerCase()==='b'&&(!modal||modal.type==='world')){bag=!bag;render();}if(e.key.toLowerCase()==='l')open('journal');if(e.key==='Tab'&&modal){const f=Array.from(root.querySelectorAll<HTMLElement>('.camp-modal-root button:not([disabled]),.camp-modal-root input')).filter(el=>el.tabIndex>=0&&el.getClientRects().length>0&&!el.closest('[inert]'));if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0]?.focus();}}});
 document.addEventListener('keyup',e=>{if(active&&e.key.toLowerCase()==='h'){showPoints=false;root.querySelector('.camp-scene')?.classList.remove('camp-observing');}});
 window.addEventListener('blur',()=>{showPoints=false;root.querySelector('.camp-scene')?.classList.remove('camp-observing');});
 function nativeBack(){
  if(!active)return false;
  if(modal){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));return true;}
  if(bag||chosen){bag=false;chosen=null;render();return true;}
  open('picker');return true;
 }
 return {back:nativeBack,start:begin,continue:()=>begin(s.chapter,true),replayFirst:()=>{activate();open('replay');},openPicker:()=>{document.title='孤城夜火 · 六关正篇';activate();open('picker');},progress:()=>s};
}
