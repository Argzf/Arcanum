import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          URL Shortener
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Create short, memorable links
        </p>
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Example:</p>
            <code className="text-sm text-gray-800 dark:text-gray-200">
              https://arsan.my/abc123
            </code>
          </div>
          <Link
            href="/manage"
            className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  );
}
