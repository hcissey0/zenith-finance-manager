import React, { useState } from "react";
import { Account } from "../../types";
import Icon from "../ui/Icon";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

interface HeaderProps {
  activeAccount: Account;
  user: any;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeAccount, user, onSignOut }) => {
  const isOnline = useOnlineStatus();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserInitials = (email: string, fullName?: string) => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = (email: string, fullName?: string) => {
    return fullName || email.split("@")[0];
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Icon name="logo" className="h-8 w-8 text-blue-500" />
            <span className="ml-3 text-2xl font-bold text-white tracking-tight">
              Zenith
            </span>
            {!isOnline && (
              <span className="ml-3 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                Offline
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {activeAccount && (
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-3xl text-xs">
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

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center  bg-gray-800 hover:bg-gray-700 px-2 py-2 rounded-full transition-colors duration-200"
              >
                {user?.user_metadata?.picture ||
                user?.user_metadata?.avatar_url ? (
                  <img
                    src={
                      user.user_metadata.picture ||
                      user.user_metadata.avatar_url
                    }
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                    user?.user_metadata?.picture ||
                    user?.user_metadata?.avatar_url
                      ? "hidden"
                      : ""
                  }`}
                >
                  {user
                    ? getUserInitials(
                        user.email,
                        user.user_metadata?.full_name ||
                          user.user_metadata?.name
                      )
                    : "?"}
                </div>
                {/* <Icon
                  name="chevronDown"
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                /> */}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user
                        ? getUserDisplayName(
                            user.email,
                            user.user_metadata?.full_name ||
                              user.user_metadata?.name
                          )
                        : "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name="logout" className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
