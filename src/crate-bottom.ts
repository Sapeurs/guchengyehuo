/** A controlled experiment: the upper opening stays locked while the floor moves. */
export type BottomDraft=[23,number,number,number,number]; // upper bar, lower peg, floor travel, observed test
export const BOTTOM_START:BottomDraft=[23,0,0,0,0];
export const BOTTOM_PROOF:BottomDraft=[23,1,1,100,1];
export function validBottom(d:unknown[]):d is BottomDraft {
 return d.length===5&&d[0]===23&&[d[1],d[2],d[4]].every(n=>n===0||n===1)&&typeof d[3]==='number'&&Number.isFinite(d[3])&&d[3]>=0&&d[3]<=100&&(d[3]===0||d[2]===1)&&(!d[4]||(d[1]===1&&d[2]===1&&d[3]>=85));
}
export const bottomCorrect=(d:unknown[])=>validBottom(d)&&d[4]===1;
export function moveBottom(current:unknown[],action:string,value=0):{draft:BottomDraft;line:string;sound:'wood'|'latch'|'cloth'} {
 const d:BottomDraft=validBottom(current)?[...current]:[...BOTTOM_START];
 const out=(line:string,sound:'wood'|'latch'|'cloth'='wood')=>({draft:d,line,sound});
 if(bottomCorrect(d))return out('箱口的横木仍扣着，底下却通了。先把这处改动记住。');
 if(action==='bar'){d[1]=1-d[1];return out(d[1]?'横木扣回上盖。现在箱口打不开。':'横木退出铁箍，上盖又能打开了。','latch');}
 if(action==='peg'){
  if(d[3]>2)return out('底板还伸在外面，销孔没有对齐。可以先把底板推回。');
  d[2]=1-d[2];return out(d[2]?'这枚短销拔出来了。磨亮的槽一直通到箱底。':'短销重新扣进底槽。','latch');
 }
 if(action==='slide'){
  if(!d[2])return out('底板只晃了一下，右侧还有一枚短销咬着。');
  if(!Number.isFinite(value))return out('手沿着底板的木槽移动。');
  d[3]=Math.round(Math.max(0,Math.min(100,value)));
  return out(d[3]>84?(d[1]?'底下已经通了。上盖的横木呢？试着抬一下。':'底下通了，可上盖没有锁住。要知道能不能绕过箱口，得让箱口保持锁住。'):d[3]===0?'底板沿槽推回，箱底重新合拢。':'底板沿着长槽退出，箱壁没有跟着动。');
 }
 if(action==='lid'){
  if(!d[1])return out('上盖能抬起来。箱口也开着，还不能说明货能绕过封住的箱口。');
  if(d[3]<85)return out('横木顶住箱盖。上头打不开，底下那道磨亮的槽却还没有查清。','latch');
  d[3]=100;d[4]=1;return out('盖子还锁着……底下却能卸货。原来，只验箱口封签，根本验不住这只箱。','latch');
 }
 return out('上头的横木和底下的短销，管的是两处不同的开口。');
}
