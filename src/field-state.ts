/** Chapter 2–6 object state. Per-object format markers reject incompatible old drafts. */
export type FieldDraft=number[];
export type FieldSound='cloth'|'paper'|'wood'|'latch'|'water'|'step'|'knock'|'reveal';
export interface FieldChange {draft:FieldDraft;line:string;sound:FieldSound}
export const FIELD_PROOF:Record<string,FieldDraft>={
 'c2-p1':[19,1,1,1,1],'c2-p2':[19,3,1],'c2-p3':[25,1,1],'c2-p4':[19,1,1,1],'c2-p5':[24,1,2,3,0],'c2-p6':[19,1,1,1],
 'c3-p1':[19,1,1,1,1],'c3-p2':[19,2,1,1],'c3-p3':[19,2,1,1],'c3-p4':[19,2,1,1],'c3-p5':[25,1,1,1],'c3-p6':[19,3,1,1],
 'c4-p1':[19,1,1,1],'c4-p2':[19,67,1],'c4-p3':[19,1,2,1],'c4-p4':[19,7,1],'c4-p5':[19,1,1,100,1],'c4-p6':[24,100,1,0,1,1],
 'c5-p1':[19,1,1,1],'c5-p2':[19,1,1,1],'c5-p3':[19,1,3,1],'c5-p4':[24,100,1,2],'c5-p5':[19,1,1,1,1],'c5-p6':[24,5,1],
 'c6-p1':[19,100,1,1],'c6-p2':[19,72,3],'c6-p3':[24,1,2,1],'c6-p4':[19,7,1,1,1],'c6-p5':[19,1,1,1],'c6-p6':[19,1,1,1,1,1]
};
export function fieldInitial(id:string):FieldDraft {const proof=FIELD_PROOF[id];if(!proof)return [];const d:FieldDraft=proof.map((v,i)=>i===0?v:0);if(id==='c2-p2')d[1]=5;if(id==='c4-p6')d[3]=1;return d;}
const FIELD_MAX:Record<string,number[]>={
 'c2-p5':[24,1,3,3,1],'c4-p6':[24,100,1,1,1,1],'c5-p6':[24,7,1],'c6-p3':[24,1,3,1],'c2-p2':[19,5,1],
 'c3-p2':[19,3,1,1],'c3-p3':[19,3,1,1],'c3-p4':[19,4,1,1],'c3-p6':[19,15,1,1],
 'c4-p2':[19,100,1],'c4-p5':[19,1,1,100,1],'c5-p3':[19,1,15,1],
 'c6-p2':[19,100,3]
};
export function validField(id:string,d:unknown[]):d is FieldDraft {const shape=FIELD_PROOF[id];return !!shape&&d[0]===shape[0]&&(d.length===shape.length||id==='c6-p6'&&d.length>=6&&d.length<=22)&&d.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100)&&d.slice(0,shape.length).every((v,i)=>i===0||Number.isInteger(v)&&Number(v)<=(FIELD_MAX[id]||shape)[i]);}
export function fieldCorrect(id:string,d:unknown[]):boolean {if(!validField(id,d))return false;const p=FIELD_PROOF[id];return p.every((v,i)=>id==='c4-p4'&&i===1?!!(Number(d[i])&2):id==='c4-p2'&&i===1?Math.abs(d[i]-67)<=9:id==='c6-p2'&&i===1||id==='c2-p5'&&i===4?true:id==='c5-p6'&&i===1?(Number(d[i])&5)===5:d[i]===v);}
export function migrateFieldDraft(id: string, draft: unknown[]): unknown[] {
 if(id==='c3-p5'&&draft.length===6&&draft[0]===24&&(draft[3]===0||draft[3]===1)){
  return [25,draft[3],0,0];
 }
 return draft;
}
export function fieldViewDraft(id:string,d:unknown[],done:boolean):FieldDraft {return done?(fieldCorrect(id,d)?[...d] as FieldDraft:[...FIELD_PROOF[id]]):validField(id,d)?[...d]:fieldInitial(id);}
export function fieldMove(id:string,current:unknown[],action:string,value=0):FieldChange {
 const d=validField(id,current)?[...current]:fieldInitial(id),out=(line='',sound:FieldSound='wood')=>({draft:d,line,sound});
 const n=Math.round(Math.max(0,Math.min(100,Number.isFinite(value)?value:0))),set=(i:number,v=1)=>{d[i]=v;};
 if(fieldCorrect(id,d)&&!(id==='c4-p4'&&action==='show'))return out('这件物证已经核过。可以继续察看原处。','cloth');
 switch(id){
 case 'c2-p1':
  if(action==='brace'){set(1);return out('托绳吃住梯身，原先绷紧的压绳松出了一点。');}
  if(action==='slack'){if(!d[1])return out('梯子还压着这股绳，越挑越紧。先让梯身有个支撑。');set(2);return out('铁钩把压住的一股挑开，活扣露出来了。');}
  if(action==='tail'){if(!d[2])return out('绳尾被上面的绳股压住，抽不动。');set(3);return out('活扣退出了。主缆仍系着，船不会漂走。','cloth');}
  if(action==='ladder'){if(!d[3])return out('木梯被绳扣吊住了。');set(4);return out('木梯沿船边放下，底舱入口露出来。','wood');}break;
 case 'c2-p2':
  if(action==='depth'){set(1,Math.min(5,n));return out('','water');}
  if(action==='probe'){if(d[1]!==3)return out(d[1]>3?'钩尖只搅起水下的泥。退水露出的缝在更高一点。':'钩尖碰到了干石，石缝在现水线边。','water');set(2);return out('钩住了油布包里的底票，水痕正好留在戌时的旧线下。','paper');}break;
 case 'c2-p3':
  if(action==='sack')return out('隔着袋面一捏，盐粒沙沙作响。','cloth');
  if(action==='basket')return out('揭开篾盖，里头只有空麻袋。','cloth');
  if(action==='knock'){set(1);return out('木箱里碰了一声，是铁。绳下压着你熟悉的甲三烙印。','knock');}
  if(action==='open-crate'){set(1);set(2);return out('箱盖掀起，里面是认得出的军器。盐袋摆在外头，只是为了遮眼。','latch');}
  break;
 case 'c2-p4':
  if(action==='board'){set(1);return out('遮在石阶后的木板被挪开，门销在里面。');}
  if(action==='bolt'){if(!d[1])return out('木板挡住了门销。');set(2);return out('门销的磨痕在内侧。有人从城里反复开过这道门。','latch');}
  if(action==='door'){if(!d[2])return out('门还被内销扣着。');set(3);return out('门后的小巷通向驿站。湿脚印朝城内延去。','step');}break;
 case 'c2-p5':
  if(action==='test'||action==='release'){
   const right=action==='release';set(4,right?1:0);set(1);
   const mask=d[2],lights=rigLamps(mask,right?1:0);
   if(mask===2)d[3]|=right?2:1;
   return out(lights[0]&&lights[1]?'只拉了一个柄，两盏灯却一起亮了。放行根本没有经过另一次查验。':!lights[0]&&!lights[1]?'拉到底，两盏灯都不亮。主索也断了，不能这样留着。':right?'这次只有放行灯亮。再验另一柄，才知道两路是否真的分开。':'这次只有验货灯亮。另一个柄能否单独放行？','latch');
  }
  if(action==='bypass'||action==='main'){
   if(!d[1])return out('两股绳叠在一起。先试拉一个木柄，看灯怎样跟动。');
   d[2]^=action==='main'?1:2;set(3,0);
   return out(action==='main'?(d[2]&1?'左侧索扣解下，验货主索垂了下来。':'左侧主索扣回原位。'):(d[2]&2?'横接绳扣解下。现在分别试试两个木柄。':'横接绳扣回原位。'),'cloth');
  }
break;
 case 'c2-p6':
  if(action==='secure'){set(2);set(3);return out('止索在岸边绕过桩头。这下光凭船上的旧活扣，已经放不开船。','cloth');}
  if(action==='tube'){set(1);return out('“回文到后开缆”。筒口有驿站的递送刻记，这条船还在等他们发话。','paper');}
  break;
 case 'c3-p1':
  if(action==='upper'){set(1,1-d[1]);return out('上层鞍带松开了。','cloth');}
  if(action==='lower'){if(!d[1])return out('下层带被上带压住，拉不出来。');set(2,1-d[2]);return out('第二条带从鞍垫下退出。','cloth');}
  if(action==='saddle'){if(!d[1]||!d[2])return out('鞍垫还被扣带压着。');set(3);return out('湿鞍托起，缝里的纸角露了出来。');}
  if(action==='lining'){if(!d[3])return out('夹层压在鞍垫下面。');set(4);return out('里面只有被撕开的封套留底，正文已经不在。','paper');}break;
 case 'c3-p2':
  if(action==='clip'){set(1,n%4);return out('封套的断边落到了这个夹口下。','paper');}
  if(action==='fit'){if(d[1]!==2)return out('纸边与夹背的残角接不上。看看哪一处还有同样的撕口。','paper');set(2);return out('断边接上了。夹背的纸角通进了背板缝。','paper');}
  if(action==='back'){if(!d[2])return out('先弄清纸角从哪处夹口伸出来，不能把整架拆散。');set(3);return out('薄背板抽开，里面是闭关留底，旁边夹着半页纸：“废祠见我”。迎援副本还挂在架前。','wood');}break;
 case 'c3-p3':
  if(action==='light'){set(1,2);set(2);set(3);return out('灯稳稳亮起，光却落在河面上。东门仍在黑暗里。','latch');}
  if(action==='wick'){set(1,Math.min(3,n));return out('灯芯在油口里升降。','cloth');}
  if(action==='spark'){if(d[1]!==2)return out(d[1]<2?'灯芯太低，只闪了一下火星。':'灯芯露得太长，烟遮住了罩里的痕迹。','latch');set(2);return out('灯芯吸住灯油，火光稳住了。','latch');}
  if(action==='cover'){if(!d[2])return out('罩里的痕迹在暗处看不清。');set(3);return out('检修罩打开，转向架的磨痕朝着城内，光却照向河面。','paper');}break;
 case 'c3-p4':
  if(action==='window'){set(1,Math.min(4,n));return out('竹夹的开窗掠过不同字列。','paper');}
  if(action==='flip'){set(1,2);set(2,1-d[2]);return out(d[2]?'半页纸翻开，折口下面还有几行字。':'纸页沿旧折合回。','paper');}
  if(action==='read'){if(d[1]!==2||d[2]!==1)return out('折口还盖着字，先把纸翻开。','paper');set(3);return out('“别走正街。若还信我，来废祠。”末笔像陈九成。留话的人并非要你猜字，而是怕这封信被人看见。','paper');}break;
 case 'c3-p5':
  if(action==='aim' && n<=1){
   set(1,n);set(2,0);set(3,0);
   return out(n?'灯架转向城内。左边的东门楼对着灯口。':'灯口转向河面。','cloth');
  }
  if(action==='preview' || action==='pull'){
   set(2);set(3,action==='pull'&&d[1]===1?1:0);
   if(d[3])return out('两束闭关闪光越过城墙。片刻后，东门回了两下。','reveal');
   return out(d[1]?'光已照到门楼。短试还没有打出闭关号。':'光掠过河面。东门在另一边，什么也看不见。','latch');
  }
  break;
 case 'c3-p6':
  if(action==='mark'&&n<4){d[1]^=1<<n;return out('在原件上圈下这一处。','paper');}
  if(action==='compare'){if(d[1]!==3)return out('要核的是两份文书真正相反的命令，不是纸张新旧。','paper');set(2);return out('原来不是东门没收到信。有人把“不可开”，换成了“子时迎援”。','paper');}
  if(action==='prepare'){if(!d[2])return out('先核清原令，才能知道该发什么号。');set(3);return out('两份原件已经收好。闭关号是两闪，去烽堠把它送给东门。','paper');}break;
 case 'c4-p1':
  if(action==='tiles'){set(1);return out('碎瓦下露出新泥，拖痕向祭台侧面延去。');}
  if(action==='mat'){if(!d[1])return out('先看看脚下，别把新泥痕踩乱。');set(2);return out('草席拨开，拖痕停在一线墙缝前。','cloth');}
  if(action==='listen'){if(!d[2])return out('风从殿门灌进来，声音的来处还不清楚。');set(3);return out('墙后有人轻咳，又敲了两下。这里不是一座空祠。','knock');}break;
 case 'c4-p2':
  if(action==='angle'){set(1,n);return out('月光沿墙面慢慢扫过。','cloth');}
  if(action==='catch'){if(Math.abs(d[1]-67)>9)return out('光还没有落进那道窄缝，铜扣在暗处。');set(2);return out('光照出藏在墙缝里的铜扣。石板退开，里面有人。','latch');}break;
 case 'c4-p3':
  if(action==='bind'){if(!d[1])return out('先取出净布。','cloth');set(2,2);set(3);return out('布尾收进上一层，松散处终于搭住。他慢慢松开了握紧的手。','cloth');}
  if(action==='cloth'){set(1);return out('布包展开，陈九成把受伤的手臂抬向你。','cloth');}
  if(action==='wrap'){if(!d[1])return out('净布还裹在布包里。','cloth');set(2,Math.min(2,d[2]+1));return out(d[2]===1?'先把松开的布尾绕过来。':'布尾搭在上一层上，终于不再滑落。','cloth');}
  if(action==='press'){if(d[2]!==2)return out('布尾还没搭住，松手又会散开。','cloth');set(3);return out('陈九成的手不再发抖。他认出了你：“陆昭……你也活着。”','cloth');}break;
 case 'c4-p4':
  if(action==='show'&&n<3){d[1]|=1<<n;return out(['“倒灯先挂起，车刚转过坡，伏兵才冲出来。那不是事后的求援号。”','“逃出伏击后我去驿站求援。沈鹤持这样的札付取走封好的回文；见到我，又叫人追。”','“我逃进废祠，托驿卒留那四个字。不是死人留话，是我在等还能相信的人。”'][n],'paper');}
  if(action==='witness'){if(!(d[1]&2))return out('“劫车的人我没看清。但后来在驿站，我认出了一个人。”把与取信有关的原件拿给他看看。','paper');set(2);return out('陈九成把亲见的事留下签押：“我能认出沈鹤。别把猜的写成我看见的。”','paper');}break;
 case 'c4-p5':
  if(action==='stone'){set(1);return out('卡在滑轮里的碎石拨掉了。');}
  if(action==='pawl'){if(!d[1])return out('轮槽还被碎石堵着，棘爪压不进去。');set(2);return out('旧棘爪勉强吃住绳轮，齿口已经磨薄，只能暂挂牵绳。','latch');}
  if(action==='rope'){if(!d[2])return out('一松手配重就落回去，先稳住绳轮。');set(3,n);return out('井边配重升起，旧道尽头传来石门摩擦声。');}
  if(action==='door'){if(d[3]<85)return out('石门还没有退开到能扶人通过。');set(3,100);set(4);return out('旧道出口打开了，井边暂挂着牵绳，旧齿仍在打滑；门下还得有实支。');}break;
 case 'c4-p6':
  if(action==='board'){if(d[2])return out('支木已经承重，先别再动门下的木架。');set(1,n);return out('挡路木架沿地面挪开，门下露出空处。');}
  if(action==='hold'){set(3);set(4,0);return out('牵绳重新吃力，石门抬起。你有一只手还离不开它。');}
  if(action==='prop'){if(d[1]<85)return out('木架还占着门下的位置。');if(!d[3])return out('门已经回落。先拉住牵绳，把门重新抬起。');set(1,100);set(2);set(4,0);return out('支木顶进门底。松开牵绳试试，能不能腾出两只手？');}
  if(action==='release'){set(3,0);set(4,d[2]?1:0);return out(d[2]?'你松开手。石门压在支木上，没有回落；现在两只手都能扶住他。':'一松开，石门就向下滑。你及时退回。若要扶他过去，不能一直用手拉着这股绳。');}
  if(action==='escort'){if(!d[4]||!d[2])return out('先试着松开牵绳。扶着他时，两只手都要空出来。');set(5);return out('你扶陈九成跨过门槛。支木承着门，两人一起到了旧道外的避风处。','step');}
break;
 case 'c5-p1':
  if(action==='wedge'){set(1);return out('承重楔吃住木轮，绞绳暂时停了。');}
  if(action==='oil'){if(!d[1])return out('木轮还在受力转动，手伸不到锈轴上。');set(2);return out('细油口把锈轴松开，缺齿槽露了出来。','water');}
  if(action==='tooth'){if(!d[2])return out(d[1]?'轴还卡着，木齿进不了槽。':'转轮把木齿顶回来，先承住重量。');set(3);return out('备用木齿落入旧槽。临时楔撑不了一夜，还得把门闩负重卸到石座上。','latch');}break;
 case 'c5-p2':
  if(action==='flip'){set(1);return out('旧班牌背面留着守备的缺笔书押。','paper');}
  if(action==='place'){if(!d[1])return out('正面只有班号，凭它还不能核准这张调令。','paper');set(2);return out('新调令的落款处只有一枚官印，原先应有的守备书押空着。','paper');}
  if(action==='compare'){if(!d[2])return out('把旧班牌与新调令并放，再核验落款。','paper');set(3);return out('新班门军盯着空白处：“真要开错了门，咱们都得掉脑袋。”老军按住纸：“那就先别开。查路引。”','paper');}break;
 case 'c5-p3':
  if(action==='reference'){set(1);return out('底档的甲七批号已经划销。今夜路引应留守备书押。','paper');}
  if(action==='mark'&&n<4){d[2]^=1<<n;return out('在路引原件圈下这一处。','paper');}
  if(action==='verify'){if(!d[1])return out('先翻开底档，核对能查证的规矩。','paper');if(d[2]!==3)return out('纸新、折角都不能说明路引无效。需要核准批号与应有落款。','paper');set(3);return out('老军把销号那页翻给新班看：“甲七早废了。人留下，等守备来问。”','paper');}break;
 case 'c5-p4':
  if(action==='load'){if(d[2])return out('销已承住负重，先拔销才能再调。');set(1,n);set(3,0);return out('门闩沿绞索缓缓落向两只石座。');}
  if(action==='pin'){if(d[2]){set(2,0);set(3,0);return out('制动销退出。门闩又只靠绞索牵着。','latch');}if(d[1]<85)return out('门闩还悬着，销孔没有落到石座上。');set(1,100);set(2);set(3,0);return out('销穿过石座与门闩，先试轮，别急着下结论。','latch');}
  if(action==='test'){set(3,d[2]&&d[1]===100?2:1);return out(d[3]===2?'木轮转了，门闩却仍压在石座上。开门的绞索已经带不动它。':'试轮时，门闩也跟着抬起一点。临时楔只能止住眼下的转动，挡不住下一道开门令。');}
break;
 case 'c5-p5':
  if(action==='water'){set(1,1-d[1]);return out(d[1]?'水沟栅扣住，底下不能再通人。':'水沟栅重新抬起。','latch');}
  if(action==='side'){set(2,1-d[2]);return out(d[2]?'侧栅落下。':'侧栅打开，内街的人能通过。','latch');}
  if(action==='friends'){if(d[2])return out('原班门军被侧栅挡在外面。先把栅抬起来。');if(!d[1])return out('水沟还通着，先别让来人借暗处脱身。');set(3);return out('老军带人进来，朝你点头：“现在落侧栅。外头的岗照守，别起冲突。”','step');}
  if(action==='ladder'){if(!d[3]||!d[2])return out('侧栅未合、接管的人未到，不能先把退路封死。');set(4);return out('你照老军的吩咐扣好横杆。他站在案前，两班人都没有拔刀。','latch');}break;
 case 'c5-p6':
  if(action==='place'&&n<3){d[1]|=1<<n;return out(['断齿放在案上，缺口与绞关旧槽相合。','作废路引放入留验格。','未获书押的调令与旧班牌并放，守军开始复核。'][n],'paper');}
  if(action==='handover'){if((d[1]&5)!==5)return out('断齿能当场试合，调令能当面对照；先把这两件交给门军。','paper');set(2);return out('老军当面核过原物，叫一名门军陪你上楼：“先截错号。你身上的札付，天亮跟我一起说清。”','step');}break;
 case 'c6-p1':
  if(action==='cover'){set(1,n);return out('对外的光带被罩子一点点截住。','cloth');}
  if(action==='signal'){if(d[1]<85)return out('对外的迎援光还漏着，北台分不清你送的是什么号。');set(1,100);set(2);return out('闭关号送向北台。远处那扇黑窗，开始有了回应。','latch');}
  if(action==='reply'){if(!d[2])return out('北台还没有收到你的信号。');set(3);return out('北台回灯了。远处沿墙移动的火点停住，等下一道确认。','reveal');}break;
 case 'c6-p2':
  if(action==='aim'){set(1,n);return out('遮光口转动，光带扫过城台的窗口。','cloth');}
  if(action==='pulse'){if(Math.abs(d[1]-32)<=9){d[2]|=1;return out('东台回灯。它把闭关号再送向西台。','latch');}if(Math.abs(d[1]-72)<=9){if(!(d[2]&1))return out('西台仍暗着，它在等东台的接应。');d[2]|=2;return out('西台也回灯了。三处城台都已看见闭关号。','reveal');}return out('光落在墙面，窗口还没有接到。','latch');}break;
 case 'c6-p3':
  if(action==='hold'){set(1);return out('撑杆托住灯架，索扣不再承着全部重量。');}
  if(action==='main'||action==='bypass'){if(!d[1])return out('索扣仍在受力，先托住灯架。');d[2]^=action==='main'?1:2;set(3,0);return out(action==='main'?(d[2]&1?'闭关主索解下了。':'闭关主索接回原槽。'):(d[2]&2?'对外旁索解下。试拉主柄，看看还留下哪盏灯。':'对外旁索接回。'),'latch');}
  if(action==='test'){if(d[2]===2&&d[1]){set(3);return out('闭关主灯仍亮，对外旁灯不再跟动。西渡见过的接法，这回被你当场截住了。','latch');}return out(d[2]&1?'闭关主灯也暗了。拆掉主索，会连真正的号也送不出去。':'主柄一拉，两盏灯仍一起响应。对外的假号还连在上面。');}
break;
 case 'c6-p4':
  if(action==='pack'){set(1,7);set(2);set(3);set(4);return out('随身原件沿旧折收妥，封绳系牢。底单、拓痕、驿站留底和亲见签押，都在里面。','paper');}
  if(action==='place'&&n<3){d[1]|=1<<n;return out(['底单与收讫簿并列，日期矛盾照原样留下。','甲三烙记的拓痕与西渡验货见证放在一起。','陈九成的亲见签押另折，不与推测混写。'][n],'paper');}
  if(action==='fold'){if(d[1]!==7)return out('原件还没收齐，先别合封。','paper');set(2);return out('包纸沿旧折痕合拢。','paper');}
  if(action==='string'){if(!d[2])return out('纸还摊着，绳扣收不住。','cloth');set(3);return out('细绳穿过封耳，原件固定在里面。','cloth');}
  if(action==='seal'){if(!d[3])return out('封绳还没系好。');set(4);return out('封口压牢。这一路的东西，总算没有散失。','paper');}break;
 case 'c6-p5':
  if(action==='handover'){set(1);set(2);set(3);return out('守备接过纸包，抬头看了你很久：“册上写你阵亡了。”陈九成扶住案沿：“他是跟我一起回来的。”','paper');}
  if(action==='door'){set(1);return out('守军看过闭关回灯，抬开内侧通道的挡木。');}
  if(action==='shelter'){if(!d[1])return out('通道还没有放行。');set(2);return out('你撑住风里的小门，纸包没有被吹散。','cloth');}
  if(action==='hand'){if(!d[2])return out('门被风推回来，先撑稳它。');set(3);return out('守备接过纸包，原班门军把陈九成扶到案旁。','paper');}break;
 case 'c6-p6':
  if(action==='identity'){set(1);return out('甲字哨，十七，陆昭。腰牌与册上的姓名、牌号对上了。','wood');}
  if(action==='witness'){if(!d[1])return out('先把册上的人，与眼前的腰牌核准。','paper');set(2);return out('陈九成在见证处签名：“我与他一同回来的。”','paper');}
  if(action==='ink'){if(!d[2])return out('这条更正还缺生还见证。','paper');set(3);return out('笔尖蘸了墨。旧注仍要看得见。','water');}
  if(action==='stroke'){if(!d[3])return out('笔尖还是干的。墨盏就在手边。','paper');if(n!==1)return out('让这一笔穿过“阵亡”两个字，旧字仍留在下面。','paper');set(4);return out('一道细线划过旧注。那两个字，终于不再是你的去处。','paper');}
  if(action==='chen'){if(!d[4])return out('先把自己的这一行更正完。','paper');set(5);return out('陈九成名下也添了生还见证。册页没有撕去，旧事与活人都留下了。','paper');}break;
 }
 return out('先看物件怎样相互牵动。','cloth');
}
/** Store the player's own generous, two-glyph crossing stroke, not a canned animation. */
export function brushStroke(current:unknown[],points:number[]):FieldChange {
 const d=fieldViewDraft('c6-p6',current,false);if(!d[3])return fieldMove('c6-p6',d,'stroke',0);
 const pairs=Array.from({length:Math.floor(points.length/2)},(_,i)=>[points[i*2],points[i*2+1]]).filter(p=>p.every(Number.isFinite));
 const relevant=pairs.filter(([x,y])=>x>=0&&x<=100&&y>=15&&y<=85),xs=relevant.map(p=>p[0]);
 const valid=xs.some(x=>x>=12&&x<=48)&&xs.some(x=>x>=52&&x<=88)&&Math.max(...xs)-Math.min(...xs)>=42;
 if(!valid)return fieldMove('c6-p6',d,'stroke',0);
 const result=fieldMove('c6-p6',d,'stroke',1),sample=pairs.filter((_,i)=>i%Math.max(1,Math.ceil(pairs.length/8))===0).slice(0,8).flat().map(n=>Math.max(0,Math.min(100,n)));
 result.draft=[...result.draft.slice(0,6),...sample];return result;
}

