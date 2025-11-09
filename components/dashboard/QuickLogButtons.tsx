import React from "react";
import Icon from "../ui/Icon";
import { QuickLogType } from "../../types";

interface QuickLogButtonsProps {
  onQuickLog: (type: QuickLogType) => void;
  onAddTransaction: () => void;
}

const buttons: {
  type: QuickLogType | "other";
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    type: "lorry",
    label: "Lorry Fare",
    icon: "lorry",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    type: "food",
    label: "Food",
    icon: "food",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    type: "salary",
    label: "Salary",
    icon: "salary",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    type: "bill",
    label: "Bills",
    icon: "bill",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    type: "gift-in",
    label: "Gift In",
    icon: "gift",
    color: "bg-pink-500 hover:bg-pink-600",
  },
  {
    type: "gift-out",
    label: "Gift Out",
    icon: "gift",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    type: "charity",
    label: "Charity",
    icon: "salary",
    color: "bg-teal-500 hover:bg-teal-600",
  }
];

const QuickLogButtons: React.FC<QuickLogButtonsProps> = ({
  onQuickLog,
  onAddTransaction,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-300">Quick Log</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.type}
            onClick={() =>
              btn.type === "other" ? onAddTransaction() : onQuickLog(btn.type)
            }
            className={`flex flex-col items-center justify-center p-3 rounded-xl text-white font-medium text-center transition-transform transform hover:scale-105 ${btn.color}`}
          >
            <Icon name={btn.icon} className="h-6 w-6 mb-1" />
            <span className="text-xs">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLogButtons;
