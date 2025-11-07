import React, { useState, useEffect } from "react";
import { TransactionType } from "../../types";
import { categorizeTransaction } from "../../services/geminiService";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
  categories: { income: string[]; expense: string[] };
  currency: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  currency,
}) => {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories.expense[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    setCategory(
      type === "income" ? categories.income[0] : categories.expense[0]
    );
  }, [type, categories]);

  const handleSuggestCategory = async () => {
    if (!description) return;
    setIsSuggesting(true);
    try {
      const suggestedCategory = await categorizeTransaction(description);
      const allCategories = [...categories.income, ...categories.expense];
      if (allCategories.includes(suggestedCategory)) {
        if (categories.income.includes(suggestedCategory)) setType("income");
        if (categories.expense.includes(suggestedCategory)) setType("expense");
        setCategory(suggestedCategory);
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > 0) {
      onSubmit({
        type,
        amount: parseFloat(amount),
        category,
        description,
        date,
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`w-full py-2 rounded-md text-sm font-medium transition ${
              type === "expense" ? "bg-red-500 text-white" : "text-gray-300"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`w-full py-2 rounded-md text-sm font-medium transition ${
              type === "income" ? "bg-green-500 text-white" : "text-gray-300"
            }`}
          >
            Income
          </button>
        </div>

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          step="0.01"
          leadingSymbol={currency}
        />

        <div className="relative">
          <Input
            label="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Coffee with friends"
            required
          />
          <button
            type="button"
            onClick={handleSuggestCategory}
            className="absolute right-2 bottom-2 text-xs bg-primary/20 text-primary-light px-2 py-1 rounded-md hover:bg-primary/40 disabled:opacity-50"
            disabled={isSuggesting || !description || !isOnline}
            title={
              !isOnline ? "AI suggestions require internet connection" : ""
            }
          >
            {isSuggesting ? <Spinner size="xs" /> : "AI Suggest"}
          </button>
        </div>

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={type === "income" ? categories.income : categories.expense}
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Transaction</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
