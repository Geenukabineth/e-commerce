import React from "react";
import type { SidebarItemProps } from "../../auth/auth.types";

// Define props for the Sidebar itself
type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-wider">AdminPanel</h2>
      </div>
      
      <nav className="mt-6 flex flex-col gap-1 px-4">
        <SidebarItem 
          label="Overview" 
          active={activeTab === "overview"} 
          onClick={() => onTabChange("overview")} 
        />
        <SidebarItem 
          label="Products" 
          active={activeTab === "products"} 
          onClick={() => onTabChange("products")} 
        />
        <SidebarItem 
          label="Orders" 
          active={activeTab === "orders"} 
          onClick={() => onTabChange("orders")} 
        />
        <SidebarItem 
          label="Users" 
          active={activeTab === "users"} 
          onClick={() => onTabChange("users")} 
        />
      </nav>
      
      {/* Optional: Add a Logout button at the bottom */}
      <div className="mt-auto p-4 border-t border-gray-800">
         <div className="text-xs text-gray-500 text-center">v1.0.0</div>
      </div>
    </aside>
  );
}

// --- SUB-COMPONENT ---
function SidebarItem({ label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md px-4 py-3 text-left text-sm font-medium transition ${
        active 
          ? "bg-blue-600 text-white" 
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}