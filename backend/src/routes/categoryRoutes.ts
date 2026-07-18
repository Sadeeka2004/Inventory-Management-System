import { Router } from "express";
import {
    createCategory,
    getCategories,
    updateCategory, // Imported
    deleteCategory  // Imported
} from "../controllers/categoryController";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);     // Registered PUT endpoint
router.delete("/:id", deleteCategory);  // Registered DELETE endpoint

export default router;