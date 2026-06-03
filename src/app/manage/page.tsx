'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { login } from './actions';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('from') || '/admin';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await login(formData, redirectTo);
      if ('error' in result) {
        setError(result.error || 'Login failed');
        setLoading(false);
      } else if (result.redirect) {
        router.push(result.redirect);
      } else {
        setError('Unexpected response from server');
        setLoading(false);
      }
    } catch (err) {
      console.error('Client login error:', err);
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-grad-end to-grad-mid bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-grad-end focus:border-transparent transition-all"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-grad-end to-grad-mid text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
