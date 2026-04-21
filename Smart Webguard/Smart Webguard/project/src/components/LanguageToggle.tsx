import React from 'react';
import { Languages, Globe } from 'lucide-react';

interface LanguageToggleProps {
  currentLanguage: 'en' | 'hi';
  onLanguageChange: (language: 'en' | 'hi') => void;
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as 'en' | 'hi')}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="en">🇺🇸 English</option>
        <option value="hi">🇮🇳 हिंदी</option>
      </select>
    </div>
  );
}