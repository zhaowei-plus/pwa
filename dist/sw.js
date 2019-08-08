/**
 * 注册完service worker脚本之后，具体逻辑行为则在本文件实现
 * */

// 用来标注创建的缓存，也可以根据此标志来建立版本规范
const cacheStorageKey = 'minimal-pwa-3'

// 需要缓存的静态资源，一般用于离线使用
const cacheList = [
  '/',
  'index.html',
  'cache.css',
  'pwa.png',
];

// 当sw.js被安装时，serviceWorker内部触发install事件，常用来缓存用于离线时使用的静态资源
self.addEventListener('install', function(e) {
  console.log('Cache event!')
  /**
   * 打开缓存空间，将线相关需要缓存的资源添加到缓存中
   * e.waitUntil() 用于在安装成功之前执行一些预装逻辑，接受Promise对象等待资源缓存成功
   *
   * 注: 推荐只做一些轻量级和非常重要资源的缓存，减少安装失败的概率，安装成功后
   * ServiceWorker 状态会从 installing 变为 installed
   */
  e.waitUntil(
    /**
     * Cache API将资源缓存起来
     */

    caches.open(cacheStorageKey)
    .then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    })
  )
})

/**
 * 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
 * 新的service worker进入active事件
 *
 * 此事件侦听器可以用来清理过时的缓存资源
 */
self.addEventListener('activate', function(e) {
  console.log('Activate event');
  console.log('Promise all', Promise, Promise.all);
  // active事件中通常做一些过期资源释放的工作
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    console.log('cacheNames', cacheNames, cacheNames.map);
    return Promise.all(cacheNames.map(name => {
      if (name !== cacheStorageKey) { // 如果资源的key与当前需要缓存的key不同则释放资源
        console.log('caches.delete', caches.delete);
        var deletePromise = caches.delete(name);
        console.log('cache delete result: ', deletePromise);
        return deletePromise;
      } else {
        return Promise.resolve();
      }
    }));
  });

  console.log('cacheDeletePromises: ', cacheDeletePromises);
  e.waitUntil(
    Promise.all([cacheDeletePromises]
    )
  )
})

// 监听service worker fetch
self.addEventListener('fetch', function (event) {
  console.log('Fetch event ' + cacheStorageKey + ' :', e.request.url);

  // 首先判断缓存当中是否已有相同资源
  event.respondWith(
    caches.match(event.request)
        .then(function(response) {
            // 在缓存中查找到匹配的请求，就从缓存返回
            if (response) {
                console.log('Using cache for:', e.request.url)
                return response;
            }
            // 缓存中没有查找到对应请求，继续网络请求
            console.log('Fallback to fetch:', e.request.url)
            return fetch(e.request.url);
        }
    )
  );
})