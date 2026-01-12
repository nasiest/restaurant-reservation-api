import { Request, Response } from "express";
import { query } from "../utils/db";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { name, opening_time, closing_time } = req.body;
    const result = await query(
      `INSERT INTO restaurants (name, opening_time, closing_time)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, opening_time, closing_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(`SELECT * FROM restaurants WHERE id = $1`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Restaurant not found" });

    const tables = await query(`SELECT * FROM tables WHERE restaurant_id = $1`, [id]);
    res.json({ ...result.rows[0], tables: tables.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};