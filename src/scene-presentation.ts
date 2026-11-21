import type {Clue, Prop} from './campaign-data';

const A=(p:string)=>import.meta.env.BASE_URL+'assets/'+p;
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export type Rect=[number,number,number,number];
type Placement={rect:Rect;turn?:number};
type CluePlacement=Placement&{carrier:'paper'|'object'};

// Each prop rests on a surface in its own painting, rather than a shared grid.
export const PROP_PLACEMENTS:Record<string,Placement>={
 'c1-pry':{rect:[74,49,8,9],turn:-20},'c1-weight':{rect:[37,60.7,4,5.6]},'c1-manifest':{rect:[86,54,7,5],turn:5},
 'c2-hook':{rect:[29,77,4,6],turn:-14},'c2-rope':{rect:[18,78,9,7]},'c2-pass':{rect:[45,66,7,6],turn:4},
 'c3-flint':{rect:[19,75,5,5]},'c3-oil':{rect:[73,62,4.5,7]},'c3-draft':{rect:[51,69,7,6],turn:-4},
 'c4-mirror':{rect:[72,76,5,7],turn:18},'c4-bowl':{rect:[16,65,6,6]},'c4-testimony':{rect:[51,78,7,5],turn:3},
 'c5-gear':{rect:[24,73,7,7],turn:12},'c5-oil':{rect:[84,60,4.5,7]},'c5-roster':{rect:[13,74,7,5],turn:-3},
 'c6-shade':{rect:[7,42,8,13],turn:-7},'c6-brush':{rect:[48,70,7,6],turn:-24},'c6-papers':{rect:[19,76,7,5],turn:4}
};
export const CLUE_PLACEMENTS:Record<string,CluePlacement>={
 'c2-a':{carrier:'paper',rect:[64,69,6,5],turn:-4},'c2-b':{carrier:'object',rect:[10,34,22,24]},
 'c2-c':{carrier:'paper',rect:[87,63,5,7],turn:4},'c2-d':{carrier:'paper',rect:[49,73,6,5],turn:5},
 'c2-e':{carrier:'paper',rect:[68,75,6,5],turn:-5},'c2-f':{carrier:'paper',rect:[56,82,6,5],turn:-6},
 'c3-a':{carrier:'paper',rect:[10,63,5,4],turn:5},'c3-b':{carrier:'object',rect:[84,24,15,27]},
 'c3-c':{carrier:'object',rect:[53,61,20,18]},'c3-d':{carrier:'paper',rect:[61,76,6,5],turn:4},
 'c3-e':{carrier:'paper',rect:[52,79,6,5],turn:-4},'c3-f':{carrier:'paper',rect:[11,72,5,4],turn:8},
 'c4-a':{carrier:'object',rect:[39,40,15,27]},'c4-b':{carrier:'object',rect:[86,22,12,38]},
 'c4-c':{carrier:'paper',rect:[20,69,6,5],turn:4},'c4-d':{carrier:'paper',rect:[56,76,6,5],turn:-3},
 'c4-e':{carrier:'object',rect:[17,29,15,21]},'c4-f':{carrier:'object',rect:[81,26,7,24]},
 'c5-a':{carrier:'object',rect:[41,51,18,22]},'c5-b':{carrier:'paper',rect:[74,36,5,6],turn:0},
 'c5-c':{carrier:'paper',rect:[55,66,6,5],turn:5},'c5-d':{carrier:'object',rect:[70,67,13,18]},
 'c5-e':{carrier:'paper',rect:[42,70,6,5],turn:-4},'c5-f':{carrier:'paper',rect:[78,63,6,5],turn:-3},
 'c6-a':{carrier:'paper',rect:[55,70,6,5],turn:4},'c6-b':{carrier:'object',rect:[80,43,14,30]},
 'c6-c':{carrier:'paper',rect:[40,72,6,5],turn:-5},'c6-d':{carrier:'paper',rect:[66,72,6,5],turn:3},
 'c6-e':{carrier:'paper',rect:[59,72,6,5],turn:-3},'c6-f':{carrier:'paper',rect:[40,73,6,5],turn:4}
};

