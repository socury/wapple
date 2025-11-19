import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher/LanguageSwitcher';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          📶 {t('title')}
        </h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
