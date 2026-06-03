import { getItemByCode } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const item = await getItemByCode(code);
  if (!item || item.type !== 'file' || !item.destination) notFound();

  // Redirect to the blob URL directly (Vercel Blob serves with correct headers)
  // Alternatively, we could proxy, but redirect is simpler and more performant.
  return new Response(null, {
    status: 307,
    headers: { Location: item.destination },
  });
}
