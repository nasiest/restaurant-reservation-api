import express from "express";
import { createRestaurant, getRestaurant, getAllRestaurants } from "../controllers/restaurantController";

const router = express.Router();

router.post("/", createRestaurant);
router.get("/:id", getRestaurant);
router.get("/", getAllRestaurants);

export default router;