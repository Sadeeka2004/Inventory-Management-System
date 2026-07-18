import { Router } from "express";

import {
    assignProductToSupplier,
    getProductSuppliers
}
from "../controllers/supplierProductController";

const router = Router();

router.post(
    "/", assignProductToSupplier
);

router.get(
    "/product/:productId",
    getProductSuppliers
);

export default router;