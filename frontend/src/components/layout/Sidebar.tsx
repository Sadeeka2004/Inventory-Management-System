import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { segment: "Core Operations", items: [
      { label: "Dashboard", path: "/dashboard" },
    ]},
    { segment: "Registry Databases", items: [
      { label: "Our Stores", path: "/stores" },
      { label: "Supplier Shops", path: "/suppliers" },
      { label: "Product Categories", path: "/categories" },
      { label: "Product Catalog", path: "/products" },
    ]},
    { segment: "Logistics & Inventory", items: [
      { label: "Stock In", path: "/stock-in" },
      { label: "Stock Out", path: "/stock-out" },
      { label: "Current Stock Inventory", path: "/current-stock" },
      { label: "Critical Stock Alerts", path: "/inventory-alerts" },
    ]},
    { segment: "Intelligence Reports", items: [
      { label: "Analytics & Reports", path: "/reports" },
    ]}
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-slate-300 flex flex-col border-r border-slate-800 shadow-xl select-none">
      
      {/* Premium Identity Header Zone */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
          <span className="text-white font-black text-sm tracking-tighter">IM</span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wider uppercase">InvMatrix</h2>
          <span className="text-[10px] font-medium text-blue-400 tracking-widest uppercase block -mt-0.5">Enterprise Suite</span>
        </div>
      </div>

      {/* Structured Multi-Segment Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar">
        {menuItems.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {/* Segment Subheadings */}
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              {group.segment}
            </span>
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600/90 text-white shadow-lg shadow-blue-600/15 font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    {/* Active Route indicator line accent */}
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md" />
                    )}
                    
                    <span className="truncate">{item.label}</span>
                    
                    {/* Clean contextual indicator arrow icons */}
                    <span className={`w-1.5 h-1.5 border-t-2 border-r-2 transform rotate-45 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${
                      isActive ? "border-white opacity-100 translate-x-0" : "border-slate-400 group-hover:translate-x-0.5"
                    }`} />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
    </div>
  );
}

export default Sidebar;