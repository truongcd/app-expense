import React from 'react';

const FirebaseConfigWarning: React.FC = () => {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-6 rounded-md shadow" role="alert">
      <p className="font-bold">Chế độ Demo</p>
      <p className="text-sm">
        Ứng dụng đang chạy ở chế độ demo. Dữ liệu của bạn sẽ được lưu trên trình duyệt này và có thể bị mất nếu bạn xóa cache.
      </p>
      <p className="mt-2 text-sm">
        Để lưu trữ dữ liệu vĩnh viễn và đồng bộ trên nhiều thiết bị, bạn cần cấu hình Firebase. Vui lòng xem hướng dẫn trong file <code>services/firebaseConfig.ts</code>.
      </p>
    </div>
  );
};

export default FirebaseConfigWarning;
