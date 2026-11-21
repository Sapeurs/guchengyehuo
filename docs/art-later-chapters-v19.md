# 第二至六关新增素材与字形

场景为本作原图的生成编辑，不复制外部成品游戏资产。

| 文件 | 原图 | 编辑目标 |
| --- | --- | --- |
| c4-witness-v19.png | c4-s2-v12.png | 保留暗室与药桌，在草席加入受伤的陈九成，无血腥，原画笔触与光照 |
| c5-guards-v19.png | c5-s0.png | 石拱两侧各两名晚明门军，一人持调令，安静等候；保留前景道具和桌面 |
| c6-dawn-witness-v19.png | c6-s2.png、c4-witness-v19.png | 交接后出现守备与同一伤者；保留晨光、桌面、钟鼓、绞盘 |

提示词约束：preserve full composition and foreground props, match painterly realism and existing lighting, natural proportions, late Ming clothing, no UI, no readable new text, no watermark. 人物按剧情阶段出现；陈九成离开暗室后恢复为空席原图。

对象用HTML/SVG/CSS随状态变化；木面和纸面使用已有workboard-v12.png、paper-leaf-blank-v3.png。枪尾包含鸟铳木托、枪管、火绳锁与箍，断齿显示断口实物。

新增仅用于后五关对象视图的三份v19子集，第一关与序章旧字体不覆盖。

- 实体笔墨：Ma Shan Zheng，Google Fonts OFL。源 https://raw.githubusercontent.com/google/fonts/main/ofl/mashanzheng/MaShanZheng-Regular.ttf 。SHA256：6d2546bb189c732a8ca29af9e22457b152387d158aa459e4ac2ce1e51788b7fb。
- 旁白：LXGW WenKai Regular，OFL。源 https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/fonts/TTF/LXGWWenKai-Regular.ttf 。SHA256：2d73eea94ad808999d90c0000c239a84a33b09d4bc6ab6c5b8bbf1eda8a7fc8b。
- 操作字：运行环境Noto Sans CJK SC Regular，SC索引2，OFL。
- 沿用public/assets/fonts既有对应授权。内部名称GuchengFieldInkV19、GuchengFieldManuscriptV19、GuchengFieldUIV19。
- 重建：python scripts/subset-field-fonts.py。上游TTF置于忽略的.font-source/；脚本检查三个新关卡模块的全部中文字符覆盖，实体字迹用真实简体字形。

本轮浏览器QA截图作为检查证据单独展示，不纳入发布资源。
