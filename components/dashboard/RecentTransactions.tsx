
import React from 'react';
import { Transaction } from '../../types';
import TransactionItem from '../transactions/TransactionItem';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, currency }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map(tx => (
            <TransactionItem key={tx.id} transaction={tx} currency={currency} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent transactions.</p>
      )}
    </div>
  );
};

export default RecentTransactions;
