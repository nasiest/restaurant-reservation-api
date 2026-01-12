import { query } from "../utils/db";

export const findAvailableTable = async (
  restaurantId: number,
  partySize: number,
  datetime: string,
  duration: number
) => {
  const startTime = new Date(datetime);
  const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  // Fetch tables that can fit the party
  const tablesResult = await query(
    "SELECT id, capacity FROM tables WHERE restaurant_id = $1 AND capacity >= $2",
    [restaurantId, partySize]
  );

  if (!tablesResult?.rows?.length) return [];

  const availableTables: { id: number; capacity: number }[] = [];

  // Check each table for overlapping reservations
  for (const table of tablesResult.rows) {
    const reservationsResult = await query(
      "SELECT start_time, end_time FROM reservations WHERE table_id = $1 AND start_time < $2 AND end_time > $3",
      [table.id, endTime.toISOString(), startTime.toISOString()]
    );

    // If no overlapping reservations, table is available
    if (reservationsResult.rows.length === 0) {
      availableTables.push(table);
    }
  }

  return availableTables;
};

export const createReservation = async (
  restaurantId: number,
  tableId: number,
  customerName: string,
  phone: string,
  partySize: number,
  datetime: string,
  duration: number
) => {
  const startTime = new Date(datetime);
  const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  // Ensure table is still available
  const overlapping = await query(
    "SELECT id FROM reservations WHERE table_id = $1 AND start_time < $2 AND end_time > $3",
    [tableId, endTime.toISOString(), startTime.toISOString()]
  );

  if (overlapping.rows.length > 0) {
    throw new Error("No available tables at this time");
  }

  // Insert reservation
  const result = await query(
    "INSERT INTO reservations (restaurant_id, table_id, customer_name, phone, party_size, start_time, end_time) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [restaurantId, tableId, customerName, phone, partySize, startTime.toISOString(), endTime.toISOString()]
  );

  return result.rows[0];
};
export const cancelReservation = async (reservationId: number) => {
  try {
    const result = await query(
      `UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *`,
      ['canceled', reservationId]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to cancel reservation");
  }
};