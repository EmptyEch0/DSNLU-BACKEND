import pool from './src/config/db';

async function run() {
  try {
    // 1. Ensure 'ambedkar' centre exists with ID 6
    const [existing]: any = await pool.query("SELECT id FROM centres WHERE slug = 'ambedkar' OR id = 6");
    if (existing.length === 0) {
      await pool.query("INSERT INTO centres (id, name, slug, display_order) VALUES (6, 'Ambedkar Centre', 'ambedkar', 5)");
      console.log('Inserted Ambedkar centre with ID 6');
    } else {
      console.log('Ambedkar centre or ID 6 already exists');
    }

    // 2. Seed initial data if centre_committees table exists and is empty for centre 6
    const initialMembers = [
      ['Honorary Chair Person', 'Dr. A. Nageswara Rao', 1],
      ['Faculty Member', 'Dr. M. Viswachandranath', 2],
      ['Members', 'Ms. Sherley Hepsiba D', 3],
      ['Members', 'Ms. Gali Parivartana', 4],
      ['Members', 'Ms. D. Aparna', 5]
    ];

    const [existingMembers]: any = await pool.query('SELECT COUNT(*) as count FROM centre_committees WHERE centre_id = 6');
    if (existingMembers[0].count === 0) {
      for (const [role, name, ord] of initialMembers) {
        await pool.query('INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (6, ?, ?, ?)', [role, name, ord]);
      }
      console.log('Seeded Ambedkar committee members.');
    } else {
      console.log('Ambedkar committee members already seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
