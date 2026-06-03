import { getItemByCodeAndType } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const item = await getItemByCodeAndType(code, 'file');
  if (!item || !item.destination) notFound();
  return new Response(null, { status: 307, headers: { Location: item.destination } });
}
