import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Expense, Category } from './types';
import * as firebaseService from './services/firebaseService';
import * as mockService from './services/mockService';
import { firebaseConfig } from './services/firebaseConfig';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import FilterControls from './components/FilterControls';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import SummaryChart from './components/SummaryChart';
import Spinner from './components/Spinner';
import FirebaseConfigWarning from './components/FirebaseConfigWarning';
// Import các hàm và biến cần thiết từ index.tsx
import { deferredInstallPrompt, setPromptStateHandler } from './index'; 

// Interface cho sự kiện PWA install prompt để có type checking tốt hơn
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Logic kiểm tra cấu hình Firebase
const isFirebaseConfigured = () => {
  const { apiKey, projectId } = firebaseConfig;
  return !!(apiKey && !apiKey.includes('...EXAMPLE...') && projectId && projectId !== 'example-project-id');
};

// Chọn service phù hợp: Firebase nếu đã cấu hình, ngược lại dùng mock service (localStorage)
const service = isFirebaseConfigured() ? firebaseService : mockService;

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Logic khởi tạo theme thông minh hơn
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Nếu không có lựa chọn từ người dùng, dùng theme hệ thống
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Effect để xử lý PWA install prompt - giải pháp chống race-condition
  useEffect(() => {
    // 1. Đăng ký hàm setInstallPrompt với module index.tsx.
    // Bất cứ khi nào sự kiện 'beforeinstallprompt' được kích hoạt, nó sẽ gọi hàm này.
    setPromptStateHandler(setInstallPrompt as (event: Event | null) => void);
    console.log('React component registered its prompt handler.');

    // 2. Kiểm tra xem sự kiện đã được bắt TRƯỚC KHI component này mount hay chưa.
    // Nếu có, cập nhật state ngay lập tức.
    if (deferredInstallPrompt) {
      console.log('Install prompt was already available. Setting state.');
      setInstallPrompt(deferredInstallPrompt as BeforeInstallPromptEvent);
    }

    // 3. Dọn dẹp: Hủy đăng ký handler khi component unmount để tránh memory leak.
    return () => {
      console.log('React component un-registered its prompt handler.');
      setPromptStateHandler(null);
    };
  }, []);

  // Effect để áp dụng theme và lắng nghe thay đổi từ hệ thống
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    // Lắng nghe thay đổi theme từ hệ thống
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Chỉ thay đổi nếu người dùng chưa tự chọn theme (chưa lưu trong localStorage)
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  const handleInstall = async () => {
    if (!installPrompt) {
      console.warn('handleInstall called but installPrompt is null.');
      return;
    }

    // Hiển thị lời nhắc cài đặt
    installPrompt.prompt();
    
    // Chờ người dùng phản hồi. `userChoice` sẽ resolve khi người dùng
    // chấp nhận hoặc từ chối lời nhắc.
    const { outcome } = await installPrompt.userChoice;
    
    // Ghi lại kết quả (tùy chọn)
    if (outcome === 'accepted') {
      console.log('User accepted the PWA installation prompt.');
    } else {
      console.log('User dismissed the PWA installation prompt.');
    }

    // Quan trọng: Xóa trạng thái prompt sau khi nó đã được sử dụng.
    // Lời nhắc cài đặt chỉ có thể được sử dụng một lần.
    // Việc này sẽ ẩn nút cài đặt đi một cách an toàn.
    setInstallPrompt(null);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    // Lưu lựa chọn của người dùng vào localStorage
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedExpenses = await service.getExpenses();
      setExpenses(fetchedExpenses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
      setError(`Không thể tải dữ liệu: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      setError(null);
      await service.addExpense(expense);
      setIsFormVisible(false);
      await fetchExpenses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
      setError(`Không thể thêm chi tiêu mới: ${errorMessage}`);
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const originalExpenses = [...expenses];
    try {
      setError(null);
      setExpenses(prev => prev.filter(e => e.id !== id));
      await service.deleteExpense(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
      setError(`Không thể xóa chi tiêu: ${errorMessage}`);
      setExpenses(originalExpenses);
      console.error(err);
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
      const monthMatch = monthFilter === 'all' || `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}` === monthFilter;
      return categoryMatch && monthMatch;
    });
  }, [expenses, categoryFilter, monthFilter]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  }, [expenses]);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header 
        onInstall={handleInstall} 
        showInstallButton={!!installPrompt} 
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        
        { !isFirebaseConfigured() && <FirebaseConfigWarning /> }

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-600 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Summary expenses={filteredExpenses} />
              <SummaryChart expenses={filteredExpenses} />
            </div>
           <FilterControls 
             categoryFilter={categoryFilter}
             setCategoryFilter={setCategoryFilter}
             monthFilter={monthFilter}
             setMonthFilter={setMonthFilter}
             availableMonths={availableMonths}
           />
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={() => setIsFormVisible(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-11/12 max-w-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Thêm Chi Tiêu Mới</h2>
              <ExpenseForm onAddExpense={handleAddExpense} onCancel={() => setIsFormVisible(false)} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        ) : (
          <ExpenseList expenses={filteredExpenses} onDeleteExpense={handleDeleteExpense} />
        )}
      </main>
      
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsFormVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          aria-label="Thêm chi tiêu mới"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;