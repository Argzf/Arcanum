import { getItemByCodeAndType } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const item = await getItemByCodeAndType(code, 'link');
  if (!item) notFound();
  redirect(item.destination!);
}
