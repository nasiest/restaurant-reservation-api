import express from "express";
import { createReservation, getReservation, cancelReservation  } from "../controllers/reservationController";

const router = express.Router();

router.post("/", createReservation);
router.get("/:id", getReservation);
router.delete("/:id", cancelReservation);

export default router;
