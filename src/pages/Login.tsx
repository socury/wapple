import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn();
      navigate('/');
    } catch (err: any) {
      setError(err?.message || '구글 로그인에 실패했습니다.');
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
              <p className="text-sm text-gray-500">{t('subtitle')}</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                aria-label={t('login.google')}
                className="w-full inline-flex items-center justify-center gap-3 border border-gray-300 bg-white text-sm text-gray-700 rounded-md px-4 py-2 shadow-sm hover:bg-gray-50"
              >
                {/* Google G logo (simple) */}
                <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-37.6-4.7-55.6H272v105.3h146.9c-6.3 34.4-25 62.2-53.2 81.2v67.4h85.9c50.3-46.3 81.9-114.6 81.9-198.3z"/>
                  <path fill="#34A853" d="M272 544.3c72.6 0 133.6-24 178.2-65.4l-85.9-67.4c-24 16.1-54.6 25.6-92.3 25.6-70.9 0-131-47.8-152.3-112.1H32.6v70.6C76.9 492.3 168.2 544.3 272 544.3z"/>
                  <path fill="#FBBC05" d="M119.7 325.0c-10.9-32.1-10.9-66.9 0-99L32.6 155.4C11.6 200.7 0 250.3 0 301.3s11.6 100.6 32.6 145.9l87.1-70.6z"/>
                  <path fill="#EA4335" d="M272 109.8c39.5 0 75 13.6 102.9 40.3l77.2-77.2C404.9 24.2 344 0 272 0 168.2 0 76.9 51.9 32.6 128.1l87.1 70.6C141 157.6 201.1 109.8 272 109.8z"/>
                </svg>
                <span className="font-medium">{t('login.google')}</span>
              </button>
            </div>

            <div className="my-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">{t('login.orEmail')}</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('login.emailLabel')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('login.passwordLabel')}</label>
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
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                  </svg>
                )}
                <span>{loading ? t('loading') : (mode === 'login' ? t('login.signIn') : t('register.signup'))}</span>
              </button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link to="/register" className="text-blue-600 hover:underline font-medium">{t('login.registerLink')}</Link>
              <div className="text-xs text-gray-400 mt-2">{t('login.noAccount')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
