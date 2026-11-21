"""Create the licensed book-ink subset from Bakudai Regular in .font-source/."""
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parents[1]
options = subset.Options()
options.flavor = 'woff'
font = subset.load_font(str(root / '.font-source/brush.ttf'), options)
ss = subset.Subsetter(options=options)
ss.populate(text=(root / 'src/muster.ts').read_text())
ss.subset(font)
for name in font['name'].names:
    if name.nameID in (1, 4, 6, 16):
        name.string = 'GuchengBookInkV4'.encode(name.getEncoding())
    elif name.nameID in (2, 17):
        name.string = 'Regular'.encode(name.getEncoding())
target = root / 'public/assets/fonts/book-ink-v4.woff'
subset.save_font(font, str(target), options)
print(target.name, target.stat().st_size)
