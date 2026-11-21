import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fieldInitial,fieldCorrect,fieldMove,validField,FIELD_PROOF,fieldViewDraft,brushStroke,fieldSceneBlock,fieldActionBlock,fieldPuzzleVisible,fieldSceneLabel} from './field-state.ts';
import {freshCampaign,enterChapter,restartChapter,restoreChapter,restoreCampaign,takeProp,solve,applyTool,finishFieldMoment,puzzleReady,chapterComplete,eastGateAdmitted,admitAtEastGate} from './campaign-state.ts';
import {CHAPTER_BY_ID} from './campaign-data.ts';
import {MAIN_PATH,chapterOutro} from './chapter-flow.ts';
const paths:Record<string,(string|[string,number])[]>={
 'c2-p1':['brace','slack','tail','ladder'],'c2-p2':[['depth',3],'probe'],'c2-p3':['sack','knock','open-crate'],'c2-p4':['board','bolt','door'],'c2-p5':['test','bypass','test','release'],'c2-p6':['secure','tube'],
 'c3-p1':['upper','lower','saddle','lining'],'c3-p2':[['clip',2],'fit','back'],'c3-p3':[['wick',2],'spark','cover'],'c3-p4':[['window',2],'flip','read'],'c3-p5':['preview',['aim',1],'pull'],'c3-p6':[['mark',0],['mark',1],'compare','prepare'],
 'c4-p1':['tiles','mat','listen'],'c4-p2':[['angle',65],'catch'],'c4-p3':['cloth','wrap','wrap','press'],'c4-p4':[['show',0],['show',1],['show',2],'witness'],'c4-p5':['stone','pawl',['rope',100],'door'],'c4-p6':[['board',100],'prop','release','escort'],
 'c5-p1':['wedge','oil','tooth'],'c5-p2':['flip','place','compare'],'c5-p3':['reference',['mark',0],['mark',1],'verify'],'c5-p4':[['load',100],'pin','test'],'c5-p5':['water','friends','side','ladder'],'c5-p6':[['place',0],['place',1],['place',2],'handover'],
 'c6-p1':[['cover',100],'signal','reply'],'c6-p2':[['aim',32],'pulse',['aim',72],'pulse'],'c6-p3':['hold','bypass','test'],'c6-p4':['pack'],'c6-p5':['door','shelter','hand'],'c6-p6':['identity','witness','ink',['stroke',1],'chen']
};
for(const [id,path] of Object.entries(paths))test(id+' completes through real object actions and survives every interruption',()=>{
 let d=fieldInitial(id);assert.equal(fieldCorrect(id,d),false);
 for(const step of path){const before=[...d],r=fieldMove(id,d,typeof step==='string'?step:step[0],typeof step==='string'?0:step[1]);assert.deepEqual(d,before,'transition must not mutate input');assert.ok(validField(id,r.draft),id+JSON.stringify(r));d=r.draft;
  const restored=restoreCampaign(JSON.stringify({...freshCampaign(),chapter:Number(id[1]),started:true,drafts:{[id]:d}}));assert.deepEqual(restored.drafts[id],d,id+' stores partial action');
 }
 assert.equal(fieldCorrect(id,d),true,id+JSON.stringify(d));
 const before=JSON.stringify(d);assert.ok(fieldCorrect(id,fieldMove(id,d,'anything',1).draft));assert.equal(JSON.stringify(d),before);
});
test('physical loads, gates and provenance prevent out-of-order completion',()=>{
 for(const [id,action] of [['c2-p1','tail'],['c3-p1','lower'],['c3-p2','back'],['c4-p5','door'],['c4-p6','escort'],['c5-p1','tooth'],['c5-p5','ladder'],['c6-p1','reply'],['c6-p4','seal'],['c6-p6','stroke']]){
  const d=fieldInitial(id);assert.deepEqual(fieldMove(id,d,action,1).draft,d,id+' must preserve blocked attempt');
 }
 const eastMissing=fieldMove('c6-p2',fieldMove('c6-p2',fieldInitial('c6-p2'),'aim',72).draft,'pulse');assert.equal(eastMissing.draft[2],0);
 assert.match(fieldMove('c2-p1',fieldInitial('c2-p1'),'slack').line,/支撑/);
});
test('new scene gates match physical access, including tools behind late doors',()=>{
 for(const [c,scene,gate] of [[2,1,'c2-p1'],[4,2,'c4-p2'],[5,2,'c5-p2'],[6,2,'c6-p3']] as const){assert.ok(fieldSceneBlock(c,scene,[]));assert.equal(fieldSceneBlock(c,scene,[gate]),null);}
 const c2=enterChapter(freshCampaign(),2);assert.equal(CHAPTER_BY_ID(2).props.find(p=>p.id==='c2-rope')?.scene,0);
 const before={...c2,scene:0};assert.equal(takeProp(before,'c2-pass'),before);
 assert.equal(fieldSceneBlock(2,2,[]),null);
});
test('incompatible old board drafts reset, completed chapters remain inspectable',()=>{
 const old={...freshCampaign(),chapter:3,started:true,solved:['c1-p5','c2-p1','c3-p2'],drafts:{'c1-p5':[1,2,9,1],'c2-p1':['左环'],'c3-p2':['草稿','正本']}};
 const s=restoreCampaign(JSON.stringify(old));assert.deepEqual(s.solved,old.solved);assert.equal(s.drafts['c2-p1'],undefined);assert.equal(s.drafts['c3-p2'],undefined);assert.deepEqual(s.drafts['c1-p5'],old.drafts['c1-p5']);
 for(const id of ['c2-p1','c3-p2'])assert.ok(fieldCorrect(id,fieldViewDraft(id,[],true)));
 assert.equal(validField('c2-p1',[19,99,99,99,99]),false);
});
test('source records appear only after inspecting their actual carrier',()=>{
 const p=CHAPTER_BY_ID(3).puzzles.find(p=>p.id==='c3-p2')!;
 let s=enterChapter(freshCampaign(),3);assert.deepEqual(s.read,[]);
 s={...s,solved:['c3-p1'],bag:['c3-draft'],drafts:{'c3-p2':[...FIELD_PROOF['c3-p2']]}};
 assert.equal(solve(s,p.id).ok,false);assert.deepEqual(s.read,[]);
 const result=solve(applyTool(s,p,'c3-draft'),p.id);assert.equal(result.ok,true);assert.deepEqual(result.state.read,['c3-a']);
 assert.deepEqual(solve(result.state,p.id).state.read,['c3-a']);
});
test('chapter replay and restore keep every other chapter and carry the final originals',()=>{
 const s={...enterChapter(freshCampaign(),6),solved:['c1-p2','c2-p1','c4-p2','c6-p1'],drafts:{'c2-p1':[...FIELD_PROOF['c2-p1']],'c4-p2':[19,61,0]},bag:['c2-hook','c4-mirror','c6-papers','c6-token'],introSeen:[1,2,4,6]};
 const replay=restartChapter(s,4);assert.deepEqual(replay.solved,['c1-p2','c2-p1','c6-p1']);assert.deepEqual(replay.drafts['c2-p1'],s.drafts['c2-p1']);assert.deepEqual(replay.bag,['c2-hook','c6-papers','c6-token']);
 const restored=restoreChapter({...replay,solved:[...replay.solved,'c5-p1']},s,4);assert.deepEqual(restored.solved,['c1-p2','c2-p1','c6-p1','c5-p1','c4-p2']);assert.deepEqual(restored.drafts['c4-p2'],s.drafts['c4-p2']);
 assert.ok(enterChapter(freshCampaign(),6).bag.includes('c6-papers'));assert.ok(enterChapter(freshCampaign(),6).bag.includes('c6-token'));
});
test('register accepts a generous actual stroke across both words, stores it, and rejects taps or unrelated scribbles',()=>{
 const before=[19,1,1,1,0,0];
 for(const pts of [[20,50],[20,0,70,0],[12,50,31,50],[60,50,88,50]])assert.equal(brushStroke(before,pts).draft[4],0);
 const r=brushStroke(before,[8,60,25,53,41,49,60,45,82,40,96,36]);assert.equal(r.draft[4],1);assert.ok(r.draft.length>6);assert.equal(fieldCorrect('c6-p6',r.draft),false);
 const final=fieldMove('c6-p6',r.draft,'chen').draft;assert.equal(fieldCorrect('c6-p6',final),true);assert.deepEqual(restoreCampaign(JSON.stringify({...freshCampaign(),drafts:{'c6-p6':final}})).drafts['c6-p6'],final);
 assert.deepEqual(before,[19,1,1,1,0,0]);assert.equal(brushStroke(fieldInitial('c6-p6'),[8,50,90,50]).draft[4],0);
});

