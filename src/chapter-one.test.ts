import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CRATE_INITIAL,CRATE_STEPS,validCrateDraft,moveCrate,sealCorrect,directSealDraft,sealReviewDraft} from './chapter-one.ts';
import {freshCampaign,restoreCampaign,restartFirstChapter,restoreFirstChapter,markStory,correctSolution} from './campaign-state.ts';
import {CHAPTERS} from './campaign-data.ts';
import {sealView} from './seal-view.ts';
test('seal UI shows only the two sourced originals, with no numbered or rotating selector',()=>{
 for(const done of [false,true]){
  const html=sealView(done?[1,2,9,1]:[1,2,0,0],done);
  assert.match(html,/拘令上的印/);assert.match(html,/箱底旧封签上的印/);
  assert.match(html,/data-c="seal-overlay"/);assert.doesNotMatch(html,/seal-candidate|seal-turn|w-print-tabs|甲处|乙处|丙处|第[123]处/);
 }
});
test('crate collisions and boundaries are physical and reversible',()=>{
 assert.equal(validCrateDraft(CRATE_INITIAL),true);assert.equal(moveCrate(CRATE_INITIAL,0,1),null);assert.equal(moveCrate(CRATE_INITIAL,1,1),null);assert.equal(moveCrate(CRATE_INITIAL,0,-1),null);
 let d=[...CRATE_INITIAL];for(const [i,dir] of CRATE_STEPS){const next=moveCrate(d,i,dir);assert.ok(next);assert.deepEqual(moveCrate(next,i,-dir),d);d=next;}
 assert.equal(validCrateDraft(d)&&d[0]===6,true);assert.equal(validCrateDraft([4,4,12,9,7]),false);assert.equal(validCrateDraft([4,2,12,9,15]),false);
});
test('every reachable crate arrangement can return to start: no irreversible wrong move',()=>{
 const queue=[[...CRATE_INITIAL]],seen=new Set([CRATE_INITIAL.join(',')]);let goals=0;
 while(queue.length){const d=queue.shift()!;if(d[0]===6)goals++;for(let i=0;i<5;i++)for(const dir of [-1,1]){const next=moveCrate(d,i,dir);if(!next)continue;assert.deepEqual(moveCrate(next,i,-dir),d);const key=next.join(',');if(!seen.has(key)){seen.add(key);queue.push(next);}}}
 assert.ok(seen.size>20);assert.ok(goals>0);
});
test('seal requires correct residual print, alignment, overlay and two independent defects',()=>{
 assert.equal(sealCorrect([1,2,9,1]),true);for(const wrong of [[0,2,9,1],[2,2,9,1],[1,1,9,1],[1,2,1,1],[1,2,8,1],[1,2,15,1],[1,2,9,0]])assert.equal(sealCorrect(wrong),false);
});
test('old seal choices migrate to the actual document without granting false completion',()=>{
 const legacy=[1,0,1,1];assert.deepEqual(directSealDraft(legacy),[1,2,1,1]);assert.deepEqual(legacy,[1,0,1,1]);
 for(const oldChoice of [0,2]){
  const s=restoreCampaign(JSON.stringify({...freshCampaign(),drafts:{'c1-p5':[oldChoice,2,9,1],'c2-p1':['左环']},solved:['c2-p1']}));
  assert.deepEqual(s.drafts['c1-p5'],[1,2,0,1]);assert.equal(sealCorrect(s.drafts['c1-p5']),false);
  assert.equal(s.drafts['c2-p1'],undefined);assert.deepEqual(s.solved,['c2-p1']);
 }
 assert.deepEqual(initialDraft(CHAPTERS[0].puzzles[4]),[1,2,0,0]);
 const partiallyMarked=restoreCampaign(JSON.stringify({...freshCampaign(),drafts:{'c1-p5':legacy}}));assert.deepEqual(partiallyMarked.drafts['c1-p5'],[1,2,1,1]);
});
test('reopening a solved seal permits comparison without changing confirmed evidence',()=>{
 const stored={...freshCampaign(),solved:['c1-p5','c2-p1'],drafts:{'c1-p5':[1,2,9,1],'c2-p1':['左环']}};
 const before=JSON.stringify(stored);const separated=sealReviewDraft(false),overlaid=sealReviewDraft(true);
 assert.deepEqual(separated,[1,2,9,0]);assert.deepEqual(overlaid,[1,2,9,1]);overlaid[2]=0;
 assert.deepEqual(sealReviewDraft(true),[1,2,9,1]);assert.equal(JSON.stringify(stored),before);
});
test('old solved chapters survive new mechanics while incompatible unfinished drafts reset locally',()=>{
 const old={...freshCampaign(),solved:['c1-p1','c2-p1'],drafts:{'c1-p1':[1,3],'c1-p5':[2,2,2],'c2-p1':['左环']},storySeen:undefined};const s=restoreCampaign(JSON.stringify(old));assert.deepEqual(s.solved,old.solved);assert.equal(s.drafts['c1-p1'],undefined);assert.equal(s.drafts['c1-p5'],undefined);assert.equal(s.drafts['c2-p1'],undefined);assert.deepEqual(s.storySeen,[]);
});
test('first chapter replay and restoration retain subsequent chapter work and require explicit story keys',()=>{
 const before={...freshCampaign(),chapter:2,scene:1,solved:['c1-p1','c2-p1'],bag:['c1-pry','c2-hook'],read:['c1-b','c2-a'],used:['c1-p1:c1-pry'],introSeen:[1,2],outroSeen:[1],drafts:{'c1-p1':[...CRATE_INITIAL],'c2-p1':['左环']},storySeen:['c1-opened']};
 const replay=restartFirstChapter(before);assert.deepEqual(replay.solved,['c2-p1']);assert.deepEqual(replay.bag,['c2-hook']);assert.deepEqual(replay.introSeen,[2]);assert.equal(replay.chapter,1);
 const advanced={...replay,solved:[...replay.solved,'c2-p2'],bag:[...replay.bag,'c2-pass']};const restored=restoreFirstChapter(advanced,before);assert.deepEqual(restored.solved,['c2-p1','c2-p2','c1-p1']);assert.deepEqual(restored.bag,['c2-hook','c2-pass','c1-pry','c1-manifest','c1-warrant']);assert.deepEqual(restored.storySeen,['c1-opened']);assert.equal(markStory(restored,'arbitrary'),restored);const marked=markStory(restored,'c1-patrol');assert.ok(marked.storySeen.includes('c1-patrol'));assert.equal(markStory(marked,'c1-patrol'),marked);
});

