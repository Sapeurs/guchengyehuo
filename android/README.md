# 孤城夜火 Android 离线版

Android 包 0.26.0（versionCode 2600），使用网站第 26 版的同一份离线游戏。侧库照签、旧道救人、东门绞关和城楼回灯可在现场操作。

- 安装要求：Android8.0/API26起，Android System WebView/Chrome110以上。运行组件过旧时显示更新提示。
- 原生Java Activity通过AndroidX WebViewAssetLoader读取APK中的完整静态内容。没有INTERNET、存储、通讯录、位置等权限；不访问ChatGPT登录页。纯Java，无CPU ABI限制。
- 横屏可左右翻转，隐藏系统栏并保留刘海及系统手势安全区；屏幕在游玩时保持常亮。
- 系统返回键依次收起物件/背包、打开篇章页；标题页返回会询问是否暂离。API33以上注册OnBackInvokedDispatcher，较旧系统使用onBackPressed。
- Android背景绘制使用Canvas2D，避免为静态场景另建WebGL上下文；其余场景仍是HTML/SVG可动构件。
- 后台暂停Web Audio，回前台恢复。每次游戏状态变化沿用原存档写入；途中拖动也沿用各机关的保存逻辑。
- 网页与APK的存储源隔离，网页存档不会自动迁移。相同包名、同一签名的覆盖更新会保留APK存档；卸载或清除应用数据会丢失本地存档。没有云同步和账号系统。

## 构建

需要Node/npm、JDK17以上、Android SDK平台35/Build Tools35.0.0。

```sh
npm ci
npm test
npm run build
cd android
./gradlew assembleDebug
./gradlew assembleRelease lintRelease
```

本地local.properties指定sdk.dir；Gradle8.13、Android Gradle Plugin8.13.2、AndroidX Webkit1.12.1固定版本。Gradle包装器随源码提交。

release需要私有signing.properties：storeFile、storePassword、keyAlias、keyPassword。签名材料与密码不提交Git，单独保留私有备份；以后升级必须复用。debug使用独立.debug包名，避免覆盖正式体验版。

assets直接指向根目录dist，禁止手工拷贝造成网页和APK版本漂移。verifyWebAssets在未构建网页时阻止APK构建；scripts/verify-android-apk.py检查签名、权限、版本、CPU无关性和所有dist文件的字节一致性。

## 本版验证边界

90项状态与关卡检查通过；桌面浏览器实际验证了箱底拖动、错误试验反馈、刷新续接、两份日期核对、对光看旧签，以及不查印章/车辙也能从第一关进入第二关。release构建与Android lint通过，逐文件核对离线资源、零权限及原签名。未完成真实Android手机上的安装和触摸通关验证。

## Android实现参考

- https://developer.android.com/develop/ui/views/layout/webapps/load-local-content
- https://developer.android.com/jetpack/androidx/releases/webkit#1.12.1
- https://developer.android.com/build/releases/agp-8-13-0-release-notes
- https://developer.android.com/about/versions/16/behavior-changes-16

窗口适配按游戏类别声明，仍允许系统多窗口与厂商兼容设置。未使用绕过系统限制的私有API。
