# 抽屉形体与开合修复 v11

2026-11-11。基线：托管第 10 版 `ca6289e5`。

问题：原实现将桌面局部截图作为矩形面板，以 CSS 透视拉伸模拟抽屉，缺少盒体、侧板、内腔与暗槽；底部工具栏的透明区域还会截住部分点击。已移除该面板及其形变动画。

改动：采用与原画相同视角的抽屉打开场景，并分别保留点灯、遮灯两种光照。闭合时使用原来的闭合场景。抽屉可以拉开、推回；取灯后内部空置，开合和刷新不会重复生成物品。开合沿用原 `c1-drawer-open` 标记，无需清空旧进度。存放中的油灯未点燃、提梁折下；修正了图片在网格按钮中按固有比例溢出的问题。铜砝码按桌面位置和比例重新放置。

## 新素材

| 资产 | 用途 |
| --- | --- |
| `public/assets/chapters/c1-s1-drawer-open-v11.png` | 抽屉打开、挂灯燃亮的房间 |
| `public/assets/chapters/c1-s1-drawer-covered-v11.png` | 同一打开抽屉、挂灯罩住后的房间 |
| `public/assets/chapters/hand-oil-lamp-stored-v11.png` | 抽屉内未点燃、提梁收起的油灯透明素材 |

使用内置 ImageGen，源图为本项目已有原画。保留旧资产；以下为本轮最终提示词。

### 打开抽屉

```text
Use case: precise-object-edit. Edit target: this exact painted late-Ming storeroom. Correct ONE gameplay object: the large writing desk in the LEFT foreground must have a physically credible OPEN wooden drawer. The closed front panel with a brass ring pull around x19–33%, y77–89% is the drawer front. Pull that existing drawer forward towards the viewer and slightly left along the desk's own rails, only about one third of its depth. Show its solid thick front board with the original brass ring pull, both real side walls, a dark recessed EMPTY interior bottom and the dark rectangular cavity under the desk behind it. Keep the drawer connected to the desk, aligned exactly with the desk's existing vanishing points; its back portion remains inside the desk. Do not make a detached floating plank or pasted rectangle. Let the front project to approximately x14–32%, y86–94%, keeping the whole front and handle inside the canvas, with realistic contact shadows under the tabletop and drawer. There is NO lamp or paper inside; the game will place its item in the visible interior. Preserve all other pixels/composition as closely as possible: entire desk tabletop, hanging textile, book, inkstone, abacus, legs, cupboard, bench, hanging lit lamp, moonlight, weapons, floor, right chest, camera, perspective, painterly material detail. Same wide 1672x941 composition. No writing, UI, people, new props or extra handles.
```

### 遮灯后的打开抽屉

```text
Use case: precise-object-edit. Image 1 is the ONLY edit target: storeroom with an already OPEN, empty, correctly drawn desk drawer at lower left. Image 2 is a lighting and lamp-cover reference ONLY. Change image 1 ONLY by covering the hanging oil lamp's flame with the same soot-dark bronze bell-shaped shade seen in image 2, removing its local warm wall glow and gently reducing that lamp's warm room illumination. Preserve image 1's OPEN drawer geometry, drawer side walls, empty dark interior, brass pull, tabletop, books, textile, desk legs, camera and every object EXACTLY as in image 1. Keep the cool right-window moonlight. Do NOT close or move the drawer and do NOT add anything to it. No text, no UI, no people. Same wide composition. This must be the matching open-drawer + lamp-covered state.
```

### 存放中的油灯

```text
Use case: precise-object-edit. Edit this exact small bronze oil lamp into its STORED IN A DRAWER state. Preserve the same aged bronze bowl, circular foot, hinge ears, wick and painterly realistic materials. Make the wick UNLIT, with no flame and no glow. Fold its hinged curved carrying handle DOWN close around the rear rim rather than standing upright, so its silhouette is squat. View from approximately 45 degrees above, three-quarter front view, suitable for placing on the bottom of a shallow wooden drawer. One object only, truly transparent background, no floor or drawer, no other props, no shadow rectangle, no text or UI, full silhouette and clear margin. Bowl should occupy most of the image, roughly 3:2 object proportions.
```

## 实机验证

在 1363×936 桌面浏览器从重玩第一关进入簿房，检查未取灯、已取灯、关抽屉、再开抽屉、刷新恢复、对账触发巡兵并遮灯后的状态组合。油灯只取一次，遮灯后抽屉仍保持开合状态，DOM 不再含 `w-drawer-front` 假面板。原 31 项状态测试通过；生产构建随发布执行。未声称完成全关未知解盲测或移动触屏测试。

![抽屉修复实机](screenshots/drawer-fixed-v11.png)

