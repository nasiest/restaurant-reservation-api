import { query } from "./db";

const seed = async () => {
  try {
    // 1️⃣ Create a test restaurant
    const restaurantRes = await query(
      `INSERT INTO restaurants (name, opening_time, closing_time)
       VALUES ($1, $2, $3) RETURNING *`,
      ["Tallie Test Restaurant", "10:00:00", "22:00:00"]
    );

    const restaurant = restaurantRes.rows[0];
    console.log(`Created restaurant: ${restaurant.name} (ID: ${restaurant.id})`);

    // 2️⃣ Create tables
    const tables = [
      { table_number: 1, capacity: 2 },
      { table_number: 2, capacity: 2 },
      { table_number: 3, capacity: 4 },
      { table_number: 4, capacity: 4 },
      { table_number: 5, capacity: 6 },
      { table_number: 6, capacity: 6 },
    ];

    for (const t of tables) {
      const tableRes = await query(
        `INSERT INTO tables (restaurant_id, table_number, capacity)
         VALUES ($1, $2, $3) RETURNING *`,
        [restaurant.id, t.table_number, t.capacity]
      );
      console.log(`Created table: ${tableRes.rows[0].table_number} (Capacity: ${tableRes.rows[0].capacity})`);
    }

    console.log("✅ Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
