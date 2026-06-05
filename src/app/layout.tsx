// src/app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import "./globals.css";

const defaultMetadata: Metadata = {
  title: 'Arcanum',
  description: 'Private link shortening and file hosting — secure and private',
  openGraph: {
    title: 'Arcanum',
    description: 'Private link shortening and file hosting — secure and private',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Arcanum Banner',
      },
    ],
    // 'type' is omitted here to avoid type errors; we'll hardcode it in the meta tag
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanum',
    description: 'Private link shortening and file hosting — secure and private',
    images: ['/banner.png'],
  },
};

const isSharingRoute = (pathname: string) => {
  return pathname.startsWith('/links/') || pathname.startsWith('/files/');
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  let title = 'Arcanum';
  let favicon = "/central-favicon.svg";

  if (pathname.startsWith('/admin')) {
    title = 'Dashboard – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname.startsWith('/manage')) {
    title = 'Login – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname.startsWith('/status')) {
    title = 'Status – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname.startsWith('/links')) {
    title = 'Arcanum Link Directory';
    favicon = "/links-favicon.svg";
  } else if (pathname.startsWith('/files')) {
    title = 'Arcanum File Vault';
    favicon = "/files-favicon.svg";
  }

  const metaDescription = defaultMetadata.description ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <link rel="icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/central-favicon-180.png" />
        <meta name="description" content={!isSharingRoute(pathname) ? metaDescription : undefined} />

        {!isSharingRoute(pathname) && (
          <>
            {/* Hardcode static values to avoid type errors */}
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
