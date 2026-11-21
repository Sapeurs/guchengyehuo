import {mainComplete} from './chapter-flow.ts';
import {BOTTOM_START,bottomCorrect,validBottom} from './crate-bottom.ts';
import {isFieldMoment} from './field-direction.ts';
import {fieldInitial,validField,migrateFieldDraft,fieldCorrect,fieldSceneBlock,fieldActionBlock} from './field-state.ts';
import {validLatch,latchComplete,canWeight} from './crate-latch.ts';
import {CHAPTERS,CHAPTER_BY_ID,type Puzzle} from './campaign-data.ts';
import {WORLD_FLAGS,PAPER_START,validPaper,paperReadable} from './chapter-one-world.ts';
import {validCrateDraft,validSealDraft,sealCorrect,directSealDraft,STORY_KEYS} from './chapter-one.ts';
export const CAMPAIGN_KEY='gucheng-nightfire:campaign:v1';
export type Draft=(string|number)[];
export interface CampaignProgress {version:1;chapter:number;scene:number;solved:string[];bag:string[];read:string[];used:string[];storySeen:string[];world:string[];drafts:Record<string,Draft>;introSeen:number[];outroSeen:number[];started:boolean;moment:string|null}
export const freshCampaign=():CampaignProgress=>({version:1,chapter:1,scene:0,solved:[],bag:[],read:[],used:[],storySeen:[],world:[],drafts:{},introSeen:[],outroSeen:[],started:false,moment:null});
export function eastGateAdmitted(s:CampaignProgress){return s.chapter!==5||s.world.includes('c5-guard-vouched')||s.solved.some(id=>id.startsWith('c5-'));}
export function admitAtEastGate(s:CampaignProgress):CampaignProgress{return s.chapter===5&&!eastGateAdmitted(s)?{...s,world:[...s.world,'c5-guard-vouched']}:s;}
const puzzles=CHAPTERS.flatMap(c=>c.puzzles),props=CHAPTERS.flatMap(c=>c.props),clues=CHAPTERS.flatMap(c=>c.clues);
const strings=(v:unknown,allowed:string[])=>Array.isArray(v)?[...new Set(v.filter((x):x is string=>typeof x==='string'&&allowed.includes(x)))]:[];
export function restoreCampaign(raw:string|null):CampaignProgress {
  try {const v=JSON.parse(raw||'null');if(!v||v.version!==1)return freshCampaign();
    const p=freshCampaign();p.chapter=CHAPTERS.some(c=>c.id===v.chapter)?v.chapter:1;p.scene=Number.isInteger(v.scene)&&v.scene>=0&&v.scene<3?v.scene:0;
    p.solved=strings(v.solved,puzzles.map(p=>p.id));p.moment=isFieldMoment(v.moment)&&p.solved.includes(v.moment)&&v.moment.startsWith('c'+p.chapter+'-')?v.moment:null;p.bag=strings(v.bag,props.map(p=>p.id));p.read=strings(v.read,clues.map(c=>c.id));p.used=strings(v.used,puzzles.flatMap(q=>q.tools.map(t=>q.id+':'+t))).filter(k=>p.bag.includes(k.split(':')[1]));
    p.storySeen=strings(v.storySeen,STORY_KEYS);p.world=strings(v.world,[...WORLD_FLAGS,'c5-guard-vouched']);
    for(const key of ['introSeen','outroSeen'] as const)p[key]=Array.isArray(v[key])?[...new Set<number>(v[key].filter((n:unknown)=>CHAPTERS.some(c=>c.id===n)))]:[];
    if(v.drafts&&typeof v.drafts==='object')for(const q of puzzles){const d=v.drafts[q.id];if(Array.isArray(d)&&d.length<=24&&d.every(x=>(typeof x==='string'&&x.length<80)||(typeof x==='number'&&Number.isFinite(x))))p.drafts[q.id]=migrateFieldDraft(q.id,d) as Draft;}
    for(const q of puzzles){if(q.kind==='bottom'&&p.drafts[q.id]&&!validBottom(p.drafts[q.id]))delete p.drafts[q.id];if(q.kind==='field'&&p.drafts[q.id]&&!validField(q.id,p.drafts[q.id]))delete p.drafts[q.id];if(q.kind==='latch'&&p.drafts[q.id]&&!validLatch(p.drafts[q.id]))delete p.drafts[q.id];if(q.kind==='crate'&&p.drafts[q.id]&&!validCrateDraft(p.drafts[q.id]))delete p.drafts[q.id];if(q.kind==='seal'&&p.drafts[q.id]&&!validSealDraft(p.drafts[q.id]))delete p.drafts[q.id];if(q.kind==='translucent'&&p.drafts[q.id]&&!validPaper(p.drafts[q.id]))delete p.drafts[q.id];if(q.kind==='trace'&&p.drafts[q.id]&&(p.drafts[q.id].length!==1||!Number.isInteger(p.drafts[q.id][0])||Number(p.drafts[q.id][0])<0||Number(p.drafts[q.id][0])>3))delete p.drafts[q.id];}
    if(p.drafts['c1-p5'])p.drafts['c1-p5']=directSealDraft(p.drafts['c1-p5']);
    p.started=!!v.started;if(p.started)p.bag=[...new Set([...p.bag,...CHAPTER_BY_ID(p.chapter).props.filter(t=>t.carried).map(t=>t.id)])];if(p.started&&p.chapter===1)p.bag=[...new Set([...p.bag,'c1-manifest','c1-warrant'])];return p;
  }catch{return freshCampaign();}
}
export function initialDraft(p:Puzzle):Draft {const c=p.config;
  switch(p.kind){case 'bottom':return [...BOTTOM_START];case 'field':return fieldInitial(p.id);case 'translucent':return [...PAPER_START];case 'trace':return [0];case 'order':return [];case 'balance':case 'select':return [];case 'latch':case 'crate':case 'seal':case 'dials':case 'network':return [...c.initial];case 'mosaic':return [...c.initial];case 'route':return [c.start];case 'light':return [0,0,4];case 'match':return c.left.map(()=>-1);}
}
export const missingRequirements=(s:CampaignProgress,p:Puzzle)=>({puzzles:p.requires.filter(id=>!s.solved.includes(id)),tools:p.tools.filter(id=>!s.used.includes(p.id+':'+id))});
export function puzzleReady(s:CampaignProgress,p:Puzzle){const m=missingRequirements(s,p);return eastGateAdmitted(s)&&!m.puzzles.length&&!m.tools.length;}
export function chapterComplete(s:CampaignProgress,id:number){return mainComplete(s,id);}
const same=(a:Draft,b:Draft)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
export function correctSolution(p:Puzzle,d:Draft):boolean {const c=p.config;
  switch(p.kind){
    case 'bottom':return bottomCorrect(d);
    case 'field':return fieldCorrect(p.id,d);
    case 'latch':return latchComplete(d);
    case 'translucent':return validPaper(d)&&paperReadable(d);
    case 'trace':return d.length===1&&d[0]===3;
    case 'crate':return validCrateDraft(d)&&d[0]===6;
    case 'seal':return sealCorrect(d);
    case 'order':case 'dials':case 'network':case 'light':case 'match':return same(d,c.answer||c.target);
    case 'mosaic':return same(d,c.labels.map((_:unknown,i:number)=>i));
    case 'select':return d.length===c.answer.length&&new Set(d).size===d.length&&d.every(v=>c.answer.includes(v));
    case 'balance':return d.length===2&&new Set(d).size===d.length&&d.every(i=>Number.isInteger(i)&&Number(i)>=0&&Number(i)<c.weights.length)&&d.reduce<number>((a,i)=>a+c.weights[Number(i)],0)===c.target;
    case 'route':{
      if(d[0]!==c.start||d.at(-1)!==c.end||new Set(d).size!==d.length||d.some(v=>!Number.isInteger(v)||Number(v)<0||Number(v)>=16||c.blocked.includes(v)))return false;
      if(d.some((v,i)=>i>0&&Math.abs(Number(v)%4-Number(d[i-1])%4)+Math.abs(Math.floor(Number(v)/4)-Math.floor(Number(d[i-1])/4))!==1))return false;
      let previous=-1;for(const w of c.waypoints){const at=d.indexOf(w);if(at<=previous)return false;previous=at;}return true;
    }
  }
}
export function solve(s:CampaignProgress,id:string){const p=CHAPTER_BY_ID(s.chapter).puzzles.find(p=>p.id===id);if(!p)return {ok:false,state:s,message:'这件物证不在当前调查中。'};
  if(s.solved.includes(id))return {ok:true,state:s,message:p.result};
  if(!puzzleReady(s,p))return {ok:false,state:s,message:'还需要相应的物件或前一步调查结果。'};
  const actionBlock=fieldActionBlock(id,'solve',s.solved);if(actionBlock)return {ok:false,state:s,message:actionBlock};
  if(!correctSolution(p,s.drafts[id]||initialDraft(p)))return {ok:false,state:s,message:p.kind==='route'?'路线尚未连通，检查地标先后与相邻道路。':p.kind==='match'?'材料与判断还没有一一对应。再看看原始记录。':'还没有对上。保留当前摆放，再比对一下线索。'};
  if(id==='c5-p6'&&(Number(s.drafts[id]?.[1])&2)&&!s.solved.includes('c5-p3'))return {ok:false,state:s,message:'尚未取得的路引不能作为原件交出。'};
  const awards=(p.config.awards||[]).filter((id:string)=>CHAPTER_BY_ID(s.chapter).props.some(t=>t.id===id));
  const reads=(p.config.reads||[]).filter((id:string)=>CHAPTER_BY_ID(s.chapter).clues.some(c=>c.id===id));
  // A v24 test reply is still useful for aiming, but this visit needs the actual closing signal.
  const aimedBeforeOrder=id==='c3-p6'&&s.solved.includes('c3-p5');
  const solved=aimedBeforeOrder?s.solved.filter(key=>key!=='c3-p5'):s.solved;
  const drafts=aimedBeforeOrder?{...s.drafts,'c3-p5':[25,1,0,0]}:s.drafts;
  return {ok:true,state:{...s,drafts,moment:isFieldMoment(id)&&!['c2-p5','c3-p5','c4-p6','c5-p4','c6-p2'].includes(id)?id:s.moment,solved:[...solved,id],bag:[...new Set([...s.bag,...awards])],read:[...new Set([...s.read,...reads])]},message:p.result};
}
export function enterChapter(s:CampaignProgress,id:number):CampaignProgress {
 if(!CHAPTERS.some(c=>c.id===id))return s;
 const carried=CHAPTER_BY_ID(id).props.filter(p=>p.carried).map(p=>p.id);
 return {...s,chapter:id,scene:0,started:true,moment:s.moment?.startsWith('c'+id+'-')?s.moment:null,bag:[...new Set([...s.bag,...carried,...(id===1?['c1-manifest','c1-warrant']:[])])]};
}
export function takeProp(s:CampaignProgress,id:string):CampaignProgress {const p=CHAPTER_BY_ID(s.chapter).props.find(p=>p.id===id&&p.scene===s.scene);return p&&eastGateAdmitted(s)&&!fieldSceneBlock(s.chapter,s.scene,s.solved)&&!(p.requires||[]).some(id=>!s.solved.includes(id))&&!(id==='c1-scraps'&&(!s.solved.includes('c1-p1')||!s.world.includes('c1-lining-lifted')))&&!(id==='c1-lamp'&&!s.world.includes('c1-drawer-open'))&&!s.bag.includes(id)?{...s,bag:[...s.bag,id]}:s;}
export function readClue(s:CampaignProgress,id:string):CampaignProgress {const c=CHAPTER_BY_ID(s.chapter).clues.find(c=>c.id===id);return c&&!s.read.includes(id)?{...s,read:[...s.read,id]}:s;}
export function applyTool(s:CampaignProgress,p:Puzzle,id:string):CampaignProgress {const key=p.id+':'+id;return !(p.id==='c1-p1'&&id==='c1-weight'&&(!s.used.includes('c1-p1:c1-pry')||!canWeight(s.drafts[p.id]||initialDraft(p))))&&p.tools.includes(id)&&s.bag.includes(id)&&!s.used.includes(key)?{...s,used:[...s.used,key]}:s;}
export function markStory(s:CampaignProgress,key:string):CampaignProgress{return STORY_KEYS.includes(key)&&!s.storySeen.includes(key)?{...s,storySeen:[...s.storySeen,key]}:s;}
export function restartFirstChapter(s:CampaignProgress):CampaignProgress {return {...s,chapter:1,scene:0,started:true,moment:null,solved:s.solved.filter(id=>!id.startsWith('c1-')),bag:s.bag.filter(id=>!id.startsWith('c1-')),read:s.read.filter(id=>!id.startsWith('c1-')),used:s.used.filter(id=>!id.startsWith('c1-')),storySeen:[],world:s.world.filter(id=>!id.startsWith('c1-')),drafts:Object.fromEntries(Object.entries(s.drafts).filter(([id])=>!id.startsWith('c1-'))),introSeen:s.introSeen.filter(id=>id!==1),outroSeen:s.outroSeen.filter(id=>id!==1)};}
export function restoreFirstChapter(s:CampaignProgress,backup:CampaignProgress):CampaignProgress {const merge=(current:string[],old:string[])=>[...current.filter(id=>!id.startsWith('c1-')),...old.filter(id=>id.startsWith('c1-'))];return {...s,chapter:1,scene:0,moment:null,solved:merge(s.solved,backup.solved),bag:[...new Set([...merge(s.bag,backup.bag),'c1-manifest','c1-warrant'])],read:merge(s.read,backup.read),used:merge(s.used,backup.used),storySeen:[...backup.storySeen],world:[...s.world.filter(id=>!id.startsWith('c1-')),...backup.world.filter(id=>id.startsWith('c1-'))],drafts:{...Object.fromEntries(Object.entries(s.drafts).filter(([id])=>!id.startsWith('c1-'))),...Object.fromEntries(Object.entries(backup.drafts).filter(([id])=>id.startsWith('c1-')))},introSeen:[...s.introSeen.filter(id=>id!==1),...backup.introSeen.filter(id=>id===1)],outroSeen:[...s.outroSeen.filter(id=>id!==1),...backup.outroSeen.filter(id=>id===1)]};}

