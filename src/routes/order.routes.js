import express from "express"
import { createOrder, getSingleOrder, listOrders } from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/listOrders", listOrders);
router.get("/getSingleOrder/:id", getSingleOrder);

export default router;