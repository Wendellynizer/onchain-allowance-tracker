'use client';

import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAccount } from 'wagmi';
import { Users, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/smart-contract';

interface SharedWallet {
  id: string;
  name: string;
  members: string[];
  totalBudget: number;
  spent: number;
}

export default function SharedWalletView() {
  const { isConnected, address } = useAccount();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [totalBudget, setTotalBudget] = useState('');

  // Mock shared wallets (in production, this would come from smart contract)
  const [sharedWallets, setSharedWallets] = useState<SharedWallet[]>([
    {
      id: '1',
      name: 'Study Group Budget',
      members: ['0x123...abc', '0x456...def', '0x789...ghi'],
      totalBudget: 300,
      spent: 125.50
    },
    {
      id: '2', 
      name: 'Weekend Trip Fund',
      members: ['0x123...abc', '0x456...def'],
      totalBudget: 500,
      spent: 75.25
    }
  ]);

  const handleCreateWallet = () => {
    if (!walletName || !totalBudget) return;

    const newWallet: SharedWallet = {
      id: Date.now().toString(),
      name: walletName,
      members: [address || ''],
      totalBudget: parseFloat(totalBudget),
      spent: 0
    };

    setSharedWallets([...sharedWallets, newWallet]);
    setWalletName('');
    setTotalBudget('');
    setShowCreateForm(false);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-500 max-w-sm">
            Connect your wallet to create and join shared wallets for group budgeting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shared Wallets</h2>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={16} className="mr-1" />
          Create
        </Button>
      </div>

      {/* Create Wallet Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Shared Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="walletName">Wallet Name</Label>
              <Input
                id="walletName"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="e.g., Study Group Budget"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="totalBudget">Total Budget ($)</Label>
              <Input
                id="totalBudget"
                type="number"
                step="0.01"
                min="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateWallet}
                disabled={!walletName || !totalBudget}
                fullWidth
              >
                Create Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shared Wallets List */}
      <div className="space-y-4">
        {sharedWallets.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Shared Wallets Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create a shared wallet to track group expenses
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Wallet
            </Button>
          </div>
        ) : (
          sharedWallets.map((wallet) => {
            const percentage = (wallet.spent / wallet.totalBudget) * 100;
            const remaining = wallet.totalBudget - wallet.spent;
            
            return (
              <Card key={wallet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                      <p className="text-sm text-gray-500">
                        {wallet.members.length} member{wallet.members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(wallet.spent)}
                      </p>
                      <p className="text-xs text-gray-500">
                        of {formatCurrency(wallet.totalBudget)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage > 90 ? 'bg-red-500' : 
                        percentage > 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className={`font-medium ${
                      remaining > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(remaining))} {remaining > 0 ? 'left' : 'over'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}