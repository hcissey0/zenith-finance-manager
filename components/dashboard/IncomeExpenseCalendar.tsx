import React, { useMemo, useState } from "react";
import { Transaction } from "../../types";
import Icon from "../ui/Icon";

interface IncomeExpenseCalendarProps {
  transactions: Transaction[];
}

const IncomeExpenseCalendar: React.FC<IncomeExpenseCalendarProps> = ({
  transactions,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Calculate daily totals for the current month
  const dailyTotals = useMemo(() => {
    const totals: { [date: string]: { income: number; expense: number } } = {};

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === currentMonth
      ) {
        const dateKey = transaction.date;
        if (!totals[dateKey]) {
          totals[dateKey] = { income: 0, expense: 0 };
        }
        if (transaction.type === "income") {
          totals[dateKey].income += transaction.amount;
        } else {
          totals[dateKey].expense += transaction.amount;
        }
      }
    });

    return totals;
  }, [transactions, currentYear, currentMonth]);

  // Find max values for normalization
  const { maxIncome, maxExpense, maxTotal } = useMemo(() => {
    let maxInc = 0;
    let maxExp = 0;
    let maxTot = 0;
    Object.values(dailyTotals).forEach(
      (day: { income: number; expense: number }) => {
        maxInc = Math.max(maxInc, day.income);
        maxExp = Math.max(maxExp, day.expense);
        maxTot = Math.max(maxTot, day.income + day.expense);
      }
    );
    return { maxIncome: maxInc, maxExpense: maxExp, maxTotal: maxTot };
  }, [dailyTotals]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || days.length % 7 !== 0) {
      const isCurrentMonth = current.getMonth() === currentMonth;
      const dateKey = current.toISOString().split("T")[0];
      const dayData = dailyTotals[dateKey] || { income: 0, expense: 0 };
      const isToday = dateKey === todayKey;

      days.push({
        date: new Date(current),
        isCurrentMonth,
        isToday,
        income: dayData.income,
        expense: dayData.expense,
        total: dayData.income + dayData.expense,
        incomeRatio:
          dayData.income + dayData.expense > 0
            ? (dayData.income / (dayData.income + dayData.expense)) * 100
            : 0,
        expenseRatio:
          dayData.income + dayData.expense > 0
            ? (dayData.expense / (dayData.income + dayData.expense)) * 100
            : 0,
        totalBar:
          maxTotal > 0
            ? ((dayData.income + dayData.expense) / maxTotal) * 100
            : 0,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentYear, currentMonth, dailyTotals, maxIncome, maxExpense, maxTotal]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors text-xl font-bold"
        >
          ‹
        </button>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          {currentDate.getMonth() !== new Date().getMonth() ||
          currentDate.getFullYear() !== new Date().getFullYear() ? (
            <button
              onClick={goToCurrentMonth}
              className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              Go to Today
            </button>
          ) : null}
        </div>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors text-xl font-bold"
        >
          ›
        </button>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[50px] sm:min-h-[60px] p-1 border rounded relative ${
              day.isToday
                ? "border-blue-500 bg-blue-500/10"
                : day.isCurrentMonth
                ? "border-gray-700 bg-gray-700"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <div
              className={`text-xs mb-1 font-semibold ${
                day.isToday ? "text-blue-500" : "text-gray-300"
              }`}
            >
              {day.date.getDate()}
            </div>

            {/* Pie Chart Visualization */}
            <div className="flex justify-center mt-1">
              {day.income > 0 || day.expense > 0 ? (
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #10b981 0% ${day.incomeRatio}%,
                      #ef4444 ${day.incomeRatio}% 100%
                    )`,
                  }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-600/30" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 text-xs text-gray-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: `conic-gradient(
                  #10b981 0% 50%,
                  #ef4444 50% 100%
                )`,
              }}
            />
            <span>Income vs Expense</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-600/30" />
            <span>No Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseCalendar;
