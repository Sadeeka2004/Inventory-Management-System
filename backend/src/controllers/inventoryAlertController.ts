import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getInventoryAlerts = async (
  req: Request,
  res: Response
) => {
  try {

    const transactions =
      await prisma.stockTransaction.findMany({
        include: {
          product: {
            include: {
              category: true,
            },
          },
          store: true,
          supplier: true,
        },
      });

    const stockMap: any = {};

    transactions.forEach((transaction) => {

      const key =
        `${transaction.productId}-${transaction.storeId}`;

      if (!stockMap[key]) {

        stockMap[key] = {

          product: transaction.product,

          store: transaction.store,

          quantity: 0,

        };

      }

      if (transaction.type === "IN") {

        stockMap[key].quantity +=
          transaction.quantity;

      }

      if (transaction.type === "OUT") {

        stockMap[key].quantity -=
          transaction.quantity;

      }

    });

    const currentStock =
      Object.values(stockMap).map(
        (stock: any) => {

          let status = "Normal";

          if (stock.quantity <= 0) {

            status = "Out of Stock";

          }
          else if (
            stock.quantity <=
            stock.product.minimumStock
          ) {

            status = "Low Stock";

          }

          return {

            ...stock,

            status,

          };

        }
      );

    const lowStock =
      currentStock.filter(
        (item: any) =>
          item.status === "Low Stock"
      );

    const outOfStock =
      currentStock.filter(
        (item: any) =>
          item.status === "Out of Stock"
      );

    res.json({

      lowStock,

      outOfStock,

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Error loading inventory alerts",

    });

  }
};