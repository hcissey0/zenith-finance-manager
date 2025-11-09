import React, { useState, useMemo } from "react";
import { Transaction } from "../../types";
import TransactionItem from "./TransactionItem";
import Icon from "../ui/Icon";
import Input from "../ui/Input";

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currency,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;

    const term = searchTerm.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(term) ||
        tx.category.toLowerCase().includes(term) ||
        tx.amount.toString().includes(term) ||
        tx.type.toLowerCase().includes(term)
    );
  }, [transactions, searchTerm]);
  // Group transactions by month/year
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(tx);
    });

    // Sort months in descending order (newest first)
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .reduce((acc, [key, txs]) => {
        acc[key] = txs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return acc;
      }, {} as { [key: string]: Transaction[] });
  }, [filteredTransactions]);

  // State for open accordions
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => {
    const currentMonth = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
    const initialOpen = new Set<string>();

    // Open current month if it has transactions
    if (groupedTransactions[currentMonth]) {
      initialOpen.add(currentMonth);
    }

    return initialOpen;
  });

  const toggleMonth = (monthKey: string) => {
    setOpenMonths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey);
      } else {
        newSet.add(monthKey);
      }
      return newSet;
    });
  };

  const formatMonthHeader = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 pt-16">
        <Icon name="empty" className="w-24 h-24 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300">
          No Transactions Found
        </h2>
        <p className="mt-2">
          Your transaction history for this account will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="text-sm text-gray-400">
          {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search transactions by description, category, amount, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-16">
          <Icon name="search" className="w-16 h-16 mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No matching transactions
          </h3>
          <p className="text-gray-400">
            Try adjusting your search terms or clear the search to see all
            transactions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(
            ([monthKey, monthTransactions]: [string, Transaction[]]) => (
              <div
                key={monthKey}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleMonth(monthKey)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      name="chevronDown"
                      className={`h-5 w-5 transition-transform ${
                        openMonths.has(monthKey) ? "transform rotate-180" : ""
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-white">
                      {formatMonthHeader(monthKey)}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-lg">
                      {monthTransactions.length} transaction
                      {monthTransactions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-white">
                      {currency}
                      {monthTransactions
                        .reduce((sum, tx) => sum + tx.amount, 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">

                      {
                        monthTransactions.filter((tx) => tx.type === "income")
                          .length
                      }{" "}
                      income <br />{" "}
                      {
                        monthTransactions.filter((tx) => tx.type === "expense")
                          .length
                      }{" "}
                      expense
                    </div>
                  </div>
                </button>

                {openMonths.has(monthKey) && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-3">
                      {monthTransactions.map((tx) => (
                        <TransactionItem
                          key={tx.id}
                          transaction={tx}
                          currency={currency}
                          onDelete={onDelete}
                          showDelete={true}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
