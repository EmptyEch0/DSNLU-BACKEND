import db from "../config/db";

// FULL JOURNAL (single endpoint)
export const getFullJournal = async () => {
  const [journal]: any = await db.query("SELECT * FROM journal LIMIT 1");
  const journalId = journal[0]?.id || 1;

  const [about]: any = await db.query("SELECT * FROM journal_about WHERE journal_id = ?", [journalId]);
  const [contacts]: any = await db.query("SELECT * FROM journal_contacts WHERE journal_id = ?", [journalId]);
  const [guidelines]: any = await db.query("SELECT * FROM journal_guidelines WHERE journal_id = ?", [journalId]);
  const [limits]: any = await db.query("SELECT * FROM journal_word_limits WHERE journal_id = ?", [journalId]);
  const [board]: any = await db.query("SELECT * FROM journal_board WHERE journal_id = ?", [journalId]);
  const [archives]: any = await db.query("SELECT * FROM journal_archives WHERE journal_id = ?", [journalId]);

  return {
    about: about[0] || null,
    contacts,
    guidelines,
    wordLimits: limits,
    board,
    archives,
  };
};

// ABOUT
export const getAbout = async () => {
  const [rows]: any = await db.query("SELECT content FROM journal_about WHERE journal_id = 1");
  return rows[0];
};

export const updateAbout = async (content: string) => {
  await db.query("UPDATE journal_about SET content = ? WHERE journal_id = 1", [content]);
};

// CONTACTS
export const getContacts = async () => {
  const [rows]: any = await db.query("SELECT * FROM journal_contacts WHERE journal_id = 1");
  return rows;
};

export const addContact = async (data: any) => {
  const { role, name, email } = data;
  const [orderResult]: any = await db.query("SELECT COALESCE(MAX(display_order),0)+1 AS n FROM journal_contacts WHERE journal_id=1");
  const [result]: any = await db.query(
    "INSERT INTO journal_contacts (journal_id, role, name, email, display_order) VALUES (1, ?, ?, ?, ?)",
    [role, name, email, orderResult[0].n]
  );
  return { id: result.insertId, role, name, email };
};

export const updateContact = async (id: number, data: any) => {
  const { role, name, email } = data;
  await db.query("UPDATE journal_contacts SET role=?, name=?, email=? WHERE id=?", [role, name, email, id]);
};

export const deleteContact = async (id: number) => {
  await db.query("DELETE FROM journal_contacts WHERE id=?", [id]);
};

// GUIDELINES
export const getGuidelines = async () => {
  const [rows]: any = await db.query("SELECT * FROM journal_guidelines WHERE journal_id = 1");
  return rows;
};

export const addGuideline = async (data: any) => {
  const { section_title, content } = data;
  const [orderResult]: any = await db.query("SELECT COALESCE(MAX(display_order),0)+1 AS n FROM journal_guidelines WHERE journal_id=1");
  const [result]: any = await db.query(
    "INSERT INTO journal_guidelines (journal_id, section_title, content, display_order) VALUES (1, ?, ?, ?)",
    [section_title, content, orderResult[0].n]
  );
  return { id: result.insertId, section_title, content };
};

export const updateGuideline = async (id: number, data: any) => {
  const { section_title, content } = data;
  await db.query("UPDATE journal_guidelines SET section_title=?, content=? WHERE id=?", [section_title, content, id]);
};

export const deleteGuideline = async (id: number) => {
  await db.query("DELETE FROM journal_guidelines WHERE id=?", [id]);
};

// WORD LIMITS
export const getWordLimits = async () => {
  const [rows]: any = await db.query("SELECT * FROM journal_word_limits WHERE journal_id = 1");
  return rows;
};

export const addWordLimit = async (data: any) => {
  const { category, min_words, max_words } = data;
  const [orderResult]: any = await db.query("SELECT COALESCE(MAX(display_order),0)+1 AS n FROM journal_word_limits WHERE journal_id=1");
  const [result]: any = await db.query(
    "INSERT INTO journal_word_limits (journal_id, category, min_words, max_words, display_order) VALUES (1, ?, ?, ?, ?)",
    [category, min_words, max_words, orderResult[0].n]
  );
  return { id: result.insertId, category, min_words, max_words };
};

export const updateWordLimit = async (id: number, data: any) => {
  const { category, min_words, max_words } = data;
  await db.query("UPDATE journal_word_limits SET category=?, min_words=?, max_words=? WHERE id=?", [category, min_words, max_words, id]);
};

export const deleteWordLimit = async (id: number) => {
  await db.query("DELETE FROM journal_word_limits WHERE id=?", [id]);
};

// BOARD
export const getBoard = async () => {
  const [rows]: any = await db.query("SELECT * FROM journal_board WHERE journal_id = 1");
  return rows;
};

export const addBoardMember = async (data: any) => {
  const { board_type, name, designation, email } = data;
  const [orderResult]: any = await db.query("SELECT COALESCE(MAX(display_order),0)+1 AS n FROM journal_board WHERE journal_id=1");
  const [result]: any = await db.query(
    "INSERT INTO journal_board (journal_id, board_type, name, designation, email, display_order) VALUES (1, ?, ?, ?, ?, ?)",
    [board_type, name, designation, email, orderResult[0].n]
  );
  return { id: result.insertId, board_type, name, designation, email };
};

export const updateBoardMember = async (id: number, data: any) => {
  const { board_type, name, designation, email } = data;
  await db.query("UPDATE journal_board SET board_type=?, name=?, designation=?, email=? WHERE id=?", [board_type, name, designation, email, id]);
};

export const deleteBoardMember = async (id: number) => {
  await db.query("DELETE FROM journal_board WHERE id=?", [id]);
};

// ARCHIVES
export const getArchives = async () => {
  const [rows]: any = await db.query("SELECT * FROM journal_archives WHERE journal_id = 1");
  return rows;
};

export const addArchive = async (data: any) => {
  const { title, year, file_url } = data;
  const [result]: any = await db.query(
    "INSERT INTO journal_archives (journal_id, title, year, file_url) VALUES (1, ?, ?, ?)",
    [title, year, file_url]
  );
  return { id: result.insertId, title, year, file_url };
};

export const updateArchive = async (id: number, data: any) => {
  const { title, year, file_url } = data;
  await db.query("UPDATE journal_archives SET title=?, year=?, file_url=? WHERE id=?", [title, year, file_url, id]);
};

export const deleteArchive = async (id: number) => {
  await db.query("DELETE FROM journal_archives WHERE id=?", [id]);
};
