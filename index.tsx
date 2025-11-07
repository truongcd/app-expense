import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Biến toàn cục để lưu trữ sự kiện, có thể truy cập ở mọi nơi.
export let deferredInstallPrompt: Event | null = null;

// Biến lưu trữ hàm cập nhật state của component App.
let promptStateHandler: ((event: Event | null) => void) | null = null;

/**
 * Cho phép component App đăng ký hàm `setState` của nó để có thể được gọi từ bên ngoài.
 * @param handler Hàm setState hoặc null để hủy đăng ký.
 */
export const setPromptStateHandler = (handler: ((event: Event | null) => void) | null) => {
  promptStateHandler = handler;
};


// Lắng nghe sự kiện PWA install prompt.
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('`beforeinstallprompt` event fired.');
  // Ngăn chặn trình duyệt tự động hiển thị.
  e.preventDefault();
  
  // Lưu lại sự kiện.
  deferredInstallPrompt = e;

  // Nếu React component đã sẵn sàng và đã đăng ký handler,
  // hãy gọi nó ngay lập tức để cập nhật UI.
  if (promptStateHandler) {
    console.log('React handler is ready, calling it now.');
    promptStateHandler(e);
  } else {
    console.log('React handler not ready yet. Event is stored.');
  }
});


// Đăng ký Service Worker cho PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);