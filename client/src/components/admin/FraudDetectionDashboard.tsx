import { useEffect, useState } from "react";
import { 
    ShieldAlert, 
    CheckCircle, 
    XCircle, 
    Eye, 
    Activity, 
    RefreshCw 
} from "lucide-react";

// --- IMPORT THE API FUNCTIONS ---
import { 
    getModerationQueueApi, 
    getModerationStatsApi, 
    resolveModerationItemApi 
} from "../../auth/auth.Productapi";

// --- Types ---
interface ModerationItem {
    id: number;
    content_type: string;
    content: string;
    reported_by: string;
    risk_level: "High" | "Medium" | "Low";
    ml_confidence: number;
    recommended_action: string;
    created_at: string;
}

interface DashboardStats {
    pending_reviews: number;
    high_risk_content: number;
    auto_approved: number;
    accuracy: string;
}

export default function FraudDetectionDashboard() {
    const [queue, setQueue] = useState<ModerationItem[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // USAGE: Calling the imported API functions
            const [queueData, statsData] = await Promise.all([
                getModerationQueueApi(),
                getModerationStatsApi()
            ]);
            setQueue(queueData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to load moderation data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'remove') => {
        if (!window.confirm(`Are you sure you want to ${action} this item?`)) return;
        
        setProcessingId(id);
        try {
            // USAGE: Calling the resolve function
            await resolveModerationItemApi(id, action);
            
            // Optimistic UI Update
            setQueue(prev => prev.filter(item => item.id !== id));
            
            // Refresh stats in background to keep counters accurate
            const newStats = await getModerationStatsApi();
            setStats(newStats);
            
        } catch (error) {
            alert("Failed to process action. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const riskBadge = (risk: string) => {
        const base = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide";
        if (risk === "High") return `${base} bg-red-100 text-red-700 border border-red-200`;
        if (risk === "Medium") return `${base} bg-yellow-100 text-yellow-700 border border-yellow-200`;
        return `${base} bg-green-100 text-green-700 border border-green-200`;
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
                        <ShieldAlert className="text-indigo-600 w-8 h-8" />
                        Fraud & Risk Control Center
                    </h1>
                    <p className="text-gray-500 mt-1 ml-11">AI-Powered Content Moderation Queue</p>
                </div>
                <button 
                    onClick={loadData}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition shadow-sm"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KpiCard 
                    title="Pending Review" 
                    value={stats?.pending_reviews.toString() || "-"} 
                    icon={<Activity className="text-indigo-500" />}
                />
                <KpiCard 
                    title="High Risk Alerts" 
                    value={stats?.high_risk_content.toString() || "-"} 
                    highlight 
                    icon={<ShieldAlert className="text-red-500" />}
                />
                <KpiCard 
                    title="Auto-Approved" 
                    value={stats?.auto_approved.toString() || "540"} 
                    icon={<CheckCircle className="text-green-500" />}
                />
                <KpiCard 
                    title="AI Accuracy" 
                    value={stats?.accuracy || "96%"} 
                    icon={<Eye className="text-blue-500" />}
                />
            </div>

            {/* Moderation Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-700">Flagged Content Queue</h3>
                    <span className="text-xs font-medium text-gray-400">
                        {queue.length} items requiring attention
                    </span>
                </div>

                {loading && queue.length === 0 ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600"></div>
                    </div>
                ) : queue.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-200" />
                        <p>All clean! No flagged content found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-white text-gray-500 uppercase text-xs tracking-wider border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Risk Level</th>
                                    <th className="px-6 py-4 text-left font-bold">Content Type</th>
                                    <th className="px-6 py-4 text-left font-bold w-1/3">Content Analysis</th>
                                    <th className="px-6 py-4 text-left font-bold">ML Confidence</th>
                                    <th className="px-6 py-4 text-left font-bold">AI Suggestion</th>
                                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {queue.map((item) => (
                                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={riskBadge(item.risk_level)}>
                                                {item.risk_level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{item.content_type}</div>
                                            <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                                {item.content}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                    <div 
                                                        className={`h-1.5 rounded-full ${item.ml_confidence > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                                        style={{ width: `${item.ml_confidence}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold text-gray-700">{item.ml_confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-600 text-xs uppercase">
                                            {item.recommended_action}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleAction(item.id, 'approve')}
                                                    disabled={processingId === item.id}
                                                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition border border-green-200 disabled:opacity-50"
                                                    title="Approve (False Positive)"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(item.id, 'remove')}
                                                    disabled={processingId === item.id}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200 disabled:opacity-50"
                                                    title="Remove Content"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function KpiCard({ title, value, highlight, icon }: { title: string; value: string; highlight?: boolean; icon?: React.ReactNode; }) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm bg-white border border-gray-100 flex items-start justify-between ${highlight ? "ring-2 ring-red-100" : ""}`}>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <p className={`text-3xl font-black mt-2 ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${highlight ? 'bg-red-50' : 'bg-indigo-50'}`}>
            {icon}
        </div>
    </div>
  );
}