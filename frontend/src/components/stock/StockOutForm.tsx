import { useState } from "react";

interface Props {
  stores: any[];
  products: any[];
  onSubmit: (data: any) => void;
}

function StockOutForm({
  stores,
  products,
  onSubmit
}: Props) {

  const [form, setForm] = useState({
    storeId: "",
    productId: "",
    quantity: "",
    takenBy: "",
    reason: "",
    date: ""
  });

  const [otherReason, setOtherReason] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...form,
      reason: form.reason === "Other" ? otherReason : form.reason
    };

    onSubmit(finalData);

    setForm({
      storeId: "",
      productId: "",
      quantity: "",
      takenBy: "",
      reason: "",
      date: ""
    });
    setOtherReason("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-5 space-y-4"
    >
      <h2 className="text-xl font-bold">
        Stock Out
      </h2>

      {/* Store Selection - Required */}
      <select
        name="storeId"
        value={form.storeId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">
          Select Store
        </option>
        {stores.map(store => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>

      {/* Product Selection - Required */}
      <select
        name="productId"
        value={form.productId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">
          Select Product
        </option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      {/* Quantity - Required (Must be 1 or more) */}
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        min="1"
        value={form.quantity}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      {/* Taken By - Optional */}
      <input
        name="takenBy"
        placeholder="Taken By"
        value={form.takenBy}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      {/* Reason Selection - Optional */}
      <select
        name="reason"
        value={form.reason}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="">
          Select Reason
        </option>
        <option value="Sold">Sold</option>
        <option value="Transfer to Another Store">Transfer to Another Store</option>
        <option value="Damaged">Damaged</option>
        <option value="Expired">Expired</option>
        <option value="Returned to Supplier">Returned to Supplier</option>
        <option value="Sample">Sample</option>
        <option value="Adjustment">Adjustment</option>
        <option value="Other">Other</option>
      </select>

      {/* Extra text input if "Other" is picked */}
      {form.reason === "Other" && (
        <input
          placeholder="Enter Reason"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          className="border p-2 w-full"
        />
      )}

      {/* Stock Out Date - Optional */}
      <div>
        <label className="block text-sm mb-1">
          Stock Out Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <button className="bg-red-600 text-white px-5 py-2">
        Remove Stock
      </button>
    </form>
  );
}

export default StockOutForm;