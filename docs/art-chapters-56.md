# 第五、六关场景原画

生成方式：内置 imagegen。输入图片 `public/assets/room-v3.png` 仅作为画风参考；每张为独立场景，未制作拼图。原始输出原样复制进项目，未压缩、裁剪或重绘。六张均为 1672×941，人物、现代物品、界面与可读文字均不在图中。

## 交互构图建议

坐标为图像宽高的百分比；矩形顺序为 x / y / width / height，最终热点由游戏主工程确认。

| 文件 | 场景 | 主要物件建议范围 |
| --- | --- | --- |
| c5-s0.png | 东门内街 | 左告示 6/22/28/40；中门口 45/28/21/34；右岗亭桌 71/58/25/20 |
| c5-s1.png | 绞关房 | 左铁链 1/0/15/77；中绞盘 34/42/51/48；制动齿 69/68/14/16；右窗 81/8/18/35 |
| c5-s2.png | 东门夹道 | 左沟盖 2/73/22/24；中路引桌 44/58/30/18；右栅门 66/9/31/48 |
| c6-s0.png | 城楼号房 | 左信旗架 2/7/17/82；中文书 46/62/28/15；右灯架 77/13/19/47 |
| c6-s1.png | 城墙敌台 | 左沙盘 8/56/46/28；中城外远灯 34/24/41/24；右旗架 77/40/19/45 |
| c6-s2.png | 黎明城楼 | 左钟鼓 2/35/28/42；中长案 31/61/63/22；中门 23/13/33/50；右绞轮 78/34/17/35 |

## 最终提示词

### c5-s0.png

Use case: historical-scene. Asset type: final wide 16:9 exploration scene background for an original Southern Ming mystery point-and-click game. Reference image is a STYLE REFERENCE ONLY; do not reproduce its room. Match its realistic painterly hand-painted 2D aesthetic, tactile aged wood, gray brick and paper, subtle brush texture, readable objects, restrained cold moonlight with warm lantern contrast, richly atmospheric but not too dark. Fixed eye-level camera, substantial foreground interactive props, no interface, no labels, no lettering, no watermarks, no modern objects, no people, no statues resembling people, no combat. One single continuous landscape scene, NOT a collage. Leave clean object silhouettes for hotspot interaction. East gate inner street in a fictional late Ming walled city at night. Left foreground a broad weathered blank notice board on a wooden wall, center middle-distance a heavy gatehouse stone arch opening and wet blue-gray stone street leading toward closed gates, right foreground a small sentry booth with warm hanging lantern and inspection bench. The notice board, arch and booth must be large, separately readable objects. Moonlight and faint smoke, quiet tension.

### c5-s1.png

Use case: historical-scene. Asset type: final wide 16:9 exploration scene background for an original Southern Ming mystery point-and-click game. Reference image is a STYLE REFERENCE ONLY; do not reproduce its room. Match its realistic painterly hand-painted 2D aesthetic, tactile aged wood, gray brick and paper, subtle brush texture, readable objects, restrained cold moonlight with warm lantern contrast, richly atmospheric but not too dark. Fixed eye-level camera, substantial foreground interactive props, no interface, no labels, no lettering, no watermarks, no modern objects, no people, no statues resembling people, no combat. One single continuous landscape scene, NOT a collage. Leave clean object silhouettes for hotspot interaction. Inside the gatehouse winch chamber. Left foreground hanging thick black iron chains with rope coil, center foreground large wooden capstan with horizontal handles and plainly visible wooden braking tooth and gear; right wall a barred window admitting cold moonlight and a small warm oil lantern. Realistic timber framing and rough stone, mechanical parts large and clear, old hand-forged metal, no writing.

### c5-s2.png

