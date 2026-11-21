import type {CampaignProgress} from './campaign-state.ts';
import {fieldViewDraft, rigLamps} from './field-state.ts';

export function isRiverPuzzle(id: string): boolean {
  return ['c2-p3','c2-p5','c2-p6','c3-p3','c3-p5'].includes(id);
}

export function riverField(s: CampaignProgress): string | undefined {
  if (s.chapter === 2 && s.scene === 0 && s.solved.includes('c2-p3')) return 'c2-p6';
  if (s.chapter === 2 && s.scene === 1) return 'c2-p3';
  if (s.chapter === 2 && s.scene === 2) return 'c2-p5';
  if (s.chapter === 3 && s.scene === 2) return s.solved.includes('c3-p3') ? 'c3-p5' : 'c3-p3';
  return undefined;
}

export function riverBackdrop(s: CampaignProgress): string | undefined {
  const field = riverField(s);
  if (field === 'c2-p3' && s.solved.includes(field)) return 'chapters/c2-cargo-open-v25.png';
  if (field === 'c2-p5') return 'chapters/c2-lamp-rig-v24.png';
  if (field === 'c3-p3') return 'chapters/c3-signal-cold-v25.png';
  if (field === 'c3-p5') return 'chapters/c3-signal-close-v24.png';
  return undefined;
}

export function witnessReleaseLight(s: CampaignProgress): boolean {
  const id = 'c2-p5';
  if (s.solved.includes(id)) return false;
  const draft = fieldViewDraft(id, s.drafts[id] || [], false);
  return !!draft[1] && rigLamps(draft[2], draft[4])[1];
}

export function riverObservation(s: CampaignProgress): string {
  const has = (id: string) => s.solved.includes(id);
  const field = riverField(s);
  if (s.chapter === 2) {
    if (s.scene === 0) {
      if (has('c2-p6')) return '风吹过来，船头只晃了一下。新加的止索吃住了力。';
      if (s.drafts['c2-p6']?.[1]) return '驿站刻记留在筒上。走之前，给主缆再加一道止索。';
      if (s.drafts['c2-p6']?.[3]) return '止索已系牢。船头还挂着那只回文筒。';
      if (witnessReleaseLight(s)) return '值房的放行光落在船头。船还系着，没人来验舱。';
      if (has('c2-p3')) return '甲三还在船上。船头挂着递送筒，岸边的缆桩可以加一道止索。';
      if (!has('c2-p1')) return '舱里点着灯。船身压得低，从岸上够不到舱门。';
      return '梯脚搭住了船舷。舱里堆着从岸上看不清的货。';
    }
    if (field === 'c2-p3') {
      if (has('c2-p6')) return '甲三军器留在舱里。船头筒口的驿递刻记还在。';
      if (has('c2-p3')) return '甲三烙印就在箱沿。河关把这批货报成了盐。';
      return '角落是盐袋和篾篓。案角那只木箱捆着新绳，箱缝露着一点黑印。';
    }
    if (field === 'c2-p5') {
      if (has('c2-p5')) return '牵着放行灯的横绳已松开。验货以后，还得有人亲自放行。';
      if (witnessReleaseLight(s)) return '窗外是刚才那条船。放行灯一亮，船头就看得见。';
      return '验货和放行各有拉柄。船头正对着值房的窗。';
    }
  }
  if (s.chapter === 3) {
    if (s.scene === 1 && has('c3-p6')) {
      return has('c3-p5') ? '东门已经回了闭关灯。架后的半页纸约你去废祠。' : '两道命令已经核清。闭关号带上烽堠就能用。';
    }
    if (field === 'c3-p3') return has('c3-p6') ? '东门还在等闭关号。号灯的油盏是冷的。' : '灯罩背朝河面。东门的窗在左边，灯里一点火也没有。';
    if (field === 'c3-p5') {
      if (has('c3-p5')) return '东门窗里回过灯了。闭关号已经送到。';
      if (has('c3-p6')) return '闭关号已核准。看清灯口对着哪边，再把号打出去。';
      return '可以短掀遮板看光向。要补报，得先查清驿站原来收到的命令。';
    }
  }
  return '';
}
