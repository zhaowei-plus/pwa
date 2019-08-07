const cacheStorageKey = 'minimal-pwa-3'

const cacheList = [
  '/',
  'index.html',
  'main.css',
  'e.png',
  'pwa-fonts.png',
];

// 当浏览器解析完毕sw闻不见是，serviceWorker内部触发install事件
self.addEventListener('install', function(e) {
  console.log('Cache event!')

  // 打开缓存空间，将线相关需要缓存的资源添加到缓存中
  /**
   * 打开缓存空间，将线相关需要缓存的资源添加到缓存中
   * 
   * e.waitUntil() 接受Promise对象等待资源缓存成功
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