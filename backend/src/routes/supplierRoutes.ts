import { Router } from "express";

import {
    createSupplier,
    getSuppliers,
    updateSupplier,
    deactivateSupplier
}
from "../controllers/supplierController";


const router = Router();

router.put(
    "/:id",
    updateSupplier
);

router.post(
    "/",
    createSupplier
);

router.get(
    "/",
    getSuppliers
);

router.put(
    "/deactivate/:id",
    deactivateSupplier
)


export default router;
