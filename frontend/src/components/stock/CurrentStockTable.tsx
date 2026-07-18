import Table from "../common/Table";
import type { CurrentStock } from "../../services/stockService";

interface Props {
  stocks: CurrentStock[];
}

function CurrentStockTable({ stocks }: Props) {
  // Master visual lookup mapping dictionary for status badges
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 font-semibold";
      case "Low Stock":
        return "bg-amber-50 text-amber-700 border-amber-200/60 font-semibold";
      case "Out of Stock":
        return "bg-rose-50 text-rose-700 border-rose-200/60 font-bold";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200 font-medium";
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <Table headers={["#", "Product SKU Item", "Category Type", "Warehouse Store", "Supplier Source", "Stock Balance", "Health Status"]}>
        {stocks.map((stock: any, index) => (
          <tr 
            key={`${stock.product.id}-${stock.store.id}`} 
            className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30"
          >
            {/* Table Counter Index */}
            <td className="border border-gray-200 p-3 w-12 text-center font-mono text-sm text-gray-500 font-medium">
              {index + 1}
            </td>

            {/* Product Title */}
            <td className="border border-gray-200 p-3 font-semibold text-gray-900">
              {stock.product.name}
            </td>

            {/* Category Descriptor */}
            <td className="border border-gray-200 p-3 text-sm text-gray-500">
              <span className="bg-gray-100/80 text-gray-600 px-2 py-0.5 rounded text-xs font-medium border border-gray-200/40">
                {stock.product.category?.name || "Uncategorized"}
              </span>
            </td>

            {/* Store Location */}
            <td className="border border-gray-200 p-3 text-gray-700">
              {stock.store.name}
            </td>

            {/* Supplier Origin */}
            <td className="border border-gray-200 p-3 text-gray-600 max-w-[160px] truncate">
              {stock.supplier?.shopName || stock.supplier?.name || "-"}
            </td>

            {/* Balance Quantity Metric */}
            <td className="border border-gray-200 p-3 text-center font-mono font-bold text-gray-800">
              {stock.quantity}
            </td>

            {/* Premium Status Pill Display */}
            <td className="border border-gray-200 p-3 text-center w-36">
              <span className={`inline-block px-2.5 py-1 text-xs border rounded-full tracking-wide shadow-sm w-28 text-center uppercase transition-all ${getStatusStyles(stock.status)}`}>
                {stock.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      {stocks.length === 0 && (
        <div className="text-center p-12 text-gray-400 font-medium bg-white">
          No current inventory balances tracked.
        </div>
      )}
    </div>
  );
}

export default CurrentStockTable;