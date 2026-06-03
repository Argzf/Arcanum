const { createClient } = require('@tursodatabase/serverless/compat');
require('dotenv').config({ path: '.env' });

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function run() {
  await db.execute(`ALTER TABLE Link ADD COLUMN type TEXT DEFAULT 'link';`);
  await db.execute(`ALTER TABLE Link ADD COLUMN fileName TEXT;`);
  await db.execute(`ALTER TABLE Link ADD COLUMN fileSize INTEGER;`);
  await db.execute(`ALTER TABLE Link ADD COLUMN mimeType TEXT;`);
  console.log('Migration done');
}
run();
