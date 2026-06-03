const { createClient } = require('@tursodatabase/serverless/compat');
require('dotenv').config({ path: '.env' });

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function migrate() {
  try {
    // Add type column if not exists (default 'link')
    await db.execute(`ALTER TABLE Link ADD COLUMN type TEXT DEFAULT 'link';`);
    console.log('✅ Added column "type"');
    
    // Add file specific columns
    await db.execute(`ALTER TABLE Link ADD COLUMN fileName TEXT;`);
    await db.execute(`ALTER TABLE Link ADD COLUMN fileSize INTEGER;`);
    await db.execute(`ALTER TABLE Link ADD COLUMN mimeType TEXT;`);
    console.log('✅ Added file metadata columns');
    
    // For backward compatibility, set existing rows to type 'link'
    await db.execute(`UPDATE Link SET type = 'link' WHERE type IS NULL;`);
    console.log('✅ Migration complete');
  } catch (err) {
    console.error('Migration error (columns may already exist):', err.message);
  }
}

migrate();
