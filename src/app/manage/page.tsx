'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { login } from './actions';
import DiscordLoginButton from '../components/DiscordLoginButton';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('from') || '/admin';
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  // If Discord session is active, redirect immediately
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
              Sign in with Discord or password
            </p>
          </div>

          {/* Discord Login Button */}
          <div className="mb-6">
            <DiscordLoginButton />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with password
              </span>
            </div>
          </div>

          {/* Password Login Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
              {loading ? 'Logging in...' : 'Login with Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-gray-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
