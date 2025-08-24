'use client';

import { formatCurrency } from '@/lib/smart-contract';

interface SpendingSummaryProps {
  todaySpent: number;
  weekSpent: number;
  monthSpent: number;
  dailyBudget: number;
  weeklyBudget: number;
  monthlyBudget: number;
  className?: string;
}

export default function SpendingSummary({ 
  todaySpent, 
  weekSpent, 
  monthSpent,
  dailyBudget,
  weeklyBudget,
  monthlyBudget,
  className = '' 
}: SpendingSummaryProps) {
  const summaryData = [
    {
      label: 'Today',
      spent: todaySpent,
      budget: dailyBudget,
      percentage: dailyBudget > 0 ? (todaySpent / dailyBudget) * 100 : 0,
      color: 'bg-blue-500'
    },
    {
      label: 'This Week',
      spent: weekSpent,
      budget: weeklyBudget,
      percentage: weeklyBudget > 0 ? (weekSpent / weeklyBudget) * 100 : 0,
      color: 'bg-green-500'
    },
    {
      label: 'This Month',
      spent: monthSpent,
      budget: monthlyBudget,
      percentage: monthlyBudget > 0 ? (monthSpent / monthlyBudget) * 100 : 0,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Summary</h3>
      
      <div className="space-y-4">
        {summaryData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.spent)}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  / {formatCurrency(item.budget)}
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ 
                  width: `${Math.min(100, item.percentage)}%`,
                  backgroundColor: item.percentage > 90 ? '#ef4444' : item.percentage > 70 ? '#f59e0b' : undefined
                }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {item.percentage.toFixed(1)}% used
              </span>
              <span className={`font-medium ${
                item.percentage > 90 ? 'text-red-600' : 
                item.percentage > 70 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {formatCurrency(Math.max(0, item.budget - item.spent))} left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}