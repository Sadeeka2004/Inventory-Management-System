import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes";

import categoryRoutes from "./routes/categoryRoutes";

import supplierRoutes from "./routes/supplierRoutes";

import supplierProductRoutes from "./routes/supplierProductRoutes";

import stockRoutes from "./routes/stockRoutes";

import stockAnalysisRoutes from "./routes/stockAnalysisRoutes";

import supplierStockRoutes from "./routes/supplierStockRoutes";

import storeRoutes from "./routes/storeRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import inventoryAlertRoutes from "./routes/inventoryAlertRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/supplier-stock",
    supplierStockRoutes
);

app.use(
    "/stock-analysis",
    stockAnalysisRoutes
);

app.use(
    "/categories",
    categoryRoutes
);

app.use(
    "/suppliers",
    supplierRoutes
);

app.use("/stock", stockRoutes);
app.use("/supplier-products", supplierProductRoutes);

app.use("/products", productRoutes);

app.use("/stores", storeRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/inventory-alerts", inventoryAlertRoutes);

app.get("/", (req, res) => {
    res.send("Inventory Management API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});