test('lamp experiment distinguishes a severed main line from an isolated release lamp and is reversible',()=>{
 let d=fieldInitial('c2-p5');
 d=fieldMove('c2-p5',d,'test').draft;
 d=fieldMove('c2-p5',d,'main').draft;
 let result=fieldMove('c2-p5',d,'test');
 assert.equal(fieldCorrect('c2-p5',result.draft),false);assert.match(result.line,/都不亮/);
 d=fieldMove('c2-p5',result.draft,'bypass').draft;
 assert.equal(fieldCorrect('c2-p5',fieldMove('c2-p5',d,'test').draft),false,'both lines removed is not a solution');
 d=fieldMove('c2-p5',d,'main').draft;
 const restored=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),2),drafts:{'c2-p5':d}}));
 assert.deepEqual(restored.drafts['c2-p5'],d);
 assert.equal(fieldCorrect('c2-p5',fieldMove('c2-p5',fieldMove('c2-p5',restored.drafts['c2-p5'],'test').draft,'release').draft),true);
});
test('old unfinished lamp experiments reset locally; solved evidence and other drafts survive',()=>{
 const s=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),2),solved:['c1-p5','c2-p1'],drafts:{'c2-p5':[19,1,1,0],'c2-p2':[19,3,0]}}));
 assert.equal(s.drafts['c2-p5'],undefined);assert.deepEqual(s.drafts['c2-p2'],[19,3,0]);assert.deepEqual(s.solved,['c1-p5','c2-p1']);
 const done=fieldViewDraft('c2-p5',[19,1,1,1],true);assert.equal(fieldCorrect('c2-p5',done),true);
});
test('a witness can sign a sourced identification without exhausting optional conversation topics',()=>{
 let d=fieldInitial('c4-p4');assert.equal(fieldMove('c4-p4',d,'witness').draft[2],0);
 d=fieldMove('c4-p4',d,'show',0).draft;assert.equal(fieldMove('c4-p4',d,'witness').draft[2],0,'general recollection alone does not identify the courier');
 d=fieldMove('c4-p4',fieldInitial('c4-p4'),'show',1).draft;
 assert.equal(fieldCorrect('c4-p4',fieldMove('c4-p4',d,'witness').draft),true);
});
test('care, securing the boat, and handing over papers no longer require repeated equivalent clicks',()=>{
 assert.equal(fieldCorrect('c4-p3',fieldMove('c4-p3',fieldInitial('c4-p3'),'bind').draft),false);
 const cloth=fieldMove('c4-p3',fieldInitial('c4-p3'),'cloth').draft;
 assert.equal(fieldCorrect('c4-p3',fieldMove('c4-p3',cloth,'bind').draft),true);
 const tube=fieldMove('c2-p6',fieldInitial('c2-p6'),'tube').draft;
 assert.equal(fieldCorrect('c2-p6',fieldMove('c2-p6',tube,'secure').draft),true);
 assert.equal(fieldCorrect('c6-p5',fieldMove('c6-p5',fieldInitial('c6-p5'),'handover').draft),true);
 let papers=fieldInitial('c6-p4');assert.equal(fieldCorrect('c6-p4',fieldMove('c6-p4',papers,'pack').draft),true);
 for(let i=0;i<3;i++)papers=fieldMove('c6-p4',papers,'place',i).draft;
 assert.equal(fieldCorrect('c6-p4',fieldMove('c6-p4',papers,'pack').draft),true);
});

