import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Create Category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({
            message: "Error creating category",
            error
        });
    }
};

// Get All Categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching categories"
        });
    }
};

// Update Category (ADDED)
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: { name }
        });

        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating category backend side"
        });
    }
};

// Delete Category with Safe Safe-guards (FIXED)
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryIdNum = Number(id);

        // 1. Double check if they are trying to delete the system safeguard category
        const categoryToDelete = await prisma.category.findUnique({
            where: { id: categoryIdNum }
        });

        if (categoryToDelete?.name.toLowerCase() === "general") {
             res.status(400).json({ message: "The master 'General' category cannot be deleted from the system." });
             return;
        }

        // 2. Locate or create a backup placeholder category named "General"
        let fallbackCategory = await prisma.category.findFirst({
            where: { name: { equals: "General", mode: "insensitive" } }
        });

        if (!fallbackCategory) {
            fallbackCategory = await prisma.category.create({
                data: { name: "General" }
            });
        }

        // 3. Re-route products from the old category over to the fallback group
        await prisma.product.updateMany({
            where: { categoryId: categoryIdNum },
            data: { categoryId: fallbackCategory.id } 
        });

        // 4. Now that no active items depend on it, delete the target category
        await prisma.category.delete({
            where: { id: categoryIdNum }
        });

        res.json({ message: "Category deleted and dependent products moved to 'General' category successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error deleting category from database"
        });
    }
};