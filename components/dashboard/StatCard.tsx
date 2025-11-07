import React from 'react';
import Icon from '../ui/Icon';

interface StatCardProps {
  title: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense' | 'balance';
}

const typeStyles = {
  income: {
    icon: 'arrowUp' as const,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  expense: {
    icon: 'arrowDown' as const,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  balance: {
    icon: 'balance' as const,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, amount, currency, type }) => {
  const styles = typeStyles[type];

  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);

  if (type === 'balance') {
    // Original wide layout for balance card
    return (
      <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full ${styles.bgColor}`}>
          <Icon name={styles.icon} className={`h-6 w-6 ${styles.color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${styles.color}`}>
            {formattedAmount}
          </p>
        </div>
      </div>
    );
  }
  
  // New compact, vertical layout for income and expense cards
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg h-full">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`p-1.5 rounded-full ${styles.bgColor}`}>
          <Icon name={styles.icon} className={`h-4 w-4 ${styles.color}`} />
        </div>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
      <p className={`text-2xl font-bold ${styles.color} truncate`}>
        {formattedAmount}
      </p>
    </div>
  );
};

export default StatCard;