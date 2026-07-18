import Table from "../common/Table";
import type { StockTransaction } from "../../services/stockService";

interface Props {
  stocks: StockTransaction[];
  onDelete: (id: number) => void;
}

function StockHistoryTable({ stocks, onDelete }: Props) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <Table headers={["#", "Date", "Product Item", "Store / Location", "Supplier Origin", "Quantity", "Purchase Price", "Actions"]}>
        {stocks.map((stock, index) => (
          <tr key={stock.id} className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30">
            {/* Visual counting row tracker */}
            <td className="border border-gray-200 p-3 w-12 text-center font-mono text-sm text-gray-500 font-medium">
              {index + 1}
            </td>
            
            {/* Calendar Date logged */}
            <td className="border border-gray-200 p-3 font-mono text-sm text-gray-700 whitespace-nowrap">
              {stock.date ? new Date(stock.date).toLocaleDateString() : "-"}
            </td>

            {/* Product Title */}
            <td className="border border-gray-200 p-3 font-semibold text-gray-900">
              {stock.product?.name || "Unknown Product"}
            </td>

            {/* Warehouse / Store Location */}
            <td className="border border-gray-200 p-3 text-gray-700">
              {stock.store?.name || "-"}
            </td>

            {/* Supplier Shop Reference */}
            <td className="border border-gray-200 p-3 text-gray-700">
              {stock.supplier?.shopName || stock.supplier?.name || "-"}
            </td>

            {/* Inbound Quantity */}
            <td className="border border-gray-200 p-3 font-bold text-center text-emerald-600 font-mono">
              +{stock.quantity}
            </td>

            {/* Unit Purchase Price Metrics */}
            <td className="border border-gray-200 p-3 text-right font-mono text-gray-800">
              {stock.purchasePrice !== null && stock.purchasePrice !== undefined 
                ? `$${Number(stock.purchasePrice).toFixed(2)}` 
                : "-"}
            </td>

            {/* Management Actions Workspace */}
            <td className="border border-gray-200 p-3 text-center w-28">
              <button
                onClick={() => onDelete(stock.id)}
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 px-2.5 py-1.5 rounded text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </Table>
      
      {stocks.length === 0 && (
        <div className="text-center p-12 text-gray-400 font-medium bg-white">
          No matching inbound tracking log entries found.
        </div>
      )}
    </div>
  );
}

export default StockHistoryTable;