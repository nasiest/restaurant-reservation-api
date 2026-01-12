import { Request, Response } from "express";
import { query } from "../utils/db";
import { findAvailableTable } from "../services/reservationService";

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { restaurant_id, customer_name, phone, party_size, start_time, end_time, duration } = req.body;

    const start = new Date(start_time);
    const end = new Date(start.getTime() + duration * 60000); // duration in minutes

    // Find table
    const tables = await findAvailableTable(restaurant_id, party_size, start_time, end_time);
    if (!tables || tables.length === 0) return res.status(400).json({ error: "No table available" });

    const table = tables[0];
    const result = await query(
      `INSERT INTO reservations
       (restaurant_id, table_id, customer_name, phone, party_size, start_time, end_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [restaurant_id, table.id, customer_name, phone, party_size, start, end]
    );

    console.log(`Reservation confirmed for ${customer_name} at table ${table.id}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM reservations WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM reservations WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    console.log(`Reservation ${id} cancelled`);
    res.status(200).json({ message: "Reservation cancelled", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};