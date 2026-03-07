import { Request, Response } from "express";
import db from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageRow extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  meta_desc: string;
  hero_subtitle: string;
  is_active: number;
  created_at: string;
}

interface SectionRow extends RowDataPacket {
  id: number;
  page_id: number;
  section_type: string;
  title: string;
  content: string;
  display_order: number;
}

interface NavRow extends RowDataPacket {
  id: number;
  nav_parent: string;
  group_heading: string;
  item_label: string;
  page_slug: string;
  display_order: number;
  is_active: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/dynamic-pages  (admin: all | public: active only)
export const listPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminHeader = req.headers.authorization;
    const isAdmin = !!adminHeader;
    const sql = isAdmin
      ? "SELECT * FROM dynamic_pages ORDER BY created_at DESC"
      : "SELECT * FROM dynamic_pages WHERE is_active = 1 ORDER BY created_at DESC";

    const [rows] = await db.query<PageRow[]>(sql);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("listPages:", err);
    res.status(500).json({ success: false, message: "Failed to fetch pages" });
  }
};

// GET /api/dynamic-pages/:slug  — full page with sections
export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const [pages] = await db.query<PageRow[]>(
      "SELECT * FROM dynamic_pages WHERE slug = ? AND is_active = 1",
      [slug]
    );

    if (!pages.length) {
      res.status(404).json({ success: false, message: "Page not found" });
      return;
    }

    const page = pages[0];

    if (!page) {
      res.status(404).json({ success: false, message: "Page not found" });
      return;
    }

    const [sections] = await db.query<SectionRow[]>(
      "SELECT * FROM page_sections WHERE page_id = ? ORDER BY display_order ASC",
      [page.id]
    );

    // Parse content JSON safely
    const parsedSections = sections.map((s) => ({
      ...s,
      content: (() => {
        try { return JSON.parse(s.content); }
        catch { return {}; }
      })(),
    }));

    res.json({ success: true, data: { ...page, sections: parsedSections } });
  } catch (err) {
    console.error("getPageBySlug:", err);
    res.status(500).json({ success: false, message: "Failed to fetch page" });
  }
};

// POST /api/dynamic-pages  (admin)
export const createPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, meta_desc = "", hero_subtitle = "" } = req.body;

    if (!title || !slug) {
      res.status(400).json({ success: false, message: "Title and slug are required" });
      return;
    }

    // Sanitise slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO dynamic_pages (title, slug, meta_desc, hero_subtitle) VALUES (?, ?, ?, ?)",
      [title, cleanSlug, meta_desc, hero_subtitle]
    );

    res.status(201).json({ success: true, data: { id: result.insertId, slug: cleanSlug } });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ success: false, message: "Slug already exists" });
      return;
    }
    console.error("createPage:", err);
    res.status(500).json({ success: false, message: "Failed to create page" });
  }
};

// PUT /api/dynamic-pages/:id  (admin)
export const updatePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, meta_desc, hero_subtitle, is_active } = req.body;

    const cleanSlug = slug?.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE dynamic_pages SET title=?, slug=?, meta_desc=?, hero_subtitle=?, is_active=? WHERE id=?`,
      [title, cleanSlug, meta_desc, hero_subtitle, is_active ?? 1, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Page not found" });
      return;
    }
    res.json({ success: true, message: "Page updated" });
  } catch (err) {
    console.error("updatePage:", err);
    res.status(500).json({ success: false, message: "Failed to update page" });
  }
};

// DELETE /api/dynamic-pages/:id  (admin) — cascades to sections
export const deletePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await db.query<ResultSetHeader>("DELETE FROM dynamic_pages WHERE id=?", [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Page not found" });
      return;
    }
    res.json({ success: true, message: "Page deleted" });
  } catch (err) {
    console.error("deletePage:", err);
    res.status(500).json({ success: false, message: "Failed to delete page" });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// SECTION ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/dynamic-pages/:pageId/sections  (admin)
export const addSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { section_type, title = "", content, display_order = 0 } = req.body;

    if (!section_type || content === undefined) {
      res.status(400).json({ success: false, message: "section_type and content required" });
      return;
    }

    const contentStr = typeof content === "string" ? content : JSON.stringify(content);

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO page_sections (page_id, section_type, title, content, display_order) VALUES (?,?,?,?,?)",
      [pageId, section_type, title, contentStr, display_order]
    );

    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error("addSection:", err);
    res.status(500).json({ success: false, message: "Failed to add section" });
  }
};

// PUT /api/dynamic-pages/sections/:sectionId  (admin)
export const updateSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sectionId } = req.params;
    const { section_type, title, content, display_order } = req.body;

    const contentStr = typeof content === "string" ? content : JSON.stringify(content);

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE page_sections SET section_type=?, title=?, content=?, display_order=? WHERE id=?",
      [section_type, title, contentStr, display_order ?? 0, sectionId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Section not found" });
      return;
    }
    res.json({ success: true, message: "Section updated" });
  } catch (err) {
    console.error("updateSection:", err);
    res.status(500).json({ success: false, message: "Failed to update section" });
  }
};

// DELETE /api/dynamic-pages/sections/:sectionId  (admin)
export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sectionId } = req.params;
    await db.query("DELETE FROM page_sections WHERE id=?", [sectionId]);
    res.json({ success: true, message: "Section deleted" });
  } catch (err) {
    console.error("deleteSection:", err);
    res.status(500).json({ success: false, message: "Failed to delete section" });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// NAV ADDITIONS ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/dynamic-pages/nav-additions  (public)
export const listNavAdditions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<NavRow[]>(
      "SELECT * FROM nav_additions WHERE is_active=1 ORDER BY nav_parent, display_order ASC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("listNavAdditions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch nav additions" });
  }
};

// GET /api/dynamic-pages/nav-additions/all  (admin — includes inactive)
export const listAllNavAdditions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<NavRow[]>(
      "SELECT * FROM nav_additions ORDER BY nav_parent, display_order ASC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("listAllNavAdditions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch all nav additions" });
  }
};

// POST /api/dynamic-pages/nav-additions  (admin)
export const addNavEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nav_parent, group_heading, item_label, page_slug, display_order = 99 } = req.body;

    if (!nav_parent || !group_heading || !item_label || !page_slug) {
      res.status(400).json({ success: false, message: "All fields required" });
      return;
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO nav_additions (nav_parent, group_heading, item_label, page_slug, display_order) VALUES (?,?,?,?,?)",
      [nav_parent, group_heading, item_label, page_slug, display_order]
    );

    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    console.error("addNavEntry:", err);
    res.status(500).json({ success: false, message: "Failed to add nav entry" });
  }
};

// PUT /api/dynamic-pages/nav-additions/:id  (admin)
export const updateNavEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nav_parent, group_heading, item_label, page_slug, display_order, is_active } = req.body;

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE nav_additions SET nav_parent=?, group_heading=?, item_label=?, page_slug=?, display_order=?, is_active=? WHERE id=?",
      [nav_parent, group_heading, item_label, page_slug, display_order ?? 99, is_active ?? 1, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: "Nav entry not found" });
      return;
    }
    res.json({ success: true, message: "Nav entry updated" });
  } catch (err) {
    console.error("updateNavEntry:", err);
    res.status(500).json({ success: false, message: "Failed to update nav entry" });
  }
};

// DELETE /api/dynamic-pages/nav-additions/:id  (admin)
export const deleteNavEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM nav_additions WHERE id=?", [id]);
    res.json({ success: true, message: "Nav entry deleted" });
  } catch (err) {
    console.error("deleteNavEntry:", err);
    res.status(500).json({ success: false, message: "Failed to delete nav entry" });
  }
};