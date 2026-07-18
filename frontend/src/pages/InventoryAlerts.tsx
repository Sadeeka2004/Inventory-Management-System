import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { getInventoryAlerts } from "../services/inventoryAlertService";

function InventoryAlerts() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const result = await getInventoryAlerts();
      setData(result);
    } catch (err) {
      console.error("Failed to load warning system alerts:", err);
    }
  };

  // Premium Skeleton loading state
  if (!data) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        <div className="h-40 bg-gray-100 rounded-xl mt-6"></div>
        <div className="h-40 bg-gray-100 rounded-xl mt-6"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Title block banner */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Critical Stock Alerts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Automated detection of warehouse line deficiencies and critical depletion levels.</p>
      </div>

      {/* SECTION 1: Low Stock Products */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          <h2 className="text-lg font-bold tracking-wide uppercase text-amber-700 text-xs">
            Low Stock Profiles (Approaching Limits)
          </h2>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <Table headers={["#", "Product SKU Item", "Warehouse Location", "Current Quantity", "Threshold Limit"]}>
            {data.lowStock.map((item: any, index: number) => (
              <tr key={`low-${index}`} className="hover:bg-amber-50/20 transition-colors odd:bg-white even:bg-gray-50/30">
                <td className="border border-gray-200 p-3 w-12 text-center font-mono text-sm text-gray-400 font-medium">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-3 font-semibold text-gray-900">
                  {item.product.name}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700">
                  {item.store.name}
                </td>
                <td className="border border-gray-200 p-3 text-center font-bold text-amber-600 font-mono">
                  {item.quantity}
                </td>
                <td className="border border-gray-200 p-3 text-center font-mono text-gray-400">
                  {item.product.minimumStock}
                </td>
              </tr>
            ))}
          </Table>

          {data.lowStock.length === 0 && (
            <div className="text-center p-8 text-sm text-gray-400 font-medium bg-white">
              ✓ All products maintain quantities above safety thresholds.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Out Of Stock Products */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-rose-600">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <h2 className="text-lg font-bold tracking-wide uppercase text-rose-700 text-xs">
            Critical Depletions (Out Of Stock)
          </h2>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <Table headers={["#", "Product SKU Item", "Warehouse Location", "Operational Status"]}>
            {data.outOfStock.map((item: any, index: number) => (
              <tr key={`out-${index}`} className="hover:bg-rose-50/20 transition-colors odd:bg-white even:bg-gray-50/30">
                <td className="border border-gray-200 p-3 w-12 text-center font-mono text-sm text-gray-400 font-medium">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-3 font-semibold text-gray-900">
                  {item.product.name}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700">
                  {item.store.name}
                </td>
                <td className="border border-gray-200 p-3 text-center w-40">
                  <span className="inline-block px-2.5 py-0.5 text-xs border rounded-full font-black tracking-wide bg-rose-50 text-rose-700 border-rose-200 shadow-sm uppercase w-32 text-center">
                    Out Of Stock
                  </span>
                </td>
              </tr>
            ))}
          </Table>

          {data.outOfStock.length === 0 && (
            <div className="text-center p-8 text-sm text-emerald-600 font-medium bg-white">
              ✓ Splendid! No stock balance positions are currently depleted.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryAlerts;