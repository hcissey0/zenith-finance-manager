
// This file now implements the Accounts page, replacing the former AI Insights feature.
import React, { useState } from 'react';
import { Account } from '../../types';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { v4 as uuidv4 } from 'uuid';

const ICONS = ['Wallet', 'Landmark', 'Briefcase', 'User', 'School', 'PiggyBank', 'CreditCard'];
const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

// Sub-component for the account creation/editing form
const AccountForm: React.FC<{
  onClose: () => void;
  onSave: (account: Omit<Account, 'id'>) => void;
}> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name, currency, icon, color });
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="Account Name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Savings" />
        <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value)} options={CURRENCIES} />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(i => (
              <button type="button" key={i} onClick={() => setIcon(i)} className={`p-2 rounded-lg ${icon === i ? `ring-2 ring-primary ${color}` : 'bg-gray-700'}`}>
                <Icon name={i} className="h-6 w-6 text-white" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button type="button" key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`} />
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Account</Button>
        </div>
      </form>
    </Modal>
  );
};

// Sub-component for displaying a single account item
const AccountItem: React.FC<{
  account: Account;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ account, isActive, onSelect, onDelete }) => (
  <li className={`rounded-lg transition-all ${isActive ? 'bg-primary/20 ring-2 ring-primary' : 'bg-gray-800 hover:bg-gray-700'}`}>
    <div className="flex items-center justify-between p-4">
      <button onClick={() => onSelect(account.id)} className="flex items-center space-x-4 text-left w-full">
        <div className={`p-3 rounded-lg ${account.color}`}>
          <Icon name={account.icon} className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-white">{account.name}</p>
          <p className="text-sm text-gray-400">{account.currency}</p>
        </div>
      </button>
      <button onClick={() => onDelete(account.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
        <Icon name="trash" className="h-5 w-5" />
      </button>
    </div>
  </li>
);


interface AccountsPageProps {
  accounts: Account[];
  activeAccountId: string;
  onAddAccount: (account: Omit<Account, 'id'>) => void;
  onDeleteAccount: (id: string) => void;
  onSetAccount: (id: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, activeAccountId, onAddAccount, onDeleteAccount, onSetAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Accounts</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <span className="flex items-center gap-2">
            <Icon name="plus" className="h-4 w-4"/> New Account
          </span>
        </Button>
      </div>

      <ul className="space-y-3">
        {accounts.map(acc => (
          <AccountItem
            key={acc.id}
            account={acc}
            isActive={acc.id === activeAccountId}
            onSelect={onSetAccount}
            onDelete={onDeleteAccount}
          />
        ))}
      </ul>
      
      {accounts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
            <Icon name="wallet" className="mx-auto h-16 w-16 mb-4"/>
            <h3 className="text-lg font-semibold text-gray-300">No Accounts Found</h3>
            <p className="mt-1">Create your first account to start tracking your finances.</p>
        </div>
      )}

      {isModalOpen && <AccountForm onClose={() => setIsModalOpen(false)} onSave={onAddAccount} />}
    </div>
  );
};

export default AccountsPage;
