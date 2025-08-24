'use client';

import { Home, Plus, BarChart3, Users } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'add' | 'dashboard' | 'shared';
  onTabChange: (tab: 'home' | 'add' | 'dashboard' | 'shared') => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'add' as const,
      label: 'Add',
      icon: Plus,
    },
    {
      id: 'dashboard' as const,
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'shared' as const,
      label: 'Shared',
      icon: Users,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 bottom-nav">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl min-h-[60px] flex-1 mx-1 transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${isActive ? 'stroke-2' : 'stroke-1.5'}`}
              />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}