import {icon} from './icons';

// Small, stable pen movements: no random changes when the page is reopened.
function ink(text:string,seed:number){
  const turns=[-.8,.5,-1.3,.9,-.35,1.15,.1];
  const sizes=[1.02,.96,1.04,.99,1.01,.97,1.03];
  const shifts=[-.045,.025,-.02,.055,0,-.035,.035];
  const shades=[.93,.84,.97,.9,.88,1,.92];
  return `<span class="ink-text">${text}</span>`+[...text].map((c,i)=>{
    const n=(seed+i*3)%turns.length;
    return `<span class="ink-glyph" aria-hidden="true" style="--pen-turn:${turns[n]}deg;--pen-x:${shifts[n]}em;--pen-size:${sizes[n]}em;--pen-alpha:${shades[n]}">${c}</span>`;
  }).join('');
}

/** Fictional camp folio, informed by Ming muster terminology; not a facsimile. */
export function musterView(page:number,tagClean:boolean,known:boolean,reveal:boolean,magnified=false){
  const target=page===1;
  const records=target?[
    ['十四','何应山','何应山','原伍充役','在营'],
    ['十五','周定','周定','随队解运','阵亡'],
    ['十六','陈九成','陈九成','随队解运','未回'],
    ['十七','陆昭','陆昭','随队解运','阵亡'],
    ['十八','许安','许安','原伍充役','在营'],
  ]:[
    ['九','刘靖','刘靖','原伍充役','在营'],
    ['十','冯瑞','冯瑞','随队解运','未回'],
    ['十一','魏福','魏福','原伍充役','在营'],
    ['十二','郑荣','郑荣','随队解运','阵亡'],
    ['十三','许长山','许长山','原伍充役','在营'],
  ];
  return `<div class="muster-viewport ${magnified?'magnified':''}"><svg class="ink-filter-defs" width="0" height="0" aria-hidden="true"><defs><filter id="ledger-ink-v4" x="-5%" y="-5%" width="110%" height="120%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="19" result="paper-grain"/><feComponentTransfer in="paper-grain" result="ink-grain"><feFuncA type="linear" slope=".23" intercept=".77"/></feComponentTransfer><feComposite in="SourceGraphic" in2="ink-grain" operator="in"/></filter></defs></svg><div translate="no" lang="zh-CN" class="muster-spread ${reveal?'identity-reveal':''}">
    <img class="muster-ground" src="${import.meta.env.BASE_URL}assets/crafted/muster-folio-v3.png" alt="纸捻装订的旧册展开，纸上有淡竖界栏" draggable="false">
    <div class="muster-page muster-left" aria-label="册页缘由">
      <div class="muster-frontispiece"><span>${ink('东营',2)}</span><h3 lang="zh-Hant" aria-label="行伍册">${ink('行伍冊',5)}</h3><small>${ink(target?'甲字哨':'乙字哨',9)}</small></div>
      <div class="muster-account"><p>${ink('六月初九日',7)}</p><p>${ink('解运军器中途遇袭',13)}</p><p>${ink('随行诸兵据报附记',4)}</p><p>${ink('待查明另报',12)}</p></div>
      <span class="muster-folio">${ink(target?'十一':'九',2)}</span>
    </div>
    <div class="muster-page muster-right" aria-label="${target?'甲字哨':'乙字哨'}人员条记">
      <div class="muster-entries">${records.map((r,i)=>`<button class="muster-entry ${target&&i===3?'luzhao-record':''}" data-action="ledger-row-${i}" aria-label="第${r[0]}名，${r[2]}，${r[4]==='阵亡'?'附注阵亡':r[4]==='未回'?'附注未回':'附注在营'}"><span class="muster-name">${ink(r[0],i*5+page)}<i></i>${ink(r[1],i*11+3)}</span><span class="muster-detail">${ink(r[3],i*7+2)}</span><span class="muster-annotation ${r[4]==='阵亡'?'loss-note':''}">${r[4]==='阵亡'?'<small>'+ink('初九日',i+9)+'</small>':''}${ink(r[4],i+18)}</span></button>`).join('')}</div>
      <span class="muster-folio">${ink(target?'十二':'十',3)}</span>
    </div>
  </div></div><div class="muster-controls"><button class="text-button" data-action="turn-page">${icon(target?'back':'arrow')}${target?'翻前一叶':'翻后一叶'}</button><button class="text-button" data-action="magnify-ledger" aria-pressed="${magnified}">${icon('eye')}${magnified?'收起放大':'放大细看'}</button><span>${tagClean?'腰牌所记：甲字哨 · 十七 · 陆昭':'纸上墨迹有浓有淡。'}</span></div>${known&&target?'<p class="muster-observation">“阵亡”两字墨色更深，像是后来添上去的。</p>':''}`;
}
