import type {CampaignProgress, Draft} from './campaign-state';
/** Feedback points to a mismatch in the player's comparison, not to an answer. */
export function compareLedger(d:Draft):{ok:boolean;line:string} {
 if(d.length!==2||new Set(d).size!==2)return {ok:false,line:'先在两份原件上各圈一处，再放在一起看。'};
 if(d.includes(0)||d.includes(2))return {ok:false,line:'这条收讫记的是另一批箱。两张记录得先说的是同一批货。'};
 if(d.includes(4)||d.includes(5))return {ok:false,line:'箱号和去向都能对上。它们还不能说明这次交割哪里出了问题。'};
 return d.includes(1)&&d.includes(3)?{ok:true,line:'同一批甲三，初九才起解，初八却已收讫。先后倒过来了。'}:{ok:false,line:'这两处还不能互相核对。保留原件，重新圈看。'};
}
export function caseLead(s:CampaignProgress):string {
 const has=(id:string)=>s.solved.includes('c1-p'+id);
 if(!has('1'))return '库里说甲三已经验收。那只箱里，究竟交进了什么？';
 if(!has('3'))return '箱子是空的。老军匠却说，昨夜搬进来时箱口的封签还在。';
 if(!has('2'))return '箱口锁住也拦不住箱底。账上的“收讫”，又是何时验的？';
 if(!has('4'))return '空箱和收讫日期都不对。箱底那张折损旧签，还留着原来的去向吗？';
 return '箱底能绕开箱口，收讫又早于起解。旧签的去向已经露出——该去那里亲眼认货。';
}
export function caseThreads(s:CampaignProgress){
 const has=(id:string)=>s.solved.includes('c1-p'+id);
 return [
  {target:has('1')?'c1-p3':'c1-p1',title:has('3')?'封住箱口，守不住箱底':has('1')?'箱口的封签，真能说明箱里有货？':'甲三到底交进了什么？',text:has('3')?'你亲手试过，箱盖锁住时，底板仍能退出。这说明可以绕开箱口卸货，尚不能认定当时是谁做的。':has('1')?'先别急着把空箱当成结论。底板边的新擦痕，与上盖横木似乎并不相连。':'箱号与底单相同。先看实物，再听别人怎么解释。'},
  {target:'c1-p2',title:has('2')?'收讫记在起解之前':'交割记录对得上吗？',text:has('2')?'同一批甲三：底单初九起解，簿上初八收讫。两份记录不能同时照实成立。':'把贴身底单摊在簿房原册旁，核对同一批货。'},
  {target:'c1-p4',title:has('4')?'东营下面，另有西渡':'旧签表面，是否就是它原来的字？',text:has('4')?(has('6')?'纸下旧字与车辙的河泥、芦苇互相印证。去西渡确认军器是否还在。':'纸下的旧去向已经露出。可以再查车辙印证，也可以先到那里亲眼认货。'):'旧签来自箱底，纸角有两层。灯光也许能让它开口。'},
  ...(has('4')?[{target:'c1-p5',title:has('5')?'拘令与旧签出自同一印模':'再查一层：旧印似曾相识',text:has('5')?'两处磨损都相合。用印的经手人仍需追查；这一点已记下，随原件带走。':'这枚旧印可以与随身原件继续比看。它关系到谁在用印，不妨留到认回货之后追问。'}]:[])
 ];
}
export function firstEnding(s:CampaignProgress):string[]{
 const extra=[s.solved.includes('c1-p6')?'车辙的河泥与芦苇也指向河边。':'',s.solved.includes('c1-p5')?'拘令与旧签的两处印模磨损也已经核准。':''].filter(Boolean).join('');
 return ['箱口锁着，底板仍能退出；收讫日期又早于起解。“甲三已经验收”的说法，不能就这样信了。','旧签纸下的去向是西渡。'+extra+'你把原件收好，去那里亲眼认货。'];
}
export function firstDeparture(s:CampaignProgress):[string,string][]{
 return [['老军匠','门我给你留着。沿西墙走，别走巡兵的灯下。'],['陆昭',s.solved.includes('c1-p5')?'箱底的改动、提前的收讫和两处印痕，都记下了。先去西渡认货。':'箱底的改动、提前的收讫，都记下了。纸上指着哪里，就去哪里亲眼看。'],['老军匠','认回那批货，再追经手的人。我等你活着回来。']];
}
