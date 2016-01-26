define('mWebview',function(require, exports, module){

    var connectWebViewJavascriptBridge=function(callback){
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge)
            }, false)
        }
    };

    return {
        connectWebViewJavascriptBridge:connectWebViewJavascriptBridge//初始化函数
    }
});
