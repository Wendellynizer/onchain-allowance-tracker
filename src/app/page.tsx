'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useExpenses } from '@/hooks/useExpense';

// Component imports
import WalletStatus from './components/WalletStatus';
import BudgetHealthCard from './components/BudgetHealthCard';
import QuickExpenseForm from './components/QuickExpenseForm';
import RecentExpenses from './components/RecentExpenses';
import CategoryChart from './components/CategoryChart';
import SpendingSummary from './components/SpendingSummary';
import BottomNavigation from './/components/BottomNavigation';
import SharedWalletView from './components/SharedWalletView';

type TabType = 'home' | 'add' | 'dashboard' | 'shared';

export default function Page() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { 
    expenses, 
    budget, 
    loading, 
    getSpendingTotals, 
    getBudgetHealth, 
    getCategoryBreakdown 
  } = useExpenses();

  const spendingTotals = getSpendingTotals();
  const budgetHealth = getBudgetHealth();
  const categoryBreakdown = getCategoryBreakdown();

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('home'); // Navigate back to home after adding expense
  };

  // Home Tab Content
  const HomeContent = () => (
    <div className="space-y-6">
      <WalletStatus />
      
      {isConnected && budgetHealth && (
        <BudgetHealthCard budgetHealth={budgetHealth} />
      )}
      
      <RecentExpenses expenses={expenses} />
      
      {isConnected && expenses.length > 0 && (
        <CategoryChart categoryBreakdown={categoryBreakdown} />
      )}
    </div>
  );

  // Add Expense Tab Content
  const AddExpenseContent = () => (
    <div className="space-y-6">
      <div className="text-center pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Expense</h2>
        <p className="text-gray-500 mb-8">Log your expense onchain for transparency</p>
      </div>
      
      <QuickExpenseForm onExpenseAdded={handleExpenseAdded} />
      
      {expenses.length > 0 && (
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <RecentExpenses expenses={expenses.slice(0, 3)} />
        </div>
      )}
    </div>
  );

  // Dashboard Tab Content
  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="text-center pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-500 mb-8">Track your spending patterns and budget health</p>
      </div>
      
      {isConnected && budget ? (
        <>
          <SpendingSummary
            todaySpent={spendingTotals.todaySpent}
            weekSpent={spendingTotals.weekSpent}
            monthSpent={spendingTotals.monthSpent}
            dailyBudget={budget.dailyLimit}
            weeklyBudget={budget.weeklyLimit}
            monthlyBudget={budget.monthlyLimit}
          />
          
          {budgetHealth && (
            <BudgetHealthCard budgetHealth={budgetHealth} />
          )}
          
          <CategoryChart categoryBreakdown={categoryBreakdown} />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {!isConnected ? 'Connect Your Wallet' : 'No Budget Set'}
          </h3>
          <p className="text-gray-500">
            {!isConnected 
              ? 'Connect your wallet to view analytics' 
              : 'Set up your budget to see detailed analytics'
            }
          </p>
        </div>
      )}
    </div>
  );

  // Shared Wallets Tab Content
  const SharedWalletsContent = () => (
    <div className="space-y-6">
      <div className="text-center pt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shared Wallets</h2>
        <p className="text-gray-500 mb-8">Manage group budgets and expenses together</p>
      </div>
      
      <SharedWalletView />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'add':
        return <AddExpenseContent />;
      case 'dashboard':
        return <DashboardContent />;
      case 'shared':
        return <SharedWalletsContent />;
      default:
        return <HomeContent />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your allowance tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Daily Allowance Tracker
            </h1>
            <p className="text-sm text-gray-500">
              Onchain transparency for financial literacy
            </p>
          </div>
          <div className="text-right">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 animate-fade-in-up">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Attribution */}
      <div className="fixed bottom-20 left-4 right-4 text-center z-0">
        <p className="text-xs text-gray-400">
          Built with OnchainKit SDK v0.38.17 by Modu on Ohara
        </p>
      </div>
    </div>
  );
}