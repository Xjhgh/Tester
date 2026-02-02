const cacheName = 'moein-v4'; // تغییر ورژن برای اعمال تغییرات جدید
const assets = [
  './',
  './index.html',
  './manifest.json',
  './title.png',
  './Logoapp.png',
  './Logotitle.png',
  './30vip.png',
  './40vip.png'
];

// نصب سرویس ورکر و ذخیره فایل‌ها در کش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// فعال‌سازی و پاک‌سازی کش‌های قدیمی
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// پاسخ‌دهی به درخواست‌ها (حتی در حالت آفلاین)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
