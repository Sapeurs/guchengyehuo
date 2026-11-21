# GitHub 源码导入

源码已整理为可独立安装、测试和构建的 Vite + TypeScript + Phaser 项目。当前试玩在 Sites 托管；尚未在用户 GitHub 账号建仓或推送。连接器能访问现有仓库，但本次没有建仓能力；终端 GitHub CLI 与建仓网页也没有可用登录会话。

## 导入空仓库

在 GitHub 创建一个空仓库，例如 `gucheng-nightfire`，不要预先添加 README。在源码解压目录依次执行：

```bash
git init -b main
git add .
git commit -m "Add Gucheng Nightfire game"
git remote add origin YOUR_EMPTY_REPOSITORY_URL
git push -u origin main
```

`YOUR_EMPTY_REPOSITORY_URL` 应替换为本人新建空仓库的实际地址。通过 GitHub 官方登录完成认证，不要把密码或访问令牌写进文件。

## 验证

```bash
npm ci
npm test
npm run build
npm run preview
```

游戏进度存在各玩家浏览器中，不随代码仓库上传。根路径静态托管可直接使用 `dist`；GitHub Pages 项目子路径需先调整所有 `/assets/` 路径，不应直接声称上传源码就能在线游玩。美术和字体来源见 README 与 docs。项目尚未选择整体开源许可证，仓库可见性与授权应在正式对外发布时确定。
