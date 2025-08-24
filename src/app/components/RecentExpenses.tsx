'use client';

import { formatDistanceToNow } from 'date-fns';
import type { Expense } from '@/app/types/expense';
import { formatCurrency, getCategoryColor } from '@/lib/smart-contract';

interface RecentExpensesProps {
  expenses: Expense[];
  className?: string;
}

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Food: '🍕',
    Transport: '🚌',
    School: '📚',
    Misc: '🎯'
  };
  return icons[category] || '💰';
};

export default function RecentExpenses({ expenses, className = '' }: RecentExpensesProps) {
  const recentExpenses = expenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  if (recentExpenses.length === 0) {
    return (
      <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-sm">No expenses yet</p>
          <p className="text-gray-400 text-xs mt-1">Add your first expense to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <span className="text-sm text-gray-500">{expenses.length} total</span>
      </div>
      
      <div className="space-y-3">
        {recentExpenses.map((expense) => (
          <div 
            key={expense.id}
            className="expense-card flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}
                >
                  {getCategoryIcon(expense.category)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {expense.description}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-white rounded-lg">
                    {expense.category}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(expense.date, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
              {expense.txHash && (
                <p className="text-xs text-gray-400">
                  {expense.txHash.slice(0, 6)}...{expense.txHash.slice(-4)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {expenses.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all {expenses.length} expenses
          </button>
        </div>
      )}
    </div>
  );
}