import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalStores = await prisma.store.count({ where: { isActive: true } });
    const totalSuppliers = await prisma.supplier.count({ where: { isActive: true } });
    const totalProducts = await prisma.product.count({ where: { isActive: true } });

    const transactions = await prisma.stockTransaction.findMany({
      include: {
        product: { include: { category: true } },
        store: true,
      },
    });

    const stockMap: any = {};

    transactions.forEach((transaction) => {
      // FIX: Group exactly like inventory alert module (Product + Store)
      const key = `${transaction.productId}-${transaction.storeId}`;

      if (!stockMap[key]) {
        stockMap[key] = {
          product: transaction.product,
          store: transaction.store,
          quantity: 0,
        };
      }

      if (transaction.type === "IN") {
        stockMap[key].quantity += transaction.quantity;
      } else {
        stockMap[key].quantity -= transaction.quantity;
      }
    });

    // Only look at active products that actually have warehouse transactional records
    const currentStock = Object.values(stockMap).filter((item: any) => item.product?.isActive);

    const lowStockProducts = currentStock.filter((item: any) => {
      return item.quantity > 0 && item.quantity <= item.product.minimumStock;
    });

    const outOfStockProducts = currentStock.filter((item: any) => {
      return item.quantity <= 0;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStockIn = await prisma.stockTransaction.count({
      where: {
        type: "IN",
        date: { gte: today },
      },
    });

    const todayStockOut = await prisma.stockTransaction.count({
      where: {
        type: "OUT",
        date: { gte: today },
      },
    });

    res.json({
      totalStores,
      totalSuppliers,
      totalProducts,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      todayStockIn,
      todayStockOut,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};