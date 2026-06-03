const { createClient } = require('@tursodatabase/serverless/compat');

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function setup() {
  const sql = `
    CREATE TABLE IF NOT EXISTS Link (
      id TEXT PRIMARY KEY,
      shortCode TEXT UNIQUE NOT NULL,
      destination TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `;
  await db.execute(sql);
  console.log('✅ Database schema ready');
}

setup().catch(console.error);
