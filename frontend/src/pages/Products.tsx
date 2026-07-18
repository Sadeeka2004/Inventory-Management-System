import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { getProducts, createProduct, updateProduct, deactivateProduct } from "../services/productService";
import { getCategories, type Category } from "../services/categoryService";
import type { Product } from "../services/productService";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // Dynamic search input tracking state

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        unit: "",
        minimumStock: "",
        description: ""
    });

    const loadData = async () => {
        const prodData = await getProducts();
        const catData = await getCategories();
        
        const sortedCategories = [...catData].sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        setProducts(prodData);
        setCategories(sortedCategories);
        
        if (sortedCategories.length > 0 && !editingId) {
            setForm(f => ({ ...f, categoryId: sortedCategories[0].id.toString() }));
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const clearForm = () => {
        setForm({
            name: "",
            categoryId: categories.length > 0 ? categories[0].id.toString() : "",
            unit: "",
            minimumStock: "",
            description: ""
        });
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            categoryId: parseInt(form.categoryId),
            unit: form.unit,
            minimumStock: parseInt(form.minimumStock) || 0,
            description: form.description
        };

        if (editingId) {
            await updateProduct(editingId, payload as any);
        } else {
            await createProduct(payload as any);
        }

        clearForm();
        const prodData = await getProducts();
        setProducts(prodData);
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            categoryId: product.categoryId.toString(),
            unit: product.unit,
            minimumStock: product.minimumStock.toString(),
            description: product.description || ""
        });
    };

    const handleDeactivate = async (id: number) => {
        if (window.confirm("Are you sure you want to deactivate this product option?")) {
            await deactivateProduct(id);
            if (editingId === id) clearForm();
            const prodData = await getProducts();
            setProducts(prodData);
        }
    };

    // Filter products dynamically by both name and category context
    const filteredProducts = products.filter((product) => {
        const productName = product.name.toLowerCase();
        const categoryName = (product.category?.name || "uncategorized").toLowerCase();
        const search = searchTerm.toLowerCase();
        return productName.includes(search) || categoryName.includes(search);
    });

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Products Catalog</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Total Tracked: <span className="font-bold text-black">{products.length}</span> items in catalog
                </p>
            </div>

            {/* Premium Multi-Row Form Setup */}
            <form onSubmit={handleSubmit} className="border border-gray-200 p-5 space-y-4 bg-white rounded-xl shadow-sm w-full">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    {editingId ? "Modify Existing Commodity Profile" : "Register New Wholesale Commodity"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                        <input
                            name="name"
                            placeholder="e.g. Ponni Samba Rice"
                            value={form.name}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Assigned Category</label>
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full bg-white rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Measurement Unit</label>
                        <input
                            name="unit"
                            placeholder="e.g. Kg, Packet, Box"
                            value={form.unit}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Minimum Alert Threshold Stock</label>
                        <input
                            name="minimumStock"
                            type="number"
                            placeholder="e.g. 50"
                            value={form.minimumStock}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Item Specifications / Description</label>
                        <input
                            name="description"
                            placeholder="Optional supplementary storage or vendor information details..."
                            value={form.description}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button type="submit" className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded font-medium transition-colors shadow-sm">
                        {editingId ? "Update Product Master" : "Save Product Item"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={clearForm} className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded font-medium transition-colors">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Dynamic Full-Width Search Block */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="🔍 Search products instantly by item title name or assigned category grouping..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2.5 w-full rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                />
            </div>

            {/* Full Widescreen Responsive Table Layout with explicit internal Cell borders */}
            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <Table headers={["#", "Product Item", "Category Group", "Unit Basis", "Alert Limit Threshold", "Specifications / Description", "Actions"]}>
                    {filteredProducts.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30">
                            {/* Visual counting row tracker */}
                            <td className="border border-gray-200 p-3 w-16 text-center font-mono text-sm text-gray-500 font-medium">
                                {index + 1}
                            </td>
                            <td className="border border-gray-200 p-3 font-semibold text-gray-900">
                                {product.name}
                            </td>
                            <td className="border border-gray-200 p-3 text-gray-800 font-medium">
                                <span className="bg-gray-100 border text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                                    {product.category?.name || "General"}
                                </span>
                            </td>
                            <td className="border border-gray-200 p-3 text-gray-700 font-mono text-sm">
                                {product.unit}
                            </td>
                            <td className="border border-gray-200 p-3 font-bold text-gray-800 text-center">
                                {product.minimumStock}
                            </td>
                            <td className="border border-gray-200 p-3 text-gray-600 text-sm max-w-xs truncate">
                                {product.description || "-"}
                            </td>
                            <td className="border border-gray-200 p-3 w-48 text-center">
                                <div className="flex justify-center gap-2">
                                    <button 
                                        onClick={() => handleEdit(product)} 
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 font-medium transition-colors shadow-sm"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeactivate(product.id)} 
                                        className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 font-medium transition-colors shadow-sm"
                                    >
                                        Deactivate
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
                
                {filteredProducts.length === 0 && (
                    <div className="text-center p-12 text-gray-500 font-medium">
                        No products listed match your current search constraints.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;