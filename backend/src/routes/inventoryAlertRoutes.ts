import { Router } from "express";

import {
  getInventoryAlerts,
} from "../controllers/inventoryAlertController";

const router = Router();

router.get(
  "/",
  getInventoryAlerts
);

export default router;