import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth.store";
import Products from "./Products"; 
import Sidebar from "./Sidebar"; 
import Overview from "./overview";
import AddUser from "./AddUser";

export default function AdminDashboard() {
  // 1. GET isLoading FROM STORE
  const { profile, isLoading } = useAuth(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // --- SECURITY & REDIRECT CHECK ---
  useEffect(() => {
    // 2. WAIT FOR LOADING TO FINISH BEFORE REDIRECTING
    // If we are still loading, do nothing.
    // Only redirect if loading is DONE and permission is missing.
    if (!isLoading) {
       if (!profile || profile.role !== "admin") {
         navigate("/"); 
       }
    }
  }, [profile, isLoading, navigate]); // Add isLoading to dependencies

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
            <p className="text-gray-500">Welcome back, {profile.username}</p>
          </div>
        </header>

        {activeTab === "overview" && <Overview />}
        {activeTab === "products" && <Products />}  
        {activeTab === "users" && <AddUser />}
        {activeTab === "orders" && <div>Orders coming soon...</div>}
        {activeTab === "users" && <div>Users coming soon...</div>}
      </main>
    </div>
  );
}

