
import React from 'react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};


const ExpenseItem: React.FC<{ expense: Expense; onDeleteExpense: (id: string) => void }> = ({ expense, onDeleteExpense }) => {
    return (
        <li className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center gap-4">
                 <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{expense.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} · {formatDate(expense.date)}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <p className="font-mono text-lg text-red-500 dark:text-red-400 text-right">{formatCurrency(expense.amount)}</p>
                <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label={`Xóa ${expense.description}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </li>
    );
};


const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Chưa có chi tiêu nào</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Hãy nhấn nút '+' để thêm chi tiêu đầu tiên của bạn.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lịch sử chi tiêu</h2>
        <ul className="space-y-3">
            {expenses.map(expense => (
                <ExpenseItem key={expense.id} expense={expense} onDeleteExpense={onDeleteExpense} />
            ))}
        </ul>
    </div>
  );
};

export default ExpenseList;
