import { Request, Response } from "express";
import db from "../config/db";

export const getLLMCurriculum = async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    const [reg]: any = await db.query(
      `SELECT * FROM llm_regulations WHERE regulation_year=?`,
      [year]
    );

    if (!reg.length) return res.status(404).json({ message: "Regulation not found" });

    const regulationId = reg[0].id;

    const [compulsory]: any = await db.query(
      `SELECT * FROM llm_compulsory_papers
       WHERE regulation_id=?
       ORDER BY display_order ASC`,
      [regulationId]
    );

    const [dissertation]: any = await db.query(
      `SELECT * FROM llm_dissertation WHERE regulation_id=?`,
      [regulationId]
    );

    const [specializations]: any = await db.query(
      `SELECT * FROM llm_specializations
       WHERE regulation_id=?
       ORDER BY display_order ASC`,
      [regulationId]
    );

    for (const spec of specializations) {
      const [papers]: any = await db.query(
        `SELECT * FROM llm_specialization_papers
         WHERE specialization_id=?
         ORDER BY display_order ASC`,
        [spec.id]
      );
      spec.papers = papers;
    }

    res.json({
      regulation: reg[0],
      compulsory,
      dissertation: dissertation[0],
      specializations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