export function restartChapter(s:CampaignProgress,id:number):CampaignProgress {
 if(id===1)return restartFirstChapter(s);if(!CHAPTERS.some(c=>c.id===id))return s;
 const keep=(v:string)=>!v.startsWith('c'+id+'-');
 return enterChapter({...s,moment:null,solved:s.solved.filter(keep),bag:s.bag.filter(keep),read:s.read.filter(keep),used:s.used.filter(keep),world:s.world.filter(keep),drafts:Object.fromEntries(Object.entries(s.drafts).filter(([key])=>keep(key))),introSeen:s.introSeen.filter(n=>n!==id),outroSeen:s.outroSeen.filter(n=>n!==id)},id);
}
export function restoreChapter(s:CampaignProgress,backup:CampaignProgress,id:number):CampaignProgress {
 if(id===1)return restoreFirstChapter(s,backup);if(!CHAPTERS.some(c=>c.id===id))return s;
 const here=(v:string)=>v.startsWith('c'+id+'-'),merge=(a:string[],b:string[])=>[...a.filter(v=>!here(v)),...b.filter(here)];
 return enterChapter({...s,moment:backup.moment?.startsWith('c'+id+'-')?backup.moment:null,solved:merge(s.solved,backup.solved),bag:merge(s.bag,backup.bag),read:merge(s.read,backup.read),used:merge(s.used,backup.used),world:merge(s.world,backup.world),drafts:{...Object.fromEntries(Object.entries(s.drafts).filter(([key])=>!here(key))),...Object.fromEntries(Object.entries(backup.drafts).filter(([key])=>here(key)))},introSeen:[...s.introSeen.filter(n=>n!==id),...backup.introSeen.filter(n=>n===id)],outroSeen:[...s.outroSeen.filter(n=>n!==id),...backup.outroSeen.filter(n=>n===id)]},id);
}

export const finishFieldMoment=(s:CampaignProgress):CampaignProgress=>s.moment?{...s,moment:null}:s;
