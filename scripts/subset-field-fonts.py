"""v26 scoped fonts. Put licensed upstream TTF files in ignored .font-source/."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
all_text = ''.join(p.read_text() for p in (root / 'src').glob('*') if p.suffix in ('.ts', '.css'))
field_text = ''.join((root / 'src' / p).read_text() for p in ('field-state.ts', 'field-view.ts', 'later-chapters.ts', 'field-direction.ts', 'field-polish.ts','chapter-workshop.ts','chapter-flow.ts','river-route.ts','river-scene.ts','stronghold-scene.ts','chapter-one-world-view.ts','crate-bottom.ts','crate-bottom-view.ts','c1-inquiry.ts'))
sources = [
    (root / '.font-source/title.ttf', 'field-ink-v26.woff', 'GuchengFieldInkV26', None),
    (root / '.font-source/manuscript.ttf', 'field-manuscript-v26.woff', 'GuchengFieldManuscriptV26', None),
    (Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'), 'field-ui-v26.woff', 'GuchengFieldUIV26', 2),
]
for source, target, family, number in sources:
    font = TTFont(source, fontNumber=number) if number is not None else TTFont(source)
    needed = {ord(c) for c in field_text if '\u3400' <= c <= '\u9fff'}
    missing = needed - set(font.getBestCmap())
    assert not missing, (target, ''.join(map(chr, sorted(missing))))
    options = subset.Options()
    options.flavor = 'woff'
    sub = subset.Subsetter(options=options)
    sub.populate(text=all_text)
    sub.subset(font)
    for name in font['name'].names:
        if name.nameID in (1, 4, 6, 16):
            name.string = family.encode(name.getEncoding())
        elif name.nameID in (2, 17):
            name.string = 'Regular'.encode(name.getEncoding())
    font.flavor = 'woff'
    font.save(root / 'public/assets/fonts' / target)
    print(target)
