import React, { useMemo } from 'react';
import { Expense, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface SummaryChartProps {
  expenses: Expense[];
}

interface ChartDataItem {
  category: Category;
  total: number;
  percentage: number;
  color: string;
}

const DonutSegment: React.FC<{
  percentage: number;
  startAngle: number;
  color: string;
  radius: number;
  holeRadius: number;
  cx: number;
  cy: number;
}> = ({ percentage, startAngle, color, radius, holeRadius, cx, cy }) => {
  let endAngle = startAngle + (percentage / 100) * 360;
  // Tránh lỗi render của SVG khi góc là 360 độ
  if (percentage > 99.99) {
      endAngle = startAngle + 359.99;
  }
  
  const getCoords = (angle: number, r: number) => ({
    x: cx + r * Math.cos((angle - 90) * Math.PI / 180),
    y: cy + r * Math.sin((angle - 90) * Math.PI / 180)
  });

  const start = getCoords(startAngle, radius);
  const end = getCoords(endAngle, radius);
  const startHole = getCoords(startAngle, holeRadius);
  const endHole = getCoords(endAngle, holeRadius);
  
  const largeArcFlag = percentage > 50 ? 1 : 0;
  
  const d = [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    `L ${endHole.x} ${endHole.y}`,
    `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${startHole.x} ${startHole.y}`,
    'Z'
  ].join(' ');

  return <path d={d} fill={color} />;
};

const SummaryChart: React.FC<SummaryChartProps> = ({ expenses }) => {
  const chartData = useMemo(() => {
    if (expenses.length === 0) return [];

    // FIX: Typing the initial value of `reduce` ensures `totalByCategory` is correctly typed.
    // This allows TypeScript to infer that `total` is a number in subsequent operations,
    // resolving the arithmetic operation errors.
    const totalByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    if (totalExpenses === 0) return [];

    const sortedData = Object.entries(totalByCategory)
      .map(([category, total]) => ({
        category: category as Category,
        total,
        percentage: (total / totalExpenses) * 100,
        color: CATEGORY_COLORS[category as Category],
      }))
      .sort((a, b) => b.total - a.total);
    
    // FIX: To prevent side effects during render, calculate segment start angles here
    // instead of using a mutable variable in the component body.
    let accumulatedPercentage = 0;
    return sortedData.map(item => {
        const dataPoint = {
            ...item,
            startAngle: accumulatedPercentage * 3.6,
        };
        accumulatedPercentage += item.percentage;
        return dataPoint;
    });
  }, [expenses]);
  
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 h-full">
         <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-50">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="62.8" />
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" className="dark:stroke-gray-600" strokeWidth="10" />
            {chartData.map(item => {
                return (
                    <DonutSegment
                        key={item.category}
                        percentage={item.percentage}
                        startAngle={item.startAngle}
                        color={item.color}
                        radius={45}
                        holeRadius={35}
                        cx={50}
                        cy={50}
                    />
                );
            })}
        </svg>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 text-center md:text-left">Phân bổ chi tiêu</h3>
        <ul className="space-y-1">
          {chartData.map(item => (
            <li key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-300">{item.category}</span>
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">{item.percentage.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryChart;