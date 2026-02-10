import { useContext } from "react";
import type { SidebarItemProps } from "../../auth/auth.types";
import { SIDEBAR_ROUTES } from "../../auth/sidebar.config";
import { AuthContext } from "../../auth/auth.store";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { role } = auth;

  return (
    <aside className="fixed left-0 top-20 h-full w-64 z-50 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-wider uppercase">{role} Panel</h2>
        <p className="text-xs text-gray-400 mt-1">{role}</p>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-4">
        {role &&
          SIDEBAR_ROUTES
            .filter(route => route.roles.includes(role)) 
            .map(route => (
              <SidebarItem
                key={route.tab}
                label={route.label}
                active={activeTab === route.tab}
                onClick={() => onTabChange(route.tab)}
              />
            ))}
      </nav>

      <div className="mt-auto p-4 border-t border-gray-800">
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
