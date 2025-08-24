'use client';

import { formatCurrency } from '@/lib/smart-contract';
import type { BudgetHealth } from '@/app/types/expense';

interface BudgetHealthCardProps {
  budgetHealth: BudgetHealth;
  className?: string;
}

export default function BudgetHealthCard({ budgetHealth, className = '' }: BudgetHealthCardProps) {
  const getHealthStyles = (score: 'green' | 'yellow' | 'red') => {
    switch (score) {
      case 'green':
        return {
          bg: 'health-green',
          text: 'text-white',
          progress: 'bg-white bg-opacity-30'
        };
      case 'yellow':
        return {
          bg: 'health-yellow',
          text: 'text-white',
          progress: 'bg-white bg-opacity-30'
        };
      case 'red':
        return {
          bg: 'health-red',
          text: 'text-white',
          progress: 'bg-white bg-opacity-30'
        };
    }
  };

  const styles = getHealthStyles(budgetHealth.score);

  return (
    <div className={`${styles.bg} rounded-2xl p-6 ${styles.text} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Budget Health</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${styles.text === 'text-white' ? 'bg-white' : 'bg-current'}`} />
          <span className="text-sm font-medium capitalize">{budgetHealth.score}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline space-x-2 mb-1">
          <span className="text-2xl font-bold">
            {Math.min(100, Math.round(budgetHealth.percentage))}%
          </span>
          <span className="text-sm opacity-80">of budget used</span>
        </div>
        <p className="text-sm opacity-90">{budgetHealth.message}</p>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-2 ${styles.progress} rounded-full overflow-hidden mb-4`}>
        <div 
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, budgetHealth.percentage)}%` }}
        />
      </div>

      {/* Remaining amounts */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs opacity-80 mb-1">Daily Left</p>
          <p className="font-semibold text-sm">
            {formatCurrency(budgetHealth.remainingDaily)}
          </p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Weekly Left</p>
          <p className="font-semibold text-sm">
            {formatCurrency(budgetHealth.remainingWeekly)}
          </p>
        </div>
        <div>
          <p className="text-xs opacity-80 mb-1">Monthly Left</p>
          <p className="font-semibold text-sm">
            {formatCurrency(budgetHealth.remainingMonthly)}
          </p>
        </div>
      </div>
    </div>
  );
}