Use case: historical-scene. Asset type: final wide 16:9 exploration scene background for an original Southern Ming mystery point-and-click game. Reference image is a STYLE REFERENCE ONLY; do not reproduce its room. Match its realistic painterly hand-painted 2D aesthetic, tactile aged wood, gray brick and paper, subtle brush texture, readable objects, restrained cold moonlight with warm lantern contrast, richly atmospheric but not too dark. Fixed eye-level camera, substantial foreground interactive props, no interface, no labels, no lettering, no watermarks, no modern objects, no people, no statues resembling people, no combat. One single continuous landscape scene, NOT a collage. Leave clean object silhouettes for hotspot interaction. East gate narrow inspection passage in a Ming stone gatehouse. Left foreground rectangular stone drainage channel cover, center foreground long worn wooden inspection table with folded blank travel permits, brush and plain weights, right middle-distance a heavy wooden barred gate. Warm lantern illumination on table against cold stone passage. Clear readable prop placement.

### c6-s0.png

Use case: historical-scene. Asset type: final wide 16:9 exploration scene background for an original Southern Ming mystery point-and-click game. Reference image is a STYLE REFERENCE ONLY; do not reproduce its room. Match its realistic painterly hand-painted 2D aesthetic, tactile aged wood, gray brick and paper, subtle brush texture, readable objects, restrained cold moonlight with warm lantern contrast, richly atmospheric but not too dark. Fixed eye-level camera, substantial foreground interactive props, no interface, no labels, no lettering, no watermarks, no modern objects, no people, no statues resembling people, no combat. One single continuous landscape scene, NOT a collage. Leave clean object silhouettes for hotspot interaction. Inside a walled city's signal room above the gatehouse, deep night. Left foreground a wooden rack with several simple plain cloth signal flags without symbols, center foreground long document table with blank folded papers and a small oil lamp, right foreground a wooden signal-lantern rack with multiple unlit lantern housings and rope. Beyond lattice windows faint night sky. Broad readable props, aged wood.

### c6-s1.png

Use case: historical-scene. Asset type: final wide 16:9 exploration scene background for an original Southern Ming mystery point-and-click game. Reference image is a STYLE REFERENCE ONLY; do not reproduce its room. Match its realistic painterly hand-painted 2D aesthetic, tactile aged wood, gray brick and paper, subtle brush texture, readable objects, restrained cold moonlight with warm lantern contrast, richly atmospheric but not too dark. Fixed eye-level camera, substantial foreground interactive props, no interface, no labels, no lettering, no watermarks, no modern objects, no people, no statues resembling people, no combat. One single continuous landscape scene, NOT a collage. Leave clean object silhouettes for hotspot interaction. A Ming city wall enemy-watch platform during the last hour before dawn. Left foreground large wooden sand-table with miniature plain wooden terrain blocks and a winding trench, center stone embrasures and arrow slits looking out over a dark landscape with a few distant warm signal lights, right foreground rack of spare plain folded signal flags and wooden rail. Wide atmospheric cold-blue scene with warm oil lamp at sand table. No people, no combat, no writing.

### c6-s2.png

Use case: historical-scene. Asset type: final wide 16:9 exploration scene background for an original Southern Ming mystery point-and-click game. Reference image is a STYLE REFERENCE ONLY; do not reproduce its room. Match its realistic painterly hand-painted 2D aesthetic, tactile aged wood, gray brick and paper, subtle brush texture, readable objects, restrained cold moonlight with warm lantern contrast, richly atmospheric but not too dark. Fixed eye-level camera, substantial foreground interactive props, no interface, no labels, no lettering, no watermarks, no modern objects, no people, no statues resembling people, no combat. One single continuous landscape scene, NOT a collage. Leave clean object silhouettes for hotspot interaction. Dawn on a Ming city gate tower after a long night. Left foreground bronze bell and plain war drum on wooden stands, center a large heavy wooden inner door and broad worn council table, right foreground wooden flag-hoisting wheel, ropes and a plain muted-red flag visible above parapet. Cool indigo shadows turning to soft warm pale gold sunrise outside. Hopeful restrained historical atmosphere, no people, no writing, no battle.

