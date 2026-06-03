'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ServiceStatus = {
  database: boolean;
  links: boolean;
  files: boolean;
};

export default function Home() {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'limited' | 'checking'>('checking');

  useEffect(() => {
    async function checkStatus() {
      const base = window.location.origin;
      const results = {
        database: false,
        links: false,
        files: false,
      };

      try {
        // Test links endpoint: request a random non‑existent code and see if we get a 404 (means the route exists)
        const linksRes = await fetch(`${base}/links/__test__status__`, { method: 'HEAD' });
        results.links = linksRes.status === 404; // 404 means route is working (no such code)
      } catch {
        results.links = false;
      }

      try {
        const filesRes = await fetch(`${base}/files/__test__status__`, { method: 'HEAD' });
        results.files = filesRes.status === 404;
      } catch {
        results.files = false;
      }

      // Test database via a dedicated API endpoint (we'll create it)
      try {
        const dbRes = await fetch(`${base}/api/status/db`);
        results.database = dbRes.ok;
      } catch {
        results.database = false;
      }

      setStatus(results);
      const allOk = results.database && results.links && results.files;
      setOverallStatus(allOk ? 'operational' : 'limited');
    }

    checkStatus();
    // Refresh every 60 seconds
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = {
    operational: 'bg-green-500',
    limited: 'bg-yellow-500',
    checking: 'bg-gray-400',
  };

  const statusText = {
    operational: 'Operational',
    limited: 'Limited Service',
    checking: 'Checking...',
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 md:p-8 animate-fade-in">
      <div className="max-w-4xl w-full mx-auto space-y-12">
        {/* Header with Status */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-white/10">
            <span className={`w-2 h-2 ${statusColor[overallStatus]} rounded-full animate-pulse`}></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{statusText[overallStatus]}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="gradient-text">cdn.arsan.my</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Short links and file hosting — for the exclusive use of the owner.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              ⚠️ This service is private. Only the holder of <strong>arsan.my</strong> is authorized to upload files or create links.
            </p>
          </div>
        </div>

        {/* Feature Cards (no login button) */}
        <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
          <div className="group relative glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-grad-end/5 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl bg-blue-100 dark:bg-blue-500/10 p-3 rounded-xl">🔗</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Short Links</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
              Create short URLs that redirect anywhere.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
              https://cdn.arsan.my/links/yourcode
            </div>
          </div>

          <div className="group relative glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-grad-end/5 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl bg-purple-100 dark:bg-purple-500/10 p-3 rounded-xl">📁</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">File Hosting</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
              Upload and share files instantly.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
              https://cdn.arsan.my/files/yourfile
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} –{' '}
          <a href="https://arsan.my" target="_blank" rel="noopener noreferrer" className="hover:text-grad-end transition-colors">
            Arsan Gzf
          </a>
        </p>
      </footer>
    </main>
  );
}
