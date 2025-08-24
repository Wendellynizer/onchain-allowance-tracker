import type { Transaction } from '@coinbase/onchainkit/transaction';
import type { Expense, Budget, SharedWallet } from '@/app/types/expense';

// Smart contract ABI for expense tracking
export const EXPENSE_TRACKER_ABI = [
  {
    type: 'function',
    name: 'addExpense',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'category', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'timestamp', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setBudget',
    inputs: [
      { name: 'dailyLimit', type: 'uint256' },
      { name: 'weeklyLimit', type: 'uint256' },
      { name: 'monthlyLimit', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createSharedWallet',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'totalBudget', type: 'uint256' }
    ],
    outputs: [{ name: 'walletId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addToSharedWallet',
    inputs: [
      { name: 'walletId', type: 'uint256' },
      { name: 'member', type: 'address' }
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getUserExpenses',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'amount', type: 'uint256' },
          { name: 'category', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'timestamp', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view',
  }
] as const;

// Base Sepolia testnet contract address (placeholder)
export const EXPENSE_TRACKER_ADDRESS = '0x67c97D1FB8184F038592b2109F854dfb09C77C75';

// Create transaction calls for OnchainKit
export const createAddExpenseCall = (expense: {
  amount: number;
  category: string;
  description: string;
}): Transaction => ({
  address: EXPENSE_TRACKER_ADDRESS,
  abi: EXPENSE_TRACKER_ABI,
  functionName: 'addExpense',
  args: [
    BigInt(Math.floor(expense.amount * 100)), // Convert to cents for precision
    expense.category,
    expense.description,
    BigInt(Math.floor(Date.now() / 1000)) // Current timestamp
  ],
});

export const createSetBudgetCall = (budget: {
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
}): Transaction => ({
  address: EXPENSE_TRACKER_ADDRESS,
  abi: EXPENSE_TRACKER_ABI,
  functionName: 'setBudget',
  args: [
    BigInt(Math.floor(budget.dailyLimit * 100)),
    BigInt(Math.floor(budget.weeklyLimit * 100)),
    BigInt(Math.floor(budget.monthlyLimit * 100))
  ],
});

export const createSharedWalletCall = (wallet: {
  name: string;
  totalBudget: number;
}): Transaction => ({
  address: EXPENSE_TRACKER_ADDRESS,
  abi: EXPENSE_TRACKER_ABI,
  functionName: 'createSharedWallet',
  args: [wallet.name, BigInt(Math.floor(wallet.totalBudget * 100))],
});

// Utility functions for expense calculations
export const calculateBudgetHealth = (
  spent: number,
  limit: number
): { score: 'green' | 'yellow' | 'red'; percentage: number } => {
  const percentage = (spent / limit) * 100;
  
  if (percentage <= 70) return { score: 'green', percentage };
  if (percentage <= 90) return { score: 'yellow', percentage };
  return { score: 'red', percentage };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Food: '#ef4444',
    Transport: '#3b82f6',
    School: '#10b981',
    Misc: '#f59e0b'
  };
  return colors[category] || '#6b7280';
};