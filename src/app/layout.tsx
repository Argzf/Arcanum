'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine page title, favicon, and metadata
  let title = 'Arcanum';
  let description = 'Private short links and file hosting – exclusive to the owner.';
  let favicon = "/central-favicon.svg";
  let appleTouchIcon = "/central-favicon-180.png";
  let ogImage = "https://cdn.arsan.my/banner.png"; // replace with actual banner URL

  if (pathname?.startsWith('/admin')) {
    title = 'Dashboard – Arcanum';
    description = 'Manage your short links and files securely.';
    favicon = "/central-favicon.svg";
    appleTouchIcon = "/central-favicon-180.png";
  } else if (pathname?.startsWith('/manage')) {
    title = 'Login – Arcanum';
    description = 'Admin authentication for Arcanum.';
    favicon = "/central-favicon.svg";
    appleTouchIcon = "/central-favicon-180.png";
  } else if (pathname?.startsWith('/status')) {
    title = 'System Status – Arcanum';
    description = 'Real‑time health checks for Arcanum services.';
    favicon = "/central-favicon.svg";
    appleTouchIcon = "/central-favicon-180.png";
  } else if (pathname?.startsWith('/links')) {
    title = 'Arcanum Link Directory';
    description = 'A short link redirecting you.';
    favicon = "/links-favicon.svg";
    appleTouchIcon = "/links-favicon-180.png";
    ogImage = "https://cdn.arsan.my/banner-links.png"; // optional different banner
  } else if (pathname?.startsWith('/files')) {
    title = 'Arcanum File Vault';
    description = 'A file hosted on Arcanum.';
    favicon = "/files-favicon.svg";
    appleTouchIcon = "/files-favicon-180.png";
    ogImage = "https://cdn.arsan.my/banner-files.png";
  }

  // Update meta tags dynamically (for SEO and social sharing)
  useEffect(() => {
    // Update standard meta tags
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Open Graph (Facebook, LinkedIn)
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    let ogImageTag = document.querySelector('meta[property="og:image"]');
    if (!ogImageTag) {
      ogImageTag = document.createElement('meta');
      ogImageTag.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageTag);
    }
    ogImageTag.setAttribute('content', ogImage);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', `https://cdn.arsan.my${pathname}`);

    // Twitter Card
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', description);

    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', ogImage);

    // Update favicon links
    let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = favicon;
    faviconLink.type = 'image/svg+xml';

    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = appleTouchIcon;
  }, [pathname, title, description, favicon, appleTouchIcon, ogImage]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Base meta tags (will be overridden by useEffect) */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0C0E13" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
