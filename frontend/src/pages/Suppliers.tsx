import { useEffect, useState } from "react";
import Table from "../components/common/Table";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deactivateSupplier
} from "../services/supplierService";

import type { Supplier } from "../services/supplierService";

function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    shopName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: ""
  });

  const loadSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const clearForm = () => {
    setForm({
      shopName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName.trim()) return;

    if (editingId !== null) {
      await updateSupplier(editingId, form);
    } else {
      await createSupplier(form);
    }

    clearForm();
    loadSuppliers();
  };

  const handleDeactivate = async (id: number) => {
    if (confirm("Are you sure you want to alter the activation status of this partner profile?")) {
      await deactivateSupplier(id);
      if (editingId === id) {
        clearForm();
      }
      loadSuppliers();
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setForm({
      shopName: supplier.shopName,
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || ""
    });
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-8">
      {/* Narrative Section Header */}
      <div className="flex justify-between items-center border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vendor & Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global merchant records, logistics networks, and operational points of contact.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-right">
          <span className="text-xs font-semibold text-gray-400 uppercase block">Registered Partners</span>
          <span className="text-2xl font-bold text-gray-900">{suppliers.length} Accounts</span>
        </div>
      </div>

      {/* Primary Workspace Grid Split (Shifted columns to give table more breathing room) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* Core Management Sidecar Form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl p-5 sticky top-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId !== null ? "Configure Partner Credentials" : "Add New Suppliers"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingId !== null ? "Modify active contract data arrays." : "Register an external raw logistical pipeline."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Shop / Firm Name</label>
              <input
                name="shopName"
                placeholder="e.g., Global Industrial Fabrics Ltd"
                value={form.shopName}
                onChange={handleChange}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Account Representative</label>
              <input
                name="contactPerson"
                placeholder="Contact Representative Name"
                value={form.contactPerson}
                onChange={handleChange}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hotline</label>
                <input
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@firm.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
              <input
                name="address"
                placeholder="Suite, Block, City, Postcode"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-200 p-2.5 rounded-lg text-sm bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button 
                type="submit" 
                className={`w-full font-medium text-sm py-2.5 rounded-lg shadow-sm transition-colors ${
                  editingId !== null 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-black hover:bg-gray-800 text-white"
                }`}
              >
                {editingId !== null ? "Commit Partner Adjustments" : "Save New Supplier"}
              </button>
              
              {editingId !== null && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium text-sm py-2 rounded-lg transition-colors"
                >
                  Discard Workspace Modifications
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Global Supplier Records Ledger Table */}
        <div className="lg:col-span-2 xl:col-span-3 bg-white border border-gray-200 shadow-sm rounded-xl overflow-x-auto">
          <div className="px-5 py-4 border-b bg-gray-50/70">
            <h2 className="text-lg font-bold text-gray-800">Supplier Registry Matrix</h2>
          </div>

          <div className="min-w-[700px]">
            <Table headers={["Shop Name", "Representative Contact", "Phone", "Address Location", "Actions"]}>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-10 text-gray-400 font-medium bg-white">
                    No registered active supply hubs populated in current view.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50/80 transition-colors group">
                    {/* Shop Name */}
                    <td className="border-b border-gray-100 p-3 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {supplier.shopName}
                    </td>
                    
                    {/* Representative Info Stacked Vertically to Save Horizontal Space */}
                    <td className="border-b border-gray-100 p-3 text-sm">
                      <div className="font-medium text-gray-800">
                        {supplier.contactPerson || <span className="text-gray-300 italic">None</span>}
                      </div>
                      <div className="text-xs text-gray-400 font-mono truncate max-w-[160px]">
                        {supplier.email || <span className="text-gray-300 italic">-</span>}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="border-b border-gray-100 p-3 text-sm font-mono text-gray-600">
                      {supplier.phone || <span className="text-gray-300 italic">-</span>}
                    </td>

                    {/* Address Location */}
                    <td className="border-b border-gray-100 p-3 text-sm text-gray-500 max-w-[180px] truncate">
                      {supplier.address || <span className="text-gray-300 italic">No Address Listed</span>}
                    </td>

                    {/* Compact Profile Actions */}
                    <td className="border-b border-gray-100 p-3 text-sm whitespace-nowrap text-right w-10">
                      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 font-medium px-3 py-1.5 rounded-md transition-all text-xs"
                        >
                          Configure
                        </button>
                        <button
                          onClick={() => handleDeactivate(supplier.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50/60 font-medium px-3 py-1.5 rounded-md transition-all text-xs border-l border-gray-100"
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Suppliers;