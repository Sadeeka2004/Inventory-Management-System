import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { Card } from "../components/common/Card";
import { getInventoryReport, type TransactionReportItem } from "../services/reportService";

function Reports() {
    const [transactions, setTransactions] = useState<TransactionReportItem[]>([]);
    const [summary, setSummary] = useState({ totalStockIn: 0, totalStockOut: 0 });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const loadReport = async () => {
    setLoading(true);
    try {
        // If dates aren't selected yet, fall back to a safe range 
        // (e.g., from 30 days ago up to the present day)
        let finalStart = startDate;
        let finalEnd = endDate;

        if (!finalStart || finalStart.trim() === "") {
            const defaultStart = new Date();
            defaultStart.setDate(defaultStart.getDate() - 30); // 30 days ago baseline
            finalStart = defaultStart.toISOString().split('T')[0];
        }

        if (!finalEnd || finalEnd.trim() === "") {
            finalEnd = new Date().toISOString().split('T')[0]; // Today
        }

        const data = await getInventoryReport(finalStart, finalEnd);
        
        setTransactions(data.transactions || []);
        setSummary({
            totalStockIn: data.totalStockIn || 0,
            totalStockOut: data.totalStockOut || 0
        });
    } catch (error) {
        console.error("Failed to load report metrics stream:", error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        loadReport();
    }, []);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loadReport();
    };

    const handleClearFilter = async () => {
    setStartDate("");
    setEndDate("");
    setLoading(true);
    try {
        // Fall back to our clean 30-day default window
        const defaultStart = new Date();
        defaultStart.setDate(defaultStart.getDate() - 30);
        const finalStart = defaultStart.toISOString().split('T')[0];
        const finalEnd = new Date().toISOString().split('T')[0];

        const data = await getInventoryReport(finalStart, finalEnd);
        
        setTransactions(data.transactions || []);
        setSummary({ 
            totalStockIn: data.totalStockIn || 0, 
            totalStockOut: data.totalStockOut || 0 
        });
    } catch (error) {
        console.error("Failed to reset report logs:", error);
    } finally {
        setLoading(false);
    }
};

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6 space-y-6 print:p-0">
            {/* Header Action Row */}
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold text-gray-800">Management Reports</h1>
                <button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow transition-colors"
                >
                    Print Report
                </button>
            </div>

            <div className="hidden print:block mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Wholesale Inventory Report</h1>
                <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                {(startDate || endDate) && (
                    <p className="text-gray-700 font-medium">
                        Filter Period: {startDate || "Beginning"} to {endDate || "Present"}
                    </p>
                )}
            </div>

            {/* Date Filtering Panel Control */}
            <form onSubmit={handleFilterSubmit} className="bg-white border p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-end print:hidden">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <button 
                        type="submit" 
                        className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded font-medium transition-colors"
                    >
                        Filter
                    </button>
                    {(startDate || endDate) && (
                        <button 
                            type="button" 
                            onClick={handleClearFilter}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded font-medium transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </form>

            {/* High Level Key Metric Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="p-2">
                        <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">Total Bulk Inbound</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{summary.totalStockIn.toLocaleString()} Units</h3>
                        <p className="text-xs text-gray-500 mt-2">Cumulative stock received from all supplier shops.</p>
                    </div>
                </Card>
                <Card>
                    <div className="p-2">
                        <p className="text-sm font-semibold text-red-600 uppercase tracking-wider">Total Bulk Outbound</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{summary.totalStockOut.toLocaleString()} Units</h3>
                        <p className="text-xs text-gray-500 mt-2">Cumulative inventory issued for warehouse operations.</p>
                    </div>
                </Card>
            </div>

            {/* Transaction Movement History Ledger Grid */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Complete Stock Movement History</h2>
                </div>
                
                {loading ? (
                    <div className="p-10 text-center text-gray-500 font-medium">Loading report metrics...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No transactions recorded during the specified date parameters.</div>
                ) : (
                    <Table headers={["Date", "Type", "Warehouse Store", "Product Item", "Quantity", "Source / Reference"]}>
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="border p-3 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td className="border p-3 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                        tx.type === "IN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}>
                                        STOCK {tx.type}
                                    </span>
                                </td>
                                <td className="border p-3 font-medium text-gray-800">{tx.store?.name}</td>
                                <td className="border p-3 text-gray-900">
                                    {tx.product?.name} <span className="text-gray-400 text-xs">({tx.product?.unit})</span>
                                </td>
                                <td className="border p-3 font-bold text-gray-800 text-right">
                                    {tx.quantity}
                                </td>
                                <td className="border p-3 text-sm text-gray-600">
                                    {tx.type === "IN" 
                                        ? `Supplier: ${tx.supplier?.shopName || "Unknown"}` 
                                        : `Issued to: ${tx.takenBy || "-"} (${tx.reason || "No reason"})`
                                    }
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </div>
        </div>
    );
}

export default Reports;