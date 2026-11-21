# 第三、四章背景资产

生成方式：内置图像生成；每张独立生成，不使用拼图裁切。参考图 `public/assets/room-v3.png` 仅用于同一游戏的绘画风格，不作为逐像素保留的编辑目标。六张均为 1672×941 PNG，接近 16:9。已逐张查看，均没有人物、可读题字或界面。

## 共用提示词

Use case: historical-scene. Asset type: final production background for a Chinese 2D point-and-click mystery game, widescreen 16:9, one continuous scene (no panels). Match the supporting style reference: detailed realistic hand-painted period environment, tactile weathered wood, stone, rough cloth and paper; early Southern Ming era Chinese frontier city in a single night. Legible medium-dark exposure, cool moonlight with a restrained amber oil-lamp accent. Eye-level fixed game camera, room/objects clearly readable, painterly rather than photographic, no oversaturated fantasy. No people, faces, writing, labels, symbols, readable text, logos, modern objects, UI or watermark. Full-bleed landscape artwork.

## 每图场景提示词

- `c3-s0.png`: An abandoned military courier-station stable. LEFT foreground: a large old wooden feed trough with loose hay. CENTER middle-ground: a prominent empty saddle stand and worn saddle, with open stone walking floor leading to a rear wooden doorway. RIGHT: a weathered wooden tack cabinet, its rope latch and straps clearly visible. Empty stalls, no horses. Strong stable beams, earthy grey-brown palette, cold moon shaft entering high rear opening. Make the trough, saddle stand and cabinet three large distinct inspectable objects, with enough negative space between them.
- `c3-s1.png`: A courier station sleeping/dispatch room. LEFT: a worn heated brick sleeping platform (kang), folded rough blanket and a low stool. CENTER foreground: a large weathered dispatch desk with blank folded papers, a black brush rest and a plain wooden dispatch tube; behind it a latticed window and rear door. RIGHT: a large plain wooden pigeonhole cabinet with an amber portable oil lantern hanging beside it. No writing anywhere, all papers blank. Leave broad distinct inspectable prop clusters. Blue-grey moonlit room, warmer foreground desk.
- `c3-s2.png`: An empty beacon watch courtyard at night, open sky. LEFT: broad rough stone steps and a wooden ladder leading up a low watch-beacon tower. CENTER foreground: a broad raised square stone worktable holding a toppled old Chinese signal lantern with a plain blank cloth casing and detachable wood frame. RIGHT foreground: a heavy wooden rope rack with coiled rope and a small plain bronze alarm bell. Broken rain-dark stone paving, distant walls, dark-blue sky, no fire show, no people, no writing. Three clear inspectable zones.
- `c4-s0.png`: An abandoned Chinese ancestral-temple courtyard, no figures. LEFT foreground: a large gnarled bare tree with a short old cord and several loose natural rope knots hanging from a low branch; half-broken bench below. CENTER: a large weathered cracked stone memorial slab on a short base, its surface completely blank without any glyphs or engraving; the crack clearly visible. RIGHT foreground: a round rough-stone old well with a simple wooden crossbar and bucket, and a thick rope. The rear temple doorway stands in moon shadow. Cold green-grey stone and amber light spilling subtly from the doorway, light ground mist but objects distinct.
- `c4-s1.png`: An empty, abandoned small Chinese ancestral-temple main hall, no figures or statues. LEFT: an old carved folding wooden screen leaning against the wall, with blank torn fabric panels. CENTER foreground: a large low scarred wood offering table holding two tied rough-paper bundles with blank paper surfaces, a shallow ceramic incense bowl and a wax candle stub. RIGHT: a broken latticed window with ragged faded curtain, cold moonlight strikes the floor, a plain old wooden cabinet in shadow. Dusty beams, no readable writing, no decorative false glyphs, restrained charcoal-brown and pale-blue palette, enough light for every inspectable object.
- `c4-s2.png`: A hidden low-ceiling chamber beneath an abandoned Chinese temple, no people and no gore. LEFT foreground: a rough shelf/workbench holding a brown ceramic medicine bowl, a small pestle and folded grey cloth strips. CENTER: a woven straw sleeping mat recently left by a wounded soldier, with a bundled blanket and a small closed wooden keepsake box beside it; no body or person. RIGHT: a dark heavy wooden concealed doorway, a small warm oil lamp on a rough stone ledge beside it. Earthen stone walls, overhead beams, intimate amber light balanced with a faint cold shaft from a ceiling vent. Inspectable medicine bench, mat/box and lamp/door form three clear large zones.

`c3-s1.png` 初稿右侧提灯呈近代玻璃煤油灯，已用内置图像编辑局部更换为米纸和竹木灯框。编辑提示：Change ONLY the small hanging glass-and-metal hurricane lantern on the upper right pillar (just left of the pigeonhole cabinet) into a historically plausible simple Southern Ming Chinese hanging lantern: warm cream rice-paper square sides, dark slender bamboo/wood frame, small rounded top carrying loop, modest amber candle light inside. Absolutely no glass chimney, no kerosene mechanism, no modern metal lantern. Keep its position, approximate size and soft warm light. Preserve the exact room layout, desk, blank papers, cabinet, sleeping platform, doors, all other props, painterly texture, camera, colors and image dimensions. Do not add writing, people or UI. This is a single local object replacement.

## 建议热点范围

以下为左、上、宽、高的百分比，可按游戏近景入口适当放大容错。书写线索仍由真实文字层实现，不由背景伪造。

| 资产 | 物件 | x | y | w | h |
| --- | --- | ---: | ---: | ---: | ---: |
| c3-s0 | 马槽 | 0 | 57 | 31 | 39 |
| c3-s0 | 鞍架 | 44 | 44 | 28 | 44 |
| c3-s0 | 马具柜 | 76 | 23 | 23 | 57 |
| c3-s1 | 旧炕 | 1 | 42 | 29 | 35 |
| c3-s1 | 递送桌／空白纸 | 36 | 66 | 43 | 20 |
| c3-s1 | 信筒 | 79 | 69 | 15 | 17 |
| c3-s1 | 格柜 | 82 | 14 | 18 | 41 |
| c3-s1 | 纸灯 | 76 | 18 | 5 | 15 |
| c3-s2 | 烽台梯 | 26 | 23 | 14 | 43 |
| c3-s2 | 信灯与石台 | 45 | 53 | 28 | 26 |
| c3-s2 | 绳架铜铃 | 77 | 28 | 22 | 45 |
| c4-s0 | 树上旧绳结 | 16 | 17 | 13 | 25 |
| c4-s0 | 裂石碑 | 35 | 29 | 23 | 44 |
| c4-s0 | 井口 | 76 | 44 | 23 | 47 |
| c4-s1 | 旧屏风 | 6 | 21 | 20 | 53 |
| c4-s1 | 大纸包 | 27 | 64 | 18 | 17 |
| c4-s1 | 小纸包 | 51 | 71 | 16 | 13 |
| c4-s1 | 右侧旧柜 | 76 | 34 | 11 | 28 |
| c4-s2 | 药碗与布条 | 2 | 54 | 25 | 16 |
| c4-s2 | 草席 | 34 | 55 | 40 | 33 |
| c4-s2 | 小木盒 | 61 | 71 | 9 | 9 |
| c4-s2 | 暗门 | 70 | 13 | 20 | 64 |
| c4-s2 | 灯台 | 89 | 44 | 11 | 17 |
