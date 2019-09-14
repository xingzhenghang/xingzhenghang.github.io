// index.js
// 注册service worker，service worker脚本文件为sw.js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function () {
        console.log('Service Worker 注册成功');
    });
}
// 监听install事件
self.addEventListener('install', function (e) {
    console.log('Service Worker 状态： install');
});
