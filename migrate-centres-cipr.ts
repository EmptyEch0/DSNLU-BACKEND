import pool from './src/config/db';

async function run() {
  try {
    const [existing]: any = await pool.query("SELECT id FROM centres WHERE slug = 'cipr'");
    if (existing.length === 0) {
      await pool.query("INSERT INTO centres (name, slug, display_order) VALUES ('Centre for IPR', 'cipr', 4)");
      console.log('Inserted CIPR centre');
    } else {
      console.log('CIPR centre already exists');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
