import { Router } from "express";

import {
  getStores,
  createStore,
  updateStore,
  deactivateStore,
} from "../controllers/storeController";

const router = Router();

router.get("/", getStores);

router.post("/", createStore);

router.put("/:id", updateStore);

router.put("/deactivate/:id", deactivateStore);

export default router;