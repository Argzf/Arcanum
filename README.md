<div align="center">
  <img src="./public/central-favicon.svg" alt="Arcanum Logo" width="80" height="80" />
  <h1>Arcanum</h1>
  <p><strong>Private short links & file hosting</strong> — built for the exclusive use of myself.</p>
</div>

Arcanum is a secure, self‑hosted utility that turns long URLs into short, memorable links and allows instant file sharing. It is not intended for public registration or open use.

## ✨ Features

- **Short links** – Create custom or randomly generated short codes that redirect to any destination.
- **File hosting** – Upload files (images, PDFs, documents) and share them with a short code.
- **Unified admin dashboard** – Manage all links and files in one place.
- **Dynamic favicons** – Different icons for links, files, and the main site.
- **System status page** – Real‑time health checks for the database and routes.
- **Mobile‑optimised** – Responsive design with copy‑to‑clipboard buttons.
- **Dark mode**
- **Built on modern stack** – Next.js, Turso (libSQL), Vercel Blob Storage.

## 🔧 Tech Stack

- **Framework** – [Next.js 14](https://nextjs.org/) (App Router)
- **Database** – [Turso](https://turso.tech/) (libSQL)
- **File storage** – [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Authentication** – JWT via `jose`
- **Styling** – Tailwind CSS + custom glassmorphic design

## 🚀 Deployment

This project is tailored for deployment on **Vercel**. Environment variables needed:

```env
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
ADMIN_PASSWORD=...
JWT_SECRET=...
BLOB_READ_WRITE_TOKEN=...
