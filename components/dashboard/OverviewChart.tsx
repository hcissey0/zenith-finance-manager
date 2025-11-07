
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../../types';

interface OverviewChartProps {
  transactions: Transaction[];
}

const OverviewChart: React.FC<OverviewChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const dataByDate: { [date: string]: { income: number; expense: number } } = {};

    transactions.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!dataByDate[date]) {
        dataByDate[date] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        dataByDate[date].income += tx.amount;
      } else {
        dataByDate[date].expense += tx.amount;
      }
    });
    
    return Object.entries(dataByDate)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [transactions]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(str) => {
              const date = new Date(str);
              return `${date.getMonth() + 1}/${date.getDate()}`;
          }}/>
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} dot={{r: 4}} activeDot={{ r: 8 }}/>
          <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} dot={{r: 4}} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewChart;
