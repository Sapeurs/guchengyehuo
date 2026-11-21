# 第一关场景交互素材 v10

2026-11-11，使用内置 ImageGen。源图为本仓库已有的项目原画。生成后保留原件，并复制到下列版本化资产路径，未覆盖旧图。

| 成果路径 | 用途 | 输入参考 |
| --- | --- | --- |
| `public/assets/chapters/hand-oil-lamp-v10.png` | 真透明背景的手提油灯，场景、背包、近景共用 | `c1-s2.png` 的材质与画风 |
| `public/assets/chapters/c1-s1-covered-v10.png` | 遮灯后簿房；灯焰与局部暖光消失，月光保留 | `c1-s1.png` |
| `public/assets/chapters/c1-wheel-tracks-v10.png` | 车辙转弯与芦苇的实体近景，光照由代码施加 | `c1-s0-closed-v7.png` 的地面与材质 |
| `public/assets/chapters/c1-s2-cleared-v10.png` | 移除案上两片散纸，供代码呈现已拼合的整签 | `c1-s2.png` |

## 提示词规格

1. **油灯／background-extraction**：ONE small late-Ming hand-carried oil lamp; squat shallow aged dark bronze bowl, short circular foot, simple curved bronze handle on two hinge ears; open oil surface and one burning cotton wick. Three-quarter view, painterly realistic aged materials matching reference room. Transparent background, full silhouette and clear margin. No glass, no kerosene lamp, no paper lantern, no text, no UI, no floor or extra objects.
2. **遮灯状态／precise-object-edit**：Edit only hanging oil bowl at x72%,y27%; soot-dark bronze bell-shaped shield completely covers wick/flame; chains and bowl stay in place. Remove localized warm glow; preserve cool moonlight, all furniture geometry, papers, weapons, cupboard, window, camera and brushwork. No new objects, text or people.
3. **车辙近景／historical-scene**：Steep downward view of only wet stone paving, thin muddy silt and two parallel cart-wheel ruts bending toward left/west. Curved scuff near x39%,y59%; broken reed stalks with narrow frayed leaves pressed into rut near upper middle. Realistic contact shadows, low-contrast cool moonlight, readable wet-stone texture, no baked warm light. No architecture, boxes, UI, arrows, numbers or decorative clues. Final reed hotspot is aligned to the observed output at x56%,y40%.
4. **清理桌面／precise-object-edit**：Remove only the two pale blank paper scraps at x40–59%,y70–81%, reconstruct bare worn wooden tabletop. Preserve tied cloth packet, wax bowl, lamp, camera, lighting, doors, weapons, furniture and all other elements. No added frame, paper, letters, UI or people.

## 补充字形

`world-serif-v10.woff` 使用系统 Noto Serif CJK SC 原字体重新命名后提取新增字形，补足原手写字库缺少的 9/8 个字；`world-ui-v10.woff` 使用 Noto Sans CJK SC，补足界面新增 8 个字。按各原字体缺字集合声明 unicode-range，只为原子集中缺少的字提供后备字形。Noto 字体采用 SIL OFL 1.1，许可文本已保留于 `public/assets/fonts/UI-OFL.txt`；未使用原保留字体名称标识新子集。