import {changeRoom, paperClarity, paperReadable, movePaper, inspectTrack,worldViewDraft} from './chapter-one-world.ts';
import {takeProp, applyTool, puzzleReady, initialDraft, solve, type CampaignProgress} from './campaign-state.ts';
test('room actions gate physical pickups and survive refresh without changing other chapters',()=>{
 let s=freshCampaign();assert.equal(takeProp(s,'c1-scraps'),s);assert.equal(changeRoom(s,'lining'),s);
 s={...s,scene:1};assert.equal(takeProp(s,'c1-lamp'),s);s=changeRoom(s,'drawer');s=takeProp(s,'c1-lamp');assert.ok(s.bag.includes('c1-lamp'));
 s={...s,scene:0,solved:['c1-p1','c2-p2']};assert.equal(takeProp(s,'c1-scraps'),s);s=changeRoom(s,'lining');s=takeProp(s,'c1-scraps');
 const restored=restoreCampaign(JSON.stringify(s));assert.ok(restored.world.includes('c1-drawer-open'));assert.ok(restored.world.includes('c1-lining-lifted'));assert.deepEqual(restored.bag,['c1-lamp','c1-scraps']);
 const replay=restartFirstChapter(restored);assert.deepEqual(replay.world,[]);assert.deepEqual(replay.solved,['c2-p2']);assert.deepEqual(restoreFirstChapter(replay,restored).world,restored.world);
 assert.equal(changeRoom({...s,chapter:2},'drawer').chapter,2);
});
test('completed legacy saves reconstruct inspectable proof without rewriting saved or unfinished work',()=>{
 const legacy=restoreCampaign(JSON.stringify({...freshCampaign(),solved:['c1-p2','c1-p3','c1-p4','c1-p5','c1-p6','c2-p1'],drafts:{'c1-p5':[2,2,2],'c2-p1':['左环']}}));
 const before=JSON.stringify(legacy);
 for(const p of CHAPTERS[0].puzzles.slice(1)){
  const view=worldViewDraft(p.id,legacy.drafts[p.id]||initialDraft(p),true);
  assert.ok(correctSolution(p,view),p.id);view[0]=999;
  assert.ok(correctSolution(p,worldViewDraft(p.id,[],true)),p.id+' returns an independent proof');
 }
 assert.equal(JSON.stringify(legacy),before);
 const incomplete=[2,1,8,0];assert.equal(worldViewDraft('c1-p5',incomplete,false),incomplete);
 assert.equal(worldViewDraft('c2-p1',incomplete,true),incomplete);
});
test('counterweight cannot reach the inner latch until the outer batten has been pried up',()=>{
 const p=CHAPTERS[0].puzzles[0];let s:CampaignProgress={...freshCampaign(),bag:['c1-pry','c1-weight'],drafts:{[p.id]:[13,100,0,0]}};
 assert.equal(applyTool(s,p,'c1-weight'),s);assert.equal(solve(s,p.id).ok,false);s=applyTool(s,p,'c1-pry');assert.equal(puzzleReady(s,p),false);s=applyTool(s,p,'c1-weight');s={...s,drafts:{...s.drafts,[p.id]:[13,100,100,100]}};assert.equal(solve(s,p.id).ok,true);
});
test('paper reveals progressively over a usable area, requires its reverse, and keeps position on refresh',()=>{
 const p=CHAPTERS[0].puzzles[3];assert.equal(paperClarity([1,67,42]),1);assert.ok(paperClarity([1,58,42])>paperClarity([1,48,42]));assert.equal(paperReadable([0,67,42]),false);assert.equal(paperReadable([1,69,44]),true);assert.equal(paperReadable([1,18,70]),false);
 assert.deepEqual(movePaper([1,67,42],999,-3),[1,88,20]);assert.equal(correctSolution(p,[1,69,44]),true);assert.equal(correctSolution(p,[1,NaN,42]),false);assert.equal(correctSolution(p,initialDraft(p)),false);
 const s=restoreCampaign(JSON.stringify({...freshCampaign(),drafts:{[p.id]:[1,64.5,43.7]}}));assert.deepEqual(s.drafts[p.id],[1,64.5,43.7]);
});
test('track evidence requires the lantern to illuminate both distinct marks, and patrol quieting is recoverable',()=>{
 assert.equal(inspectTrack(0,0,[0,0]),0);assert.equal(inspectTrack(0,0,[39,59]),1);assert.equal(inspectTrack(1,0,[39,59]),1);assert.equal(inspectTrack(1,1,[56,40]),3);assert.equal(inspectTrack(0,4,[39,59]),0);
 const p=CHAPTERS[0].puzzles[5];let s:CampaignProgress={...freshCampaign(),solved:['c1-p1'],bag:['c1-lamp'],drafts:{[p.id]:[3]}};assert.equal(solve(s,p.id).ok,false);s=applyTool(s,p,'c1-lamp');assert.equal(solve(s,p.id).ok,true);
 const patrol=restoreCampaign(JSON.stringify({...s,world:['c1-patrol-active']}));const quiet=changeRoom(patrol,'quiet');assert.ok(!quiet.world.includes('c1-patrol-active'));assert.ok(quiet.world.includes('c1-patrol-done'));
 const legacy=restoreCampaign(JSON.stringify({...s,drafts:{'c1-p4':[1,3,2],'c1-p6':[2,0,1]}}));assert.equal(legacy.drafts['c1-p4'],undefined);assert.equal(legacy.drafts['c1-p6'],undefined);assert.ok(legacy.solved.includes('c1-p1'));
});

