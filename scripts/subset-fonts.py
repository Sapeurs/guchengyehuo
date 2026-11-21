"""Regenerate licensed local font subsets after changing game text.

Place the original title.ttf, manuscript.ttf and ui.ttf in ignored .font-source/.
Requires fonttools. Sources and licenses are documented in docs/typography.md.
"""
from pathlib import Path
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
text = ''.join(p.read_text() for p in (root / 'src').glob('*') if p.suffix in ('.ts', '.css'))
text += (root / 'index.html').read_text()
for source, target, weight in [
    ('title.ttf', 'display-v3.woff', None),
    ('manuscript.ttf', 'manuscript-v3.woff', None),
    ('ui.ttf', 'ui-regular-v3.woff', 450),
    ('ui.ttf', 'ui-semibold-v3.woff', 600),
]:
    options = subset.Options()
    options.flavor = 'woff'
    font = subset.load_font(str(root / '.font-source' / source), options)
    if weight:
        instantiateVariableFont(font, {'wght': weight}, inplace=True)
    ss = subset.Subsetter(options=options)
    ss.populate(text=text)
    ss.subset(font)
    family = 'Gucheng' + target.split('.')[0].replace('-', '').title() + 'Subset'
    for name in font['name'].names:
        if name.nameID in (1, 4, 6, 16):
            name.string = family.encode(name.getEncoding())
        elif name.nameID in (2, 17):
            name.string = 'Regular'.encode(name.getEncoding())
    subset.save_font(font, str(root / 'public/assets/fonts' / target), options)
    print(target)
