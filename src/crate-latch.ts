/** The opening slice uses the visible latch, rather than a separate block puzzle. */
export type LatchDraft=[13,number,number,number]; // wedge lift, bar withdrawal, lid opening (%)
export type LatchPart='lever'|'bar'|'lid';
export interface LatchTools {pry:boolean;weight:boolean}
export const LATCH_START:LatchDraft=[13,0,0,0];
export const LATCH_OPEN:LatchDraft=[13,100,100,100];
export function validLatch(d:(number|string)[]):d is LatchDraft {
 return d.length===4&&d[0]===13&&d.slice(1).every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=100)&&
  (Number(d[2])===0||Number(d[1])>=80)&&(Number(d[3])===0||Number(d[2])>=98);
}
export function latchComplete(d:(number|string)[]){return validLatch(d)&&d[1]>=80&&d[2]>=98&&d[3]===100;}
export function canWeight(d:(number|string)[]){return validLatch(d)&&d[1]>=80&&d[2]<=3&&d[3]===0;}
export function latchMove(d:LatchDraft,part:LatchPart,value:number,tools:LatchTools):{draft:LatchDraft;blocked:'pry'|'spring'|'bar'|'open'|null}{
 const next:LatchDraft=[...d];
 if(!Number.isFinite(value))return {draft:next,blocked:null};
 const v=Math.round(Math.max(0,Math.min(100,value))*10)/10;
 if(d[3]===100)return {draft:next,blocked:'open'};
 if(part==='lever'){
  if(!tools.pry)return {draft:next,blocked:'pry'};
  next[1]=tools.weight||d[2]>0?100:v;
 }else if(part==='bar'){
  if(!tools.pry||d[1]<80)return {draft:next,blocked:'pry'};
  if(!tools.weight)return {draft:next,blocked:'spring'};
  if(d[3]>0)return {draft:next,blocked:'open'};
  next[2]=v;
 }else{
  if(!tools.pry||!tools.weight||d[2]<98)return {draft:next,blocked:'bar'};
  next[3]=v;
 }
 return {draft:next,blocked:null};
}
