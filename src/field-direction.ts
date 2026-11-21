/** Short, skippable scenes punctuate discoveries. Progress is saved before they open. */
export interface FieldMoment {image:string;title:string;speaker:string;line:string;after:string;theme:'recognition'|'signal'|'dawn'|'discovery'}
export const FIELD_MOMENTS:Record<string,FieldMoment>={
 'c1-p3':{image:'chapters/c1-bottom-open-v23.png',title:'封签守不住的地方',speaker:'陆昭',line:'箱口还锁着……底下却能把货取走。',after:'你松开手。上盖纹丝未动，抽出的底板停在脚边。封签完整，原来也不能保证货还在。',theme:'discovery'},
 'c2-p5':{image:'chapters/c2-lamp-rig-v24.png',title:'一柄，两盏灯',speaker:'陆昭',line:'原来验货的人只要一拉，放行灯就会跟着亮。',after:'把两柄分别试过，才知道独立放行原先是怎样被绕过的。',theme:'discovery'},
 'c3-p5':{image:'chapters/c3-signal-close-v24.png',title:'收信的人看见了',speaker:'陆昭',line:'原来不是灯不亮，是光根本没送到他眼前。',after:'远处门楼的黑窗回了一下灯。现在补报闭关，才有人能够接到。',theme:'discovery'},
 'c5-p4':{image:'chapters/c5-hoist-close-v24.png',title:'绞盘动了，门没动',speaker:'老军',line:'再有人叫开门，这根绳也带不起来了。',after:'你松开手。门闩压在石座上，试轮以后仍留在原处。',theme:'discovery'},
 'c4-p2':{image:'chapters/c4-witness-v19.png',title:'墙后的人',speaker:'陈九成',line:'……把门带上。外头的人走了吗？',after:'他抬起头。是跟你一同押运的陈九成。',theme:'recognition'},
 'c4-p3':{image:'chapters/c4-witness-treated-v22.png',title:'还活着',speaker:'陈九成',line:'册上……是不是也把你写没了？',after:'他的手终于不再攥着布尾。你在他身边坐下。',theme:'recognition'},
 'c4-p6':{image:'chapters/c4-shelter-v22.png',title:'先出了这道门',speaker:'陈九成',line:'让我坐一会儿……方才有些话，没敢说。',after:'旧道的门撑在身后。你收好半页纸，在避风处陪他坐下。',theme:'recognition'},
 'c6-p2':{image:'chapters/c6-towers-v21.png',title:'远处有人回应',speaker:'',line:'东台的灯先亮了。片刻后，西台也亮起来。',after:'这一次，闭关号确实传到了远处。',theme:'signal'},
 'c6-p6':{image:'chapters/c6-dawn-witness-v19.png',title:'把名字留给天亮',speaker:'陈九成',line:'走吧。回营。',after:'旧注没有撕掉。它下面，留下了两个人生还的见证。',theme:'dawn'}
};
export const isFieldMoment=(id:unknown):id is string=>typeof id==='string'&&Object.hasOwn(FIELD_MOMENTS,id);
