import {militaryStamp} from './seal-view';
import {icon} from './icons';

/** Real text over paper: right-to-left vertical lines, with reading notes outside. */
function letter(title:string,lines:string[],date:string,extra='',signature=''){
  return `<article translate="no" lang="zh-CN" class="period-letter ${extra}" aria-label="${title||'染血残札'}"><div class="letter-ruling" aria-hidden="true"></div><div class="letter-ink">${title?`<h3>${title}</h3>`:''}${lines.map(line=>`<p>${line}</p>`).join('')}${signature?`<div class="w-prologue-warrant-print">${militaryStamp('prologue')}</div>`:''}<div class="letter-signature">${signature?`<span>${signature}</span>`:''}<small>${date}</small></div></div></article>`;
}
const journalButton=()=>`<button class="secondary-button" data-action="journal">${icon('book')}翻阅手记</button>`;

export function noteView(which:'A'|'B',registerKnown=false){
  return `<div class="document-layout period-document">${letter(which==='A'?'点验记':'随行记',which==='A'?['长枪先验','藤牌收尾']:['火铳验毕','再点弓弩'],'六月初九日','informal-letter')}<div class="document-caption"><span class="eyebrow">陆昭 · 心声</span><h3>${which==='A'?'熟悉的笔迹':'布包里的记事'}</h3><p>${which==='A'?'百户的字。启运前，他还在逐一查验这些军器。':registerKnown?'这是陈九成留下的。册中只记了“未回”……他会不会仍活着？':'陈九成，押运时就走在我前面。遇袭之后，我再没见过他。'}</p>${journalButton()}</div></div>`;
}

export function manifestView(){
  return `<div class="document-layout period-document">${letter('解运底单',['军器一批编甲字三号','六月初九日起解','解赴东营军器库验明交收','长枪火铳弓弩藤牌'],'六月初九日','transport-letter')}<div class="document-caption"><span class="eyebrow">百户的遗物</span><h3>解运军器的底单</h3><p>六月初九启运，甲字三号，送往东营军器库。到了库中，就从这批军器查起。</p>${journalButton()}</div></div>`;
}

export function orderView(detained=false){
  const paper=detained?letter('札付',['为查拿事','仰将归营哨探陆昭','暂行看守听候查讯','毋得擅纵'],'六月十一日','official-letter','副将赵廷岳'):letter('',['子时','东门','不可开'],'','fragment-letter');
  return `<div class="document-layout period-document">${paper}<div class="document-caption"><span class="eyebrow">${detained?'墙上的札付':'百户怀中的残札'}</span><h3>${detained?'赵廷岳……':'子时之前'}</h3><p>${detained?'副将要人把我看守起来，听候查讯。归营之前，我从没见过这道命令。':'纸只剩半页，余下的字被血污和撕口遮去。百户临终攥着它，东门今夜究竟会发生什么？'}</p></div></div>`;
}
