// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 animate-fade-in bg-white dark:bg-[#0C0E13]">
      <div className="max-w-md w-full mx-auto text-center space-y-8">
        {/* 404 Status */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Lost in the Void</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The link or file you're looking for doesn't exist, may have moved, or was never created.
          </p>
        </div>

        {/* Illustration / Icon */}
        <div className="flex justify-center">
          <svg className="w-32 h-32 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="bg-gradient-to-r from-grad-end to-grad-mid text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          >
            Return Home
          </Link>
          <Link
            href="/status"
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Check System Status
          </Link>
        </div>
      </div>
    </main>
  );
}
