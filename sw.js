// Tên của bộ nhớ cache. Tăng phiên bản khi bạn cập nhật tài nguyên.
const CACHE_NAME = 'expense-tracker-cache-v4';

// Danh sách các tệp cơ bản cần có để ứng dụng khởi chạy (app shell).
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/index.tsx' 
];

// Sự kiện 'install': được kích hoạt khi Service Worker được cài đặt.
// Mở cache và lưu các tệp trong app shell vào đó.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('SW install failed: ', error);
      })
  );
});

// Sự kiện 'fetch': được kích hoạt cho mọi yêu cầu mạng.
// Sử dụng chiến lược "Network First, falling back to Cache".
self.addEventListener('fetch', event => {
  event.respondWith(
    // 1. Cố gắng fetch từ mạng trước.
    fetch(event.request)
      .then(networkResponse => {
        // Nếu fetch thành công, lưu bản sao vào cache và trả về response.
        // Điều này đảm bảo cache luôn được cập nhật với dữ liệu mới nhất.
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // 2. Nếu fetch thất bại (VD: mất mạng), thử lấy từ cache.
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Nếu không có trong cache, yêu cầu thực sự thất bại.
            // Có thể trả về một trang offline dự phòng tại đây nếu muốn.
          });
      })
  );
});

// Sự kiện 'activate': dọn dẹp các cache cũ.
// Điều này đảm bảo rằng người dùng luôn nhận được phiên bản mới nhất của các tệp
// sau khi Service Worker mới được kích hoạt.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Nếu cache name không nằm trong danh sách trắng, xóa nó đi.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
