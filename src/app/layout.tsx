'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let title = 'Arcanum';
  let favicon = "/central-favicon.svg";

  if (pathname?.startsWith('/admin')) {
    title = 'Dashboard – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname?.startsWith('/manage')) {
    title = 'Login – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname?.startsWith('/status')) {
    title = 'Status – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname?.startsWith('/links')) {
    title = 'Arcanum Link Directory';
    favicon = "/links-favicon.svg";
  } else if (pathname?.startsWith('/files')) {
    title = 'Arcanum File Vault';
    favicon = "/files-favicon.svg";
  }

  const shouldShowMetadata = !pathname?.startsWith('/links/') && !pathname?.startsWith('/files/');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <link rel="icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/central-favicon-180.png" />
        <meta name="description" content="Private link shortening and file hosting — secure and private" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#6597E9" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1E293B" />
        <meta name="msapplication-TileColor" content="#6597E9" />

        {shouldShowMetadata && (
          <>
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Arcanum" />
            <meta property="og:description" content="Private link shortening and file hosting — secure and private" />
            <meta property="og:image" content="/banner.png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Arcanum" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Arcanum" />
            <meta name="twitter:description" content="Private link shortening and file hosting — secure and private" />
            <meta name="twitter:image" content="/banner.png" />
          </>
        )}
      </head>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
