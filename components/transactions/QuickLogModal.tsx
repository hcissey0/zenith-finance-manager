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

const config = {
  lorry: { title: "Log Lorry Fare", fields: ["from", "to", "amount"] },
  food: { title: "Log Food Expense", fields: ["item", "amount"] },
  salary: { title: "Log Salary", fields: ["source", "amount"] },
  bill: { title: "Log Bill Payment", fields: ["for", "amount"] },
  "gift-in": { title: "Log Gift Received", fields: ["from", "amount"] },
  "gift-out": { title: "Log Gift Given", fields: ["to", "amount"] },
  charity: { title: "Log Charity Donation", fields: ["to", "amount"] },
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
      setFormData({});
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
    const placeholder = isAmount ? "0.00" : `Enter ${field}...`;
    const inputType = isAmount ? "number" : "text";
    const label = field.charAt(0).toUpperCase() + field.slice(1);

    return (
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