test('discovery scenes survive interruption and do not replay for old completed saves',()=>{
 const p=CHAPTER_BY_ID(4).puzzles.find(p=>p.id==='c4-p2')!;
 let state=enterChapter(freshCampaign(),4);state={...state,bag:['c4-mirror'],solved:['c4-p1'],drafts:{'c4-p2':[...FIELD_PROOF['c4-p2']]}};
 const complete=solve(applyTool(state,p,'c4-mirror'),p.id);assert.equal(complete.ok,true);assert.equal(complete.state.moment,'c4-p2');
 const resumed=restoreCampaign(JSON.stringify(complete.state));assert.equal(resumed.moment,'c4-p2');
 const watched=finishFieldMoment(resumed);assert.equal(watched.moment,null);assert.ok(watched.solved.includes(p.id));assert.equal(solve(watched,p.id).state.moment,null);
 assert.equal(restoreCampaign(JSON.stringify({...watched,moment:'c6-p2'})).moment,null);
 const old={...watched} as Record<string,unknown>;delete old.moment;assert.equal(restoreCampaign(JSON.stringify(old)).moment,null);
 assert.equal(enterChapter(resumed,5).moment,null);
});

test('optional memories remain available after signing without erasing the identification',()=>{
 let d=fieldMove('c4-p4',fieldInitial('c4-p4'),'show',1).draft;
 d=fieldMove('c4-p4',d,'witness').draft;
 const more=fieldMove('c4-p4',d,'show',0);
 assert.match(more.line,/伏兵/);assert.equal(fieldCorrect('c4-p4',more.draft),true);assert.equal(more.draft[1],3);
});

