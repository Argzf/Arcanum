// src/app/status/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type StatusDetail = {
  name: string;
  status: 'operational' | 'limited' | 'checking';
  message: string;
};

export default function StatusPage() {
  const [details, setDetails] = useState<StatusDetail[]>([
    { name: 'Database', status: 'checking', message: 'Checking connection...' },
    { name: 'Links Route', status: 'checking', message: 'Checking endpoint...' },
    { name: 'Files Route', status: 'checking', message: 'Checking endpoint...' },
  ]);

  const fetchStatus = async () => {
    const base = window.location.origin;
    const newDetails = [...details];

    // Check database
    try {
      const dbRes = await fetch(`${base}/api/status/db`);
      newDetails[0].status = dbRes.ok ? 'operational' : 'limited';
      newDetails[0].message = dbRes.ok ? 'Database is reachable.' : 'Database responded with an error.';
    } catch {
      newDetails[0].status = 'limited';
      newDetails[0].message = 'Could not connect to the database.';
    }

    // Check links route
    try {
      const linksRes = await fetch(`${base}/links/__test__status__`, { method: 'HEAD' });
      const isWorking = linksRes.status === 404; // 404 means route exists but code doesn't
      newDetails[1].status = isWorking ? 'operational' : 'limited';
      newDetails[1].message = isWorking
        ? 'Links route is functioning correctly.'
        : 'Links route is not responding as expected.';
    } catch {
      newDetails[1].status = 'limited';
      newDetails[1].message = 'Links route is unreachable.';
    }

    // Check files route
    try {
      const filesRes = await fetch(`${base}/files/__test__status__`, { method: 'HEAD' });
      const isWorking = filesRes.status === 404;
      newDetails[2].status = isWorking ? 'operational' : 'limited';
      newDetails[2].message = isWorking
        ? 'Files route is functioning correctly.'
        : 'Files route is not responding as expected.';
    } catch {
      newDetails[2].status = 'limited';
      newDetails[2].message = 'Files route is unreachable.';
    }

    setDetails(newDetails);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
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
    <main className="min-h-screen p-6 md:p-8 animate-fade-in bg-white dark:bg-[#0C0E13]">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold gradient-text">System Status</h1>
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-grad-end transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-4">
          {details.map((detail, idx) => (
            <div key={idx} className="glass-card rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{detail.name}</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 ${statusColors[detail.status]} rounded-full animate-pulse`}></span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {statusText[detail.status]}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{detail.message}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-500 pt-4">
          Status updates every 30 seconds.
        </p>
      </div>
    </main>
  );
}
