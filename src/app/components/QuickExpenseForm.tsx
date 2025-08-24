'use client';

import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useExpenses } from '@/hooks/useExpense';
import { useAccount } from 'wagmi';
import { ExpenseCategory } from '@/app/types/expense';
// import { formatCurrency } from '@/lib/smart-contract';

interface QuickExpenseFormProps {
  onExpenseAdded?: () => void;
}

export default function QuickExpenseForm({ onExpenseAdded }: QuickExpenseFormProps) {
  const { isConnected } = useAccount();
  const { addExpense } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || !category || !description) {
      alert('Please fill in all fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await addExpense({
        amount: parsedAmount,
        category: category as ExpenseCategory,
        description: description.trim()
      });

      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      
      onExpenseAdded?.();
      
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Expense</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
            Amount ($)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        {/* Category Select */}
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </Label>
          <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">🍕 Food</SelectItem>
              <SelectItem value="Transport">🚌 Transport</SelectItem>
              <SelectItem value="School">📚 School</SelectItem>
              <SelectItem value="Misc">🎯 Misc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            maxLength={100}
            className="mt-1"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isConnected || isSubmitting || !amount || !category || !description}
          size="lg"
          variant="primary"
          fullWidth
        >
          {isSubmitting ? 'Adding...' : 'Add Expense Onchain'}
        </Button>
      </form>

      {!isConnected && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Connect your wallet to add expenses onchain
          </p>
        </div>
      )}
    </div>
  );
}