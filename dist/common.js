/**
 * @description 注册 service worker
 */
_initServiceWorker: function() {
    var isWeChat = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1;
    if ('serviceWorker' in navigator
        && 'caches' in window &&
        'fetch' in window &&
        Label.miniPostfix !== '' &&
        !isWeChat
    ) {
        navigator.serviceWorker.register('/sw.js?' + Label.staticResourceVersion, {scope: '/'});
    }
}