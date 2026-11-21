import type {CampaignProgress} from './campaign-state.ts';
/** Optional discoveries enrich a case without becoming unrelated exit chores. */
export const MAIN_PATH:Record<number,string[]>={
 1:['c1-p1','c1-p3','c1-p2','c1-p4'],
 2:['c2-p1','c2-p3','c2-p6','c2-p5'],
 3:['c3-p1','c3-p2','c3-p6','c3-p3','c3-p5'],
 4:['c4-p1','c4-p2','c4-p3','c4-p5','c4-p6','c4-p4'],
 5:['c5-p1','c5-p4','c5-p2','c5-p6'],
 6:['c6-p1','c6-p2','c6-p3','c6-p4','c6-p5','c6-p6']
};
export function mainComplete(s:Pick<CampaignProgress,'solved'>,chapter:number){return !!MAIN_PATH[chapter]&&MAIN_PATH[chapter].every(id=>s.solved.includes(id));}
export function chapterOutro(s:CampaignProgress,fallback:string[]):string[]{
 const has=(p:number)=>s.solved.includes('c'+s.chapter+'-p'+p);
 if(s.chapter===2)return ['甲三军器仍在船上。你在岸边加了道止索，把船和货留在西渡。'+(has(2)?'石缝里的底票随身收好。':''),'验货与放行原本各有拉索，却被横绳牵到了一起。'+(has(4)?'小门后的湿脚印通向城内。':'')+'船头还在等驿站回文。下一步，去查是谁在发令。'];
 if(s.chapter===3)return ['原始留底要闭关，后来挂上的副本却要迎援。你在烽堠打出两闪。东门回了两下，此刻还来得及闭关。','递送架背板里的半页纸写着“废祠见我”。'+(has(4)?'翻开折口，末笔像陈九成的字。':'')+'带上原始留底，去看看留话的人是否还在。'];
 if(s.chapter===5)return ['绞盘仍能转，门闩却压在石座上。老军亲眼看过试轮，收下断齿和缺失书押的调令。'+(has(3)?'作废路引也一并留验。':''),has(5)?'原班门军守住检验案。老军叫人陪你上楼，对外的迎援灯仍需截断。':'两班门军暂不动门，等守备核令。老军叫人陪你上楼：“先把外头的错号截住。”'];
 return fallback;
}
