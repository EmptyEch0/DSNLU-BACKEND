import { Request, Response } from "express";
import db from "../config/db";

export const getCurrentRegistrar = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM registrars WHERE is_current = 1 LIMIT 1"
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No current registrar found"
      });
    }

    const row = rows[0];
    res.json({ success: true, data: { ...row, full_message: row.message } });

  } catch (error) {
    console.error("Registrar Fetch Error:", error);
    res.status(500).json({ success: false });
  }
};

// Update registrar
export const updateRegistrar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, designation, message, image_url } = req.body;

    await db.query(
      `UPDATE registrars 
       SET name=?, designation=?, message=?, image_url=? 
       WHERE id=?`,
      [name || "", designation || "", message || "", image_url || "", id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Registrar Update Error:", error);
    res.status(500).json({ success: false });
  }
};
