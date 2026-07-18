import { useEffect, useState } from "react";
import Table from "../components/common/Table";

import {
  getStores,
  createStore,
  updateStore,
  deactivateStore,
} from "../services/storeService";

import type { Store } from "../services/storeService";

function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
  });

  const loadStores = async () => {
    const data = await getStores();
    setStores(data);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      await updateStore(editingId, form);
      setEditingId(null);
    } else {
      await createStore(form);
    }

    handleCancelEdit();
    loadStores();
  };

  const handleEdit = (store: Store) => {
    setEditingId(store.id);
    setForm({
      name: store.name,
      address: store.address || "",
      phone: store.phone || "",
      manager: store.manager || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", address: "", phone: "", manager: "" });
  };

  const handleDeactivate = async (id: number) => {
    if (confirm("Are you sure you want to change this store's operational framework status?")) {
      await deactivateStore(id);
      loadStores();
    }
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-8">
      {/* Top Narrative Row */}
      <div className="flex justify-between items-center border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stores</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and audit physical retail facilities and warehouse stores.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-right">
          <span className="text-xs font-semibold text-gray-400 uppercase block">Total Locations</span>
          <span className="text-2xl font-bold text-gray-900">{stores.length} Active</span>
        </div>
      </div>

      {/* Main Structural Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Management Form Block */}
        <div className="lg:col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl p-5 sticky top-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? "Modify Hub Specifications" : "Add New Store"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingId ? "Update existing parameters below." : "Register an active warehouse sector nodes node."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Store Name</label>
              <input
                name="name"
                placeholder="e.g., Central Logistical Depot"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Operational Address</label>
              <input
                name="address"
                placeholder="Street suite details, City, State"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                <input
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Manager</label>
                <input
                  name="manager"
                  placeholder="Full Name"
                  value={form.manager}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button 
                type="submit" 
                className={`w-full font-medium text-sm py-2.5 rounded-lg shadow-sm transition-colors ${
                  editingId 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-black hover:bg-gray-800 text-white"
                }`}
              >
                {editingId ? "Save Parameter Updates" : "Save New Store"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium text-sm py-2 rounded-lg transition-colors"
                >
                  Cancel Re-alignment
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Live Data Registry Ledger Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50/70">
            <h2 className="text-lg font-bold text-gray-800">Operational Registry</h2>
          </div>

          <Table headers={["Store / Node Name", "Address Location", "Communications", "Assigned Manager", "Actions Profile"]}>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-10 text-gray-400 font-medium bg-white">
                  No managed fulfillment locations found in the system.
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="border-b border-gray-100 p-3 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {store.name}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm text-gray-600 max-w-[180px] truncate">
                    {store.address || <span className="text-gray-300 italic">No Address Listed</span>}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm font-mono text-gray-600">
                    {store.phone || <span className="text-gray-300 italic">-</span>}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm text-gray-700 font-medium">
                    {store.manager || <span className="text-gray-300 italic">Unassigned</span>}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1 rounded hover:bg-blue-50 transition-all text-xs"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => handleDeactivate(store.id)}
                      className="text-red-500 hover:text-red-700 font-semibold px-2.5 py-1 rounded hover:bg-red-50 transition-all text-xs"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>

      </div>
    </div>
  );
}

export default Stores;