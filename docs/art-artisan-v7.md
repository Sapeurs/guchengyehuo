# 老军匠立绘 v7

日期：2026-11-11。第一关的原创人物立绘，采用内置 imagegen 生成与编辑。未使用商业游戏人物素材。

## 文件与检查

| 文件 | 用途 | 尺寸／格式 |
| --- | --- | --- |
| `public/assets/chapters/artisan-neutral-v7.png` | 库门旁常态立绘、普通问答 | 1024 × 1536，RGBA |
| `public/assets/chapters/artisan-alert-v7.png` | 察觉巡兵、抬手示意低声 | 1024 × 1536，RGBA |

两张均以相同人物、服装、光照和近似站位绘制，全身、双手和鞋均可见。图像呈写实手绘质感，灰布头巾、束发、短须和交领粗布衣服符合本项目明末美术设定；不将数字立绘当作文物复原依据。

透明度已读取核对：两图均为 0–254 的 alpha，常态 1,028,824 像素全透明，警觉态 1,033,453 像素全透明。预览器显示的黑色／暖色背景是全透明区域保留的 RGB（抽样 alpha 为 0），应通过标准 alpha 合成显示，不应丢弃 alpha 或将 RGB 背景当作实体背景。

此任务只生成立绘与提示记录；角色尺寸、脚底位置、对话裁切与场景照明由主工程最终检查。

## 常态提示词

Use case: historical-scene. Asset type: full-body transparent-background character sprite / dialogue illustration for an original serious South Ming historical mystery point-and-click game. Match the tactile realistic hand-painted game background reference in this conversation: mature painterly 2D realism, subtle brush texture, restrained cool moon edge light with soft amber lantern side light, no anime or cartoon outlines. Subject: one original Chinese Han military artisan about 60 years old, weathered thoughtful face, gray-white short beard, rough hands, modest faded dark brown coarse-cloth crossed-collar Ming short robe, cloth belt, worn dark trousers and cloth shoes. Ming-style hair tied in a topknot covered with a simple gray cloth headscarf; no Qing queue, no shaved forehead. Calm protective but exhausted expression, slightly turned toward screen right; relaxed credible standing pose with one hand resting lightly at belt and the other loose at side. Vertical portrait framing, whole body from head to soles fully visible with generous transparent padding, centered, feet level, natural proportions. He is waiting quietly by a military storeroom gate. Background must be genuinely transparent, not a painted room or checkerboard. No weapons, no text, no logo, no accessories unrelated to a humble artisan. A single person only, no panels. Preserve readable silhouette for small scene use and detailed face for large dialogue use.

画风参考：`public/assets/chapters/c1-s0.png`，生成前已查看，只参考写实手绘、冷暖光与材质。

## 警觉态编辑提示词

Use case: identity-preserve / precise-object-edit. Edit target: the provided full-body old Ming military artisan character sprite. Create a second alert dialogue pose for the SAME character. Preserve exact identity, age, gray short beard, gray headscarf and covered Ming topknot, weathered face, clothing colors/materials, body proportions, shoes, cool moon edge and warm side lighting, painterly realism, full vertical framing and transparent background. Change only his expression and one gesture: he notices distant approaching patrol footsteps, eyebrows tense slightly and gaze turns a little toward screen right, his currently lowered hand rises to chest height with an open small palm to quietly signal 'keep your voice down'. The other hand stays by his belt. Keep the gesture restrained and anatomically natural, not threatening. Whole figure from head to soles remains complete and in nearly the same position and scale. No speech balloon, no text, no weapon, no new object. The background must remain genuinely transparent with clean silhouette and no opaque halo, painted background, or drop shadow.

编辑目标：常态立绘 `artisan-neutral-v7.png`，编辑前已查看。透明背景选项在两次生成中均设为 true。生成原图直接复制至项目，没有使用代码绘图、抠图或重绘。
