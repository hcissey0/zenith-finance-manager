import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

interface SettingsPageProps {
  onInstallPWA: () => void;
  installPromptAvailable: boolean;
  seedTestData: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onInstallPWA, installPromptAvailable, seedTestData }) => {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className="py-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">App Installation</h3>
        {isPWA ? (
          <div className="flex items-center space-x-3 text-green-400">
            <Icon name="check" className="h-6 w-6" />
            <span>App is already installed on your device.</span>
          </div>
        ) : installPromptAvailable ? (
          <div>
            <p className="text-gray-400 mb-4">
              Install this application on your device for a better experience, including offline access.
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
            PWA installation is not supported by your browser, or the app is already installed. You can also try installing from your browser's menu.
          </p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-yellow-500/50">
        <div className="flex items-center gap-3">
            <Icon name="dev" className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-400">Developer Tools</h3>
        </div>
        <p className="text-gray-400 mt-3 mb-4 text-sm">
          This is for testing purposes only. It will populate the current account with sample transaction data. This button can be removed later.
        </p>
        <Button onClick={seedTestData} variant="secondary">
          <span className="flex items-center gap-2">
            Add Test Data
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;