export function sceneAsset(chapter:number,scene:number){
 return `chapters/c${chapter}-s${scene}${['2-1','2-2','4-2','6-0'].includes(`${chapter}-${scene}`)?'-v12':''}.png`;
}
function detailMarks(asset:string){
 if(asset.includes('c4-s0'))return `<g class="camp-stone-engraving" transform="rotate(-2 755 480)" fill="#70766e" font-size="21" font-family="Gucheng Campaign Manuscript,serif" text-anchor="start">${['井阶松一路','殿廊门相连','归路绕过塌墙'].map((line,i)=>`<text x="${800-i*45}" y="385" writing-mode="vertical-rl" letter-spacing="4">${line}</text>`).join('')}</g>`;
 if(asset.includes('c2-s2'))return `<g transform="translate(470 286) rotate(-3)"><path d="M0 0H15V214H0Z" fill="#5f5038" stroke="#a38c60" stroke-width="1"/><path d="${[0,1,2,3,4,5].map(i=>`M1 ${12+i*37}H${i%2?9:13}`).join('')}" fill="none" stroke="#c1ad81" stroke-width="2"/></g>`;
 return '';
}
export function sceneMarks(chapter:number,scene:number){
 const marks=detailMarks(sceneAsset(chapter,scene));
 return marks?`<svg class="camp-scene-marks" viewBox="0 0 1672 941" aria-hidden="true">${marks}</svg>`:'';
}
export function propArt(p:Prop,cls=''){
 if(typeof p.art==='number'){
  // Crop a square atlas cell in image coordinates; never stretch the whole atlas
  // into a hit rectangle (which previously flattened all non-square placements).
  return `<svg class="camp-art ${cls}" viewBox="0 0 362 362" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(p.name)}"><svg width="362" height="362" viewBox="0 0 362 362" style="overflow:hidden"><image href="${A('chapters/tools-atlas.png')}" x="${-(p.art%4)*362}" y="${-Math.floor(p.art/4)*362}" width="1448" height="1086"/></svg></svg>`;
 }
 return `<img class="camp-prop-img ${cls}" src="${A('crafted/'+(p.art==='key'?'bronze-key.png':'folded-document-v2.png'))}" alt="${esc(p.name)}" draggable="false">`;
}
function spot(command:string,label:string,at:Placement,cls:string,body:string){
 const [x,y,w,h]=at.rect;
 // camp-hint 只驱动"这里能点"的呼吸微光；纸片与散落道具自带明显造型，不再叠加。
 const hint=/camp-paper-prop|camp-loose-prop/.test(cls)?'':' camp-hint';
 return `<button class="camp-spot ${cls}${hint}" data-c="${command}" aria-label="${esc(label)}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;--prop-turn:${at.turn||0}deg">${body}<i class="camp-point" aria-hidden="true"></i></button>`;
}
export function propSpot(p:Prop,body=propArt(p)){
 const at=PROP_PLACEMENTS[p.id]||{rect:[p.x-4,p.y-4,8,9] as Rect};
 return spot('take:'+p.id,p.name,at,'camp-loose-prop'+(p.art==='paper'?' camp-flat-paper':''),body);
}
export function clueSpot(q:Clue){
 const at=CLUE_PLACEMENTS[q.id];if(!at)return '';
 return spot('clue:'+q.id,q.title,at,at.carrier==='paper'?'camp-paper-prop camp-flat-paper':'camp-object-clue',at.carrier==='paper'?`<img src="${A('crafted/folded-document-v2.png')}" alt="" draggable="false">`:'');
}
export function sceneDetail(asset:string,rect:Rect,label:string){
 const [x,y,w,h]=rect;
 return `<svg class="camp-scene-detail" viewBox="${x*16.72} ${y*9.41} ${w*16.72} ${h*9.41}" role="img" aria-label="${esc(label)}"><image href="${A(asset)}" width="1672" height="941"/>${detailMarks(asset)}</svg>`;
}
export function clueDetail(q:Clue,chapter:number){
 const at=CLUE_PLACEMENTS[q.id];
 if(!at||at.carrier==='paper')return '';
 const [x,y,w,h]=at.rect;
 return `<div class="camp-object-detail">${sceneDetail(sceneAsset(chapter,q.scene),[Math.max(0,x-4),Math.max(0,y-4),Math.min(100-x+4,w+8),Math.min(100-y+4,h+8)],q.title)}<small>察看原处 · 陆昭记下所见</small></div>`;
}
