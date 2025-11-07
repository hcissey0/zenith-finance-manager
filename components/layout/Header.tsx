import React from "react";
import { Account } from "../../types";
import Icon from "../ui/Icon";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

interface HeaderProps {
  activeAccount: Account;
}

const Header: React.FC<HeaderProps> = ({ activeAccount }) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Icon name="logo" className="h-8 w-8 text-primary" />
            <span className="ml-3 text-2xl font-bold text-white tracking-tight">
              Zenith
            </span>
            {!isOnline && (
              <span className="ml-3 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                Offline
              </span>
            )}
          </div>
          {activeAccount && (
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg">
              <Icon
                name={activeAccount.icon}
                className={`h-5 w-5 ${activeAccount.color.replace(
                  "bg-",
                  "text-"
                )}`}
              />
              <span className="text-white font-medium">
                {activeAccount.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
