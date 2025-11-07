
import React, { useMemo } from 'react';
import { Expense } from '../types';

interface SummaryProps {
  expenses: Expense[];
}

const Summary: React.FC<SummaryProps> = ({ expenses }) => {
  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
      <p className="text-lg text-gray-600 dark:text-gray-300">Tổng Chi Tiêu</p>
      <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(total)}</p>
    </div>
  );
};

export default Summary;