test('securing the boat need not wait for the courier, while the East Gate will only acknowledge a sourced order',()=>{
 const dock={...enterChapter(freshCampaign(),2),drafts:{'c2-p4':[...FIELD_PROOF['c2-p4']]}};
 assert.equal(solve(dock,'c2-p4').ok,true);
 const tied=fieldMove('c2-p6',fieldInitial('c2-p6'),'secure').draft;
 assert.equal(tied[3],1);
 assert.equal(fieldCorrect('c2-p6',tied),false);
 assert.equal(fieldCorrect('c2-p6',fieldMove('c2-p6',tied,'tube').draft),true);
 const order='c3-p6',lamp='c3-p5';
 const draft=FIELD_PROOF[order];
 const s={...enterChapter(freshCampaign(),3),solved:['c3-p1','c3-p2','c3-p3'],drafts:{[order]:[...draft],[lamp]:[...FIELD_PROOF[lamp]]}};
 assert.equal(fieldActionBlock(lamp,'preview',s.solved),null);
 assert.ok(fieldActionBlock(lamp,'pull',s.solved));
 assert.equal(solve(s,lamp).ok,false);
 const prepared=solve(s,order);assert.equal(prepared.ok,true);
 assert.equal(solve(prepared.state,lamp).ok,true);
});
test('existing v24 lamp orientation carries into the final dispatch if the back-room comparison was unfinished',()=>{
 const ids=['c3-p1','c3-p2','c3-p3','c3-p5'];
 const legacy=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),3),solved:ids,drafts:{'c3-p5':[24,1,1,1,1,1],'c3-p6':FIELD_PROOF['c3-p6']}}));
 assert.ok(legacy.solved.includes('c3-p5'));
 const prepared=solve(legacy,'c3-p6');assert.equal(prepared.ok,true);
 assert.equal(chapterComplete(prepared.state,3),false);
 assert.deepEqual(prepared.state.drafts['c3-p5'],[25,1,0,0]);
 const complete=restoreCampaign(JSON.stringify({...legacy,solved:[...ids,'c3-p6']}));
 assert.equal(chapterComplete(complete,3),true);
});

test('rescue precedes testimony, recovers the missed half-page, survives reload and can finish the chapter',()=>{
 const c=CHAPTER_BY_ID(4),escort=c.puzzles.find(p=>p.id==='c4-p6')!,witness=c.puzzles.find(p=>p.id==='c4-p4')!;
 let s:ReturnType<typeof freshCampaign>={...enterChapter(freshCampaign(),4),scene:2,solved:['c4-p1','c4-p2','c4-p3','c4-p5'],drafts:{[escort.id]:[...FIELD_PROOF[escort.id]]}};
 assert.equal(puzzleReady(s,witness),false);assert.equal(fieldPuzzleVisible(witness.id,s.solved),false);
 const result=solve(s,escort.id);assert.equal(result.ok,true);s=restoreCampaign(JSON.stringify(result.state));
 assert.equal(s.moment,null,'the rescue leads straight to the shelter');assert.ok(s.bag.includes('c4-testimony'));
 assert.equal(fieldSceneLabel(4,2,s.solved,'祠下暗室'),'旧道外避风处');
 assert.equal(fieldPuzzleVisible(witness.id,s.solved),true);assert.equal(fieldPuzzleVisible('c4-p3',s.solved),false);
 assert.equal(chapterComplete(s,4),false,'getting out does not silently skip the witness');
 s=finishFieldMoment(s);s=applyTool(s,witness,'c4-testimony');
 let d=fieldMove(witness.id,fieldInitial(witness.id),'show',1).draft;d=fieldMove(witness.id,d,'witness').draft;
 const signed=solve({...s,drafts:{...s.drafts,[witness.id]:d}},witness.id);assert.equal(signed.ok,true);assert.equal(chapterComplete(signed.state,4),true);
 const old=restoreCampaign(JSON.stringify({...s,solved:['c4-p1','c4-p2','c4-p3','c4-p4','c4-p5'],moment:null}));
 assert.equal(puzzleReady(old,escort),true,'old saves with testimony already signed can still rescue');
 assert.equal(solve({...old,drafts:{[escort.id]:[...FIELD_PROOF[escort.id]]}},escort.id).ok,true);
});

