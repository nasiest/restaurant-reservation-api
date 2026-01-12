import { query } from '../utils/db';

export const addToWaitlist = async (
  restaurantId: number,
  customerName: string,
  phone: string,
  partySize: number,
  datetime: string
) => {
  try {
    const result = await query(
      `INSERT INTO waitlist (restaurant_id, customer_name, phone, party_size, datetime)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [restaurantId, customerName, phone, partySize, datetime]
    );

    if (!result || !result.rows || result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    console.error('Error adding to waitlist:', err);
    return null;
  }
};

export const processWaitlist = async (restaurantId: number, datetime: string) => {
  try {
    const result = await query(
      `SELECT * FROM waitlist WHERE restaurant_id = $1 AND datetime <= $2 ORDER BY datetime ASC`,
      [restaurantId, datetime]
    );

    if (!result || !result.rows) return [];
    return result.rows;
  } catch (err) {
    console.error('Error processing waitlist:', err);
    return [];
  }
};
