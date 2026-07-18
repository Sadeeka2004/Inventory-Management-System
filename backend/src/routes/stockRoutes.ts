import { Router } from "express";

import {
  addStock,
  removeStock,
  getCurrentStock,
  getStockHistory,
  updateTransaction,
} from "../controllers/stockController";

import { deleteStockRecord } from "../controllers/stockController";

const router = Router();

// Stock In
router.post("/in", addStock);

// Stock Out
router.post("/out", removeStock);

// Current Stock
router.get("/current", getCurrentStock);

router.get("/history", getStockHistory);

router.put("/:id", updateTransaction);

router.delete("/history/:id", deleteStockRecord);

export default router;