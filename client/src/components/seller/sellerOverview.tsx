import React from 'react';
import type { Profile } from "../../auth/auth.types";
import { TrendingUp, ArrowUpRight, DollarSign, Users, ShoppingBag } from 'lucide-react';

interface OverviewProps {
  profile: Profile | null;
}

const Overview: React.FC<OverviewProps> = ({ profile }) => {
  
  // --- MOCK DATA FOR CHART ---
  const salesData = [
    { month: 'Aug', value: 4500, label: '$4.5k' },
    { month: 'Sep', value: 3200, label: '$3.2k' },
    { month: 'Oct', value: 5800, label: '$5.8k' },
    { month: 'Nov', value: 4900, label: '$4.9k' },
    { month: 'Dec', value: 8500, label: '$8.5k' },
    { month: 'Jan', value: 6200, label: '$6.2k' },
  ];

  const maxValue = Math.max(...salesData.map(d => d.value));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {profile?.business_name || profile?.username}. Here is your business summary.
          </p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12.5% vs last month
            </span>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Status</h3>
            <div className="mt-4 flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${profile?.is_approved ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                <span className="text-xl font-bold text-gray-800">
                {profile?.is_approved ? "Approved" : "Pending Review"}
                </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            {profile?.is_approved ? "Live on Marketplace" : "Awaiting Admin Verification"}
          </p>
        </div>

        {/* Category Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Business Category</h3>
            <div className="mt-4">
                <span className="inline-block rounded-lg bg-blue-50 px-3 py-1 text-lg font-bold text-blue-700 border border-blue-100">
                {profile?.category || "General Seller"}
                </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Determines where your items appear.</p>
        </div>

        {/* Sales Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</h3>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">$33,100</span>
                <span className="text-xs text-green-600 font-bold flex items-center">
                    <ArrowUpRight className="h-3 w-3" /> 8%
                </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Last 6 months performance</p>
        </div>
      </div>

      {/* 3. Analytics Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Revenue Trend</h3>
                <select className="text-xs border-gray-200 border rounded-lg p-1 text-gray-500 font-medium outline-none">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                </select>
            </div>
            
            {/* Custom CSS Bar Chart */}
            <div className="flex items-end justify-between h-64 gap-2 pt-4 pb-2">
                {salesData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 h-full group cursor-pointer">
                        <div className="flex-1 w-full flex items-end justify-center relative">
                            {/* Tooltip */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded mb-2">
                                {item.label}
                            </div>
                            {/* Bar */}
                            <div 
                                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${index === salesData.length - 1 ? 'bg-indigo-600' : 'bg-indigo-100 group-hover:bg-indigo-200'}`}
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 mt-3">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Store Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">New Orders</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">124</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Users className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Profile Visits</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">1.2k</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Conversion Rate</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">3.2%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 4. Detailed Business Profile */}
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