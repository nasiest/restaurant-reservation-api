import { query } from '../utils/db';

export const createRestaurant = async (
  name: string,
  openingTime: string,
  closingTime: string,
  totalTables: number
) => {
  try {
    const result = await query(
      `INSERT INTO restaurants (name, opening_time, closing_time, total_tables)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, openingTime, closingTime, totalTables]
    );

    if (!result || !result.rows || result.rows.length === 0) return null;

    return result.rows[0];
  } catch (err) {
    console.error('Error creating restaurant:', err);
    return null;
  }
};

export const createTable = async (restaurantId: number, tableNumber: number, capacity: number) => {
  try {
    const result = await query(
      `INSERT INTO tables (restaurant_id, table_number, capacity)
       VALUES ($1, $2, $3) RETURNING *`,
      [restaurantId, tableNumber, capacity]
    );

    if (!result || !result.rows || result.rows.length === 0) return null;

    return result.rows[0];
  } catch (err) {
    console.error('Error creating table:', err);
    return null;
  }
};

export const getAllRestaurants = async () => {
  try {
    const result = await query('SELECT * FROM restaurants');

    if (!result || !result.rows) return [];
    return result.rows;
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    return [];
  }
};

export const getTablesForRestaurant = async (restaurantId: number) => {
  try {
    const result = await query(
      'SELECT * FROM tables WHERE restaurant_id = $1',
      [restaurantId]
    );

    if (!result || !result.rows) return [];
    return result.rows;
  } catch (err) {
    console.error('Error fetching tables:', err);
    return [];
  }
};
export const getRestaurant = async (restaurantId: number) => {
  try {
    const result = await query(
      'SELECT * FROM restaurants WHERE id = $1',
      [restaurantId]
    );

    if (!result || !result.rows || result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    return null;
  }
};