import {LATCH_START,LATCH_OPEN,latchMove,canWeight,validLatch,latchComplete} from './crate-latch.ts';
test('physical latch requires the wedge, the weight, bar travel and actual lid movement',()=>{
 let d=[...LATCH_START] as typeof LATCH_START;
 assert.equal(latchMove(d,'lid',100,{pry:false,weight:false}).blocked,'bar');
 assert.equal(latchMove(d,'lever',100,{pry:false,weight:false}).blocked,'pry');
 assert.equal(canWeight(d),false);
 d=latchMove(d,'lever',45,{pry:true,weight:false}).draft;assert.equal(canWeight(d),false);
 d=latchMove(d,'lever',100,{pry:true,weight:false}).draft;assert.equal(canWeight(d),true);
 assert.equal(latchMove(d,'bar',100,{pry:true,weight:false}).blocked,'spring');
 d=latchMove(d,'bar',50,{pry:true,weight:true}).draft;
 assert.equal(latchMove(d,'lid',100,{pry:true,weight:true}).blocked,'bar');
 const back=latchMove(d,'bar',0,{pry:true,weight:true}).draft;assert.equal(back[2],0);
 d=latchMove(d,'bar',100,{pry:true,weight:true}).draft;
 d=latchMove(d,'lid',50,{pry:true,weight:true}).draft;assert.equal(latchComplete(d),false);
 d=latchMove(d,'lid',100,{pry:true,weight:true}).draft;assert.deepEqual(d,LATCH_OPEN);assert.equal(latchComplete(d),true);
});
test('latch progress survives interrupted gestures and rejects incompatible legacy boards',()=>{
 for(const d of [[13,50,0,0],[13,100,37.2,0],[13,100,100,42]]){
  assert.equal(validLatch(d),true);
  const s=restoreCampaign(JSON.stringify({...freshCampaign(),used:['c1-p1:c1-pry'],bag:['c1-pry'],drafts:{'c1-p1':d},solved:['c2-p1']}));
  assert.deepEqual(s.drafts['c1-p1'],d);assert.deepEqual(s.solved,['c2-p1']);
 }
 for(const bad of [[4,2,12,9,7],[13,0,100,0],[13,100,20,100],[13,NaN,0,0],[13,100,100,101]])assert.equal(validLatch(bad),false);
 const old=restoreCampaign(JSON.stringify({...freshCampaign(),solved:['c1-p1','c2-p1'],drafts:{'c1-p1':[6,10,12,8,11]}}));
 assert.deepEqual(old.solved,['c1-p1','c2-p1']);assert.equal(old.drafts['c1-p1'],undefined);
});


