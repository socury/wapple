import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../libs/i18n';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages: { code: Locale; label: string }[] = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  const handleLanguageChange = (lang: Locale) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 rounded-md transition-colors duration-200 ${
            i18n.language === lang.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
