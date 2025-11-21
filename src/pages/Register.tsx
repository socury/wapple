import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export const Register: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // set displayName from nickname
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nickname || undefined });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white">
      <Header />
      <div className="max-w-lg mx-auto mt-12 px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-blue-600">{t('appName')}</h1>
              <p className="text-sm text-gray-500">{t('register.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('register.nickname')}</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('register.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('register.password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                  </svg>
                )}
                <span>{loading ? t('loading') : t('register.signup')}</span>
              </button>
            </form>

            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500">{t('register.alreadyAccount')} <Link to="/login" className="text-blue-600 hover:underline">{t('login.signIn')}</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
