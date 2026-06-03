import { createClient } from '@tursodatabase/serverless/compat';

export const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export type Link = {
  id: string;
  shortCode: string;
  destination: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllLinks(): Promise<Link[]> {
  const result = await db.execute(
    `SELECT id, shortCode, destination, createdAt, updatedAt 
     FROM Link 
     ORDER BY createdAt DESC`
  );
  return result.rows.map(row => ({
    id: row.id as string,
    shortCode: row.shortCode as string,
    destination: row.destination as string,
    createdAt: new Date(row.createdAt as string),
    updatedAt: new Date(row.updatedAt as string),
  }));
}

export async function getLinkByCode(shortCode: string): Promise<Link | null> {
  // Case‑insensitive search using LOWER()
  const result = await db.execute({
    sql: `SELECT id, shortCode, destination, createdAt, updatedAt 
          FROM Link 
          WHERE LOWER(shortCode) = LOWER(?)`,
    args: [shortCode],
  });
  const row = result.rows[0];
  return row
    ? {
        id: row.id as string,
        shortCode: row.shortCode as string,
        destination: row.destination as string,
        createdAt: new Date(row.createdAt as string),
        updatedAt: new Date(row.updatedAt as string),
      }
    : null;
}

export async function createLink(shortCode: string, destination: string): Promise<Link> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO Link (id, shortCode, destination, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?)`,
    args: [id, shortCode, destination, now, now],
  });
  return {
    id,
    shortCode,
    destination,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
}

export async function updateLink(id: string, shortCode: string, destination: string): Promise<void> {
  const now = new Date().toISOString();
  await db.execute({
    sql: `UPDATE Link 
          SET shortCode = ?, destination = ?, updatedAt = ?
          WHERE id = ?`,
    args: [shortCode, destination, now, id],
  });
}

export async function deleteLink(id: string): Promise<void> {
  await db.execute({
    sql: `DELETE FROM Link WHERE id = ?`,
    args: [id],
  });
}
