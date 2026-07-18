import api from "./api";

export interface StockTransaction {
    id: number;
    type: "IN" | "OUT" | string;
    quantity: number;
    purchasePrice: number | null;
    date: string;
    takenBy?: string;
    reason?: string;

    product: {
        id: number;
        name: string;
    };

    store: {
        id: number;
        name: string;
    };

    supplier?: {
        id: number;
        shopName: string;
        name?: string; // Fallback helper
    };
}

export interface CurrentStock {
    product: {
        id: number;
        name: string;
        category?: {
            name: string;
        };
    };

    store: {
        id: number;
        name: string;
    };

    supplier?: {
        shopName: string;
    };

    quantity: number;
    status: string;
}

export interface AddStockPayload {
    productId: number;
    storeId: number;
    supplierId?: number;
    quantity: number;
    purchasePrice?: number;
    date?: string;
}

export interface RemoveStockPayload {
    productId: number;
    storeId: number;
    quantity: number;
    takenBy: string;
    reason: string;
    date?: string;
}

// Stock In
export const addStock = async (data: AddStockPayload): Promise<StockTransaction> => {
    const response = await api.post("/stock/in", data);
    return response.data;
};

// Stock Out
export const removeStock = async (data: RemoveStockPayload): Promise<StockTransaction> => {
    const response = await api.post("/stock/out", data);
    return response.data;
};

// Current Stock
export const getCurrentStock = async (): Promise<CurrentStock[]> => {
    const response = await api.get("/stock/current");
    return response.data;
};

// Stock History Ledger Logs
export const getStockHistory = async (): Promise<StockTransaction[]> => {
    const response = await api.get("/stock/history");
    return response.data;
};

// Update existing Transaction Node record
export const updateStockTransaction = async (
    id: number, 
    data: Partial<AddStockPayload> | Partial<RemoveStockPayload>
): Promise<StockTransaction> => {
    const response = await api.put(`/stock/${id}`, data);
    return response.data;
};

// Unified Delete Routing Process using your Axios api client config instance wrapper 
export const deleteStock = async (id: number): Promise<void> => {
    await api.delete(`/stock/history/${id}`);
};