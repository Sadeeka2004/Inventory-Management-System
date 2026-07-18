import { useEffect, useState } from "react";
import StockInForm from "../components/stock/StockInForm";
import StockHistoryTable from "../components/stock/StockHistoryTable";
import { getStores } from "../services/storeService";
import { getSuppliers } from "../services/supplierService";
import { getProducts } from "../services/productService";
import { getStockHistory, addStock, deleteStock } from "../services/stockService";

function StockIn() {
    const [stores, setStores] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState<any[]>([]);

    // Deep Filter Multi-State Tracking Variables
    const [globalSearch, setGlobalSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const loadAllMetadata = async () => {
        try {
            const [storeRes, supplierRes, productRes, historyRes] = await Promise.all([
                getStores(),
                getSuppliers(),
                getProducts(),
                getStockHistory()
            ]);
            setStores(storeRes);
            setSuppliers(supplierRes);
            setProducts(productRes);
            
            // Isolate incoming records
            setStocks(historyRes.filter((item: any) => item.type === "IN"));
        } catch (err) {
            console.error("Data loading sequence failure context:", err);
        }
    };

    useEffect(() => {
        loadAllMetadata();
    }, []);

    const handleSubmit = async (formData: any) => {
        try {
            await addStock({ ...formData, type: "IN" });
            const historyRes = await getStockHistory();
            setStocks(historyRes.filter((item: any) => item.type === "IN"));
        } catch (err) {
            alert("Error processing stock input registration data.");
        }
    };

    const handleDeleteRecord = async (id: number) => {
        if (window.confirm("Are you absolute sure you want to delete this historical ledger node record? This will alter logging tracking history context!")) {
            try {
                await deleteStock(id);
                // Refresh list directly after complete deletion execution
                const historyRes = await getStockHistory();
                setStocks(historyRes.filter((item: any) => item.type === "IN"));
            } catch (err) {
                alert("Error removing ledger logging node line.");
            }
        }
    };

    // Advanced Live Data Filter Algorithm pipeline
    const filteredStocks = stocks.filter((item) => {
        const prodName = (item.product?.name || "").toLowerCase();
        const supName = (item.supplier?.name || "").toLowerCase();
        const storeName = (item.store?.name || "").toLowerCase();
        const targetSearch = globalSearch.toLowerCase();

        // 1. Text criteria evaluate match
        const matchesText = prodName.includes(targetSearch) || 
                            supName.includes(targetSearch) || 
                            storeName.includes(targetSearch);

        // 2. Date ranges bounds validation checking
        const recordDateStr = item.date ? item.date : item.createdAt;
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
                    <h1 className="text-3xl font-bold text-gray-800">Stock Arrival (Inbound Logging)</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage inbound inventory logs and warehouse arrival ledgers.</p>
                </div>
            </div>

            {/* Split Screen Workspace Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-1 bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Log New Arrival</h2>
                    <StockInForm
                        stores={stores}
                        suppliers={suppliers}
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
                                    placeholder="🔍 Search items by Product, Supplier, or Store Location..."
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
                                    title="Start Date Filter Window boundary limit parameters"
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border border-gray-300 p-2 text-sm w-full rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                                    title="End Date Filter Window boundary limit parameters"
                                />
                            </div>
                        </div>
                        
                        {/* Filter clear button badge helper shortcuts utility layout link view triggers */}
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

                    {/* Full Datagrid Workspace tracking summary details element item wrapper layout view */}
                    <StockHistoryTable 
                        stocks={filteredStocks} 
                        onDelete={handleDeleteRecord}
                    />
                </div>
            </div>
        </div>
    );
}

export default StockIn;