export function fieldSceneBlock(chapter:number,scene:number,solved:string[]):string|null {
 const gate:Record<string,[string,string]>={
  '2:1':['c2-p1','船梯还悬着，先把梯身放稳。'],
  '4:2':['c4-p2','墙缝后的铜扣还没有找到，暗室尚未打开。'],
  '5:2':['c5-p2','检验夹道还由新班把守，先请岗亭重核换防调令。'],
  '6:2':['c6-p3','对外的迎援号尚未截断，守军还不能放开内侧通道。']
 };const item=gate[chapter+':'+scene];return item&&!solved.includes(item[0])?item[1]:null;
}

/** Test the beam freely. A closing signal requires the original order. */
export function fieldActionBlock(id:string,action:string,solved:string[],value=0):string|null {
 if(id==='c5-p6'&&action==='place'&&value===1&&!solved.includes('c5-p3'))return '还没有查到路引原件。先交眼前能够核验的断齿与调令。';
 if(id==='c3-p5'&&(action==='pull'||action==='solve')&&!solved.includes('c3-p6'))return '先核准驿站的原令，再向东门发号。';
 return null;
}
export function fieldPuzzleVisible(id:string,solved:string[]):boolean {
 if(id==='c4-p4')return solved.includes('c4-p6');
 if(id==='c4-p3'||id==='c4-p6')return !solved.includes('c4-p6');
 return true;
}
export function fieldSceneLabel(chapter:number,scene:number,solved:string[],fallback:string):string {
 return chapter===4&&scene===2&&solved.includes('c4-p6')?'旧道外避风处':fallback;
}

export function rigLamps(mask:number,handle:number):[boolean,boolean]{return handle===0?[!(mask&1),!(mask&1)&&!(mask&2)]:[!(mask&1)&&!(mask&2),true];}
