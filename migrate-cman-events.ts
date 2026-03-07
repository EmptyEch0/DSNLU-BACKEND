import pool from './src/config/db';

async function run() {
  try {
    // Check and update centre_events schema
    const [columns]: any = await pool.query('SHOW COLUMNS FROM centre_events');
    const existingColumns = columns.map((c: any) => c.Field);

    if (!existingColumns.includes('subtitle')) {
      await pool.query('ALTER TABLE centre_events ADD COLUMN subtitle VARCHAR(500) NULL');
      console.log('Added subtitle column.');
    }
    if (!existingColumns.includes('tag')) {
      await pool.query('ALTER TABLE centre_events ADD COLUMN tag VARCHAR(255) NULL');
      console.log('Added tag column.');
    }
    if (!existingColumns.includes('category')) {
      await pool.query('ALTER TABLE centre_events ADD COLUMN category VARCHAR(255) NULL');
      console.log('Added category column.');
    }
    if (!existingColumns.includes('event_date_label')) {
      await pool.query('ALTER TABLE centre_events ADD COLUMN event_date_label VARCHAR(255) NULL');
      console.log('Added event_date_label column.');
    }
    if (!existingColumns.includes('is_published')) {
      await pool.query('ALTER TABLE centre_events ADD COLUMN is_published TINYINT(1) DEFAULT 1');
      console.log('Added is_published column.');
    }

    const initialEvent = {
       title: "One Day Open House Discussion on “Rights of Fishermen”",
       subtitle: "The event served as a vital platform for dialogue between legal scholars, maritime industry stakeholders, and representatives from the fishing community.",
       description: "The Centre for Maritime, Admiralty & Navigation Laws (C-MAN) at DSNLU, in collaboration with the National Human Rights Commission (NHRC), organized a significant open house discussion focused on the legislative and social protections afforded to the fishing community.",
       event_date: "2024-08-31",
       tag: "NHRC Collaboration",
       category: "Discussion",
       display_order: 1,
       is_published: 1
    };

    const [existing]: any = await pool.query('SELECT COUNT(*) as count FROM centre_events WHERE centre_id = 8 AND title = ?', [initialEvent.title]);
    
    if (existing[0].count === 0) {
      await pool.query(
        `INSERT INTO centre_events (centre_id, title, subtitle, description, event_date, tag, category, display_order, is_published)
         VALUES (8, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [initialEvent.title, initialEvent.subtitle, initialEvent.description, initialEvent.event_date, initialEvent.tag, initialEvent.category, initialEvent.display_order, initialEvent.is_published]
      );
      console.log('Seeded initial C-MAN event.');
    } else {
      console.log('Initial C-MAN event already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

run();
