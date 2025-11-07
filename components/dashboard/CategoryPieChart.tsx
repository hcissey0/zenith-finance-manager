
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../../types';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = ['#4f46e5', '#ec4899', '#22d3ee', '#f97316', '#84cc16', '#a855f7', '#eab308'];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);
  }, [transactions]);
  
  if (data.length === 0) {
      return <div className="flex items-center justify-center h-full text-gray-500">No expense data available.</div>
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            formatter={(value) => `$${Number(value).toFixed(2)}`}
          />
          <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize: "12px", color: "#d1d5db"}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
