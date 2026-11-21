# 物件原画 v2

生成日期：2026-11-11。

本批将腰牌、麻布和纸质文书统一为与兵舍场景一致的写实绘画原画。仅新增六张 PNG 和此文档；原始腰牌、木匣、钥匙及游戏代码未在本任务中修改。

## 工具与流程

- 工具：内置 `image_gen.imagegen`（通过 `tools.image_gen__imagegen` 调用）。
- 每张独立生成或编辑，统一设置 `transparent_background: true`。未使用 CLI/API 替代方案。
- 参考图：`public/assets/room.png`、`public/assets/crafted/token-clean.png`、`public/assets/crafted/chest-open.png`，均在生成前验看。
- 成对状态通过编辑同一基础原画得到：干净腰牌→泥污腰牌；干布→湿布。轮廓与主要褶皱、绳结保持一致。
- 最终 PNG 直接复制生成原文件，保留 RGBA；未用 Python、SVG 或其他程序绘制、抠图、裁剪、调色或转换图片。Pillow 仅用于读取尺寸和检查透明通道。
- 每张已分别验看，并检查 alpha 范围、主体包围盒及留白。原始生成文件均保留于 `/workspace/scratch/9779d84e4f4c/generated_images/`。

## 最终资产

所有交付图片位于 `public/assets/crafted/`。包围盒坐标按 PNG 原始像素记为 `(left, top, right, bottom)`，使用 `alpha > 16` 排除不可见或几乎不可见的边缘噪点。

| 文件 | 尺寸 | alpha 范围 | 主体包围盒 |
| --- | --- | --- | --- |
| token-cutout-v2.png | 1122 × 1402 | 0–255 | (263, 185, 905, 1174) |
| token-dirty-cutout-v2.png | 1122 × 1402 | 0–255 | (262, 186, 902, 1175) |
| cloth-dry-v2.png | 1536 × 1024 | 0–254 | (186, 325, 1349, 739) |
| cloth-wet-v2.png | 1536 × 1024 | 0–254 | (187, 325, 1349, 739) |
| folded-document-v2.png | 1536 × 1024 | 0–254 | (158, 208, 1378, 809) |
| torn-order-v2.png | 1024 × 1536 | 0–254 | (271, 393, 752, 1188) |

腰牌正面保持无字，供代码叠加剧情姓名；泥污版覆盖自然干泥，不能读出文字。干湿布的主体边界仅约 1–2 像素差异。纸张墨迹为不可读的残笔，正式剧情线索文字应由代码排版。

PNG 某些完全透明像素的 RGB 分量仍存有暖色值，但其 alpha 为 0，正常浏览器合成不可见；接入时应保留 alpha，避免将图片铺平为不透明 JPG。物件留白不同，背包接入时可按上表主体包围盒校准可见尺寸。

## 最终提示词与生成来源

以下为实际提交的完整提示词。带“采用”的步骤对应最终资产；基础步骤保留用于复现依赖关系。每次均独立调用 imagegen，未生成拼图或 sprite sheet。

### 1. 腰牌基础提取

来源原图：`exec-2a776129-ce55-43e1-a357-af52c228a5a5.png`。

输入参考/编辑目标：

- `/workspace/sites/gucheng-nightfire/.sites-checkout/public/assets/crafted/token-clean.png`

```text
Use case: background-extraction. The input is the edit target. Extract the SAME old iron waist identity token AND its attached dark oxblood red cord, removing ALL dark cloth background and background shadow. Preserve the exact shouldered rectangular iron plaque shape, top hole, aged iron/rust/scratches, the cord knot at the top hole and the loosely looped and frayed red cord above. Preserve identity, proportions, silhouette and front-face wear. The front metal face is wholly BLANK: no writing, no symbols. Face visible front-on with a very slight overhead material view, not an isometric icon. Canvas portrait 4:5. Add transparent outer margin if needed without changing the token and cord. A production item cutout for the historical Chinese mystery game Gucheng Nightfire. Realistic painterly rendering, tangible worn material microtexture, restrained earth colors, gentle warm candlelight from upper right and soft cooler fill, matching the provided barracks/chest art. One complete isolated object centered in its canvas, all parts entirely visible, with at least 10 percent fully transparent margin on EVERY side. Genuine RGBA alpha transparency, including all holes and gaps. NO floor, cloth backdrop, tabletop, panel, backdrop, gradient, vignette, UI, title, border, glow, white stroke, text labels, watermark, collage or spritesheet. No baked checkerboard. Do not add a shadow plate.
```

