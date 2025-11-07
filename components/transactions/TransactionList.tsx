
import React from 'react';
import { Transaction } from '../../types';
import TransactionItem from './TransactionItem';
import Icon from '../ui/Icon';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currency, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 pt-16">
        <Icon name="empty" className="w-24 h-24 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300">No Transactions Found</h2>
        <p className="mt-2">Your transaction history for this account will appear here.</p>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <ul className="space-y-3">
        {transactions.map(tx => (
            <TransactionItem key={tx.id} transaction={tx} currency={currency} onDelete={onDelete} showDelete={true} />
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
