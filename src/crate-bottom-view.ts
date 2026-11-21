import type {Draft} from './campaign-state';
const A=(p:string)=>import.meta.env.BASE_URL+'assets/chapters/'+p;
export function bottomBar(locked:boolean){return `<div class="c1-bottom-bar ${locked?'locked':''}" aria-hidden="true"><svg viewBox="37 143 2097 448" preserveAspectRatio="none"><image href="${A('crate-bar-v13.png')}" width="2172" height="724"/></svg></div><svg class="c1-bottom-keepers" viewBox="0 0 1672 941" aria-hidden="true"><defs><clipPath id="bottom-keeper-clip"><path d="M938 273L983 263L1000 298L1006 444L961 458L944 441Z M1268 239L1306 230L1320 251L1324 389L1287 405L1273 389Z"/></clipPath></defs><image href="${A('c1-bottom-closed-v23.png')}" width="1672" height="941" clip-path="url(#bottom-keeper-clip)"/></svg>`;}
export function bottomView(d:Draft,done:boolean){
 const bar=!!d[1],peg=!!d[2],travel=Number(d[3]);
 return `<div class="c1-bottom-scene ${done?'experiment-done':''}" style="--bottom-travel:${travel/100}">
 <img class="c1-bottom-base" src="${A('c1-bottom-closed-v23.png')}" alt="垫起的空箱，箱口与底槽是两处不同结构" draggable="false">
 <img class="c1-bottom-open" src="${A('c1-bottom-open-v23.png')}" alt="底板沿槽退出，上盖仍停在原处" draggable="false">
 ${bottomBar(bar)}
 <button class="c1-bottom-part bottom-bar-control" data-c="world:bottom-bar" aria-label="${bar?'松开':'扣回'}上盖横木" ${done?'disabled':''}><span>${bar?'松开':'扣回'}上盖横木</span></button>
 <button class="c1-bottom-part bottom-peg-control ${peg?'peg-out':''}" data-c="world:bottom-peg" aria-label="${peg?'插回':'拔出'}底槽短销" ${done?'disabled':''}><i></i><span>${peg?'插回':'拔出'}底槽短销</span></button>
 <div class="bottom-drag-hit" data-bottom-drag="true" role="group" aria-label="底板拉环，向左拖动抽出箱底" ${done?'inert':''}></div>
 <button class="c1-bottom-part bottom-lid-control" data-c="world:bottom-lid" aria-label="试抬箱盖" ${done?'disabled':''}><span>试抬箱盖</span></button>
 ${!done?`<label class="bottom-range"><span>顺着木槽抽动底板</span><input type="range" min="0" max="100" step="1" value="${travel}" data-bottom-range aria-label="抽出箱底的距离"></label>`:''}
 ${done?'<div class="bottom-confirmed">箱口未开，箱底已通。</div>':''}
 </div>`;
}
