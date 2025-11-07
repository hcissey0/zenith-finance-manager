import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <Icon name="alert" className="h-6 w-6 text-red-500" />
          </div>
          <div className="pt-1">
            <p className="text-sm text-gray-300">{message}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
