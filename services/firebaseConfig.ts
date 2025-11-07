// =================================================================
// CẤU HÌNH FIREBASE
// =================================================================
// 1. Truy cập Firebase Console: https://console.firebase.google.com/
// 2. Tạo một dự án mới (hoặc chọn dự án đã có).
// 3. Đi đến Project Settings (biểu tượng bánh răng) > General.
// 4. Trong phần "Your apps", chọn biểu tượng Web (</>).
// 5. Đăng ký ứng dụng của bạn và Firebase sẽ cung cấp cho bạn một đối tượng `firebaseConfig`.
// 6. Sao chép các giá trị đó và dán vào đối tượng `firebaseConfig` dưới đây.
// 7. Cài đặt Firebase SDK trong project của bạn bằng lệnh: `npm install firebase`
// =================================================================

// TODO: Thay thế các giá trị placeholder dưới đây bằng cấu hình Firebase của bạn.
export const firebaseConfig = {
  apiKey: "AIzaSyAK2SFfqpAmWT8u__sI7uxj8IgKF3d9XAA",
  authDomain: "app-management-e9f24.firebaseapp.com",
  projectId: "app-management-e9f24",
  storageBucket: "app-management-e9f24.firebasestorage.app",
  messagingSenderId: "755162223579",
  appId: "1:755162223579:web:5315963fc9f45bf70c4dfe",
  measurementId: "G-0TXY7T7N1H"
};

// Kiểm tra xem các giá trị cấu hình đã được thay đổi từ placeholder hay chưa
// Điều này quyết định ứng dụng sẽ chạy ở chế độ demo (dùng mockService)
// hay chế độ thật (dùng firebaseService).
export const isFirebaseConfigured =
  firebaseConfig.apiKey !== "AIzaSyAK2SFfqpAmWT8u__sI7uxj8IgKF3d9XAA" &&
  firebaseConfig.projectId !== "app-management-e9f24";
