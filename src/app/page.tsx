import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 animate-fade-in">
      <div className="max-w-4xl w-full mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-white/10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operational</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="gradient-text">cdn.arsan.my</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share links and files with short, memorable codes — fast, secure, and beautifully simple.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
          {/* Short Links Card */}
          <div className="group relative glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-grad-end/5 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl bg-blue-100 dark:bg-blue-500/10 p-3 rounded-xl">🔗</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Short Links</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
              Create short URLs that redirect anywhere. Perfect for social media, emails, or QR codes.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
              https://short.arsan.my/links/yourcode
            </div>
          </div>

          {/* File Hosting Card */}
          <div className="group relative glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-grad-end/5 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl bg-purple-100 dark:bg-purple-500/10 p-3 rounded-xl">📁</span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">File Hosting</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
              Upload and share files instantly. Images, PDFs, documents — all with a short code.
            </p>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
              https://cdn.arsan.my/files/yourfile
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <Link
              href="/manage"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-grad-end to-grad-mid text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Admin Login
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Protected area for managing links and files.
          </p>
        </div>
      </div>
    </main>
  );
}
