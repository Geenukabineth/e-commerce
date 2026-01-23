import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- MOCK DATA ---
const REVENUE_DATA = [
  { name: "Mon", revenue: 4000, orders: 24 },
  { name: "Tue", revenue: 3000, orders: 18 },
  { name: "Wed", revenue: 2000, orders: 12 },
  { name: "Thu", revenue: 2780, orders: 20 },
  { name: "Fri", revenue: 1890, orders: 15 },
  { name: "Sat", revenue: 2390, orders: 18 },
  { name: "Sun", revenue: 3490, orders: 25 },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$54,231.89"
          trend="+12.5%"
          trendUp={true}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          }
        />
        <StatCard
          title="Total Orders"
          value="1,203"
          trend="+8.2%"
          trendUp={true}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          }
        />
        <StatCard
          title="Active Users"
          value="8,402"
          trend="-2.4%"
          trendUp={false}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          }
        />
        <StatCard
          title="Conversion Rate"
          value="3.24%"
          trend="+1.2%"
          trendUp={true}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          }
        />
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Weekly Orders</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="orders" fill="#111827" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY TABLE */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <OrderRow
                id="#ORD-001"
                customer="Alex Johnson"
                product="Wireless Headphones"
                status="Completed"
                amount="$120.00"
              />
              <OrderRow
                id="#ORD-002"
                customer="Maria Garcia"
                product="Smart Watch XL"
                status="Processing"
                amount="$250.50"
              />
              <OrderRow
                id="#ORD-003"
                customer="James Smith"
                product="Gaming Mouse"
                status="Pending"
                amount="$85.00"
              />
               <OrderRow
                id="#ORD-004"
                customer="Linda Brown"
                product="Mechanical Keyboard"
                status="Completed"
                amount="$145.00"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, trend, trendUp, icon }: any) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="mt-2 text-2xl font-bold text-gray-900">{value}</h4>
        </div>
        <div className="rounded-full bg-gray-100 p-3 text-gray-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>
          {trend}
        </span>
        <span className="ml-2 text-gray-400">from last month</span>
      </div>
    </div>
  );
}

function OrderRow({ id, customer, product, status, amount }: any) {
  const statusStyles: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900">{id}</td>
      <td className="px-6 py-4 text-gray-600">{customer}</td>
      <td className="px-6 py-4 text-gray-500">{product}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right font-medium text-gray-900">{amount}</td>
    </tr>
  );
}