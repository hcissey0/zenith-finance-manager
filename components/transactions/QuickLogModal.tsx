import React, { useState, useEffect } from "react";
import { QuickLogType } from "../../types";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { title } from "process";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: QuickLogType;
  currency: string;
}

const LOCATION_SUGGESTIONS = [
  "Aboabo Station",
  "Aboabo",
  "Asabe",
  "Sepe Junction",
  "Post Office",
  "PayHall",
  "Ahodwo",
  "Adum",
];

const config = {
  lorry: { title: "Log Lorry Fare", fields: ["from", "to", "amount", "date"] },
  food: { title: "Log Food Expense", fields: ["item", "amount", "date"] },
  salary: { title: "Log Salary", fields: ["source", "amount", "date"] },
  bill: { title: "Log Bill Payment", fields: ["for", "amount", "date"] },
  "gift-in": { title: "Log Gift Received", fields: ["from", "amount", "date"] },
  "gift-out": { title: "Log Gift Given", fields: ["to", "amount", "date"] },
  charity: { title: "Log Charity Donation", fields: ["to", "amount", "date"] },
  "momo-charges": {
    title: "Log Mobile Money Charges",
    fields: ["on", "amount", "date"],
  },
  misc: {
    title: "Log Miscellaneous Spending",
    fields: ["bought", "amount", "date"],
  },
};

const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  currency,
}) => {
  const [formData, setFormData] = useState<any>({});
  const modalConfig = config[type];

  useEffect(() => {
    // Reset form when type changes or modal opens
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setFormData({ date: today });
    }
  }, [type, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: string) => {
    const isAmount = field === "amount";
    const isDate = field === "date";
    const isLocationField =
      (field === "from" || field === "to") && type === "lorry";
    const placeholder = isAmount ? "0.00" : isDate ? "" : `Enter ${field}...`;
    const inputType = isAmount ? "number" : isDate ? "date" : "text";
    const label =
      field === "date"
        ? "Date"
        : field.charAt(0).toUpperCase() + field.slice(1);

    const inputField = (
      <Input
        key={field}
        label={label}
        type={inputType}
        value={formData[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        required
        {...(isAmount && { step: "0.01", leadingSymbol: currency })}
      />
    );

    if (isLocationField) {
      return (
        <div key={field} className="space-y-2">
          {inputField}
          <div className="flex flex-wrap gap-2">
            {LOCATION_SUGGESTIONS.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => handleChange(field, location)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-200"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return inputField;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalConfig.title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {modalConfig.fields.map(renderField)}
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Log Transaction</Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickLogModal;
