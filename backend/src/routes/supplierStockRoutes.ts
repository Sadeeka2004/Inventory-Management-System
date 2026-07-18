import { Router } from "express";

import {
    getSupplierWiseStock
}
from "../controllers/supplierStockController";


const router = Router();


router.get(
    "/",
    getSupplierWiseStock
);


export default router;