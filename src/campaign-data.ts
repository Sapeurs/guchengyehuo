import {LATER_CHAPTERS} from './later-chapters.ts';
export type PuzzleKind='bottom'|'order'|'balance'|'dials'|'mosaic'|'route'|'light'|'match'|'network'|'select'|'crate'|'seal'|'translucent'|'trace'|'latch'|'field';
export interface Clue {id:string;title:string;lines:string[];note:string;scene:number}
export interface Prop {id:string;name:string;art:number|'paper'|'key';description:string;scene:number;x:number;y:number;requires?:string[];carried?:boolean}
export interface Puzzle {id:string;title:string;kind:PuzzleKind;scene:number;x:number;y:number;intro:string;instruction:string;requires:string[];tools:string[];clues:string[];hints:string[];result:string;fact:string;config:Record<string,any>}
export interface Chapter {id:number;title:string;time:string;tagline:string;intro:string[];outro:string[];scenes:{name:string;description:string}[];props:Prop[];clues:Clue[];puzzles:Puzzle[]}
const clue=(id:string,title:string,scene:number,lines:string[],note:string):Clue=>({id,title,scene,lines,note});
const prop=(id:string,name:string,art:Prop['art'],scene:number,x:number,y:number,description:string):Prop=>({id,name,art,scene,x,y,description});
function puzzle(id:string,title:string,kind:PuzzleKind,scene:number,x:number,y:number,intro:string,instruction:string,requires:string[],tools:string[],clues:string[],hints:string[],result:string,fact:string,config:Record<string,any>):Puzzle{return {id,title,kind,scene,x,y,intro,instruction,requires,tools,clues,hints,result,fact,config};}

