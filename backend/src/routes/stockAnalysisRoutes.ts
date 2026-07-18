import { Router } from "express";

import {
    getCurrentStock
}
from "../controllers/stockAnaysisController";

const router = Router();

router.get(
    "/current",
    getCurrentStock
);

export default router;