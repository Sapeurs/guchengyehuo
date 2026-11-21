"""Versioned simplified-Chinese game fonts; local OFL sources, real SC glyphs."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont, TTCollection
root=Path(__file__).resolve().parents[1]
text=''.join(p.read_text() for p in (root/'src').glob('*') if p.suffix in ('.ts','.css'))+(root/'index.html').read_text()
for source,target,family,number in [
 (root/'.font-source/title.ttf','campaign-display-v7.woff','GuchengCampaignDisplayV7',None),
 (root/'.font-source/manuscript.ttf','campaign-manuscript-v7.woff','GuchengCampaignManuscriptV7',None),
 (Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'),'campaign-ui-v7.woff','GuchengCampaignUIV7',2),
]:
 font=TTFont(source,fontNumber=number) if number is not None else TTFont(source)
 campaign_text=''.join(p.read_text() for p in (root/'src').glob('*.ts') if p.name.startswith(('campaign','chapter-one')))
 needed={ord(c) for c in campaign_text if '\u3400'<=c<='\u9fff'}
 missing=needed-set(font.getBestCmap());assert not missing,(target,''.join(map(chr,sorted(missing))))
 options=subset.Options();options.flavor='woff'
 sub=subset.Subsetter(options=options);sub.populate(text=text);sub.subset(font)
 for n in font['name'].names:
  if n.nameID in (1,4,6,16):n.string=family.encode(n.getEncoding())
  elif n.nameID in (2,17):n.string='Regular'.encode(n.getEncoding())
 font.flavor='woff';font.save(root/'public/assets/fonts'/target)
 print(target,(root/'public/assets/fonts'/target).stat().st_size)
