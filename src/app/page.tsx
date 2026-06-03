import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">URL Shortener</h1>
        <p className="text-gray-600 text-center mb-6">
          Create short, memorable links
        </p>
        <div className="space-y-4">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm text-gray-500">Example:</p>
            <code className="text-sm">https://yourdomain.com/abc123</code>
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
