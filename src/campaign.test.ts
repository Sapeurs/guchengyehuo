import {fieldSceneBlock} from './field-state.ts';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {changeRoom} from './chapter-one-world.ts';
import {CHAPTERS,type Puzzle} from './campaign-data.ts';
import {freshCampaign,restoreCampaign,enterChapter,takeProp,applyTool,readClue,solve,initialDraft,correctSolution,chapterComplete,admitAtEastGate,type Draft} from './campaign-state.ts';
function answer(p:Puzzle):Draft {const c=p.config;switch(p.kind){case 'mosaic':return c.labels.map((_:unknown,i:number)=>i);case 'balance':{for(let i=0;i<c.weights.length;i++)for(let j=i+1;j<c.weights.length;j++)if(c.weights[i]+c.weights[j]===c.target)return [i,j];throw Error('No weight solution');}case 'route':return c.example;default:return c.answer||c.target;}}
test('six chapters have three painted scenes and six actual puzzles each, with complete references',()=>{
 assert.equal(CHAPTERS.length,6);const ids=new Set<string>();
 for(const c of CHAPTERS){assert.equal(c.scenes.length,3);assert.equal(c.puzzles.length,6);assert.equal(c.clues.length,2);assert.ok(c.props.length>=3);
  for(let i=0;i<3;i++)assert.ok(existsSync(`public/assets/chapters/c${c.id}-s${i}.png`));
  for(const p of c.puzzles){assert.ok(!ids.has(p.id));ids.add(p.id);assert.ok(c.scenes[p.scene]);assert.equal(p.hints.length,3);assert.ok(p.result&&p.fact);for(const id of p.requires)assert.ok(c.puzzles.some(q=>q.id===id));for(const id of p.tools)assert.ok(c.props.some(q=>q.id===id));for(const id of p.clues)assert.ok(c.clues.some(q=>q.id===id));}
 }
 assert.equal(ids.size,36);
});
test('all 36 puzzles accept their documented solution, and the weight pairs are unique',()=>{
 for(const c of CHAPTERS)for(const p of c.puzzles){assert.equal(correctSolution(p,answer(p)),true,p.id);assert.equal(correctSolution(p,[]),false,p.id+' must need input');if(p.kind==='balance'){let count=0;for(let i=0;i<p.config.weights.length;i++)for(let j=i+1;j<p.config.weights.length;j++)if(p.config.weights[i]+p.config.weights[j]===p.config.target)count++;assert.equal(count,1,p.id);}}
});
for(const chapter of CHAPTERS)test(`chapter ${chapter.id}: reachable scenes, physical pickups, solve and save/reload without dependency deadlock`,()=>{
 let s=admitAtEastGate(enterChapter(freshCampaign(),chapter.id));if(chapter.id===1)s=changeRoom({...s,scene:1},'drawer');
 for(const clue of chapter.clues)s=readClue(s,clue.id);
 for(let round=0;round<15&&!chapter.puzzles.every(p=>s.solved.includes(p.id));round++){
  if(chapter.id===1&&s.solved.includes('c1-p1'))s=changeRoom({...s,scene:0},'lining');
  for(const item of chapter.props){if(fieldSceneBlock(chapter.id,item.scene,s.solved))continue;s={...s,scene:item.scene};s=takeProp(s,item.id);}
  for(const p of chapter.puzzles){if(s.solved.includes(p.id)||p.requires.some(id=>!s.solved.includes(id))||fieldSceneBlock(chapter.id,p.scene,s.solved))continue;
   s={...s,scene:p.scene};for(const id of p.tools){if(p.kind==='latch'&&id==='c1-weight')s={...s,drafts:{...s.drafts,[p.id]:[13,100,0,0]}};s=applyTool(s,p,id);}
   if(p.tools.some(id=>!s.used.includes(p.id+':'+id)))continue;
   const previous=s;s={...s,drafts:{...s.drafts,[p.id]:[]}};const failed=solve(s,p.id);assert.equal(failed.ok,false,p.id);assert.deepEqual(failed.state,s);s=previous;
   s={...s,drafts:{...s.drafts,[p.id]:answer(p)}};const result=solve(s,p.id);assert.equal(result.ok,true,p.id);s=restoreCampaign(JSON.stringify(result.state));assert.ok(s.solved.includes(p.id));
  }
 }
 assert.equal(chapterComplete(s,chapter.id),true,JSON.stringify(s.solved));assert.equal(s.solved.length,6);assert.equal(s.read.length,chapter.clues.length);assert.equal(s.bag.length,chapter.props.length);
});

test('tool possession alone does not apply it, wrong tools do not disappear, prerequisite cannot be bypassed',()=>{
 const c=CHAPTERS[0],p=c.puzzles[0];let s=enterChapter(freshCampaign(),1);for(const item of c.props.filter(p=>!['c1-lamp','c1-scraps'].includes(p.id))){s={...s,scene:item.scene};s=takeProp(s,item.id);}s={...s,drafts:{[p.id]:answer(p)}};assert.equal(solve(s,p.id).ok,false);const before=s;assert.equal(applyTool(s,p,'c1-manifest'),before);assert.equal(s.bag.length,4);for(const id of p.tools){if(p.kind==='latch'&&id==='c1-weight')s={...s,drafts:{...s.drafts,[p.id]:[13,100,0,0]}};s=applyTool(s,p,id);}s={...s,drafts:{...s.drafts,[p.id]:answer(p)}};assert.equal(solve(s,p.id).ok,true);const next=c.puzzles[2];s={...s,drafts:{...s.drafts,[next.id]:answer(next)}};assert.equal(solve(s,next.id).ok,false);
});
test('routes reject jumps, blocked cells, repeated cells and reversed landmarks',()=>{
 for(const c of CHAPTERS)for(const p of c.puzzles.filter(p=>p.kind==='route')){assert.equal(correctSolution(p,[p.config.start,p.config.end]),false);assert.equal(correctSolution(p,[...p.config.example,p.config.start]),false);const reverse=[...p.config.example].reverse();assert.equal(correctSolution(p,reverse),false);}
});
test('restoring hostile, damaged or unrelated data is bounded and does not erase the prologue format',()=>{
 assert.deepEqual(restoreCampaign('{bad'),freshCampaign());assert.deepEqual(restoreCampaign('{"version":2}'),freshCampaign());const s=restoreCampaign(JSON.stringify({version:1,chapter:999,scene:-5,bag:['invalid'],used:['c1-p1:c1-pry'],solved:['invalid','c1-p1','c1-p1'],drafts:{'c1-p1':Array(99).fill(3)}}));assert.equal(s.chapter,1);assert.equal(s.scene,0);assert.deepEqual(s.used,[]);assert.deepEqual(s.solved,['c1-p1']);assert.deepEqual(s.drafts,{});
});
test('all default drafts are unsolved and chapter switching preserves other chapter work',()=>{
 for(const c of CHAPTERS)for(const p of c.puzzles)assert.equal(correctSolution(p,initialDraft(p)),false,p.id);const s={...freshCampaign(),solved:['c1-p1'],bag:['c1-pry']};const second=enterChapter(s,2);assert.deepEqual(second.solved,s.solved);assert.deepEqual(enterChapter(second,1).bag,[...s.bag,'c1-manifest','c1-warrant']);assert.equal(enterChapter(s,99),s);
});
