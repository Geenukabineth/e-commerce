import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/auth.store";
import Sidebar from "../admin/Sidebar"; // Assuming you have a reusable Sidebar or a specific UserSidebar

// Mock Data for UI visualization (Replace with API calls later)
const RECENT_ORDERS = [
  { id: "#ORD-7782", date: "Jan 25, 2026", total: "$120.50", status: "Shipped" },
  { id: "#ORD-7781", date: "Jan 20, 2026", total: "$45.00", status: "Delivered" },
];

const WISHLIST_PREVIEW = [
  { id: 1, name: "Advanced React Course", price: "$49.99", stock: "In Stock" },
  { id: 2, name: "Wireless Headphones", price: "$89.99", stock: "Low Stock" },
];

export default function UserDashboard() {
  const { profile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. SIDEBAR: Pass user-specific tabs or logic here */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {activeTab === 'overview' ? 'My Account' : activeTab}
            </h1>
            <p className="text-gray-500">Welcome back, {profile?.username || "Shopper"}!</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            {profile?.username?.[0]?.toUpperCase() || "U"}
          </div>
        </header>

        {/* --- TAB CONTENT SWITCHER --- */}
        
        {/* 2. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats / Quick Actions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase">Total Orders</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">12</div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase">Wishlist Items</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">5</div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase">Reward Points</div>
                <div className="mt-2 text-3xl font-bold text-green-600">350</div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Orders</h3>
                <button onClick={() => setActiveTab("orders")} className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
              </div>
              <div className="p-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-4 font-medium text-indigo-600 cursor-pointer">{order.id}</td>
                        <td className="py-4 text-gray-500">{order.date}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-medium">{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB (Placeholder for detailed view) */}
        {activeTab === "orders" && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-700">Order History</h2>
            <p className="text-gray-500 mt-2">Full history and tracking details will be listed here.</p>
          </div>
        )}

        {/* 4. WISHLIST TAB */}
        {activeTab === "wishlist" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WISHLIST_PREVIEW.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                <div className="h-16 w-16 rounded-md bg-gray-200 flex-shrink-0"></div> {/* Placeholder Img */}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-indigo-600 font-medium">{item.price}</p>
                </div>
                <button className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:bg-gray-800">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="max-w-2xl rounded-xl bg-white p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" defaultValue={profile?.username} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" defaultValue={profile?.email} disabled className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2 shadow-sm text-gray-500" />
              </div>
              <button className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-white font-bold hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}