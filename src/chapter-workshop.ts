import type {CampaignProgress,Draft} from './campaign-state';
import {rigLamps} from './field-state';
const A=(p:string)=>import.meta.env.BASE_URL+'assets/chapters/'+p;
const num=(d:Draft,i:number)=>Number(d[i]);
const cmd=(t:string,k:string)=>`<button class="field-command" data-field="${k}">${t}</button>`;
const hit=(t:string,k:string,x:number,y:number,w:number,h:number)=>`<button class="field-part v21-touch" data-field="${k}" aria-label="${t}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"><i></i><span>${t}</span></button>`;
const rail=(t:string,k:string,v:number)=>`<label class="field-rail v24-rail"><span>${t}</span><input type="range" min="0" max="100" value="${v}" data-field-range="${k}" aria-label="${t}"></label>`;
const actions=(s:string)=>`<div class="field-local-actions v24-actions">${s}</div>`;
const photo=(p:string,alt:string)=>`<img class="v21-photo" src="${A(p)}" alt="${alt}" draggable="false">`;
const rope=(p:string)=>`<path d="${p}" class="v21-rope-shadow"/><path d="${p}" class="v21-rope-body"/><path d="${p}" class="v21-rope-fibres"/>`;
const art=(s:string,cls='')=>`<div class="v21-artwork v24-artwork ${cls}">${s}</div>`;
export function rig(d:Draft,final:boolean,inline=false,done=false,flash=false){
 const mask=num(d,2),tested=final?!!d[3]:!!d[1],handle=final?0:num(d,4);
 const lamps=tested&&(!done||flash)?rigLamps(mask,handle):[false,false];
 const y=final?64:65+(tested?2:0);
 const main=mask&1?'M358 206Q330 250 337 290':'M358 206V365';
 const cross=mask&2?'M644 206Q623 253 603 266':'M358 255L644 206';
 return art((inline?'':photo('c2-lamp-rig-v24.png','两盏纸灯，各有独立拉索与木柄；一股细绳横接两路'))+`<svg viewBox="0 0 1000 563" preserveAspectRatio="none" class="v21-dock-ropes">${rope(main)}${rope('M644 206V365')}${rope(cross)}<g fill="none" stroke="#b19a68" stroke-width="2.6"><ellipse cx="358" cy="275" rx="4" ry="7"/><ellipse cx="505" cy="230" rx="4" ry="7" transform="rotate(65 505 230)"/></g></svg><i class="v24-lamp ${lamps[0]?'on':''}" style="left:35.8%"></i><i class="v24-lamp ${lamps[1]?'on':''}" style="left:64.4%"></i><i class="v24-grip" style="left:35.8%;top:${y}%"></i><i class="v24-grip" style="left:64.4%;top:${final?64:y}%"></i><span class="v24-label" style="left:35.8%;top:38%">${final?'闭关主灯':'验货灯'}</span><span class="v24-label" style="left:64.4%;top:38%">${final?'对外旁灯':'放行灯'}</span>`,'v24-rig '+(mask&2?'split':'coupled')+(flash?' v25-rig-flash':''))
 +(done?'':hit('解开或接回左侧主索扣','main',32,46,8,12)+hit('解开或接回横接绳扣','bypass',47,37,9,12)
 +(final?actions(cmd(d[1]?'灯架已托住':'托住灯架','hold')+cmd('拉主柄试灯','test')):hit('拉验货木柄','test',32,61,8,12)+hit('拉放行木柄','release',60,61,8,12))
 +(!final&&(!inline||mask===2)?`<div class="v24-checks" aria-live="polite"><span>${num(d,3)&1?'验货可独立亮':'验货尚未单独验证'}</span><span>${num(d,3)&2?'放行可独立亮':'放行尚未单独验证'}</span></div>`:''));
}
/** Sprite atlas is genuine alpha; crops contain no rectangular room fragments. */
export function passageSprite(which:'frame'|'slab'|'prop',cls:string,style=''){
 const box={frame:'70 210 800 410',slab:'1068 38 310 660',prop:'1750 15 120 690'}[which];
 return `<svg class="v24-sprite ${cls}" viewBox="${box}" preserveAspectRatio="none" style="${style}" aria-hidden="true"><image href="${A('c4-passage-sprites-v24.png')}" width="2160" height="720"/></svg>`;
}
export function passage(d:Draft,inline=false){
 const open=!!d[3]||!!d[4];
 const image=(inline?'':photo('c4-passage-close-v24.png','旧道出口，牵绳在左，门下需有能承重的支撑'))+
  `<div class="v24-door-aperture">${passageSprite('slab','v24-stone-door',`transform:translateY(${open?-98:0}%)`)}</div>`+
  passageSprite('frame','v24-trestle',`transform:translateX(${num(d,1)*1.1}%)`)+passageSprite('prop','v24-prop',`opacity:${d[2]?1:0}`);
 return art(image,` ${open?'door-up':'door-down'} ${inline?'v26-moving-art':''}`)
  +rail('把挡路木架推向一旁','board',num(d,1))
  +(inline?hit(d[3]?'松开牵绳试门':'拉住牵绳抬门',d[3]?'release':'hold',30,26,9,47)
     +(!d[2]?hit('把支木楔到门下','prop',67,51,11,23):'')
     +actions(cmd('扶陈九成过门','escort'))
   :actions(cmd(d[3]?'松开牵绳试门':'拉住牵绳抬门',d[3]?'release':'hold')+cmd('楔入门下支木','prop')+cmd('扶陈九成过门','escort')));
}
export function gateBeam(d:Draft){const top=27+num(d,1)*.26-(d[3]===1?3:0),y=(top+4.2)*5.63;
 const slack=d[2]?8:2;
 return `<svg class="v24-hoist-ropes" viewBox="0 0 1000 563" preserveAspectRatio="none" aria-hidden="true">${rope(`M286 105 Q428 84 545 86 Q${545+slack} 206 545 ${y-4} M545 86 Q670 75 799 86 Q${799+slack} 203 799 ${y+3}`)}</svg><svg class="v24-gate-beam ${d[3]===1?'lifts-on-test':''}" viewBox="37 143 2097 448" preserveAspectRatio="none" style="top:${top}%" aria-hidden="true"><image href="${A('crate-bar-v13.png')}" width="2172" height="724"/></svg>`;
}
export function hoist(d:Draft,inline=false,done=false){
 const image=(inline?'':photo('c5-hoist-close-v24.png','绞轮牵住门闩，两只石座可承受它的重量'))+gateBeam(d)
  +`<div class="v24-wheel-aperture"><img class="v24-rotor ${d[3]?'tested':''}" src="${A('c5-hoist-close-v24.png')}" alt=""></div><i class="v24-pin ${d[2]?'inserted':''}"></i>`;
 return art(image,` ${d[3]?'wheel-tested':''} ${inline?'v26-moving-art':''}`)
  +(done?'':rail('缓放门闩负重','load',num(d,1))+hit('插入或拔出制动销','pin',74,50,12,17)
  +(inline?hit('试拉绞轮，看门闩','test',6,33,23,34):actions(cmd('试拉绞轮，看门闩','test'))));
}
function letter(d:Draft){return `<article class="v24-private-letter ${d[2]?'unfolded':''}"><h3>废祠见我</h3>${d[2]?'<p>别走正街。</p><p>若还信我，来废祠。</p><p class="v24-letter-sign">九成</p>':'<div class="v24-fold">旧折压着下半页</div>'}</article>`+actions(cmd(d[2]?'合回旧折':'翻开半页纸','flip')+(d[2]?cmd('读完留下的话','read'):''));}
function evidence(d:Draft,s:CampaignProgress){return `<div class="v24-evidence-pieces">${[['0','断齿','绞关旧槽可试合'],['2','换防调令','缺失的守备书押'],...(s.solved.includes('c5-p3')?[['1','作废路引','另查的甲七废号']]:[])].map(([n,title,line])=>`<button class="v24-evidence-piece ${num(d,1)&(1<<Number(n))?'placed':''}" data-field="place:${n}">${n==='0'?'<svg class="v24-broken-tooth" viewBox="0 0 140 190" aria-hidden="true"><defs><pattern id="v24-toothwood" width="140" height="190" patternUnits="userSpaceOnUse"><image href="'+A('workboard-v12.png')+'" width="140" height="190" preserveAspectRatio="xMidYMid slice"/></pattern></defs><path d="M30 170V64l18 -12 -5 -24 22 11 17 -23 10 29 20 -6v131Z" fill="url(#v24-toothwood)" stroke="#30271a" stroke-width="5"/></svg>':''}<strong>${title}</strong><span>${line}</span><small>${num(d,1)&(1<<Number(n))?'已放在案上':'交到案上'}</small></button>`).join('')}</div>`+actions(cmd('请门军当面接验','handover'));}
export function workshopField(id:string,d:Draft,s:CampaignProgress):string|null{
 if(id==='c2-p5'||id==='c6-p3')return rig(d,id==='c6-p3');
 if(id==='c4-p6')return passage(d);
 if(id==='c5-p4')return hoist(d);
 if(id==='c3-p4')return letter(d);
 if(id==='c5-p6')return evidence(d,s);
 if(id==='c6-p4')return `<div class="v24-paper-bundle ${d[4]?'sealed':''}"><span>${d[4]?'封绳已系牢':'随身原件与留底'}</span><p>起解底单 · 甲三拓痕<br>驿站留底 · 陈九成亲押</p></div>`+actions(cmd('包好带来的原件','pack'));
 return null;
}

export function workshopMoment(id:string){return id==='c2-p5'?`<div class="v24-moment-rig">${rig([24,1,2,3,0],false)}</div>`:'';}
