import { db } from '@/lib/db';

export async function GET() {
  try {
    // Simple query to verify database connection
    await db.execute('SELECT 1');
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
  } catch (error) {
    console.error('DB status check failed:', error);
    return new Response(JSON.stringify({ status: 'error' }), { status: 500 });
  }
}
