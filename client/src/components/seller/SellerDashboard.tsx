import  { useEffect, useState } from "react";
import { getProfileApi } from "../../auth/auth.api"; 
import type { Profile } from "../../auth/auth.types";
import Sidebar from "../admin/Sidebar";

export default function SellerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Track active tab for the sidebar
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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. SIDEBAR INTEGRATION */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Welcome Header */}
          <div className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {profile?.business_name || profile?.username}
            </h1>
            <p className="text-gray-500">Manage your business profile and check your approval status.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Status Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Account Status</h3>
              <div className="mt-4 flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${profile?.is_approved ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                <span className="text-xl font-bold text-gray-800">
                  {profile?.is_approved ? "Approved & Active" : "Pending Admin Review"}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {profile?.is_approved 
                  ? "Your products are visible to customers." 
                  : "Please wait for an administrator to verify your documents."}
              </p>
            </div>

            {/* Category Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Primary Category</h3>
              <div className="mt-4">
                <span className="inline-block rounded-lg bg-blue-50 px-3 py-1 text-lg font-bold text-blue-700 border border-blue-100">
                  {profile?.category || "Other"}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Based on your registration details.</p>
            </div>

            {/* Quick Stats Placeholder */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Total Sales</h3>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">$0.00</span>
              </div>
              <p className="mt-2 text-xs text-gray-400 italic">Sales data coming soon...</p>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="mt-10 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Business Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Owner Name</label>
                <p className="text-gray-900 font-medium">{profile?.owner_name || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Registration Number</label>
                <p className="text-gray-900 font-medium font-mono">{profile?.registration_number || "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Contact Email</label>
                <p className="text-gray-900 font-medium">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <p className="text-gray-900 font-medium">{profile?.phone || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase">Business Address</label>
                <p className="text-gray-900 font-medium">{profile?.address || "No address on file"}</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Verification Documents</h2>
            <div className="flex gap-4">
              {profile?.id_document ? (
                <a 
                  href={profile.id_document} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  View Uploaded ID
                </a>
              ) : (
                <div className="rounded-lg border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-600">
                  No ID document found. Please contact admin.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}