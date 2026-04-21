import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center justify-center w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
          isDark ? 'translate-x-3' : '-translate-x-3'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-gray-700" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </div>
    </button>
  );
}