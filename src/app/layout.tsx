'use client';

import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine page title, favicon (SVG), and iOS home screen icon (PNG)
  let title = 'Arcanum';
  let favicon = "/central-favicon.svg";
  let appleTouchIcon = "/central-favicon-180.png";

  if (pathname?.startsWith('/admin')) {
    title = 'Dashboard – Arcanum';
    favicon = "/central-favicon.svg";
    appleTouchIcon = "/central-favicon-180.png";
  } else if (pathname?.startsWith('/manage')) {
    title = 'Login – Arcanum';
    favicon = "/central-favicon.svg";
    appleTouchIcon = "/central-favicon-180.png";
  } else if (pathname?.startsWith('/status')) {
    title = 'Status – Arcanum';
    favicon = "/central-favicon.svg";
    appleTouchIcon = "/central-favicon-180.png";
  } else if (pathname?.startsWith('/links')) {
    title = 'Arcanum Link Directory';
    favicon = "/links-favicon.svg";
    appleTouchIcon = "/links-favicon-180.png";
  } else if (pathname?.startsWith('/files')) {
    title = 'Arcanum File Vault';
    favicon = "/files-favicon.svg";
    appleTouchIcon = "/files-favicon-180.png";
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <meta name="description" content="Private short links and file hosting" />

        {/* Standard favicon (SVG) */}
        <link rel="icon" href={favicon} type="image/svg+xml" />

        {/* iOS / iPadOS home screen icon (PNG) */}
        <link rel="apple-touch-icon" href={appleTouchIcon} />

        {/* Optional: different sizes for older iOS devices */}
        <link rel="apple-touch-icon" sizes="152x152" href={appleTouchIcon} />
        <link rel="apple-touch-icon" sizes="167x167" href={appleTouchIcon} />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />

        {/* Web app capabilities (standalone mode) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={title} />

        {/* Android / Chrome (optional but recommended) */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0C0E13" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
