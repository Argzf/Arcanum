import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          arsan<span className="text-blue-600">.my</span>
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Share links and files with short, memorable codes
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Link card */}
          <div className="border rounded-lg p-5 hover:shadow-md transition dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔗</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Short Links</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Create short URLs that redirect anywhere. Perfect for social media, emails, or QR codes.
            </p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://short.arsan.my/links/yourcode</code>
          </div>

          {/* File card */}
          <div className="border rounded-lg p-5 hover:shadow-md transition dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📁</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Hosting</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Upload and share files instantly. Images, PDFs, documents – all with a short code.
            </p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://short.arsan.my/files/yourfile</code>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/manage"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Admin Login →
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Protected area for managing links and files.
          </p>
        </div>
      </div>
    </main>
  );
}
