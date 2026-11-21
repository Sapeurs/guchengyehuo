export type Weapon = '戈' | '铳' | '弓' | '盾';
export type Item = 'tag' | 'cloth' | 'wetcloth' | 'key' | 'manifest' | 'order';
export interface Progress {
  version: 1; started: boolean; items: Item[]; tagClean: boolean; identityKnown: boolean;
  clueA: boolean; clueB: boolean; orderSeen: boolean; boxSolved: boolean;
  slots: (Weapon | null)[]; completed: boolean;
  introSeen: boolean; searchSeen: boolean;
}
export const SAVE_KEY = 'gucheng-nightfire:prototype:v1';
export const SOLUTION: Weapon[] = ['戈', '铳', '弓', '盾'];
export const WEAPONS: Weapon[] = ['戈', '铳', '弓', '盾'];
// Keep legacy save IDs; displayed objects are a spear, firearm, bow and rattan shield.
export const WEAPON_NAMES: Record<Weapon, string> = { 戈: '长枪', 铳: '火铳', 弓: '弓弩', 盾: '藤牌' };
export const ITEM_NAMES: Record<Item, string> = {tag:'陆昭的腰牌',cloth:'干布条',wetcloth:'湿布',key:'军器库钥匙',manifest:'押运单',order:'残缺军令'};
export const freshProgress = (): Progress => ({version:1,started:false,items:[],tagClean:false,identityKnown:false,clueA:false,clueB:false,orderSeen:false,boxSolved:false,slots:[null,null,null,null],completed:false,introSeen:false,searchSeen:false});
const ITEMS = Object.keys(ITEM_NAMES) as Item[];

/** Validate saved game data rather than trusting browser storage. */
export function restoreProgress(raw: string | null): Progress {
  try {
    const v = JSON.parse(raw || 'null');
    if (!v || v.version !== 1 || !Array.isArray(v.items) || !Array.isArray(v.slots) || v.slots.length !== 4) return freshProgress();
    const s = freshProgress();
    for (const key of ['started','tagClean','identityKnown','clueA','clueB','orderSeen','boxSolved','completed'] as const) {
      if (typeof v[key] !== 'boolean') return freshProgress();
      s[key] = v[key];
    }
    if (v.items.some((x: unknown) => !ITEMS.includes(x as Item))) return freshProgress();
    s.items = [...new Set(v.items)] as Item[];
    const used = new Set<Weapon>();
    s.slots = v.slots.map((x: unknown) => {
      if (WEAPONS.includes(x as Weapon) && !used.has(x as Weapon)) { used.add(x as Weapon); return x as Weapon; }
      return null;
    });
    if (s.items.includes('wetcloth')) s.items = s.items.filter(x => x !== 'cloth');
    if (!s.items.includes('tag')) { s.tagClean = false; s.identityKnown = false; }
    if (!s.tagClean) s.identityKnown = false;
    s.introSeen = typeof v.introSeen === 'boolean' ? v.introSeen : s.started;
    s.searchSeen = typeof v.searchSeen === 'boolean' ? v.searchSeen : false;
    if (!s.boxSolved) s.items = s.items.filter(x => !['key','manifest','order'].includes(x));
    if (!s.identityKnown || !['key','manifest','order'].every(i=>s.items.includes(i as Item))) s.completed = false;
    return s;
  } catch { return freshProgress(); }
}

