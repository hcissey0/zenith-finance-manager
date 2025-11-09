import React from "react";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

interface SettingsPageProps {
  onInstallPWA: () => void;
  installPromptAvailable: boolean;
  seedTestData: () => void;
  onSignOut: () => void;
  user: any;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  onInstallPWA,
  installPromptAvailable,
  seedTestData,
  onSignOut,
  user,
}) => {
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;

  const getUserDisplayName = (email: string, fullName?: string) => {
    return fullName || email.split("@")[0];
  };

  return (
    <div className="py-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* User Account Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Account</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user
                ? user.user_metadata?.full_name
                  ? user.user_metadata.full_name
                      .split(" ")
                      .map((name: string) => name.charAt(0))
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : user.email.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div>
              <p className="text-white font-medium">
                {user
                  ? getUserDisplayName(
                      user.email,
                      user.user_metadata?.full_name
                    )
                  : "User"}
              </p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <Button onClick={onSignOut} variant="secondary">
            <span className="flex items-center gap-2">
              <Icon name="logout" className="h-4 w-4" />
              Sign Out
            </span>
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">
          App Installation
        </h3>
        {isPWA ? (
          <div className="flex items-center space-x-3 text-green-400">
            <Icon name="check" className="h-6 w-6" />
            <span>App is already installed on your device.</span>
          </div>
        ) : installPromptAvailable ? (
          <div>
            <p className="text-gray-400 mb-4">
              Install this application on your device for a better experience,
              including offline access.
            </p>
            <Button onClick={onInstallPWA}>
              <span className="flex items-center gap-2">
                <Icon name="download" className="h-4 w-4" />
                Install App
              </span>
            </Button>
          </div>
        ) : (
          <p className="text-gray-400">
            PWA installation is not supported by your browser, or the app is
            already installed. You can also try installing from your browser's
            menu.
          </p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-yellow-500/50">
        <div className="flex items-center gap-3">
          <Icon name="dev" className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-yellow-400">
            Developer Tools
          </h3>
        </div>
        <p className="text-gray-400 mt-3 mb-4 text-sm">
          This is for testing purposes only. It will populate the current
          account with sample transaction data. This button can be removed
          later.
        </p>
        <Button onClick={seedTestData} variant="secondary">
          <span className="flex items-center gap-2">Add Test Data</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
