import React from 'react';
import type { Profile } from "../../auth/auth.types";

interface OverviewProps {
  profile: Profile | null;
}

const Overview: React.FC<OverviewProps> = ({ profile }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {profile?.business_name || profile?.username}. Here is your business summary.
        </p>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Status</h3>
          <div className="mt-4 flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${profile?.is_approved ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
            <span className="text-xl font-bold text-gray-800">
              {profile?.is_approved ? "Approved" : "Pending Review"}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {profile?.is_approved ? "Live on Marketplace" : "Awaiting Admin Verification"}
          </p>
        </div>

        {/* Category Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Business Category</h3>
          <div className="mt-4">
            <span className="inline-block rounded-lg bg-blue-50 px-3 py-1 text-lg font-bold text-blue-700 border border-blue-100">
              {profile?.category || "General Seller"}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">Determines where your items appear.</p>
        </div>

        {/* Sales Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">$0.00</span>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Business Profile */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Business Profile</h2>
          <button className="text-blue-600 text-xs font-bold hover:underline">Edit Profile</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Registered Business Name</label>
            <p className="text-gray-900 font-semibold text-lg">{profile?.business_name || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Registration Number</label>
            <p className="text-gray-900 font-mono">{profile?.registration_number || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Primary Contact</label>
            <p className="text-gray-900">{profile?.owner_name} ({profile?.email})</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
            <p className="text-gray-900">{profile?.phone || "No phone listed"}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Operational Address</label>
            <p className="text-gray-900">{profile?.address || "No address on file"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;