export type Action = {type:'START'|'MARK_INTRO'|'MARK_SEARCH'|'TAKE_TAG'|'TAKE_CLOTH'|'WET_CLOTH'|'CLEAN_TAG'|'IDENTIFY'|'READ_A'|'READ_B'|'READ_ORDER'|'OPEN_BOX'|'TAKE_KEY'|'TAKE_PAPERS'|'TAKE_REWARDS'|'RESET_SLOTS'|'COMPLETE'} | {type:'PLACE'; index:number; weapon:Weapon|null};
export interface Outcome { state: Progress; ok: boolean; message: string; }
export function act(prev: Progress, action: Action): Outcome {
  const s: Progress = {...prev, items:[...prev.items], slots:[...prev.slots]};
  const has = (i: Item) => s.items.includes(i);
  const add = (i: Item) => {if (!has(i)) s.items.push(i);};
  const done = (message = '', ok = true): Outcome => ({state: ok ? s : prev, ok, message});
  switch (action.type) {
    case 'START': s.started = true; return done();
    case 'MARK_INTRO': s.introSeen = true; return done();
    case 'MARK_SEARCH': if(!s.identityKnown)return done('',false);s.searchSeen = true; return done();
    case 'TAKE_TAG': if(has('tag')) return done('腰牌已经收好了。',false); add('tag'); return done('获得：沾污的腰牌');
    case 'TAKE_CLOTH': if(has('cloth')||has('wetcloth')) return done('布条已经收好了。',false); add('cloth'); return done('获得：干布条');
    case 'WET_CLOTH': if(!has('cloth')) return done('先找一块可以蘸水的布条。',false); s.items=s.items.filter(x=>x!=='cloth'); add('wetcloth'); return done('干布条蘸了水，变成了湿布。');
    case 'CLEAN_TAG': if(!has('tag')||!has('wetcloth')) return done('需要用湿布擦去腰牌上的污迹。',false); if(s.tagClean) return done('字迹已经清楚了。',false); s.tagClean=true; return done('甲字哨 · 十七 · 陆昭。是我的腰牌。');
    case 'IDENTIFY': if(!s.tagClean) return done('先看清腰牌上的姓名和牌号，才能确定是不是同一个人。',false); if(s.identityKnown) return done('行伍册中的陆昭，就是我。',false); s.identityKnown=true; return done('牌号没错，名字也没错。他们把我也算进去了。');
    case 'READ_A': s.clueA=true; return done();
    case 'READ_B': s.clueB=true; return done();
    case 'READ_ORDER': s.orderSeen=true; return done();
    case 'PLACE': {
      if(s.boxSolved||action.index<0||action.index>3) return done('',false);
      const old=s.slots[action.index];
      const previous=action.weapon ? s.slots.indexOf(action.weapon) : -1;
      if(previous>=0&&previous!==action.index) s.slots[previous]=old;
      s.slots[action.index]=action.weapon;
      return done();
    }
    case 'RESET_SLOTS': if(s.boxSolved)return done('',false); s.slots=[null,null,null,null]; return done();
    case 'OPEN_BOX':
      if(s.boxSolved)return done('木匣已经打开。',false);
      if(s.slots.some(x=>!x))return done('四处插位都要放上木牌。',false);
      if(!s.slots.every((v,i)=>v===SOLUTION[i]))return done('暗扣没有松开。再想想本次点验的先后。',false);
      s.boxSolved=true; return done('咔哒——暗扣松开，木匣打开了。');
    case 'TAKE_REWARDS': if(!s.boxSolved)return done('',false); add('key');add('manifest');add('order');return done('收起军器库钥匙、押运单与残缺军令。');
    case 'TAKE_KEY': if(!s.boxSolved||has('key'))return done('',false);add('key');return done('获得：军器库钥匙');
    case 'TAKE_PAPERS': if(!s.boxSolved||has('manifest'))return done('',false);add('manifest');add('order');return done('收好押运单与残缺军令。');
    case 'COMPLETE':
      if(!has('key'))return done('军器库的门锁着。百户的木匣里，也许留下了钥匙。',false);
      if(!s.identityKnown)return done('离开前，还得查清行伍册里那个“陆昭”究竟是不是我。',false);
      if(!has('manifest')||!has('order'))return done('百户匣中的文书还没收好，不能把它们留在这里。',false);
      s.completed=true;return done();
  }
}

export type HintStage = 'tag'|'identity'|'box'|'reward'|'door';
export function hintStage(s:Progress): HintStage {
  if(!s.tagClean)return 'tag';
  if(!s.identityKnown)return 'identity';
  if(!s.boxSolved)return 'box';
  if(!['key','manifest','order'].every(i=>s.items.includes(i as Item)))return 'reward';
  return 'door';
}
export const HINTS:Record<HintStage,{title:string;lines:string[]}> = {
  tag:{title:'辨认腰牌',lines:['桌上那块腰牌沾满污迹，先把它收好。','桌上有布条，水盆里还有清水。选中背包中的布条，再点水盆。','用水盆把干布条变成湿布，再选中湿布，擦拭背包里的腰牌。']},
  identity:{title:'核对行伍册',lines:['清理后的腰牌上，有姓名和牌号。','腰牌属于“甲字哨·十七”。翻到行伍册的甲字哨一页。','在甲字哨页找到“十七　陆昭”的条记，点击后核验旁边的“阵亡”添注。']},
  box:{title:'打开军匠匣',lines:['匣上木牌的先后，取决于这次押运的点验次序。','墙边便笺写了首尾；随行布包里的记事写了中间两项的先后。','从左至右放入：长枪、火铳、弓弩、藤牌，再按“拨动暗扣”。']},
  reward:{title:'收好百户的遗物',lines:['百户的木匣已经打开。','回到床脚木匣，查看里面的物品。','分别点击匣中的铜钥匙与文书，将三件遗物都收好。']},
  door:{title:'准备前往军器库',lines:['身份已核实，也拿到了库钥。','军器库就在偏房外，看看木门。','点击偏房木门，带着库钥和文书离开。']}
};
