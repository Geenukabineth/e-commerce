
import { ShieldAlert, CheckCircle, XCircle, Eye } from "lucide-react";

type ModerationItem = {
  id: number;
  contentType: string;
  content: string;
  reportedBy: string;
  riskLevel: "High" | "Medium" | "Low";
  mlConfidence: number;
  recommendedAction: string;
  date: string;
};

const moderationQueue: ModerationItem[] = [
  {
    id: 1,
    contentType: "Product Review",
    content: "This seller is a scam! Avoid at all costs!",
    reportedBy: "AI System",
    riskLevel: "High",
    mlConfidence: 92,
    recommendedAction: "Remove Content",
    date: "2026-02-05",
  },
  {
    id: 2,
    contentType: "Product Description",
    content: "Best price guaranteed!!! Click external link",
    reportedBy: "User Report",
    riskLevel: "Medium",
    mlConfidence: 68,
    recommendedAction: "Manual Review",
    date: "2026-02-04",
  },
  {
    id: 3,
    contentType: "Seller Comment",
    content: "Fast delivery and excellent service",
    reportedBy: "AI System",
    riskLevel: "Low",
    mlConfidence: 18,
    recommendedAction: "Approve",
    date: "2026-02-03",
  },
];

const riskBadge = (risk: string) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  if (risk === "High") return `${base} bg-red-100 text-red-600`;
  if (risk === "Medium") return `${base} bg-yellow-100 text-yellow-600`;
  return `${base} bg-green-100 text-green-600`;
};

export default function GlobalContentModerationQueue() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="text-red-600" />
          Global Content Moderation Queue
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Pending Reviews" value="128" />
        <KpiCard title="High Risk Content" value="24" highlight />
        <KpiCard title="Auto Approved" value="540" />
        <KpiCard title="Moderator Accuracy" value="96%" />
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Content</th>
              <th className="px-4 py-3 text-left">Reported By</th>
              <th className="px-4 py-3 text-left">Risk</th>
              <th className="px-4 py-3 text-left">ML Confidence</th>
              <th className="px-4 py-3 text-left">Recommendation</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {moderationQueue.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{item.contentType}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {item.content}
                </td>
                <td className="px-4 py-3">{item.reportedBy}</td>
                <td className="px-4 py-3">
                  <span className={riskBadge(item.riskLevel)}>
                    {item.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3">{item.mlConfidence}%</td>
                <td className="px-4 py-3 font-medium">
                  {item.recommendedAction}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="p-2 rounded hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded hover:bg-green-100 text-green-600">
                    <CheckCircle size={16} />
                  </button>
                  <button className="p-2 rounded hover:bg-red-100 text-red-600">
                    <XCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* KPI Card Component */
function KpiCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl shadow bg-white ${
        highlight ? "border-l-4 border-red-500" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
