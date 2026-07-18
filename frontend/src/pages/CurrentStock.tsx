import { useEffect, useState } from "react";
import CurrentStockTable from "../components/stock/CurrentStockTable";
import { getCurrentStock } from "../services/stockService";
import type { CurrentStock } from "../services/stockService";

function CurrentStockPage() {
    const [stocks, setStocks] = useState<CurrentStock[]>([]);

    const loadStock = async () => {
        try {
            const data = await getCurrentStock();
            setStocks(data);
        } catch (err) {
            console.error("Failed to load inventory summary dataset:", err);
        }
    };

    useEffect(() => {
        loadStock();
    }, []);

    // Metric aggregates logic for premium quick-view counter cards
    const totalUniqueLines = stocks.length;
    const outOfStockCount = stocks.filter(item => item.status === "Out of Stock").length;
    const lowStockCount = stocks.filter(item => item.status === "Low Stock").length;

    return (
        <div className="p-6 space-y-6">
            {/* Context Title Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Real-Time Inventory Balance</h1>
                    <p className="text-sm text-gray-500 mt-0.5">View cross-location item metrics, threshold markers, and warning indicators.</p>
                </div>
            </div>

            {/* Quick Metrics KPI Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Totat</span>
                    <span className="text-2xl font-black text-gray-800 mt-1 font-mono">{totalUniqueLines} <span className="text-xs font-normal text-gray-400 font-sans">Active Profiles</span></span>
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center border-l-4 border-l-amber-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Attention Required (Low Stock)</span>
                    <span className="text-2xl font-black text-amber-600 mt-1 font-mono">{lowStockCount} <span className="text-xs font-normal text-gray-400 font-sans">Reorder Thresholds Hit</span></span>
                </div>
                <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center border-l-4 border-l-rose-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Critical Exhaustion (Out of Stock)</span>
                    <span className="text-2xl font-black text-rose-600 mt-1 font-mono">{outOfStockCount} <span className="text-xs font-normal text-gray-400 font-sans">Depleted Lines</span></span>
                </div>
            </div>

            {/* Core Inventory View Workspace Grid Component */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2">
                <CurrentStockTable stocks={stocks} />
            </div>
        </div>
    );
}

export default CurrentStockPage;