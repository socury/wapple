import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../language-switcher/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          📶 {t('title')}
        </h1>
        <LanguageSwitcher />
        <div className="ml-4 flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.displayName ?? user.email}</span>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                {t('actions.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
              >
                {t('login.signIn')}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-md border border-green-500 bg-green-50 text-sm text-green-700 hover:bg-green-100"
              >
                {t('register.signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
