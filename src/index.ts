import express from "express";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurantRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import redis  from './utils/redis'

dotenv.config();

// Key pattern: restaurant:{id}:availability:{date}
const key = `restaurant:1:availability:2026-01-12`;

async function cacheAvailability(data: any) {
  await redis.set(key, JSON.stringify(data), 'EX', 60 * 5); // cache for 5 minutes
}

async function getAvailability(): Promise<any | null> {
  const value = await redis.get(key);
  if (!value) return null;
  return JSON.parse(value);
}

const app = express();
app.use(express.json());

app.use("/restaurants", restaurantRoutes);
app.use("/reservations", reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;