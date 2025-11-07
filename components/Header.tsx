import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  showInstallButton: boolean;
  onInstall: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ showInstallButton, onInstall, theme, onThemeToggle }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-6 py-4 max-w-4xl flex justify-between items-center">
        <div className="flex-1 text-left">
           {/* Can add logo or brand mark here in the future */}
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Sổ Chi Tiêu
          </h1>
        </div>

        <div className="flex-1 flex justify-end items-center gap-3">
          {showInstallButton && (
            <button
              onClick={onInstall}
              className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-700 flex items-center"
              aria-label="Cài đặt ứng dụng"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 14H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v4M8 18h8" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v3m0 0l-2 2m2-2l2-2" />
              </svg>
            </button>
          )}
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;