"""Build simplified brush ink and readable manuscript subsets from licensed sources."""
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parents[1]
text = ''.join(p.read_text() for p in (root / 'src').glob('*.ts'))
for source, target, family in [
    ('title.ttf', 'book-ink-sc-v5.woff', 'GuchengReadableInkV5'),
    ('manuscript.ttf', 'manuscript-v5.woff', 'GuchengReadableManuscriptV5'),
]:
    options = subset.Options()
    options.flavor = 'woff'
    font = subset.load_font(str(root / '.font-source' / source), options)
    ss = subset.Subsetter(options=options)
    ss.populate(text=text)
    ss.subset(font)
    for name in font['name'].names:
        if name.nameID in (1, 4, 6, 16):
            name.string = family.encode(name.getEncoding())
        elif name.nameID in (2, 17):
            name.string = 'Regular'.encode(name.getEncoding())
    subset.save_font(font, str(root / 'public/assets/fonts' / target), options)
    print(target)
