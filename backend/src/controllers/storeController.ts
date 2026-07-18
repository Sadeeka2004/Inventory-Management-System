import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get All Stores
export const getStores = async (
  req: Request,
  res: Response
) => {
  try {
    const stores = await prisma.store.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.json(stores);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stores",
    });
  }
};

// Create Store
export const createStore = async (
  req: Request,
  res: Response
) => {
  try {
    const store = await prisma.store.create({
      data: req.body,
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      message: "Error creating store",
    });
  }
};

// Update Store
export const updateStore = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });

    res.json(store);
  } catch (error) {
    res.status(500).json({
      message: "Error updating store",
    });
  }
};

// Deactivate Store
export const deactivateStore = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const store = await prisma.store.update({
      where: {
        id: Number(id),
      },
      data: {
        isActive: false,
      },
    });

    res.json({
      message: "Store deactivated",
      store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deactivating store",
    });
  }
};