export const CHAPTERS:Chapter[]=[
{id:1,title:'军器库夜查',time:'亥时四刻',tagline:'甲三已验讫。库中留下的，真是你押送的那批货？',intro:['老军匠替你推开库门。库吏白日说过：甲三已交进东营，一切验讫。','你押送的正是甲三。既已交清，归营后为何还要拘你？底单和那道拘令，都贴身收着。'],outro:['你亲手试过：箱口仍锁着，底板却能退出。封签不能证明货还在，收讫日期也早于起解。','旧签被新纸盖住的去向是西渡。先去那里认货，再追经手的人。'],
scenes:[{name:'军器库前院',description:'月光照着甲三号箱。铁箍旁的封绳还很新，泥地上留着车轮印。'},{name:'库房簿房',description:'值房无人，案上摊着收讫簿，灯还温着。'},{name:'封签侧库',description:'工作案上能展开旧封签，旁边立着旧灯架。'}],
props:[prop('c1-pry','松木撬棍',0,0,78,68,'库役留在工具台边的撬棍，前端扁平。'),prop('c1-weight','铜砝码',3,1,39,63.5,'簿房校秤用的铜砝码，拿在手里很沉。'),prop('c1-manifest','甲三押运底单','paper',0,91,58,'从百户遗物中留下的底单。甲字三号，六月初九起解，交东营验收。'),prop('c1-warrant','拘令','paper',0,0,0,'归营时那道拘你的札付。六月十一日，副将赵廷岳签发。你把它折在腰牌后，想留着问个明白。'),prop('c1-scraps','折损的旧封签','paper',0,52,59,'箱底夹着的旧封签，折角粘着两层纸。展开便能看清表面的甲三箱号，不必重新拼字。'),prop('c1-lamp','手提油灯',7,1,19,79,'抽屉中备用的小油灯，可随身提着。')],
clues:[clue('c1-a','押运底单',0,['甲字三号','六月初九日起解','交东营军器库验收'],'百户留下的底单。原件贴身收着，可放在簿房案上核对。'),clue('c1-e','库吏交割簿',1,['甲一初七收','甲三初八收','乙三初十收'],'案上原册中的三笔收讫。箱号、日期都照原样留存。')],
puzzles:[
puzzle('c1-p1','甲三号箱','latch',0,49,56,'横木穿过两只铁箍，右侧有一道窄缝。箱盖被它顶住了。','可以直接触碰箱体，也可以把随身工具放到合适的位置。',[],['c1-pry','c1-weight'],[],['先试试阻住箱盖的是什么。右侧铁箍边有一道窄缝。','撬起横木后，里面的锁舌会回弹。试找能压住它的重物。','用木撬撬起，放铜砝码压舌，把横木向左抽出，再向上抬盖。'],'箱中没有军械。衬布下留着旧签，底板边有擦痕；这是疑点，还不能单凭它断定何时被换走。','验收的箱中没有军械',{initial:[13,0,0,0],answer:[13,100,100,100]}),
puzzle('c1-p2','案上的收讫簿','select',1,48,62,'把押运底单和收讫簿并放在案上。','在两份原件上各圈一处，再并看所圈的记录。',[],['c1-manifest'],['c1-a','c1-e'],['两份原件得先说的是同一批货。','同一批货，起解与收讫的先后能成立吗？','圈底单的“初九日起解”和簿上的“甲三初八收讫”，再并看记录。'],'同一批甲三，初九才起解，初八却已收讫。两份记录不能同时照实成立。','收讫记在起解之前',{options:['甲一·初七收讫','甲三·初九起解','乙三·初十收讫','甲三·初八收讫','甲字三号','交东营'],answer:[1,3]}),
puzzle('c1-p3','箱底的新擦痕','bottom',0,49,68,'盖子搭回去了。老军匠把空箱垫高，底板边有一道新磨亮的长槽。','上盖横木和底槽短销可以分别试动；留意它们各管哪处开口。',['c1-p1'],[],[],['箱口锁住，是否就说明整只箱都打不开？先看擦痕通向哪里。','上面的横木和下面的短销并不相连。试着只动其中一处。','扣回上盖横木，拔出底槽短销，抽出底板，再试抬箱盖。'],'上盖被横木锁住，底板仍能抽走。只验箱口封签，并不能证明军器还在箱内；还需追查是谁、何时动过手。','箱口未开，箱底也能卸货',{initial:[23,0,0,0,0],answer:[23,1,1,100,1],awards:['c1-scraps']}),
puzzle('c1-p4','旧封签的纸背','translucent',2,76,45,'纸边重叠，背面透着隐约的旧墨。','可翻面，也可在灯前移动纸张。',['c1-p1'],['c1-scraps','c1-lamp'],[],['不必撕掉表层。薄纸受光时，会透出下面的墨。','翻到背面，靠近灯的亮处，观察旧墨怎样变化。','背面对光，把纸举到灯焰左上方；旧字清楚时点“辨认旧去向”。'],'灯下露出“西渡”，表面却写着“东营”。去向被覆改过，旧纸上还留着一枚朱印。','东营下面，另有西渡',{target:[1,67,42],reveal:'西渡'}),
puzzle('c1-p5','旧签上的朱印','seal',1,72,44,'新纸下面露出一枚眼熟的旧印。','可以将已有的原件放在旁边，圈出真正相同的痕迹。',['c1-p4'],['c1-warrant'],[],['旧物也能作证。那道拘你的札付，是否也盖了印？','印文相同只能认出样式。试着把原件叠在一起，看磨损有没有同样的位置。','放上拘令，对照原件；在旧签上圈右侧外框的缺口和右下“防”字的裂痕。'],'右侧外框的缺口与“防”字的裂痕都相合。曾用来拘你的印，也出现在覆改过的封签上；但仍需追查实际用印的人。','拘令与旧签出自同一印模',{initial:[1,2,0,0],answer:[1,2,9,1]}),
puzzle('c1-p6','院中的车辙','trace',0,39,81,'轮槽里有些东西，月光下看不清。','提灯移动光照，察看亮处的泥纹与夹带物。',['c1-p1'],['c1-lamp'],[],['把小油灯提低，近处的细节才会显出来。','留意车辙的转弯与轮槽里的草梗。','照亮并察看下方的转弯擦痕，再看上方车辙里的芦苇草梗。'],'车辙从西侧折入，槽里嵌着河滩芦苇。它说明运箱车走过河边；再与旧封签的去向核对。','车辙里的河泥与芦苇',{answer:[3]})]},
...LATER_CHAPTERS
];
export const CHAPTER_BY_ID=(id:number)=>CHAPTERS.find(c=>c.id===id)!;
