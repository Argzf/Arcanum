// scripts/migrate-unique.js
const { createClient } = require('@tursodatabase/serverless/compat');
require('dotenv').config({ path: '.env' });

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function migrate() {
  try {
    // SQLite doesn't support DROP CONSTRAINT, so we need to recreate the table.
    console.log('Starting migration to remove unique constraint on shortCode...');
    
    // 1. Create a new table with the same columns but no UNIQUE constraint
    await db.execute(`
      CREATE TABLE Link_new (
        id TEXT PRIMARY KEY,
        shortCode TEXT NOT NULL,
        destination TEXT,
        type TEXT DEFAULT 'link',
        fileName TEXT,
        fileSize INTEGER,
        mimeType TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    
    // 2. Copy data from old table
    await db.execute(`
      INSERT INTO Link_new (id, shortCode, destination, type, fileName, fileSize, mimeType, createdAt, updatedAt)
      SELECT id, shortCode, destination, type, fileName, fileSize, mimeType, createdAt, updatedAt FROM Link
    `);
    
    // 3. Drop old table
    await db.execute(`DROP TABLE Link`);
    
    // 4. Rename new table
    await db.execute(`ALTER TABLE Link_new RENAME TO Link`);
    
    // 5. Create a composite index for fast lookups (optional but recommended)
    await db.execute(`CREATE INDEX idx_shortcode_type ON Link (shortCode, type);`);
    
    console.log('✅ Migration complete! Unique constraint on shortCode removed. Same code can now be used for both link and file.');
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

migrate();