test('East Gate admission is saved, required for new visits, and scoped correctly across replays and legacy progress',()=>{
 const p=CHAPTER_BY_ID(5).puzzles[0],before=enterChapter(freshCampaign(),5);
 assert.equal(eastGateAdmitted(before),false);assert.equal(puzzleReady(before,p),false);assert.equal(takeProp({...before,scene:1},'c5-gear').bag.length,0);
 const admitted=restoreCampaign(JSON.stringify(admitAtEastGate(before)));assert.equal(eastGateAdmitted(admitted),true);
 assert.equal(eastGateAdmitted(restartChapter(admitted,5)),false);
 assert.ok(restartChapter(admitted,4).world.includes('c5-guard-vouched'));
 assert.ok(restartChapter(admitted,1).world.includes('c5-guard-vouched'));
 assert.equal(eastGateAdmitted(restoreChapter(restartChapter(admitted,5),admitted,5)),true);
 assert.equal(eastGateAdmitted({...before,solved:['c5-p1']}),true,'existing partially completed chapter keeps its access');
 assert.equal(admitAtEastGate(enterChapter(freshCampaign(),4)).world.length,0);
});

test('both independent lamp handles must be tested; reconnecting invalidates previous observations',()=>{
 let d=fieldMove('c2-p5',fieldInitial('c2-p5'),'test').draft;
 d=fieldMove('c2-p5',d,'bypass').draft;
 d=fieldMove('c2-p5',d,'release').draft;
 assert.equal(fieldCorrect('c2-p5',d),false,'release-only is not proof of independence');
 d=fieldMove('c2-p5',d,'bypass').draft;assert.equal(d[3],0);
 d=fieldMove('c2-p5',d,'bypass').draft;
 d=fieldMove('c2-p5',d,'test').draft;assert.equal(fieldCorrect('c2-p5',d),false);
 assert.equal(fieldCorrect('c2-p5',fieldMove('c2-p5',d,'release').draft),true);
});
test('the visible signal distinguishes a test flash, wrong direction and acknowledged closure',()=>{
 const id='c3-p5';
 const first=fieldMove(id,fieldInitial(id),'preview').draft;
 assert.deepEqual(first,[25,0,1,0]);
 const aimed=fieldMove(id,first,'aim',1).draft;
 assert.deepEqual(aimed,[25,1,0,0]);
 const preview=fieldMove(id,aimed,'preview').draft;
 assert.equal(preview[3],0,'a test flash never prompts a closure acknowledgment');
 const wrong=fieldMove(id,fieldMove(id,preview,'aim',0).draft,'pull').draft;
 assert.equal(fieldCorrect(id,wrong),false);
 assert.equal(fieldCorrect(id,fieldMove(id,aimed,'pull').draft),true);
});

