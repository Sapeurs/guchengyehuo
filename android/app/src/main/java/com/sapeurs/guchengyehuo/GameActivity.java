package com.sapeurs.guchengyehuo;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.pm.PackageInfo;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.window.OnBackInvokedDispatcher;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

/** An offline game player. No JavaScript interface, network or storage permission. */
public final class GameActivity extends Activity {
    private static final String LOCAL_HOST = "appassets.androidplatform.net";
    private static final String GAME_URL = "https://" + LOCAL_HOST + "/index.html";
    private static final int DARK = Color.rgb(7, 16, 11);
    private WebView game;
    private FrameLayout frame;
    private boolean paused;
    private AlertDialog exitDialog;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        frame = new FrameLayout(this);
        frame.setBackgroundColor(DARK);
        setContentView(frame);
        configureInsets();
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
        startGame();
    }

    private void configureInsets() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            frame.setOnApplyWindowInsetsListener((view, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.displayCutout()
                    | WindowInsets.Type.mandatorySystemGestures());
                frame.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return insets;
            });
        } else if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams attributes = getWindow().getAttributes();
            attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER;
            getWindow().setAttributes(attributes);
        }
        hideSystemBars();
    }

    @SuppressWarnings("deprecation") private void hideSystemBars() {
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.systemBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @SuppressLint("SetJavaScriptEnabled") // Only APK-owned HTTPS assets, no network or JavaScript interface.
    private void startGame() {
        if (game != null) { frame.removeView(game); game.destroy(); }
        frame.removeAllViews();
        PackageInfo engine = WebView.getCurrentWebViewPackage();
        if (engine != null) {
            try {
                int major = Integer.parseInt(engine.versionName.split("\\.")[0]);
                if (major < 110) {
                    showMessage("灯火还未备妥", "请先更新手机上的 Android System WebView 或 Chrome，再回来继续。游戏需要较新的网页运行组件。", false);
                    return;
                }
            } catch (NumberFormatException ignored) { /* Vendor version strings may differ. */ }
        }
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        game = new WebView(this);
        game.setBackgroundColor(DARK);
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings settings = game.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setBlockNetworkLoads(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setUserAgentString(settings.getUserAgentString() + " GuchengNightfire/" + BuildConfig.VERSION_NAME);
        final WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
            .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        game.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!isLocal(uri)) return blocked();
                WebResourceResponse response = assets.shouldInterceptRequest(uri);
                return response != null ? response : blocked();
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocal(request.getUrl());
            }
            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) showMessage("此夜尚未展开", "游戏内容未能载入。可以重新点亮灯火，已保存的进度会保留。", true);
            }
            @Override public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                frame.removeView(view);
                view.destroy();
                game = null;
                showMessage("灯火暂歇", "运行组件刚刚中断。重新进入即可读取已保存的进度。", true);
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) { hideSystemBars(); }
        });
        game.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onConsoleMessage(ConsoleMessage message) {
                if (BuildConfig.DEBUG && message.messageLevel() == ConsoleMessage.MessageLevel.ERROR)
                    Log.e("GuchengWeb", message.message() + " @" + message.lineNumber());
                return true;
            }
        });
        frame.addView(game, new FrameLayout.LayoutParams(-1, -1));
        game.loadUrl(GAME_URL);
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && LOCAL_HOST.equals(uri.getHost())
            && uri.getPort() == -1 && uri.getUserInfo() == null;
    }

    private static WebResourceResponse blocked() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null,
            new ByteArrayInputStream("Not found".getBytes(StandardCharsets.UTF_8)));
    }

    private void showMessage(String title, String body, boolean retry) {
        frame.removeAllViews();
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER);
        int padding = (int) (32 * getResources().getDisplayMetrics().density);
        box.setPadding(padding, padding, padding, padding);
        TextView heading = new TextView(this);
        heading.setText(title);
        heading.setTextColor(Color.rgb(216, 196, 157));
        heading.setTextSize(24);
        box.addView(heading);
        TextView text = new TextView(this);
        text.setText(body);
        text.setTextColor(Color.rgb(188, 185, 162));
        text.setTextSize(16);
        text.setGravity(Gravity.CENTER);
        text.setPadding(0, padding / 2, 0, padding / 2);
        box.addView(text);
        if (retry) {
            Button again = new Button(this);
            again.setText("重新点灯");
            again.setOnClickListener(v -> startGame());
            box.addView(again);
        }
        Button leave = new Button(this);
        leave.setText("暂离");
        leave.setOnClickListener(v -> finish());
        box.addView(leave);
        frame.addView(box, new FrameLayout.LayoutParams(-1, -1));
    }

    @SuppressLint("GestureBackNavigation") // API 33+ registers OnBackInvokedDispatcher in onCreate.
    @SuppressWarnings("deprecation") @Override public void onBackPressed() { handleBack(); }

    private void handleBack() {
        if (exitDialog != null && exitDialog.isShowing()) return;
        if (game == null) { confirmExit(); return; }
        game.evaluateJavascript("Boolean(window.guchengNative && window.guchengNative.back())", handled -> {
            if (!"true".equals(handled)) confirmExit();
        });
    }

    private void confirmExit() {
        if (isFinishing()) return;
        if (game != null) game.evaluateJavascript("window.guchengNative && window.guchengNative.pause()", null);
        exitDialog = new AlertDialog.Builder(this).setTitle("暂离此夜？")
            .setMessage("进度已保存在本机，下次可以继续。")
            .setNegativeButton("继续", (dialog, which) -> {})
            .setPositiveButton("暂离", (dialog, which) -> finish()).create();
        exitDialog.setOnDismissListener(dialog -> {
            if (!paused && !isFinishing() && game != null)
                game.evaluateJavascript("window.guchengNative && window.guchengNative.resume()", null);
        });
        exitDialog.show();
    }

    @Override public void onWindowFocusChanged(boolean focused) {
        super.onWindowFocusChanged(focused);
        if (focused) hideSystemBars();
    }
    @Override protected void onPause() {
        paused = true;
        if (game != null) {
            game.evaluateJavascript("window.guchengNative && window.guchengNative.pause()", null);
            game.onPause();
        }
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        paused = false;
        if (game != null) {
            game.onResume();
            game.evaluateJavascript("window.guchengNative && window.guchengNative.resume()", null);
        }
        hideSystemBars();
    }
    @Override protected void onDestroy() {
        if (exitDialog != null) exitDialog.dismiss();
        if (game != null) { frame.removeView(game); game.destroy(); game = null; }
        super.onDestroy();
    }
}
