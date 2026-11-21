# 六关通用道具图集

内置 imagegen 生成并通过一次透明边缘清理编辑，最终资产为 `public/assets/chapters/tools-atlas.png`。1448 × 1086，RGBA，四列三行，每格 362 × 362。没有 UI、标签或文字，透明背景，供场景与背包共用。

| 索引 | 行列 | 道具 |
| --- | --- | --- |
| 0 | 1,1 | 松木撬棍 |
| 1 | 1,2 | 小铁钩 |
| 2 | 1,3 | 旧陶油壶 |
| 3 | 1,4 | 铜砝码 |
| 4 | 2,1 | 火镰与燧石 |
| 5 | 2,2 | 麻绳盘 |
| 6 | 2,3 | 木齿轮 |
| 7 | 2,4 | 旧纸灯罩 |
| 8 | 3,1 | 方木印章 |
| 9 | 3,2 | 小铜镜 |
| 10 | 3,3 | 药钵与杵 |
| 11 | 3,4 | 毛笔 |

## 提示词

Use case: historical-scene.
Asset type: transparent inventory sprite atlas for a realistic hand painted Chinese historical mystery game set during the late Ming dynasty.
Create ONE atlas of exactly 12 distinct individual objects laid out in exactly FOUR columns and THREE rows, in equal rectangular cells, each object entirely inside its own cell, centered, generous clear padding, no overlap, no other objects. Landscape 4:3 canvas, preferably 1536 by 1152 pixels. The background must be genuinely transparent alpha, with no tabletop, no ground, no backdrop, no grid lines. Do not put any text, labels, numerals, letters, frame, watermark or UI anywhere.
Read left to right, top to bottom, strictly:
row 1: a worn pinewood pry bar; a small simple iron hook; an old brown ceramic oil flask with tiny spout; a bronze balance weight.
row 2: a traditional iron fire striker; a coiled hemp rope; a wooden replacement gear with eight teeth; an old folded paper lantern shade.
row 3: a square plain wooden seal stamp with NO text on its bottom; a small aged bronze hand mirror; a ceramic medicine mortar with pestle; a Chinese brush pen.
Style: detailed realistic hand painted game prop art, weathered physical materials, matte old wood, tarnished bronze, brown iron, tan hemp, warm neutral paper. Natural restrained warm and cool side lighting. Consistent gentle three quarter viewing angles, same scale of visual detail. Late Ming Chinese utilitarian objects, no modern manufactured hardware, no metal prybar, no modern bottle. Each silhouette readable at small inventory size, whole objects visible, no cropping. Match the tactile material style of an existing realistic tarnished bronze key game prop.

## 清理编辑提示

Edit the supplied atlas ONLY to clean the transparency around every object's silhouette. Remove all red, orange, yellow chroma-key fringe, speckles, halos or stray colored pixels outside the material edges. Preserve exactly the twelve objects, their shapes, materials, lighting, four-column three-row positions, entire composition and canvas dimensions. Keep genuinely transparent alpha, crisp natural neutral anti-aliased object edges. Do not add labels, text, grid lines or background.

## 检查

十二物件顺序与格位核对通过，轮廓完整，格内留白，无格间重叠。尺寸与 alpha 通道检查通过。图像查看器黑底预览会放大显示少量接近完全透明的红黄边缘像素；红色像素 alpha 最大为 2/255，平均约 1/255，没有可见的不透明红边。浏览器实际缩小显示时仍需随游戏画面验收。
