import { Expense, Category } from '../types';

const LOCAL_STORAGE_KEY = 'expenses-mock-data';

// Dữ liệu ban đầu cho mục đích demo
const getInitialData = (): Expense[] => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const midMonth = new Date(now.getFullYear(), now.getMonth(), 15).toISOString().split('T')[0];
  const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];


  return [
    { id: 'mock-1', description: 'Cà phê sáng', amount: 45000, category: Category.Food, date: yesterday },
    { id: 'mock-2', description: 'Tiền xăng xe', amount: 500000, category: Category.Transport, date: firstDayOfMonth },
    { id: 'mock-3', description: 'Mua sắm tạp hóa Coopmart', amount: 750000, category: Category.Shopping, date: midMonth },
    { id: 'mock-4', description: 'Ăn trưa văn phòng', amount: 60000, category: Category.Food, date: firstDayOfMonth },
    { id: 'mock-5', description: 'Xem phim cuối tuần', amount: 250000, category: Category.Entertainment, date: yesterday },
  ];
};

const getStoredExpenses = (): Expense[] => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    // Nếu không có dữ liệu, thiết lập dữ liệu ban đầu
    const initialData = getInitialData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error("Không thể truy cập localStorage", error);
    return getInitialData();
  }
};

const saveExpenses = (expenses: Expense[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Không thể lưu vào localStorage", error);
  }
};

let expenses: Expense[] = getStoredExpenses();

export const getExpenses = async (): Promise<Expense[]> => {
  // Giả lập độ trễ mạng
  await new Promise(res => setTimeout(res, 500));
  // Sắp xếp giảm dần theo ngày
  return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<string> => {
  await new Promise(res => setTimeout(res, 300));
  const newExpense: Expense = {
    ...expense,
    id: `mock-${Date.now()}`,
  };
  expenses.unshift(newExpense); // Thêm vào đầu mảng
  saveExpenses(expenses);
  return newExpense.id;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 300));
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses(expenses);
};
