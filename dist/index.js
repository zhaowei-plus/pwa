if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // 1、注册 serviceWorker，返回 promise 对象
        navigator.serviceWorker.register('/sw.js',  {
            scope:  '/app/'
        })
            .then((registration) => {
                window.registration = registration
                console.log('Registration successful, scope is:', registration.scope);

                /**
                 * 主线程中返回的状态 waitting 表示ServiceWorker 进入 installed 状态
                 */
                if (registration.waitting) {
                    console.log(' Service Worker is Waiting')
                }

                if (registration.active) {
                    console.log(' Service Worker is Activate')
                }
            }, (error) => {
                console.log('Service Worker registration failed, error:', error);
            })
    })
}