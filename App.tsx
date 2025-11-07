import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Expense, Category } from './types';
import * as firebaseService from './services/firebaseService';
import { firebaseConfig } from './services/firebaseConfig';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import FilterControls from './components/FilterControls';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import SummaryChart from './components/SummaryChart';
import Spinner from './components/Spinner';

// Logic kiểm tra cấu hình Firebase
const isFirebaseConfigured = () => {
  // FIX: The `firebaseConfig` object is not exported from the `firebaseService` module.
  // It must be imported directly from `./services/firebaseConfig`.
  const { apiKey, projectId } = firebaseConfig;
  return apiKey && !apiKey.includes('...EXAMPLE...') && projectId && projectId !== 'example-project-id';
};

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('theme');
      if (storedPrefs) {
        return storedPrefs as 'light' | 'dark';
      }
    }
    return 'light'; // Default to light
  });
  
  // Effect để xử lý PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Effect để áp dụng theme và lắng nghe thay đổi từ hệ thống
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    // Xử lý khi người dùng chưa có lựa chọn, sẽ theo theme hệ thống
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
         setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    // Đặt theme ban đầu nếu chưa có lựa chọn
     if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
     }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedExpenses = await firebaseService.getExpenses();
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

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      setError(null);
      await firebaseService.addExpense(expense);
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
      await firebaseService.deleteExpense(id);
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
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
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