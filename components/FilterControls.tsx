
import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface FilterControlsProps {
  categoryFilter: Category | 'all';
  setCategoryFilter: (category: Category | 'all') => void;
  monthFilter: string;
  setMonthFilter: (month: string) => void;
  availableMonths: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  categoryFilter, setCategoryFilter, 
  monthFilter, setMonthFilter, 
  availableMonths 
}) => {
  
  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return `Tháng ${month}, ${year}`;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <div className="flex-1">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lọc theo danh mục</label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">Tất cả danh mục</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lọc theo tháng</label>
        <select
          id="month-filter"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">Tất cả các tháng</option>
          {availableMonths.map(month => (
            <option key={month} value={month}>{formatMonth(month)}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
