import { useState } from "react";

interface Props {
  stores: any[];
  suppliers: any[];
  products: any[];
  onSubmit: (data: any) => void;
}

function StockInForm({
  stores,
  suppliers,
  products,
  onSubmit
}: Props) {

  const [form, setForm] = useState({
    storeId: "",
    supplierId: "",
    productId: "",
    quantity: "",
    purchasePrice: "",
    date: ""
  });

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

    onSubmit(form);

    setForm({
      storeId: "",
      supplierId: "",
      productId: "",
      quantity: "",
      purchasePrice: "",
      date: ""
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-5 space-y-4"
    >
      <h2 className="text-xl font-bold">
        Stock Arrival
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

      {/* Supplier Selection - Required */}
      <select
        name="supplierId"
        value={form.supplierId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">
          Select Supplier Shop
        </option>
        {suppliers.map(supplier => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.shopName}
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

      {/* Purchase Price - Optional */}
      <input
        type="number"
        name="purchasePrice"
        placeholder="Purchase Price"
        step="0.01"
        value={form.purchasePrice}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      {/* Arrival Date - Optional */}
      <div>
        <label className="block text-sm mb-1">
          Arrival Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <button className="bg-black text-white px-5 py-2">
        Save Stock
      </button>
    </form>
  );
}

export default StockInForm;