
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent"
        role="status"
        aria-live="polite"
      ></div>
      <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
    </div>
  );
};

export default Spinner;
