/** The crate has real occupancy rules: blocks slide along their own grain. */
export const CRATE_BLOCKS=[
 {name:'红漆主闩',axis:'h',size:2},
 {name:'上竖木',axis:'v',size:2},
 {name:'底横木',axis:'h',size:2},
 {name:'中横木',axis:'h',size:2},
 {name:'右竖木',axis:'v',size:2},
] as const;
export const CRATE_INITIAL=[4,2,12,9,7];
export const CRATE_SOLUTION=[6,10,12,8,11];
export const CRATE_STEPS:[[number,number],...[number,number][]]=[[3,-1],[1,1],[1,1],[0,1],[4,1],[0,1]];
export function crateCells(position:number,index:number){const b=CRATE_BLOCKS[index];return Array.from({length:b.size},(_,i)=>position+i*(b.axis==='h'?1:4));}
export function validCrateDraft(d:(string|number)[]){if(d.length!==5||d.some(v=>!Number.isInteger(v)))return false;const used=new Set<number>();
 for(let i=0;i<5;i++){const v=Number(d[i]),b=CRATE_BLOCKS[i];if(v<0||v>15||b.axis==='h'&&v%4+b.size>4||b.axis==='v'&&Math.floor(v/4)+b.size>4)return false;for(const cell of crateCells(v,i)){if(used.has(cell))return false;used.add(cell);}}return true;
}
export function moveCrate(d:(string|number)[],index:number,direction:number):number[]|null{
 if(!validCrateDraft(d)||!Number.isInteger(index)||index<0||index>=5||![-1,1].includes(direction))return null;
 const next=d.map(Number),old=next[index],axis=CRATE_BLOCKS[index].axis;next[index]+=direction*(axis==='h'?1:4);
 if(axis==='h'&&Math.floor(old/4)!==Math.floor(next[index]/4))return null;return validCrateDraft(next)?next:null;
}
export const validSealDraft=(d:(string|number)[])=>d.length===4&&d.every(Number.isInteger)&&Number(d[0])>=0&&Number(d[0])<3&&Number(d[1])>=0&&Number(d[1])<4&&Number(d[2])>=0&&Number(d[2])<=15&&[0,1].includes(Number(d[3]));
export const sealCorrect=(d:(string|number)[])=>validSealDraft(d)&&d[0]===1&&d[1]===2&&d[2]===9&&d[3]===1;
// The first two fields are retained solely for save compatibility. Only the
// actual old-seal impression remains; marks made on invented alternatives reset.
export function directSealDraft(d:(string|number)[]):number[]{
 if(!validSealDraft(d))return [1,2,0,0];
 return [1,2,Number(d[0])===1?Number(d[2]):0,Number(d[3])];
}
export function sealReviewDraft(overlay=true):number[]{return [1,2,9,overlay?1:0];}
export const STORY_KEYS=['c1-opened','c1-patrol','c1-ink','c1-mentor','c1-departure'];
export const ARTISAN_TOPICS={
 ledger:{question:'簿上为什么提前写了收讫？',lines:[['陆昭','军械还没起解，簿上已经写了收讫。这两份记录，至少有一份不实。'],['老军匠','那几日经手的不止一个人。先收好底单，别急着惊动库吏。']]},
 track:{question:'车辙里的芦苇说明什么？',lines:[['老军匠','城里铺的是石路。这种芦苇连着湿河泥，只会在西边滩上沾到。'],['陆昭','空箱是从河边来的。得沿着这条路，去找真正的货。']]},
 guide:{question:'箱盖像是被什么卡住了。',lines:[['老军匠','外头那根横木先撬起来。小心，里头的舌会弹回来，拿点有份量的东西压住它。'],['陆昭','簿房的案上，有校秤用的铜砝码。'],['老军匠','压住锁舌，横木才能从铁箍里抽出来。别硬拉箱盖。']]},
 crate:{question:'箱口封签还在，箱子怎么会空？',lines:[['陆昭','箱号是甲三。你只见过外面的封签，真见过里面的货么？'],['老军匠','……没有。我只看了箱口。要知道怎么回事，得把箱底也看一遍。'],['陆昭','底板边有新擦痕。把两角垫住，我试一试。']]},
 ink:{question:'见到他的官印，就能定罪？',lines:[['陆昭','拘我的札付和旧签上，是同一枚印。'],['老军匠','同一枚印，只能认出印模。印是谁拿的、为何拿，还得找人问。'],['陆昭','那就先把缺口与断线核准。我要带走的，是物证。']]},
 road:{question:'你为何一直帮我？',lines:[['老军匠','你们出发那天，百户说，回营替我带一包盐。我等了两日。'],['陆昭','他没能回来。'],['老军匠','所以我才不能再看着一个活人，也被写成那两个字。先把这批军械找回来。']]}
} as const;
export const C1_SCENES={
 departure:[['老军匠','门我给你留着。出了这条巷，沿西墙走，别走巡兵的灯下。'],['陆昭','底单、旧签和印痕都在。车的来路，也指向河边。'],['老军匠','到了西渡，先认货，再认人。我要等的，是你活着回来。']],
 opened:[['木闩','咔哒。横木退出铁箍，箱盖沿旧铰链掀起。'],['陆昭','空的……箱里没有军械。衬布下似乎还压着什么。']],
 patrol:[['门外 · 巡兵','库房里怎么还有灯？'],['老军匠','别动。让他们以为是我在收拾工具。'],['门外','脚步沿墙走远，灯影从门缝里退了出去。']],
 ink:[['陆昭','西渡。新签下面，还藏着另一个去向。'],['老军匠','别把那张旧纸剥坏了。纸是证据，纸下的印也是。']]
} as const;
