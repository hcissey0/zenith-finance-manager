import React from 'react';
import { Page } from '../../types';
import Icon from '../ui/Icon';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onAdd: () => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: (page: Page) => void;
}> = ({ page, label, icon, isActive, onClick }) => (
  <a
    href={`#/${page}`}
    onClick={(e) => { e.preventDefault(); onClick(page); }}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary-light'}`}
    aria-current={isActive ? 'page' : undefined}
  >
    <Icon name={icon} className="h-6 w-6" />
    <span className="text-xs mt-1">{label}</span>
  </a>
);

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate, onAdd }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
      <div className="grid grid-cols-5 h-full max-w-lg mx-auto">
        <NavItem page="dashboard" label="Dashboard" icon="dashboard" isActive={activePage === 'dashboard'} onClick={onNavigate} />
        <NavItem page="transactions" label="History" icon="transactions" isActive={activePage === 'transactions'} onClick={onNavigate} />
        
        <div className="relative flex justify-center">
            <button
                onClick={onAdd}
                className="absolute -top-6 w-16 h-16 bg-primary hover:bg-primary-light rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary"
                aria-label="Add transaction"
            >
                <Icon name="plus" className="h-8 w-8" />
            </button>
        </div>

        <NavItem page="accounts" label="Accounts" icon="wallet" isActive={activePage === 'accounts'} onClick={onNavigate} />
        <NavItem page="settings" label="Settings" icon="settings" isActive={activePage === 'settings'} onClick={onNavigate} />
      </div>
    </nav>
  );
};

export default BottomNav;
