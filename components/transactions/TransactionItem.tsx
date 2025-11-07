
import React from 'react';
import { Transaction } from '../../types';
import Icon from '../ui/Icon';

interface TransactionItemProps {
  transaction: Transaction;
  currency: string;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, currency, onDelete, showDelete = false }) => {
  const { type, amount, description, category, date } = transaction;
  const isIncome = type === 'income';
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <li className="bg-gray-800 p-3 rounded-lg flex items-center justify-between shadow-sm hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <Icon name={isIncome ? 'arrowUp' : 'arrowDown'} className={`h-5 w-5 ${isIncome ? 'text-green-400' : 'text-red-400'}`} />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-white">{description}</span>
          <span className="text-xs text-gray-400">{category} &bull; {formattedDate}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </span>
        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full"
            aria-label="Delete transaction"
          >
            <Icon name="trash" className="h-4 w-4" />
          </button>
        )}
      </div>
    </li>
  );
};

export default TransactionItem;
