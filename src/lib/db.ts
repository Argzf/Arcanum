import { createClient } from '@tursodatabase/serverless/compat';

export const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export type Item = {
  id: string;
  shortCode: string;
  destination: string | null;   // for links: external URL; for files: blob URL
  type: 'link' | 'file';
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Get all items (for admin)
export async function getAllItems(): Promise<Item[]> {
  const result = await db.execute(
    `SELECT id, shortCode, destination, type, fileName, fileSize, mimeType, createdAt, updatedAt
     FROM Link ORDER BY createdAt DESC`
  );
  return result.rows.map(row => ({
    id: row.id as string,
    shortCode: row.shortCode as string,
    destination: row.destination as string | null,
    type: row.type as 'link' | 'file',
    fileName: row.fileName as string | null,
    fileSize: row.fileSize as number | null,
    mimeType: row.mimeType as string | null,
    createdAt: new Date(row.createdAt as string),
    updatedAt: new Date(row.updatedAt as string),
  }));
}

// Get by shortCode (for redirection)
export async function getItemByCode(shortCode: string): Promise<Item | null> {
  const result = await db.execute({
    sql: `SELECT id, shortCode, destination, type, fileName, fileSize, mimeType, createdAt, updatedAt
          FROM Link WHERE LOWER(shortCode) = LOWER(?)`,
    args: [shortCode],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id as string,
    shortCode: row.shortCode as string,
    destination: row.destination as string | null,
    type: row.type as 'link' | 'file',
    fileName: row.fileName as string | null,
    fileSize: row.fileSize as number | null,
    mimeType: row.mimeType as string | null,
    createdAt: new Date(row.createdAt as string),
    updatedAt: new Date(row.updatedAt as string),
  };
}

// Create a link (type='link')
export async function createLink(shortCode: string, destination: string): Promise<Item> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO Link (id, shortCode, destination, type, createdAt, updatedAt)
          VALUES (?, ?, ?, 'link', ?, ?)`,
    args: [id, shortCode, destination, now, now],
  });
  return {
    id, shortCode, destination, type: 'link',
    fileName: null, fileSize: null, mimeType: null,
    createdAt: new Date(now), updatedAt: new Date(now),
  };
}

// Create a file record (type='file')
export async function createFileItem(
  shortCode: string,
  blobUrl: string,
  fileName: string,
  fileSize: number,
  mimeType: string
): Promise<Item> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO Link (id, shortCode, destination, type, fileName, fileSize, mimeType, createdAt, updatedAt)
          VALUES (?, ?, ?, 'file', ?, ?, ?, ?, ?)`,
    args: [id, shortCode, blobUrl, fileName, fileSize, mimeType, now, now],
  });
  return {
    id, shortCode, destination: blobUrl, type: 'file',
    fileName, fileSize, mimeType,
    createdAt: new Date(now), updatedAt: new Date(now),
  };
}

export async function updateItem(id: string, shortCode: string, destination: string): Promise<void> {
  const now = new Date().toISOString();
  await db.execute({
    sql: `UPDATE Link SET shortCode = ?, destination = ?, updatedAt = ? WHERE id = ?`,
    args: [shortCode, destination, now, id],
  });
}

export async function deleteItem(id: string): Promise<void> {
  await db.execute({ sql: `DELETE FROM Link WHERE id = ?`, args: [id] });
}
