import { createClient } from '@tursodatabase/serverless/compat';

export const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export type Item = {
  id: string;
  shortCode: string;
  destination: string | null;
  type: 'link' | 'file';
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Auto‑migration: ensure all required columns exist
async function ensureSchema() {
  try {
    // Check if 'type' column exists
    const tableInfo = await db.execute(`PRAGMA table_info(Link);`);
    const columns = tableInfo.rows.map(row => row.name as string);
    
    if (!columns.includes('type')) {
      console.log('Migrating: adding type column...');
      await db.execute(`ALTER TABLE Link ADD COLUMN type TEXT DEFAULT 'link';`);
    }
    if (!columns.includes('fileName')) {
      console.log('Migrating: adding fileName column...');
      await db.execute(`ALTER TABLE Link ADD COLUMN fileName TEXT;`);
    }
    if (!columns.includes('fileSize')) {
      console.log('Migrating: adding fileSize column...');
      await db.execute(`ALTER TABLE Link ADD COLUMN fileSize INTEGER;`);
    }
    if (!columns.includes('mimeType')) {
      console.log('Migrating: adding mimeType column...');
      await db.execute(`ALTER TABLE Link ADD COLUMN mimeType TEXT;`);
    }
    
    // Set default type for existing rows
    await db.execute(`UPDATE Link SET type = 'link' WHERE type IS NULL;`);
    console.log('Schema migration completed (if needed).');
  } catch (err) {
    console.error('Migration warning:', err);
  }
}

// Call the migration once when the module loads
ensureSchema().catch(console.error);

// ------------------------------------------------------------------
// Database functions (updated to use new columns)
// ------------------------------------------------------------------

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
