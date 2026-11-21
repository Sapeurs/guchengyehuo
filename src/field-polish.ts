import type {Draft} from './campaign-state';
const A=(p:string)=>import.meta.env.BASE_URL+'assets/chapters/'+p;
const part=(label:string,key:string,x:number,y:number,w:number,h:number,extra='')=>`<button class="field-part v21-touch ${extra}" data-field="${key}" aria-label="${label}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"><i></i><span>${label}</span></button>`;
const command=(label:string,key:string)=>`<button class="field-command" data-field="${key}">${label}</button>`;
const rope=(path:string)=>`<path d="${path}" class="v21-rope-shadow"/><path d="${path}" class="v21-rope-body"/><path d="${path}" class="v21-rope-fibres"/>`;

export function ladderSprite(lowered:boolean,cls=''){return `<img class="v21-ladder ${lowered?'lowered':''} ${cls}" src="${A('boarding-ladder-v21.png')}" alt="" draggable="false">`;}
function ladder(d:Draft){return `<div class="v21-artwork v21-dock"><img class="v21-photo" src="${A('c2-dock-close-v21.png')}" alt="木梯悬在船舷的支架上，粗主缆仍系住船">${ladderSprite(!!d[4])}<svg viewBox="0 0 1672 941" preserveAspectRatio="none" class="v21-dock-ropes" aria-hidden="true">${!d[3]?rope(d[2]?'M400 725C650 810 840 710 1120 510':'M400 725L1120 510'):''}${d[1]?rope('M400 725L1205 670L1130 470'):''}${d[2]?'<path d="M1010 475l20 -55q20 -25 30 0l-15 45" class="v21-iron-hook"/>':''}</svg></div>`+part('用备用绳托住梯身','brace',58,60,20,13)+part('用铁钩挑开压着的绳股','slack',59,42,12,15)+part('抽出松开的绳尾','tail',38,66,19,15)+part('把木梯放向船舷','ladder',72,28,9,27);}
function bandage(d:Draft){const state=d[3]?2:d[1]?1:0;return `<div class="v21-artwork v21-care"><div class="v21-care-photo" style="background-position-x:${state*50}%" role="img" aria-label="${state===0?'同袍衣袖上的旧布尾已经松开':state===1?'净布已经覆住手臂，布尾尚未收妥':'布尾已收好，同袍的手慢慢放松'}"></div></div>`+(d[1]?part('沿着布层把布尾收好；可拖动，也可点按','bind',33,35,29,28,'v21-care-grip')+`<p class="v21-object-cue">顺着布层收住松端</p>`:part('用净布覆住松散处','cloth',27,27,30,29));}
export function towers(d:Draft,inline=false,done=false,ready=true){const aim=Number(d[1]),x=30.9+(aim-32)*1.2175,y=38.8-(aim-32)*.2425;return `<div class="v21-artwork v21-towers ${inline?'v26-moving-art':''}">${inline?'':`<img class="v21-photo" src="${A('c6-towers-v21.png')}" alt="近处的号灯与远处两座黑窗城台">`}${ready&&!done?`<svg viewBox="0 0 1000 563" preserveAspectRatio="none" class="v21-signal-beam" aria-hidden="true"><defs><linearGradient id="v21ray" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#ecc474" stop-opacity=".2"/><stop offset="1" stop-color="#ecc474" stop-opacity=".015"/></linearGradient></defs><path d="M530 379L${x*10-10} ${y*5.63}L${x*10+10} ${y*5.63}Z" fill="url(#v21ray)"/><ellipse cx="${x*10}" cy="${y*5.63}" rx="13" ry="9" fill="#e4dab4" opacity=".1"/></svg>`:''}<span class="v21-tower-name east">东台</span><span class="v21-tower-name west">西台</span><i class="v21-window east ${Number(d[2])&1?'lit':''}"></i><i class="v21-window west ${Number(d[2])&2?'lit':''}"></i></div>${done||!ready?'':`<label class="field-rail v21-tower-rail"><span>东台接号，西台收尾</span><input type="range" min="0" max="100" value="${aim}" data-field-range="aim" aria-label="转动灯口"></label><div class="field-local-actions v21-tower-send">${command('开合灯口发号','pulse')}</div>`}`;}

/** Overrides use photographed material and scene-sized interaction, rather than floating diagrams. */
export function polishedField(id:string,d:Draft):string|null {
 if(id==='c2-p1')return ladder(d);
 if(id==='c4-p3')return bandage(d);
 if(id==='c6-p2')return towers(d);
 return null;
}
