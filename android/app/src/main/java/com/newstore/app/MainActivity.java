package com.newstore.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.content.Intent;
import android.net.Uri;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();

                if ("new-store-alz.pages.dev".equals(host)) {
                    return false;
                }

                if ("https".equals(uri.getScheme())
                        || "http".equals(uri.getScheme())) {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    return true;
                }

                return true;
            }
        });

        webView.loadUrl("https://new-store-alz.pages.dev/");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
