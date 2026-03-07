import pool from './src/config/db';

async function run() {
  try {
    // 1. Ensure 'criminal-justice' centre exists with ID 7
    const [existing]: any = await pool.query("SELECT id FROM centres WHERE slug = 'criminal-justice' OR id = 7");
    if (existing.length === 0) {
      await pool.query("INSERT INTO centres (id, name, slug, display_order) VALUES (7, 'Centre for Criminal Justice & Administration', 'criminal-justice', 8)");
      console.log('Inserted Criminal Justice centre with ID 7');
    } else {
      console.log('Criminal Justice centre or ID 7 already exists');
    }

    // 2. Seed initial data
    const initialMembers = [
      ['Honorary Chair Person', 'Dr. Soma B', 1],
      ['Faculty Member', 'Dr. Rifat Khan', 2],
      ['Members', 'Dr. V. Sunitha', 3],
      ['Members', 'Ms. Sherley Hepsiba D', 4]
    ];

    const [existingMembers]: any = await pool.query('SELECT COUNT(*) as count FROM centre_committees WHERE centre_id = 7');
    if (existingMembers[0].count === 0) {
      for (const [role, name, ord] of initialMembers) {
        await pool.query('INSERT INTO centre_committees (centre_id, role, name, display_order) VALUES (7, ?, ?, ?)', [role, name, ord]);
      }
      console.log('Seeded Criminal Justice committee members.');
    } else {
      console.log('Criminal Justice committee members already seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
