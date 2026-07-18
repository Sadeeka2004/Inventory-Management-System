import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===============================
// Stock In
// ===============================
export const addStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      supplierId,
      storeId,
      quantity,
      purchasePrice,
      date,
    } = req.body;

    const transaction = await prisma.stockTransaction.create({
      data: {
        productId: Number(productId),
        supplierId: supplierId ? Number(supplierId) : null,
        storeId: Number(storeId),
        quantity: Number(quantity),
        purchasePrice: Number(purchasePrice),
        type: "IN",
        date: date ? new Date(date) : new Date()
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ message: "Error adding stock" });
  }
};

// ===============================
// Stock Out
// ===============================
export const removeStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      storeId,
      quantity,
      takenBy,
      reason,
      date
    } = req.body;

    const transactions = await prisma.stockTransaction.findMany({
      where: {
        productId: Number(productId),
        storeId: Number(storeId),
      },
    });

    const totalIn = transactions
      .filter((t) => t.type === "IN")
      .reduce((sum, t) => sum + t.quantity, 0);

    const totalOut = transactions
      .filter((t) => t.type === "OUT")
      .reduce((sum, t) => sum + t.quantity, 0);

    const available = totalIn - totalOut;

    if (Number(quantity) > available) {
      res.status(400).json({ message: "Insufficient stock available." });
      return;
    }

    const transaction = await prisma.stockTransaction.create({
      data: {
        productId: Number(productId),
        storeId: Number(storeId),
        quantity: Number(quantity),
        takenBy,
        reason,
        type: "OUT",
        date: date ? new Date(date) : new Date()
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error removing stock:", error);
    res.status(500).json({ message: "Error removing stock" });
  }
};

// ===============================
// Current Stock
// ===============================
export const getCurrentStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.stockTransaction.findMany({
      include: {
        product: {
          include: {
            category: true
          }
        },
        store: true,
        supplier: true
      }
    });

    const stockMap: any = {};

    transactions.forEach((transaction) => {
      const key = `${transaction.productId}-${transaction.storeId}`;

      if (!stockMap[key]) {
        stockMap[key] = {
          product: transaction.product,
          store: transaction.store,
          supplier: transaction.supplier,
          quantity: 0
        };
      }

      if (transaction.type === "IN") {
        stockMap[key].quantity += transaction.quantity;
      }

      if (transaction.type === "OUT") {
        stockMap[key].quantity -= transaction.quantity;
      }
    });

    const currentStock = Object.values(stockMap).map((stock: any) => {
      let status = "Normal";
      if (stock.quantity <= 0) {
        status = "Out of Stock";
      } else if (stock.quantity <= stock.product.minimumStock) {
        status = "Low Stock";
      }

      return {
        ...stock,
        status
      };
    });

    res.json(currentStock);
  } catch (error) {
    console.error("Error fetching current stock:", error);
    res.status(500).json({ message: "Error fetching current stock" });
  }
};

// ===============================
// Stock History
// ===============================
export const getStockHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to } = req.query;

    let where: any = {};
    if (from && to) {
      where.date = {
        gte: new Date(from as string),
        lte: new Date(to as string)
      };
    }

    const transactions = await prisma.stockTransaction.findMany({
      where,
      include: {
        product: {
          include: {
            category: true
          }
        },
        store: true,
        supplier: true
      },
      orderBy: {
        date: "desc"
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    res.status(500).json({ message: "Error fetching stock history" });
  }
};

// ===============================
// Update Transaction
// ===============================
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      quantity,
      purchasePrice,
      takenBy,
      reason,
      date,
    } = req.body;

    const updateData: any = {
      quantity: Number(quantity),
      purchasePrice: purchasePrice !== undefined && purchasePrice !== "" ? Number(purchasePrice) : null,
      takenBy,
      reason,
    };

    if (date) {
      updateData.date = new Date(date);
    }

    const transaction = await prisma.stockTransaction.update({
      where: {
        id: Number(id)
      },
      data: updateData,
    });

    res.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction" });
  }
};

// ===============================
// Delete Stock Record
// ===============================
export const deleteStockRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const stockIdNum = Number(id);

    if (isNaN(stockIdNum)) {
      res.status(400).json({ message: "Invalid transaction entry identity code." });
      return;
    }

    // 1. Verify existence profile inside the ledger log
    const record = await prisma.stockTransaction.findUnique({
      where: { id: stockIdNum }
    });

    if (!record) {
      res.status(404).json({ message: "Stock logging ledger node line index not found." });
      return;
    }

    // 2. Perform the database row hard delete
    await prisma.stockTransaction.delete({
      where: { id: stockIdNum }
    });

    res.json({ message: "Transaction record deleted from logs successfully." });
  } catch (error) {
    console.error("Database tracking link deletion failure context:", error);
    res.status(500).json({ message: "Error deleting transaction record from core system database logs." });
  }
};