# 第一关开箱样板 · v13

范围仅为“靠近甲三箱—试拉—用木撬—压锁舌—抽横木—抬盖—检查空箱—取残签”，用于检验游戏感。其他谜题和后五关尚未按此标准改造。

## 交互与呈现

- 进入全幅近前视角，取消开箱时的居中图片卡片、模糊背景和通用机关棋盘。
- 横木、撬棍、铁箍、锁舌托片、铜砝码、箱盖和衬布分层。物件随鼠标或方向键运动。
- 未撬起时抽不动横木；锁舌未压住会回弹；横木未退出时盖子受阻。
- 铜砝码只在撬棍抬起之后才能放上锁舌。它不是点选后直接判题完成。
- 横木退出后被放到视野下方，盖子随拖动掀起。箱子打开后不弹结论面板，玩家继续在箱内调查。
- 掀布、取签留在同一近景；残签进入原有随身物品并可用于侧库拼合。
- 线索通过受阻反馈、短对白和玩家主动询问老军匠给出；不常驻步骤清单。
- 木件接触有拖动摩擦、受阻和脱扣声。未进行真人听感评测。

## 兼容与操作

- 原有六关、序章的已解记录保留。旧版第一关尚未完成的滑块摆放改为新锁舌进度，已使用的工具保留。
- 新进度记录楔起、横木退出和开盖的百分比。拖动结束、退后或页面失焦时保存。
- 方向键与物件移动方向一致；点按也可逐段操作。工具可拖入窄缝，也可先点选再点对应位置。
- 标题页“重访军器库”先备份第一关记录，再重新调查；篇章页仍可恢复备份。

## 验证

- TypeScript / Vite 生产构建通过。
- 33/33 项测试通过，包括新增的锁舌顺序、工具约束、阻挡、阶段进度恢复、旧滑块存档迁移。
- 真实桌面浏览器：未用工具试拉受阻；取撬棍并拖入缝隙；向下拖手柄；无砝码时横木回弹；去簿房取砝码再返回；压舌后抽木；抬盖、掀布、取签。
- 实测横木退出 50.1% 时刷新，继续后仍为 50.1%；随后用方向键完成抽木。
- 真实浏览器验证旧记录恢复后可进入新版开箱；再次取出的残签在侧库的随身物品栏可见。
- 最终复测：点按使用工具、方向键压撬、拖动抽木与抬盖、方向键掀布和拾取残签，均可完成。
- 未在手机实体设备上试玩，未声称所有终端均已验收。

## 资产

新增文件均由内置图像生成工具制作，保留 v12 原图，新增到项目资源目录。原木箱闭合图作为三次生成的编辑/风格参考，保持固定机位和灯光；图层位置与运动由游戏代码控制。

- public/assets/chapters/crate-body-v13.png：固定箱体，1672×941。
- public/assets/chapters/crate-open-v13.png：打开后的空箱，1672×941。
- public/assets/chapters/crate-bar-v13.png：透明木闩，2172×724。
- 实测截图：screenshots/crate-contact-v13.jpg、screenshots/crate-empty-v13.jpg。

### 最终提示词

固定箱体：

Use case: precise-object-edit. This exact painted late-Ming military chest close-up is the edit target. Remove ONLY the long sliding wooden crossbar running across the upper front. Keep the two iron vertical keeper brackets fixed in exactly the same locations; their empty rectangular channels are now visible against dark worn timber. In the narrow lid seam behind the right keeper, expose a small springy dark iron lock tongue pointing upward; small enough to be pressed down by a bronze weight. Lid stays CLOSED. Preserve absolute camera, chest body, lid, handle, cloth and ropes, background, oil bowl, lighting, full wide framing. No text, symbols, hands, UI or extra objects. This will be the stationary layer behind a separately animated crossbar.

开盖状态：

Use case: precise-object-edit. Edit this exact game close-up into its OPENED state. Same fixed camera and identical chest-body position and size. The chest lid is raised on its back hinges, its underside visible behind the box opening. The burlap and loose top rope have folded back with the lid. The long front wooden crossbar has been removed. Reveal a completely EMPTY dark wooden interior with worn bare planks, no weapons, treasure, papers or new contents. Preserve the front ring handle, fixed iron fittings and all non-chest background details, warm oil light and cool night fill. Wide original composition, no text or UI. Crucially keep the front lower body pixel-aligned so it can be animated between states.

透明横木：

Use case: background-extraction. Asset: a transparent game sprite matching the wooden sliding crossbar on the chest in the reference. Isolate ONLY a single continuous long narrow dark-brown timber bar with warm worn edges. Match its slight upward-to-the-right perspective, beveled end and coarse hand-painted grain. Reconstruct the wood where iron brackets had covered it: NO iron keeper brackets on the sprite; they belong to the fixed chest. The bar extends horizontally across a wide transparent canvas, completely visible, close-up. No chest, cloth, rope, background, hands, text or UI. True alpha transparency, not a checkerboard.

