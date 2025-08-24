'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { Expense, Budget, BudgetHealth, ExpenseCategory } from '@/app/types/expense';
import { calculateBudgetHealth } from '@/lib/smart-contract';

// Mock data for demonstration (in production, this would come from smart contract)
const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 12.50,
    category: 'Food' as ExpenseCategory,
    description: 'Lunch at cafeteria',
    date: new Date(),
    userAddress: '0x123...'
  },
  {
    id: '2', 
    amount: 5.75,
    category: 'Transport' as ExpenseCategory,
    description: 'Bus fare',
    date: new Date(Date.now() - 86400000),
    userAddress: '0x123...'
  }
];

const mockBudget: Budget = {
  id: '1',
  userAddress: '0x123...',
  dailyLimit: 25,
  weeklyLimit: 150,
  monthlyLimit: 600,
  currency: 'USD'
};

export const useExpenses = () => {
  const { address } = useAccount();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from smart contract or local storage
  const loadExpenses = useCallback(async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      
      // In production, this would query the smart contract
      // For now, use mock data and local storage
      const stored = localStorage.getItem(`expenses_${address}`);
      const storedExpenses = stored ? JSON.parse(stored) : mockExpenses;
      
      setExpenses(storedExpenses.map((e) => ({
        ...e,
        date: new Date(e.date)
      })));
      
      const storedBudget = localStorage.getItem(`budget_${address}`);
      setBudget(storedBudget ? JSON.parse(storedBudget) : mockBudget);
      
      setError(null);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Add new expense
  const addExpense = useCallback(async (expenseData: {
    amount: number;
    category: ExpenseCategory;
    description: string;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...expenseData,
        date: new Date(),
        userAddress: address,
        txHash: '0x' + Math.random().toString(16).substr(2, 8) // Mock tx hash
      };

      const updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);
      
      // Save to local storage (in production, this would be handled by smart contract)
      localStorage.setItem(`expenses_${address}`, JSON.stringify(updatedExpenses));
      
      return newExpense;
    } catch (err) {
      console.error('Error adding expense:', err);
      throw new Error('Failed to add expense');
    }
  }, [address, expenses]);

  // Update budget
  const updateBudget = useCallback(async (budgetData: {
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const updatedBudget: Budget = {
        id: budget?.id || Date.now().toString(),
        userAddress: address,
        currency: 'USD',
        ...budgetData
      };

      setBudget(updatedBudget);
      localStorage.setItem(`budget_${address}`, JSON.stringify(updatedBudget));
      
      return updatedBudget;
    } catch (err) {
      console.error('Error updating budget:', err);
      throw new Error('Failed to update budget');
    }
  }, [address, budget]);

  // Calculate spending totals
  const getSpendingTotals = useCallback(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay.getTime() - (startOfDay.getDay() * 24 * 60 * 60 * 1000));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todaySpent = expenses
      .filter(e => e.date >= startOfDay)
      .reduce((sum, e) => sum + e.amount, 0);

    const weekSpent = expenses
      .filter(e => e.date >= startOfWeek)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthSpent = expenses
      .filter(e => e.date >= startOfMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    return { todaySpent, weekSpent, monthSpent };
  }, [expenses]);

  // Calculate budget health
  const getBudgetHealth = useCallback((): BudgetHealth | null => {
    if (!budget) return null;

    const { todaySpent, weekSpent, monthSpent } = getSpendingTotals();
    
    const dailyHealth = calculateBudgetHealth(todaySpent, budget.dailyLimit);
    const weeklyHealth = calculateBudgetHealth(weekSpent, budget.weeklyLimit);
    const monthlyHealth = calculateBudgetHealth(monthSpent, budget.monthlyLimit);

    // Use the worst health score
    let overallScore: 'green' | 'yellow' | 'red' = 'green';
    if (dailyHealth.score === 'red' || weeklyHealth.score === 'red' || monthlyHealth.score === 'red') {
      overallScore = 'red';
    } else if (dailyHealth.score === 'yellow' || weeklyHealth.score === 'yellow' || monthlyHealth.score === 'yellow') {
      overallScore = 'yellow';
    }

    const getHealthMessage = (): string => {
      if (overallScore === 'red') return 'Over budget - time to cut back!';
      if (overallScore === 'yellow') return 'Close to limit - watch spending';
      return 'Great job staying within budget!';
    };

    return {
      score: overallScore,
      percentage: Math.max(dailyHealth.percentage, weeklyHealth.percentage, monthlyHealth.percentage),
      message: getHealthMessage(),
      remainingDaily: Math.max(0, budget.dailyLimit - todaySpent),
      remainingWeekly: Math.max(0, budget.weeklyLimit - weekSpent),
      remainingMonthly: Math.max(0, budget.monthlyLimit - monthSpent)
    };
  }, [budget, getSpendingTotals]);

  // Get category breakdown
  const getCategoryBreakdown = useCallback(() => {
    if (expenses.length === 0) return [];

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
      color: getCategoryColor(category)
    }));
  }, [expenses]);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Food: '#ef4444',
      Transport: '#3b82f6', 
      School: '#10b981',
      Misc: '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  // Load data on mount and address change
  useEffect(() => {
    if (address) {
      loadExpenses();
    } else {
      setExpenses([]);
      setBudget(null);
      setLoading(false);
    }
  }, [address, loadExpenses]);

  return {
    expenses,
    budget,
    loading,
    error,
    addExpense,
    updateBudget,
    getSpendingTotals,
    getBudgetHealth,
    getCategoryBreakdown,
    reload: loadExpenses
  };
};