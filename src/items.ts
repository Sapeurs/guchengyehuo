import type {Item} from './game';

/** A physical item uses the same original artwork wherever it appears. */
export const ITEM_ART:Record<Item,string> = {
  tag:'crafted/token-wood-dirty-v3.png',
  cloth:'crafted/cloth-dry-v2.png',
  wetcloth:'crafted/cloth-wet-v2.png',
  key:'crafted/bronze-key.png',
  manifest:'crafted/folded-document-v2.png',
  order:'crafted/torn-letter-blank-v3.png'
};
export const itemArtPath=(item:Item,clean=false)=>item==='tag'&&clean?'crafted/token-wood-clean-v3.png':ITEM_ART[item];
