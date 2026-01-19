import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/auth.store";
import type {SidebarItemProps, StatCardProps,OrderRowProps} from "../../auth/auth.types"

export default function AdminDashboard() {
  const { profile } = useAuth(); // Assuming 'loading' might exist, if not we rely on profile
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // --- SECURITY CHECK ---
  // Redirect if not logged in or not an admin
  useEffect(() => {
    // If profile is loaded and role is NOT admin, kick them out
    if (profile && profile.role !== "admin") {
      navigate("/");
    }
  }, [profile, navigate]);

  if (!profile || profile.role !== "admin") {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-wider">AdminPanel</h2>
        </div>
        <nav className="mt-6 flex flex-col gap-1 px-4">
          <SidebarItem 
            label="Overview" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
          />
          <SidebarItem 
            label="Products" 
            active={activeTab === "products"} 
            onClick={() => setActiveTab("products")} 
          />
          <SidebarItem 
            label="Orders" 
            active={activeTab === "orders"} 
            onClick={() => setActiveTab("orders")} 
          />
          <SidebarItem 
            label="Users" 
            active={activeTab === "users"} 
            onClick={() => setActiveTab("users")} 
          />
        </nav>
        
        <div className="absolute bottom-4 left-4">
            <Link to="/" className="text-sm text-gray-400 hover:text-white">← Back to Store</Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
            <p className="text-gray-500">Welcome back, {profile.username}</p>
          </div>
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-80">
            + Add New Product
          </button>
        </header>

        {/* Dynamic Content based on Active Tab */}
        {activeTab === "overview" && <OverviewContent />}
        {activeTab === "products" && <ProductsTable />}
        {activeTab === "orders" && <div className="text-gray-500">Orders module coming soon...</div>}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---


function SidebarItem({ label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md px-4 py-3 text-left text-sm font-medium transition ${
        active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function OverviewContent() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Revenue" value="$45,231.89" color="bg-green-50 text-green-700" />
        <StatCard title="Total Orders" value="+1,203" color="bg-blue-50 text-blue-700" />
        <StatCard title="Active Users" value="8,402" color="bg-purple-50 text-purple-700" />
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <OrderRow id="#ORD-001" customer="John Doe" status="Completed" amount="$120.00" />
              <OrderRow id="#ORD-002" customer="Sarah Smith" status="Pending" amount="$250.50" />
              <OrderRow id="#ORD-003" customer="Michael Brown" status="Processing" amount="$85.00" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductsTable() {
    // Dummy Data
    const products = [
        { id: 1, name: "Wireless Headphones", price: 120, stock: 45 },
        { id: 2, name: "Smart Watch", price: 250, stock: 12 },
        { id: 3, name: "Running Shoes", price: 85, stock: 0 },
    ];

    return (
        <div className="rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-6 py-3 font-medium">Product Name</th>
                        <th className="px-6 py-3 font-medium">Price</th>
                        <th className="px-6 py-3 font-medium">Stock</th>
                        <th className="px-6 py-3 font-medium">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                        <tr key={p.id}>
                            <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 text-gray-600">${p.price}</td>
                            <td className="px-6 py-4">
                                <span className={`rounded px-2 py-1 text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}



function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className={`rounded-xl p-6 ${color}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}



function OrderRow({ id, customer, status, amount }: OrderRowProps) {
  const statusColors = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900">{id}</td>
      <td className="px-6 py-4 text-gray-600">{customer}</td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600">{amount}</td>
    </tr>
  );
}