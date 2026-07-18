import { useEffect, useState } from "react";
import StockOutForm from "../components/stock/StockOutForm";
import Table from "../components/common/Table";
import { getStores } from "../services/storeService";
import { getProducts } from "../services/productService";
import { getStockHistory, removeStock, deleteStock, } from "../services/stockService";
import type { StockTransaction } from "../services/stockService";

function StockOut() {
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState<StockTransaction[]>([]);

    // Deep Filter Multi-State Tracking Variables
    const [globalSearch, setGlobalSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const loadAllMetadata = async () => {
        try {
            const [storeRes, productRes, historyRes] = await Promise.all([
                getStores(),
                getProducts(),
                getStockHistory()
            ]);
            setStores(storeRes);
            setProducts(productRes);
            
            // Isolate outgoing records
            setStocks(historyRes.filter((item: StockTransaction) => item.type === "OUT"));
        } catch (err) {
            console.error("Data loading sequence failure context:", err);
        }
    };

    useEffect(() => {
        loadAllMetadata();
    }, []);

    const handleSubmit = async (formData: any) => {
        try {
            await removeStock({ ...formData, type: "OUT" });
            const historyRes = await getStockHistory();
            setStocks(historyRes.filter((item: StockTransaction) => item.type === "OUT"));
        } catch (err: any) {
            // Display clean backend error messages (e.g., "Insufficient stock available.")
            alert(err.response?.data?.message || "Error processing stock extraction registration data.");
        }
    };

    const handleDeleteRecord = async (id: number) => {
        if (window.confirm("Are you absolutely sure you want to delete this historical stock-out ledger node record? This action will adjust log tracking tracking history context!")) {
            try {
                await deleteStock(id);
                // Refresh list directly after complete deletion execution
                const historyRes = await getStockHistory();
                setStocks(historyRes.filter((item: StockTransaction) => item.type === "OUT"));
            } catch (err) {
                alert("Error removing logging node line.");
            }
        }
    };

    // Advanced Live Data Filter Algorithm pipeline
    const filteredStocks = stocks.filter((item) => {
        const prodName = (item.product?.name || "").toLowerCase();
        const storeName = (item.store?.name || "").toLowerCase();
        const takenByStr = (item.takenBy || "").toLowerCase();
        const reasonStr = (item.reason || "").toLowerCase();
        const targetSearch = globalSearch.toLowerCase();

        // 1. Text criteria evaluate match
        const matchesText = prodName.includes(targetSearch) || 
                            storeName.includes(targetSearch) ||
                            takenByStr.includes(targetSearch) ||
                            reasonStr.includes(targetSearch);

        // 2. Date ranges bounds validation checking
        const recordDateStr = item.date ? item.date : (item as any).createdAt;
        const itemDate = new Date(recordDateStr).setHours(0,0,0,0);
        
        let matchesStartDate = true;
        let matchesEndDate = true;

        if (startDate) {
            matchesStartDate = itemDate >= new Date(startDate).setHours(0,0,0,0);
        }
        if (endDate) {
            matchesEndDate = itemDate <= new Date(endDate).setHours(23,59,59,999);
        }

        return matchesText && matchesStartDate && matchesEndDate;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Stock Out</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage stock extractions, adjustments, and outbound tracking logs.</p>
                </div>
            </div>

            {/* Split Screen Workspace Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-1 bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Log New Stock Out</h2>
                    <StockOutForm
                        stores={stores}
                        products={products}
                        onSubmit={handleSubmit}
                    />
                </div>

                {/* Main Data Visual Board Panel */}
                <div className="xl:col-span-2 space-y-4">
                    
                    {/* Multi-Filter Search Hub Grid Panel */}
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ledger Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="🔍 Search items by Product, Location, Recipient, or Reason..."
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    className="border border-gray-300 p-2 text-sm w-full rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border border-gray-300 p-2 text-sm w-full rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                                    title="Start date filter boundary parameter"
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border border-gray-300 p-2 text-sm w-full rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                                    title="End date filter boundary parameter"
                                />
                            </div>
                        </div>
                        
                        {/* Filter clear button helper shortcut */}
                        {(globalSearch || startDate || endDate) && (
                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => { setGlobalSearch(""); setStartDate(""); setEndDate(""); }}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Datagrid Table view */}
                    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <Table headers={["#", "Date", "Product Item", "Store / Location", "Quantity", "Taken By", "Reason", "Actions"]}>
                            {filteredStocks.map((stock, index) => (
                                <tr key={stock.id} className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30">
                                    <td className="border border-gray-200 p-3 w-12 text-center font-mono text-sm text-gray-500 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-200 p-3 font-mono text-sm text-gray-700 whitespace-nowrap">
                                        {stock.date ? new Date(stock.date).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="border border-gray-200 p-3 font-semibold text-gray-900">
                                        {stock.product?.name || "Unknown Product"}
                                    </td>
                                    <td className="border border-gray-200 p-3 text-gray-700">
                                        {stock.store?.name || "-"}
                                    </td>
                                    <td className="border border-gray-200 p-3 font-bold text-center text-rose-600 font-mono">
                                        -{stock.quantity}
                                    </td>
                                    <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                                        {stock.takenBy || "-"}
                                    </td>
                                    <td className="border border-gray-200 p-3 text-gray-600 text-sm max-w-[150px] whitespace-normal break-words">
                                        {stock.reason || "-"}
                                    </td>
                                    
                                    <td className="border border-gray-200 p-3 text-center w-28">
                                        <button
                                            onClick={() => handleDeleteRecord(stock.id)}
                                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 px-2.5 py-1.5 rounded text-xs font-semibold transition-all shadow-sm cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        
                        {filteredStocks.length === 0 && (
                            <div className="text-center p-12 text-gray-400 font-medium bg-white">
                                No matching outbound tracking log entries found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockOut;