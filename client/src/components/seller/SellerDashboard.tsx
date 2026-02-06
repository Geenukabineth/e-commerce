import { useEffect, useState } from "react";
import { getProfileApi } from "../../auth/auth.api"; 
import type { Profile } from "../../auth/auth.types";
import Sidebar from "../page/Sidebar";
import Inventory from "./Inventory";
import Overview from "./sellerOverview"; 
import SalesManagementDashboard from "../admin/SalesManagement";
import SellerOrderDashboard from "./Order";
import type CustomerCommunicationDashboard from "../page/Communication";
import Communication from "../page/Communication";
import ReviewManagementDashboard from "./Review";

export default function SellerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const data = await getProfileApi();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load seller profile");
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-10">
        <div className="mx-auto max-w-7xl">
          
          {/* Dashboard Tab: Show the separated Overview page */}
          {activeTab === "dashboard" && (
            <Overview profile={profile} />
          )}

          {/* Products Tab: Show the Inventory management page */}
          {activeTab === "products" && (
            <Inventory />
          )}

          {/* Orders Tab: Placeholder */}
          {activeTab === "orders" && <SellerOrderDashboard/>}
          {activeTab === "sales" && <SalesManagementDashboard />}
          {activeTab === "communication" && <Communication />}
          {activeTab === "reviews" && <ReviewManagementDashboard />}


        </div>
      </main>
    </div>
  );
}