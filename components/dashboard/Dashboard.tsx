import React, { useMemo, useState } from "react";
import { Transaction, QuickLogType } from "../../types";
import StatCard from "./StatCard";
import OverviewChart from "./OverviewChart";
import CategoryPieChart from "./CategoryPieChart";
import RecentTransactions from "./RecentTransactions";
import IncomeExpenseCalendar from "./IncomeExpenseCalendar";
import Icon from "../ui/Icon";
import QuickLogButtons from "./QuickLogButtons";

type TimeRange = "all" | "month" | "today";

interface DashboardProps {
  transactions: Transaction[];
  currency: string;
  onQuickLog: (type: QuickLogType) => void;
  onAddTransaction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  currency,
  onQuickLog,
  onAddTransaction,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const localStartOfMonth = new Date(
      startOfMonth.getTime() - startOfMonth.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    if (timeRange === "today") {
      return transactions.filter((t) => t.date === today);
    }
    if (timeRange === "month") {
      return transactions.filter((t) => t.date >= localStartOfMonth);
    }
    return transactions; // 'all'
  }, [transactions, timeRange]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  const TimeRangeButton = ({
    range,
    label,
  }: {
    range: TimeRange;
    label: string;
  }) => (
    <button
      onClick={() => setTimeRange(range)}
      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition ${
        timeRange === range
          ? "bg-blue-500 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-center space-x-2 bg-gray-800 p-1 rounded-xl">
        <TimeRangeButton range="today" label="Today" />
        <TimeRangeButton range="month" label="This Month" />
        <TimeRangeButton range="all" label="All" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <StatCard
            title="Net Balance"
            amount={balance}
            currency={currency}
            type="balance"
          />
        </div>
        <StatCard
          title="Total Income"
          amount={totalIncome}
          currency={currency}
          type="income"
        />
        <StatCard
          title="Total Expense"
          amount={totalExpense}
          currency={currency}
          type="expense"
        />
      </div>

      <QuickLogButtons
        onQuickLog={onQuickLog}
        onAddTransaction={onAddTransaction}
      />

      <IncomeExpenseCalendar transactions={transactions} />

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 pt-16">
          <Icon name="empty" className="w-24 h-24 mb-4" />
          <h2 className="text-xl font-semibold text-gray-300">
            No Transactions Yet
          </h2>
          <p className="mt-2">
            Log your first transaction to see your financial overview.
          </p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 pt-16">
          <Icon name="empty" className="w-24 h-24 mb-4" />
          <h2 className="text-xl font-semibold text-gray-300">
            No Transactions Found
          </h2>
          <p className="mt-2">
            There are no transactions for the selected time period.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-gray-800 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
              <OverviewChart transactions={filteredTransactions} />
            </div>
            <div className="lg:col-span-2 bg-gray-800 p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Spending by Category
              </h3>
              <CategoryPieChart transactions={filteredTransactions} />
            </div>
          </div>

          <div>
            <RecentTransactions
              transactions={filteredTransactions.slice(0, 5)}
              currency={currency}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
