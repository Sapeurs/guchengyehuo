# v24 场景素材制作记录

用途：第二至第六关机关反馈，2026-11-18。由内置图像生成工具生成，原图均已先检查。延续本项目已有的夜景木石材质；交互、绳路、光束、门闩与状态由代码控制。所有消费资源在 public/assets/chapters。

## rig

参考：c2-s2-v12.png

Use case: historical-scene. Asset: full-scene interactive game background, widescreen 16:9, rich realistic handpainted Ming China at night, match reference wood stone and muted moonlight/oillamp light. No UI, text, numbers, diagram, people or watermark. The reference is material/style/location reference, create an adjacent close view. At the river checkpoint, a straight-on close view of two small UNLIT paper signal lanterns hanging from an aged wood beam, centered at x35% and65%,y28%. Their separate thick hemp control ropes run down at x35% and65% to two wooden pull grips at y68%. One thin diagonal cross-connection rope from left rope midway x35%y43 to right lantern x65%y18 has a small bronze detachable hook at x51%y31. Main left rope has another detachable bronze clip at x35%y49. Make both lines simple and legible. River visible dark left. Leave bottom20% dark open floor for game caption. No other lamps.

## signal

参考：c3-s2.png

Use case: historical-scene. Asset: full-scene interactive game background, widescreen 16:9, rich realistic handpainted Ming China at night, match reference wood stone and muted moonlight/oillamp light. No UI, text, numbers, diagram, people or watermark. The reference is material/style/location reference, create an adjacent close view. Close view at the signal tower parapet. Near-foreground low wood lantern cradle at x45%y60%, lamp lit but blocked by wood shutter, a dark pulley at x66%y55%, two visibly different rope guide notches around it. Left half background distant East Gate tower, its dark window at x26%y28%; right half background black river and far roof silhouettes. Lantern light can be aimed either at river right or east gate left. No drawn beams baked into image, no visible return lights. Leave bottom20% dark parapet for captions.

## passage

参考：c4-witness-v19.png

Use case: historical-scene. Asset: full-scene interactive game background, widescreen 16:9, rich realistic handpainted Ming China at night, match reference wood stone and muted moonlight/oillamp light. No UI, text, numbers, diagram, people or watermark. The reference is material/style/location reference, create an adjacent close view. In the old escape passage adjacent to this cellar: fixed frontal view of a NARROW rectangular stone gate at x60%y45%, lintel top at y17%, threshold at y76%, width24%, passage visible behind. The heavy sliding stone slab is FULLY RAISED, hidden above lintel; no door blocking opening. Thick operating rope at x30% runs up to pulley. Loose broken wooden trestle across threshold in foreground at x55%y70%; it can be pushed aside. One upright stout wooden prop leaning at far right x85%. Dark escape garden beyond. Leave bottom18% dim floor empty. NO person, no standard wooden door.

## hoist

参考：c5-s1.png

Use case: historical-scene. Asset: full-scene interactive game background, widescreen 16:9, rich realistic handpainted Ming China at night, match reference wood stone and muted moonlight/oillamp light. No UI, text, numbers, diagram, people or watermark. The reference is material/style/location reference, create an adjacent close view. Adjacent close view of gate hoist: large upright old wooden winch wheel at left x23%y44%, rope runs up over wood beams. At right, two low stone bearing cradles under load at x53% and80%, both y65%, with a dark empty gap between. The actual moving crossbeam is REMOVED for game sprite overlay: do NOT paint a horizontal gate bar across these cradles. Iron locking pin on small ledge at x85%y58%. A narrow view of closed heavy gate beyond. Leave bottom20% dim stone floor for game captions.

## 后续编辑与精灵

两灯底图移除控制绳与木柄，由 SVG 绳与材质木柄按状态绘制。旧道底图移除挡路木架及支木；透明精灵图提供木架、石门和支木，按各自裁切框显示。绞关底图移除右侧闲置销，以可移动销显示接入位置。图像编辑均由内置图像工具执行；游戏裁切使用 SVG 原生视窗，没有脚本重绘素材。

