import api from "./api";

export interface TransactionReportItem {
    id: number;
    type: "IN" | "OUT";
    quantity: number;
    purchasePrice: number | null;
    date: string;
    takenBy: string | null;
    reason: string | null;
    product: {
        name: string;
        unit: string;
    };
    store: {
        name: string;
    };
    supplier: {
        shopName: string;
    } | null;
}

export interface ReportSummary {
    totalStockIn: number;
    totalStockOut: number;
    transactions: TransactionReportItem[];
}

export const getInventoryReport = async (startDate?: string, endDate?: string): Promise<ReportSummary> => {
    // 1. Build query filters for our real transaction route
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    // 2. Change endpoint path to the route that actually exists on the backend
    const response = await api.get("/stock/history", { params });
    
    const transactionsList: TransactionReportItem[] = response.data || [];

    // 3. Since /stock/history returns a raw list of actions, we compile the 
    //    totalStockIn and totalStockOut math summaries dynamically right here!
    let totalStockIn = 0;
    let totalStockOut = 0;

    transactionsList.forEach((tx) => {
        if (tx.type === "IN") {
            totalStockIn += tx.quantity || 0;
        } else if (tx.type === "OUT") {
            totalStockOut += tx.quantity || 0;
        }
    });

    // 4. Return the aggregated response contract structural layout expected by Reports.tsx
    return {
        transactions: transactionsList,
        totalStockIn,
        totalStockOut
    };
};