// Tên của bộ nhớ cache. Thay đổi tên này khi bạn cập nhật tài nguyên.
const CACHE_NAME = 'expense-tracker-cache-v1';

// Danh sách các tệp cần được lưu vào cache để ứng dụng hoạt động offline.
// Bao gồm trang chính và các tài nguyên quan trọng.
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com'
  // Các tài nguyên khác như icon, manifest.json thường được cache tự động 
  // khi người dùng truy cập, nhưng bạn có thể thêm chúng vào đây nếu muốn chắc chắn.
];

// Sự kiện 'install': được kích hoạt khi Service Worker được cài đặt lần đầu.
self.addEventListener('install', event => {
  // Chờ cho đến khi quá trình cache hoàn tất.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Tạo các request với tùy chọn phù hợp.
        // Điều này quan trọng để xử lý các tài nguyên từ các nguồn khác nhau (cross-origin).
        const requests = urlsToCache.map(url => {
          // Đối với tài nguyên cross-origin như CDN, phải sử dụng chế độ 'no-cors'
          // để tránh lỗi khi thêm vào cache.
          if (url.startsWith('http')) {
            return new Request(url, { mode: 'no-cors', cache: 'reload' });
          }
          // Đối với tài nguyên cùng nguồn gốc (từ chính trang web của bạn).
          return new Request(url, { cache: 'reload' });
        });
        return cache.addAll(requests);
      })
      .catch(error => {
        console.error('SW install failed: ', error);
      })
  );
});

// Sự kiện 'fetch': được kích hoạt mỗi khi có một yêu cầu mạng từ ứng dụng.
self.addEventListener('fetch', event => {
  // Chiến lược "Cache First": Ưu tiên trả về từ cache, nếu không có thì mới fetch từ mạng.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về từ cache nếu có.
        if (response) {
          return response;
        }
        // Nếu không có trong cache, fetch từ mạng.
        // Điều này đảm bảo ứng dụng vẫn có thể tải nội dung mới khi online.
        return fetch(event.request);
      }
    )
  );
});

// Sự kiện 'activate': được kích hoạt sau khi Service Worker mới đã được cài đặt
// và không còn Service Worker cũ nào đang kiểm soát trang.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  // Chờ cho đến khi quá trình dọn dẹp cache cũ hoàn tất.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Nếu cache name không nằm trong danh sách trắng (tức là cache cũ), thì xóa nó đi.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
