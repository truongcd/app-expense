import React from 'react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="w-12 h-6 rounded-full p-1 bg-gray-300 dark:bg-gray-600 relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
    >
      <span className="absolute left-1 top-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-yellow-500 transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
       <span className="absolute right-1 top-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out">
         <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-200 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </span>
      <div
        className={`w-4 h-4 rounded-full bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? '-translate-x-6' : ''}`}
      />
    </button>
  );
};

export default ThemeToggle;
