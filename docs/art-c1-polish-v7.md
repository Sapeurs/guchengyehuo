# 第一关状态原画 v7

日期：2026-11-11。以下三张均使用内置 imagegen 编辑；输入是项目已有原画，不复用外部游戏素材。输出原样复制，未使用脚本绘制或重绘，未裁切、拉伸或压缩。生成后逐张 `view_image` 检查。

## 文件与状态

| 文件 | 尺寸 | 内容与检查 |
| --- | --- | --- |
| `public/assets/chapters/c1-s0-closed-v7.png` | 1672 × 941 RGB | 第一关前院关闭状态。仅将右工作台近代煤油灯替换为朴素陶油碗；箱、门、兵器架、月亮、铺地和原物件位置保持。 |
| `public/assets/chapters/c1-s0-open-v7.png` | 1672 × 941 RGB | 从新关闭版编辑的开箱状态。中央主货箱盖向后打开，覆布搭在盖沿、绳索松开落在箱侧；箱内清楚可见为空，只留小块无字残纸。箱体前板、提环、地面落点保持。 |
| `public/assets/chapters/c1-s2-revealed-v7.png` | 1671 × 941 RGB | 侧库透光完成状态。桌上两片散残纸移除，右侧灯下加入小木框与完整半透明暖纸；布包、蜡碗、门、灯架、兵器和原构图保持。输出比源目标宽度少 1 像素，未另行拉伸；可按原场景容器完整显示。 |

这些是生成式编辑，不宣称非目标像素逐像素一致。目视未见主要热点错位：前院货箱主体仍在 x41–66%、y52–77%；开盖升至 y35% 附近。侧库旧散纸区域仍在 x39–59%、y68–83% 且现为空桌面；透纸框在 x80–92%、y49–69%；布包 x62–79%、y67–83%，灯架 x83–97%、y9–64%。没有人物、可读文字、UI 或新标签。

## 编辑 1：年代修正与关闭状态

输入：`public/assets/chapters/c1-s0.png`。

Use case: precise-object-edit. Edit target: supplied existing 1672x941 game background. Make only one local historical-prop correction: replace the modern metal-and-glass kerosene lantern on the RIGHT foreground workbench (around x94%, y47%) with a small plain late-Ming ceramic oil bowl and short wick flame, no glass chimney, no modern lamp frame. Keep its warm illumination same position and intensity. Keep the central main cargo chest CLOSED, cloth and ropes untouched. Preserve exact camera, 16:9 composition, all architectural outlines and object positions, crate scale, wet paving, moon, weapons, left hanging oil bowl, lighting, painterly detail and color balance. No people, no writing, no UI, no new props anywhere else. Output same 1672x941 dimensions.

## 编辑 2：从配对关闭版打开货箱

输入：`public/assets/chapters/c1-s0-closed-v7.png`。

Use case: precise-object-edit. Edit target: supplied corrected CLOSED state of an existing 1672x941 game background. Create a closely matched OPEN CHEST state. Change ONLY the large main military cargo chest in the middle foreground (approximately x41-66%,y52-77%): its hinged lid is lifted backward toward the rear of the room, open about 95 degrees; cloth corner folds off the opening naturally and rope slack lies aside. Reveal a clearly EMPTY dark wooden chest interior, no weapons or goods, only a few tiny pale blank paper-seal scraps tucked at its inner edge. Keep the chest footprint, front panel and ring handle, scale and perspective in their exact position so the existing clickable area still works. Keep ALL other room objects identical: the plain small ceramic oil bowl on the right workbench, left hanging oil lamp, doors, tools, spears, moon, puddles, wall, trees, camera, color balance, light sources and painterly surface quality. No people, no labels, no writing, no UI, no new props anywhere else. Exact same 1672x941 dimensions.

## 编辑 3：侧库透光完成状态

输入：`public/assets/chapters/c1-s2.png`。

Use case: precise-object-edit. Edit target: supplied existing 1672x941 side-storeroom game background. Show the solved paper-transillumination state. Change ONLY these tabletop papers: remove the two scattered blank torn pieces near center-front table x39-59%,y69-83%, leaving the same bare tabletop underneath; show ONE reassembled rectangular thin aged blank paper seal, translucent warm amber, leaning diagonally in a small plain thin wooden support frame directly BELOW and slightly LEFT of the RIGHT oil-lamp stand (around x81-91%, y49-67%). The paper is clear of the flame; natural transmitted warm light reveals paper fibers, but absolutely no letters, pseudo-text, symbols or stamp. Keep the tied paper package x62-79%,y67-83%, wax bowl, lamp stand, door, weapons, all furniture, camera, perspective, old-paper/wood textures, room and overall lighting unchanged. Don't move existing objects. No people, no UI. Exact same 1672x941 dimensions and composition.
