import { getItemByCode } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  console.log(`[Link route] Looking for code: "${code}"`);

  const item = await getItemByCode(code);
  console.log(`[Link route] Found item:`, item ? { type: item.type, destination: item.destination } : 'null');

  if (!item) {
    console.log(`[Link route] No item found for ${code}`);
    notFound();
  }

  if (item.type !== 'link') {
    console.log(`[Link route] Item type is ${item.type}, not a link`);
    notFound();
  }

  console.log(`[Link route] Redirecting to ${item.destination}`);
  redirect(item.destination!);
}
