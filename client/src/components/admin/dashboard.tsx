import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth.store";
import Products from "./Products"; 
import Sidebar from "../page/Sidebar"; 
import Overview from "./overview";
import AddUser from "./AddUser";
import FraudDetectionDashboard from "./FraudDetectionDashboard";
import PayoutManagement from "./PayoutManagement";
import WalletHub from "../page/WalletHub";
import SalesManagementDashboard from "./SalesManagement";
import CustomerCommunicationDashboard from "../page/Communication";

export default function AdminDashboard() {
  // 1. GET isLoading FROM STORE
  const { profile, isLoading } = useAuth();  
  const [activeTab, setActiveTab] = useState("overview");
 // Add isLoading to dependencies

  // --- 3. SHOW LOADING SCREEN ---
  // While waiting for session restore, show this instead of redirecting
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  // --- 4. SAFETY CHECK ---
  // If loading is done, but still no profile (redirect logic above handles this, but this prevents crashes)
  if (!profile || profile.role !== "admin") {
    return null;
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-100 p-6">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
            <p className="text-gray-500">Welcome back, {profile.username}</p>
          </div>
        </header>

        {activeTab === "overview" && <Overview />}         
        {activeTab === "users" && <AddUser />}
        {activeTab === "products" && <Products />}
        {activeTab === "fraud-detection" && <FraudDetectionDashboard />} 
        {activeTab === "payouts" && <PayoutManagement />}
        {activeTab === "wallet" && <WalletHub />}
        {activeTab === "sales" && <SalesManagementDashboard />}
        {activeTab === "communication" && <CustomerCommunicationDashboard />}
        {/* {activeTab === "orders" && <div>Orders coming soon...</div>} */}
        {/* {activeTab === "users" && <div>Users coming soon...</div>} */}
      </main>
    </div>
  );
}