test('letting go reveals the unsupported door; rescue requires a tested prop and free hands',()=>{
 let d=fieldMove('c4-p6',fieldInitial('c4-p6'),'release').draft;assert.equal(d[3],0);assert.equal(d[4],0);
 d=fieldMove('c4-p6',d,'board',100).draft;
 assert.equal(fieldMove('c4-p6',d,'prop').draft[2],0,'a fallen stone gate must be raised first');
 d=fieldMove('c4-p6',d,'hold').draft;d=fieldMove('c4-p6',d,'prop').draft;
 assert.equal(fieldMove('c4-p6',d,'escort').draft[5],0,'placing a prop alone is untested');
 d=fieldMove('c4-p6',d,'release').draft;assert.equal(d[3],0);assert.equal(d[4],1);
 const saved=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),4),drafts:{'c4-p6':d}}));
 assert.equal(fieldCorrect('c4-p6',fieldMove('c4-p6',saved.drafts['c4-p6'],'escort').draft),true);
});
test('winch test exposes the remaining load before pinning and proves independence after pinning',()=>{
 let d=fieldMove('c5-p4',fieldInitial('c5-p4'),'test').draft;assert.equal(d[3],1);assert.equal(fieldCorrect('c5-p4',d),false);
 d=fieldMove('c5-p4',d,'load',100).draft;d=fieldMove('c5-p4',d,'pin').draft;
 const pinned=[...d];assert.deepEqual(fieldMove('c5-p4',d,'load',30).draft,pinned);
 d=fieldMove('c5-p4',d,'pin').draft;assert.equal(d[2],0,'pin can be withdrawn before completion');
 d=fieldMove('c5-p4',d,'pin').draft;assert.equal(fieldCorrect('c5-p4',fieldMove('c5-p4',d,'test').draft),true);
});
test('last rope encounter permits wrong, recoverable choices while keeping the true signal necessary',()=>{
 let d=fieldMove('c6-p3',fieldInitial('c6-p3'),'hold').draft;
 for(const a of ['main','bypass'])d=fieldMove('c6-p3',d,a).draft;
 assert.equal(fieldCorrect('c6-p3',fieldMove('c6-p3',d,'test').draft),false,'removing both is not a solution');
 d=fieldMove('c6-p3',d,'main').draft;
 assert.equal(fieldCorrect('c6-p3',fieldMove('c6-p3',d,'test').draft),true);
});
test('all main paths are reachable without optional work, and departures do not invent uncollected evidence',()=>{
 for(const chapter of [2,3,4,5,6]){
  let s=admitAtEastGate(enterChapter(freshCampaign(),chapter));
  for(const id of MAIN_PATH[chapter]){
   const p=CHAPTER_BY_ID(chapter).puzzles.find(p=>p.id===id)!;
   for(const t of p.tools){const prop=CHAPTER_BY_ID(chapter).props.find(q=>q.id===t)!;s=takeProp({...s,scene:prop.scene},t);s=applyTool(s,p,t);}
   const result=solve({...s,scene:p.scene,drafts:{...s.drafts,[id]:[...FIELD_PROOF[id]]}},id);
   assert.equal(result.ok,true,id+result.message);s=restoreCampaign(JSON.stringify(finishFieldMoment(result.state)));
  }
  assert.equal(chapterComplete(s,chapter),true);
  const ending=chapterOutro(s,CHAPTER_BY_ID(chapter).outro).join('');
  if(chapter===2){assert.equal(s.bag.includes('c2-pass'),false);assert.doesNotMatch(ending,/底票|湿脚印/);}
  if(chapter===3)assert.match(ending,/废祠见我/);
  if(chapter===5){assert.doesNotMatch(ending,/废路引|废号路引|接管/);assert.ok(fieldActionBlock('c5-p6','place',s.solved,1));
   const fabricated={...s,solved:s.solved.filter(id=>id!=='c5-p6'),drafts:{'c5-p6':[24,7,1]}};
   assert.equal(solve(fabricated,'c5-p6').ok,false);
  }
 }
});
test('v24 locally resets incompatible experiments while preserving completed objects and other partial work',()=>{
 const ids=['c2-p5','c3-p5','c4-p6','c5-p4','c5-p6','c6-p3'];
 for(const id of ids){const chapter=Number(id[1]);const s=restoreCampaign(JSON.stringify({...enterChapter(freshCampaign(),chapter),solved:[id],drafts:{[id]:[19,1,1,1],'c2-p2':[19,3,0]}}));
  assert.ok(s.solved.includes(id));assert.equal(s.drafts[id],undefined);assert.deepEqual(s.drafts['c2-p2'],[19,3,0]);assert.ok(fieldCorrect(id,fieldViewDraft(id,[],true)));
 }
});
