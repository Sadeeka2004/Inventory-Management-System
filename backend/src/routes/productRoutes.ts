import { Router } from "express";

import {

getProducts,

createProduct,

updateProduct,

deactivateProduct

}

from "../controllers/productController";


const router = Router();



router.get(
"/",
getProducts
);



router.post(
"/",
createProduct
);



router.put(
"/:id",
updateProduct
);



router.put(
"/deactivate/:id",
deactivateProduct
);



export default router;