import {compareLedger,caseLead,caseThreads} from './c1-investigation.ts';
import {enterChapter} from './campaign-state.ts';
import {BOTTOM_START,BOTTOM_PROOF,moveBottom,validBottom,bottomCorrect} from './crate-bottom.ts';
import {chapterComplete} from './campaign-state.ts';
import {firstEnding,firstDeparture} from './c1-inquiry.ts';

test('floor experiment proves an alternate opening only when the locked lid is actually tested',()=>{
 let d=[...BOTTOM_START];assert.deepEqual(moveBottom(d,'slide',100).draft,d);
 d=moveBottom(d,'peg').draft;d=moveBottom(d,'slide',100).draft;
 const openTop=moveBottom(d,'lid');assert.equal(bottomCorrect(openTop.draft),false);assert.match(openTop.line,/没有锁住|箱口也开着/);
 d=moveBottom(d,'bar').draft;assert.equal(bottomCorrect(d),false,'a visible opening alone does not complete the inference');
 const tested=moveBottom(d,'lid');assert.equal(bottomCorrect(tested.draft),true);assert.deepEqual(tested.draft,BOTTOM_PROOF);
 assert.equal(bottomCorrect(moveBottom(moveBottom(BOTTOM_START,'bar').draft,'lid').draft),false,'locking the lid alone proves nothing about the floor');
});
test('floor and locking pin can be restored before the final experiment; wrong moves retain progress',()=>{
 let d=moveBottom(BOTTOM_START,'peg').draft;d=moveBottom(d,'slide',64).draft;
 assert.deepEqual(moveBottom(d,'peg').draft,d,'pin cannot be inserted through a displaced floor');
 d=moveBottom(d,'slide',0).draft;d=moveBottom(d,'peg').draft;assert.deepEqual(d,BOTTOM_START);
 d=moveBottom(d,'bar').draft;d=moveBottom(d,'bar').draft;assert.deepEqual(d,BOTTOM_START);
 assert.equal(validBottom([23,1,0,100,0]),false);assert.equal(validBottom([23,0,1,100,1]),false);assert.equal(validBottom([23,1,1,NaN,0]),false);
});
test('floor gestures survive interruption, old unfinished paper boards reset, completed saves retain their other work',()=>{
 let d=[...BOTTOM_START];for(const [action,value] of [['bar',0],['peg',0],['slide',37],['slide',100],['lid',0]] as const){
  d=moveBottom(d,action,value).draft;assert.equal(validBottom(d),true);
  const s=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),1),solved:['c1-p1','c2-p2'],drafts:{'c1-p3':d}}));assert.deepEqual(s.drafts['c1-p3'],d);
 }
 const old=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),1),solved:['c1-p1','c2-p2'],drafts:{'c1-p3':[4,0,3,2,5,1],'c1-p2':[1]}}));
 assert.equal(old.drafts['c1-p3'],undefined);assert.deepEqual(old.drafts['c1-p2'],[1]);assert.deepEqual(old.solved,['c1-p1','c2-p2']);
 const complete=restoreCampaign(JSON.stringify({...old,solved:[...old.solved,'c1-p3'],moment:null}));assert.ok(complete.solved.includes('c1-p3'));assert.equal(complete.moment,null);
});
test('first chapter can leave after the core investigation, while both deeper inquiries remain playable',()=>{
 const s={...enterChapter(freshCampaign(),1),solved:['c1-p1','c1-p2','c1-p3','c1-p4']};
 assert.equal(chapterComplete(s,1),true);assert.equal(chapterComplete({...s,solved:s.solved.filter(id=>id!=='c1-p3')},1),false);
 const ending=JSON.stringify([firstEnding(s),firstDeparture(s)]);assert.doesNotMatch(ending,/车辙|芦苇|两处印|印模/);
 const extended={...s,solved:[...s.solved,'c1-p5','c1-p6']};assert.match(JSON.stringify(firstEnding(extended)),/芦苇|印模/);assert.equal(chapterComplete(extended,1),true);
});
test('experiment collects the folded original if it was missed, and discovery survives refresh before continuation',()=>{
 const p=CHAPTERS[0].puzzles.find(p=>p.id==='c1-p3')!;
 const s={...enterChapter(freshCampaign(),1),solved:['c1-p1'],drafts:{[p.id]:[...BOTTOM_PROOF]}};
 const done=solve(s,p.id);assert.equal(done.ok,true);assert.ok(done.state.bag.includes('c1-scraps'));assert.equal(done.state.moment,p.id);
 const resumed=restoreCampaign(JSON.stringify(done.state));assert.equal(resumed.moment,p.id);assert.deepEqual(resumed.drafts[p.id],BOTTOM_PROOF);
 assert.equal(CHAPTERS[0].puzzles[3].requires.includes(p.id),false,'looking at a carried original does not depend on completing an unrelated experiment');
});
test('carried originals are available from entry and old first-chapter saves, without touching later chapters',()=>{
 const old={...freshCampaign(),chapter:2,started:true,bag:['c2-hook'],solved:['c2-p1']};
 const entered=enterChapter(old,1);assert.deepEqual(entered.bag,['c2-hook','c1-manifest','c1-warrant']);assert.deepEqual(entered.solved,['c2-p1']);
 assert.deepEqual(enterChapter(entered,1).bag,entered.bag);
 assert.deepEqual(restoreCampaign(JSON.stringify({...old,chapter:1})).bag,entered.bag);
 assert.deepEqual(restoreCampaign(JSON.stringify(old)).bag,['c2-hook']);
 const pending=restoreCampaign(JSON.stringify({...entered,solved:['c1-p2'],world:['c1-patrol-pending']}));
 assert.ok(pending.world.includes('c1-patrol-pending'));assert.ok(!pending.world.includes('c1-patrol-active'));
});
test('ledger comparison needs two independent matching records and gives specific non-answer feedback',()=>{
 for(const d of [[],[1],[1,1],[1,3,4],[1,0],[1,2],[4,3],[5,3]])assert.equal(compareLedger(d).ok,false,JSON.stringify(d));
 assert.equal(compareLedger([1,3]).ok,true);assert.equal(compareLedger([3,1]).ok,true);
 assert.match(compareLedger([1,0]).line,/另一批/);assert.doesNotMatch(compareLedger([1,0]).line,/初八|初九/);
 assert.match(compareLedger([4,3]).line,/箱号和去向/);
});
test('unresolved case notes do not announce the empty box, reversed dates, hidden destination, or stamp match',()=>{
 const s=enterChapter(freshCampaign(),1),notes=JSON.stringify([caseLead(s),caseThreads(s)]);
 assert.doesNotMatch(notes,/空箱|初八|西渡|同一印模/);
 const solved={...s,solved:CHAPTERS[0].puzzles.map(p=>p.id)};
 assert.match(JSON.stringify(caseThreads(solved)),/初九|初八|西渡|拘令与旧签/);
 const awaiting=sealView([1,2,0,0],false,false);
 assert.doesNotMatch(awaiting,/拘令上的印|data-c="seal-overlay"/);assert.match(awaiting,/旧印似曾相识/);
});
