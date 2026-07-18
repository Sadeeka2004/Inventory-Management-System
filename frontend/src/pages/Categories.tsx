import { useEffect, useState } from "react";
import Table from "../components/common/Table";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categoryService";
import type { Category } from "../services/categoryService";

function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState("");

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error: any) {
            console.error("Failed to load categories:", error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            if (editingId !== null) {
                await updateCategory(editingId, { name: name.trim() });
                alert("Category updated successfully!");
            } else {
                await createCategory({ name: name.trim() });
                alert("Category created successfully!");
            }
            setName("");
            setEditingId(null);
            await loadCategories(); // Force interface to reload data from server
        } catch (error: any) {
            console.error("Error saving category:", error);
            const serverMessage = error.response?.data?.message || "Check your backend server logs.";
            alert(`Error saving category: ${serverMessage}`);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setName(category.name);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this category? This will break references for products using it.")) {
            try {
                await deleteCategory(id);
                alert("Category deleted successfully!");
                await loadCategories();
            } catch (error: any) {
                console.error("Failed to delete category:", error);
                const serverMessage = error.response?.data?.message || "It is likely still linked to active products in your database.";
                alert(`Error deleting category: ${serverMessage}`);
            }
        }
    };

    const handleCancel = () => {
        setName("");
        setEditingId(null);
    };

    // Sort alphabetically first, then apply real-time filtering
    const processedCategories = [...categories]
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Count: <span className="font-bold text-black">{categories.length}</span> categories found
                    </p>
                </div>
            </div>

            {/* Input Action Panel Form */}
            <form onSubmit={handleSubmit} className="border border-gray-200 p-5 flex gap-3 w-full items-end bg-white rounded-xl shadow-sm">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editingId !== null ? "Edit Category Name" : "New Category Name"}
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Rice, Flour, Sugar, Spices"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>
                <button type="submit" className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded h-10 font-medium transition-colors">
                    {editingId !== null ? "Update Field" : "Add Category"}
                </button>
                {editingId !== null && (
                    <button type="button" onClick={handleCancel} className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded h-10 transition-colors">
                        Cancel
                    </button>
                )}
            </form>

            {/* Search Input Filter */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder={`🔍 Search through your list of categories...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2.5 w-full rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                />
            </div>

            {/* Full-width Screen Table Wrapper with Gridlines */}
            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <Table headers={["#", "Category Name", "Actions"]}>
                    {processedCategories.map((category, index) => (
                        <tr key={category.id} className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30">
                            {/* Sequential numbering system display replacement */}
                            <td className="border border-gray-200 p-3 w-20 text-center font-mono text-sm text-gray-600 font-medium">
                                {index + 1}
                            </td>
                            <td className="border border-gray-200 p-3 font-semibold text-gray-800">
                                {category.name}
                            </td>
                            <td className="border border-gray-200 p-3 w-48 text-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 font-medium transition-colors shadow-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 font-medium transition-colors shadow-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
                
                {processedCategories.length === 0 && (
                    <div className="text-center p-12 text-gray-500 font-medium border border-t-0">
                        No category types match your active search terms.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Categories;