### 2. 腰牌透明边距整理（采用）

来源原图：`exec-354b4494-6463-4d07-a1fd-b8856d2be120.png`。

输入参考/编辑目标：

- `/workspace/scratch/9779d84e4f4c/generated_images/exec-2a776129-ce55-43e1-a357-af52c228a5a5.png`

```text
Use case: background-extraction. EDIT this transparent iron waist-token asset. Preserve the exact iron plaque silhouette, proportions, worn texture and blank face, and exact attached dark red looped cord and knot. Make the COMPLETE token-and-cord group smaller within the same portrait 4:5 canvas: all visible object pixels, including frayed cord hairs, must fit entirely between x14% and x86%, and y12% and y88%. Leave the outside margins completely transparent. Erase ALL shadow, color glow and stray isolated pixels outside the actual object silhouette. Genuine alpha=0 on ALL background pixels, all gaps between cord and through hole. No new backdrop, no checkerboard, no semi-transparent haze, NO cast shadow whatsoever. Do not add symbols or writing. Keep realistic painterly worn material and warm candlelit highlights ON THE OBJECT ONLY. The object must retain its existing shape, not a different token.
```

### 3. 泥污腰牌（采用）

来源原图：`exec-2ebed7a3-f79e-441a-9fc5-10d1115b8f30.png`。

输入参考/编辑目标：

- `/workspace/sites/gucheng-nightfire/.sites-checkout/public/assets/crafted/token-cutout-v2.png`

```text
Use case: precise-object-edit. Edit only the metal surface of this existing transparent cutout. Preserve EXACT canvas, object placement, size, silhouette, cord loops, cord knot, top hole, edge thickness, lighting and full transparency. Add a natural irregular crust of DRIED brown-grey MUD to the front face of the SAME iron waist plaque. Dirt consists of uneven smeared patches, crumbly dry texture and cracks, concentrated across the center and lower face so any inscription would be obscured. Leave some worn iron visible near edges. Do not add writing, glyphs, icons or new objects. Do not soil or reshape the dark red cord. Keep no fewer than 10 percent transparent margin each side exactly as the input, genuine alpha=0 background and through all holes. NO shadow, glow, haze, floor, backdrop, panel or checkerboard. Warm candlelight ON THE OBJECT only, realistic painterly antique iron matching target. The result is this SAME token before cleaning.
```

### 4. 干麻布（采用）

来源原图：`exec-37502cff-aabe-4439-90c0-4a969fd4b189.png`。

无输入图，新生成。

```text
Use case: historical-scene. A single photorealistically hand-painted game inventory cutout of a small folded strip of old grey-beige hemp cloth. It has rough visible woven fibers, three loose folds, slightly ragged edges and supple believable wrinkles. Horizontal low stack viewed gently from above. Restrained muted earth palette, natural material, subtle warm highlights on fabric from upper right. No blood or emblems. Transparent PNG object asset, as if carefully cut out along the fabric silhouette. Canvas landscape 3:2. Object centered entirely within x18–82%, y28–72%, all ragged fibers visible with broad CLEAR transparent margin. Most critical: the cloth is the ONLY visible thing. Nothing behind it, beneath it or around it. Every pixel outside actual fabric fibers must be fully transparent alpha zero. NO SHADOW AT ALL. No contact shadow, no glow, no lighting cloud, no vignette, no brown halo, no platform, no table, no background, no checkerboard. Realistic painted ancient Chinese adventure prop, not a vector icon or cartoon.
```

### 5. 湿麻布（采用）

来源原图：`exec-847ca875-2ab6-4b0a-84b5-4f40e2a95c85.png`。

输入参考/编辑目标：

- `/workspace/sites/gucheng-nightfire/.sites-checkout/public/assets/crafted/cloth-dry-v2.png`

