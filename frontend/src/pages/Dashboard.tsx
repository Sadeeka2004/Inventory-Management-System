import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import StatCard from "../components/dashboard/StatCard";

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadDashboard = async () => {
    const result = await getDashboard();
    setData(result);
  };

  useEffect(() => {
    loadDashboard();
    // Live operational clock for warehouse desk operations
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading wholesale control cockpit metrics...
        </div>
      </div>
    );
  }

  // Quick helper to format dates for system header
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      
      {/* Enterprise System Header Panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Wholesale Hub Control Room</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time store balancing and logistics tracking network.</p>
        </div>
        <div className="text-right border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
          <div className="text-lg font-bold text-gray-800 tracking-mono font-mono">{formatTime(currentTime)}</div>
          <div className="text-xs font-semibold text-blue-600 uppercase mt-0.5 tracking-wider">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Critical Stock Health Workspace Indicators */}
      {(data.outOfStock > 0 || data.lowStock > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.outOfStock > 0 && (
            <div className="flex items-center gap-4 bg-red-50 border border-red-200 text-red-900 px-5 py-4 rounded-xl shadow-sm animate-pulse">
              <span className="flex h-4 w-4 rounded-full bg-red-600" />
              <div>
                <p className="font-bold text-base">Critical System Risk: {data.outOfStock} Item(s) Out of Stock</p>
                <p className="text-xs text-red-700 font-medium">Core commodities hit an absolute zero state. Reorder from supplier shops immediately.</p>
              </div>
            </div>
          )}
          {data.lowStock > 0 && (
            <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 text-amber-900 px-5 py-4 rounded-xl shadow-sm">
              <span className="flex h-4 w-4 rounded-full bg-amber-500" />
              <div>
                <p className="font-bold text-base">Action Required: {data.lowStock} Item(s) Approaching Minimum Buffer</p>
                <p className="text-xs text-amber-700 font-medium">Stock volume is dropping below established warehouse thresholds.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 1: Master Logistical Registries */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Core Master Registries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="hover:scale-[1.01] transition-transform duration-200">
            <StatCard title="Stores" value={data.totalStores} />
          </div>
          <div className="hover:scale-[1.01] transition-transform duration-200">
            <StatCard title="Supplier Shops" value={data.totalSuppliers} />
          </div>
          <div className="hover:scale-[1.01] transition-transform duration-200">
            <StatCard title="Products" value={data.totalProducts} />
          </div>
        </div>
      </div>

      {/* Section 2: Real-time Operational Ledger Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Inventory Volatility Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-l-4 border-l-red-500 border-gray-200 p-5 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Out Of Stocks</p>
              <h4 className="text-3xl font-black text-gray-900 mt-2">{data.outOfStock}</h4>
              <p className="text-[10px] text-red-600 font-bold mt-2 bg-red-50 inline-block px-1.5 py-0.5 rounded">0 Balance State</p>
            </div>
            <div className="bg-white border border-l-4 border-l-amber-500 border-gray-200 p-5 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stocks</p>
              <h4 className="text-3xl font-black text-gray-900 mt-2">{data.lowStock}</h4>
              <p className="text-[10px] text-amber-600 font-bold mt-2 bg-amber-50 inline-block px-1.5 py-0.5 rounded">Near Min Buffer</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Today's Activity Floor</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-l-4 border-l-green-500 border-gray-200 p-5 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Stock In</p>
              <h4 className="text-3xl font-black text-gray-900 mt-2">{data.todayStockIn}</h4>
              <p className="text-[10px] text-green-600 font-bold mt-2 bg-green-50 inline-block px-1.5 py-0.5 rounded">Purchases Logged</p>
            </div>
            <div className="bg-white border border-l-4 border-l-blue-500 border-gray-200 p-5 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Stock Out</p>
              <h4 className="text-3xl font-black text-gray-900 mt-2">{data.todayStockOut}</h4>
              <p className="text-[10px] text-blue-600 font-bold mt-2 bg-blue-50 inline-block px-1.5 py-0.5 rounded">Operations Out</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;