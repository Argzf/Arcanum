// src/app/[...catchAll]/route.ts
import { NextResponse } from 'next/server';
import { getItemByCode } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { catchAll: string[] } }
) {
  // Join the path segments into a single string (e.g., ['wtfff'] -> 'wtfff')
  const fullPath = params.catchAll.join('/');
  
  // First check if the path matches a short link/file (without /links/ or /files/ prefix)
  // This handles legacy codes like /abc123
  const item = await getItemByCode(fullPath);
  
  if (item) {
    // Redirect to the correct prefixed path
    const prefix = item.type === 'link' ? 'links' : 'files';
    const redirectUrl = new URL(`/${prefix}/${fullPath}`, request.url);
    return Response.redirect(redirectUrl.toString(), 307);
  }
  
  // If no item found, return the custom 404 page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 – Arcanum</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-white dark:bg-[#0C0E13]">
    <main class="min-h-screen flex flex-col items-center justify-center p-6">
        <div class="max-w-md w-full mx-auto text-center">
            <h1 class="text-9xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">404</h1>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Lost in the Void</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
                The link or file you're looking for doesn't exist, may have moved, or was never created.
            </p>
            <div class="mt-8">
                <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-blue-700 transition-all">
                    Return Home
                </a>
            </div>
        </div>
    </main>
</body>
</html>`;
  
  return new NextResponse(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html' },
  });
}