```text
Use case: precise-object-edit. This image is the edit target. Make this SAME folded hemp cloth wet. Preserve EXACT canvas, camera, position, size, silhouette including ragged fibers, layer shapes and every main fold. Do not unfold, rotate, add fabric or change its outlines. Change only fabric state: old grey-beige hemp is now damp, slightly darker brown-grey in an uneven natural way, a little more saturated, with tiny restrained realistic wet sheen on a few raised creases under warm upper-right candlelight. Some areas remain lighter and dry. No puddle, water drops, blue gloss, exaggerated shine, dripping or steam. Preserve its realistic painterly fibers and antique material. Keep genuine alpha transparency from target, all outside object pixels alpha zero, all gaps clear, same broad 10 percent minimum margin. NO shadow, glow, base, background or lighting cloud. No text, no UI, no other objects. This must read as the same exact object after being wetted, suitable for a state swap.
```

### 6. 折叠文书（采用）

来源原图：`exec-2c8e1953-edaf-4626-9775-85e50405699c.png`。

无输入图，新生成。

```text
Use case: historical-scene. One realistic painterly game inventory cutout: a CLOSED folded old Chinese military document, two layers of pale ochre xuan paper in a horizontal 3:2 rectangle, warm but muted paper, subtle creases, visible paper fibers and worn edges, tiny sparse faded abstract ink strokes near the edges, no readable words. Bottom-right corner slightly lifted, edge thickness clear. Almost front view with slight overhead depth, no strong perspective. Canvas landscape 3:2, whole object entirely within x18–82%, y20–80%, broad fully transparent margin on every side. The document must be the ONLY visible thing in the PNG. Precisely cut out paper silhouette, nothing behind or beneath it. NO SHADOW AT ALL. No cast shadow, no contact shadow, no warm glow cloud, no halo, no vignette, no base, no background, no checkerboard, no title or frame. All background pixels fully transparent alpha zero. Subtle upper-right warm highlights restricted to paper. Realistic tactile hand-painted material suitable for a candlelit historical Chinese mystery game, not vector icon, no UI. No wax seal, no ribbon, no props.
```

### 7. 军令残页基础生成

来源原图：`exec-d95a3225-fdad-49b4-8223-42931fd4174c.png`。

输入参考/编辑目标：

- `/workspace/sites/gucheng-nightfire/.sites-checkout/public/assets/crafted/folded-document-v2.png`

```text
Use case: historical-scene. The input image is ONLY the material/paper/color/style reference. Create a DIFFERENT shape from that same kind of old pale ochre xuan paper: one worn, damaged late-Ming military order fragment, a SINGLE thin vertical paper sheet, canvas portrait 2:3. Visible object approximately x20–80%, y12–88%, with all frayed/torn corners entirely inside the image and at least 10 percent clear transparent margin on every side. Irregular torn edges with a missing small lower corner, believable old fold creases and paper fibers. Faded broken black-grey brush ink in sparse vertical manuscript rows, abstract partial strokes and NOT readable words; a few small dark brown old dried blood stains near one torn edge, restrained and non-graphic. Central sheet still mostly aged paper. Near-front slightly overhead view, tactile realistic painterly material and subdued warm upper-right candlelight matching reference. No seal, no ribbon, no weapons, no other items. This is a precisely isolated transparent PNG cutout: genuine RGBA alpha zero everywhere outside actual paper silhouette, NO background, no tabletop, no frame, no shadow of any kind, no halo or lighting haze, no checkerboard, no UI or title. Whole document must be visible.
```

### 8. 军令残页透明边距整理（采用）

来源原图：`exec-66fb31b3-ba85-4825-affc-45c2a883c4ac.png`。

输入参考/编辑目标：

- `/workspace/sites/gucheng-nightfire/.sites-checkout/public/assets/crafted/torn-order-v2.png`

```text
Use case: background-extraction. Edit the supplied transparent military order fragment. Keep the SAME paper shape, every tear, fold crease, partial ink stroke and dark dried blood mark, identical texture and lighting. Change only composition/scale: make the ENTIRE paper fragment significantly SMALLER, centered on a portrait 2:3 canvas. All actual paper pixels must fit within x25–75% and y20–80% so there is broad truly transparent safety margin on every side. Do not crop or reshape any corner. No new marks or objects. True RGBA transparency outside actual paper, no background, no floor, no shadow, no glow, no halo. Preserve natural hand-painted old xuan paper material. This is a scale/centering edit, not new paper.
```


