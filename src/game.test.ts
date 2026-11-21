import test from 'node:test';
import assert from 'node:assert/strict';
import {act,freshProgress,restoreProgress,SOLUTION,type Action,type Progress} from './game.ts';

const play=(s:Progress,actions:Action[])=>actions.reduce((p,a)=>act(p,a).state,s);
const identify:Action[]=[{type:'TAKE_TAG'},{type:'TAKE_CLOTH'},{type:'WET_CLOTH'},{type:'CLEAN_TAG'},{type:'IDENTIFY'}];
const solve:Action[]=[...SOLUTION.map((weapon,index)=>({type:'PLACE',weapon,index} as Action)),{type:'OPEN_BOX'},{type:'TAKE_REWARDS'}];
test('完整试玩：清理身份、解匣、收物、到门口完成',()=>{
 const s=play(freshProgress(),[{type:'START'},...identify,{type:'READ_A'},{type:'READ_B'},...solve,{type:'COMPLETE'}]);
 assert.equal(s.completed,true);
 assert.deepEqual(new Set(s.items),new Set(['tag','wetcloth','key','manifest','order']));
});
test('允许先解暗匣，但完成试玩必须核实身份',()=>{
 let s=play(freshProgress(),solve);
 assert.equal(act(s,{type:'COMPLETE'}).ok,false);
 s=play(s,[...identify,{type:'COMPLETE'}]);
 assert.equal(s.completed,true);
});
test('清理腰牌需要实际获得湿布，乱用道具不改变存档',()=>{
 const s=play(freshProgress(),[{type:'TAKE_TAG'},{type:'TAKE_CLOTH'}]);
 const snapshot=JSON.stringify(s),result=act(s,{type:'CLEAN_TAG'});
 assert.equal(result.ok,false);assert.equal(JSON.stringify(result.state),snapshot);
 assert.equal(JSON.stringify(s),snapshot);
});
test('错误排列可重试，木牌和已收集物品均不丢失',()=>{
 let s=play(freshProgress(),[{type:'TAKE_TAG'},...[...SOLUTION].reverse().map((weapon,index)=>({type:'PLACE',weapon,index} as Action))]);
 assert.equal(act(s,{type:'OPEN_BOX'}).ok,false);
 assert.equal(s.items.includes('tag'),true);
 s=play(s,[{type:'RESET_SLOTS'},...solve]);
 assert.equal(s.boxSolved,true);assert.equal(s.items.includes('key'),true);
});
test('交换已有木牌时保持唯一，插位状态可在中途恢复',()=>{
 const s=play(freshProgress(),[{type:'PLACE',index:0,weapon:'盾'},{type:'PLACE',index:1,weapon:'戈'},{type:'PLACE',index:0,weapon:'戈'}]);
 assert.deepEqual(s.slots,['戈','盾',null,null]);
 assert.deepEqual(restoreProgress(JSON.stringify(s)),s);
});
test('在取得湿布、读完一条线索后刷新仍可继续',()=>{
 let s=play(freshProgress(),[{type:'START'},{type:'TAKE_TAG'},{type:'TAKE_CLOTH'},{type:'WET_CLOTH'},{type:'READ_A'}]);
 s=restoreProgress(JSON.stringify(s));
 assert.equal(s.clueA,true);assert.equal(s.items.includes('wetcloth'),true);
 s=play(s,[{type:'CLEAN_TAG'},{type:'IDENTIFY'},...solve,{type:'COMPLETE'}]);
 assert.equal(s.completed,true);
});
test('损坏的存档安全回到初始状态',()=>{
 for(const raw of ['{broken','null','{"version":9}','{"version":1,"items":[],"slots":null}']){
   assert.deepEqual(restoreProgress(raw),freshProgress());
 }
});
test('重复拾取与开匣不复制关键物品',()=>{
 const s=play(freshProgress(),[...identify,...solve,{type:'TAKE_TAG'},{type:'TAKE_CLOTH'},{type:'TAKE_REWARDS'},{type:'OPEN_BOX'}]);
 assert.equal(s.items.filter(x=>x==='key').length,1);
 assert.equal(s.items.includes('cloth'),false);
 assert.equal(s.items.includes('wetcloth'),true);
});
test('匣中分次取物：只拿库钥不能遗下百户的军令',()=>{
 let s=play(freshProgress(),[...identify,...SOLUTION.map((weapon,index)=>({type:'PLACE',weapon,index} as Action)),{type:'OPEN_BOX'},{type:'TAKE_KEY'}]);
 assert.equal(act(s,{type:'COMPLETE'}).ok,false);
 s=restoreProgress(JSON.stringify(s));
 assert.equal(s.items.includes('key'),true);assert.equal(s.items.includes('order'),false);
 s=play(s,[{type:'TAKE_PAPERS'},{type:'TAKE_PAPERS'},{type:'COMPLETE'}]);
 assert.equal(s.completed,true);assert.equal(s.items.filter(i=>i==='order').length,1);
});
test('剧情标记保持在刷新后；旧版存档继续原有调查',()=>{
 const s=play(freshProgress(),[{type:'START'},{type:'MARK_INTRO'},...identify,{type:'MARK_SEARCH'}]);
 assert.deepEqual(restoreProgress(JSON.stringify(s)),s);
 const old=JSON.parse(JSON.stringify(s));delete old.introSeen;delete old.searchSeen;
 const restored=restoreProgress(JSON.stringify(old));
 assert.equal(restored.identityKnown,true);assert.equal(restored.introSeen,true);assert.equal(restored.searchSeen,false);
 assert.equal(act(freshProgress(),{type:'MARK_SEARCH'}).ok,false);
});
