export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  userAddress: string;
  txHash?: string;
  sharedWalletId?: string;
}

export const ExpenseCategory = {
  FOOD: 'Food',
  TRANSPORT: 'Transport', 
  SCHOOL: 'School',
  MISC: 'Misc'
} as const;

export type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];

export interface Budget {
  id: string;
  userAddress: string;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  currency: string;
}

export interface BudgetHealth {
  score: 'green' | 'yellow' | 'red';
  percentage: number;
  message: string;
  remainingDaily: number;
  remainingWeekly: number;
  remainingMonthly: number;
}

export interface SharedWallet {
  id: string;
  name: string;
  members: string[];
  totalBudget: number;
  expenses: Expense[];
  createdAt: Date;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface DashboardStats {
  todaySpent: number;
  weekSpent: number;
  monthSpent: number;
  budgetHealth: BudgetHealth;
  recentExpenses: Expense[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  color: string;
}