import { useState, useEffect } from "react";
import { 
    Banknote, 
    ClockIcon, 
    FileText, 
    Download,
    Wallet,
    ArrowDownLeft,
    RefreshCcw,
    Loader2 
} from "lucide-react";
// Import the specific API functions based on your auth.payment.ts
import { getAdminFinaceApi, resolveRefundApi } from "../../auth/auth.payment";

// --- TYPES ---
// Updated IDs to 'number' to match Django <int:pk> urls
interface Payout {
    id: number;
    vendor_name: string;
    vendor_id: number;
    amount: number;
    currency: string;
    status: 'pending_approval' | 'processing' | 'paid' | 'failed';
    method: 'stripe' | 'paypal' | 'bank_transfer';
    created_at: string;
    risk_flag?: boolean;
}

interface VendorTaxRecord {
    vendor_id: number;
    vendor_name: string;
    tax_id: string;
    total_earnings_ytd: number;
    last_invoice_date: string;
    w9_status: 'submitted' | 'missing';
}

interface Transaction {
    id: string; // Transactions often use UUIDs or string refs
    type: 'sale' | 'payout' | 'refund' | 'fee';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    reference_id?: string; 
}

// Updated ID to 'number' to match Django <int:pk> urls
interface RefundRequest {
    id: number;
    order_id: string;
    customer_name: string;
    seller_name: string;
    product_name: string;
    amount: number;
    reason: string;
    date_requested: string;
    status: 'pending' | 'approved' | 'rejected' | 'escalated';
    auto_resolve_date: string;
}

// Define the expected structure from the FinanceDashboardView API
interface FinanceData {
    balance?: {
        platform_revenue: number;
        pending_clearance: number;
        vendor_holdings: number;
    };
    payouts?: Payout[];
    transactions?: Transaction[];
    refunds?: RefundRequest[];
    taxRecords?: VendorTaxRecord[];
}

export default function PayoutManagement() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'wallet' | 'history' | 'refunds' | 'tax'>('wallet');
    const [automationEnabled, setAutomationEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null); // Track which item is processing

    // --- DATA STATE (Initialized with safe defaults) ---
    const [balance, setBalance] = useState({
        platform_revenue: 0, 
        pending_clearance: 0, 
        vendor_holdings: 0, 
    });
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [taxRecords, setTaxRecords] = useState<VendorTaxRecord[]>([]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Calls the endpoint mapped to FinanceDashboardView
                const data: FinanceData = await getAdminFinaceApi();
                
                // Safety checks: Fallback to defaults if specific keys are missing
                setBalance(data?.balance || { 
                    platform_revenue: 0, 
                    pending_clearance: 0, 
                    vendor_holdings: 0 
                });

                setPayouts(data?.payouts || []);
                setTransactions(data?.transactions || []);
                setRefunds(data?.refunds || []);
                setTaxRecords(data?.taxRecords || []);

            } catch (err) {
                console.error("Failed to fetch finance data:", err);
                setError("Failed to load financial data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- ACTIONS ---
    const handleRefundAction = async (id: number, action: 'approve' | 'reject') => {
        const confirmMsg = action === 'approve' 
            ? "Are you sure you want to FORCE REFUND this order? The funds will be deducted from the seller." 
            : "Are you sure you want to DENY this refund request?";

        if(!window.confirm(confirmMsg)) return;

        setActionLoading(id);
        try {
            // Calls the API mapped to RefundActionView
            await resolveRefundApi(id, action);
            
            // Optimistic update: Update local state to reflect change immediately
            setRefunds(prev => prev.map(r => 
                r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
            ));
        } catch (err) {
            console.error("Refund action failed", err);
            alert("Failed to process refund action. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleGenerateInvoice = (vendorName: string) => {
        // Placeholder for invoice generation logic
        alert(`Generating Invoice for ${vendorName}...`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 font-bold mb-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Banknote className="h-8 w-8 text-green-600" />
                        Finance & Payouts
                    </h1>
                    <p className="text-gray-500 mt-1">Central hub for platform funds, vendor payouts, and refund disputes.</p>
                    
                     {/* Balance Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase">Platform Revenue (Fees)</p>
                            <p className="text-3xl font-extrabold text-green-700 mt-2">
                                ${balance?.platform_revenue?.toLocaleString() ?? '0.00'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Available for business withdrawal</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase">Vendor Holdings</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">
                                ${balance?.vendor_holdings?.toLocaleString() ?? '0.00'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Funds held on behalf of sellers</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase">Pending Clearance</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">
                                ${balance?.pending_clearance?.toLocaleString() ?? '0.00'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Processing transactions</p>
                        </div>
                    </div>
                </div>
                
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${automationEnabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Auto-Payouts</span>
                        <span className={`font-bold ${automationEnabled ? 'text-green-700' : 'text-yellow-700'}`}>
                            {automationEnabled ? 'Active' : 'Paused'}
                        </span>
                    </div>
                    <button 
                        onClick={() => setAutomationEnabled(!automationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${automationEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${automationEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* --- MAIN TABS --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('wallet')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'wallet' ? 'border-green-600 text-green-600 bg-green-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Wallet className="h-4 w-4" /> Wallet Hub
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'history' ? 'border-green-600 text-green-600 bg-green-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        <ClockIcon className="h-4 w-4" /> Payout History
                    </button>
                    <button 
                        onClick={() => setActiveTab('refunds')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'refunds' ? 'border-green-600 text-green-600 bg-green-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        <RefreshCcw className="h-4 w-4" /> Refund Disputes
                        {(refunds || []).filter(r => r.status === 'escalated' || r.status === 'pending').length > 0 && 
                            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full ml-1">
                                {(refunds || []).filter(r => r.status === 'escalated' || r.status === 'pending').length}
                            </span>
                        }
                    </button>
                    <button 
                        onClick={() => setActiveTab('tax')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'tax' ? 'border-green-600 text-green-600 bg-green-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                        <FileText className="h-4 w-4" /> Invoices & Tax
                    </button>
                </div>

                {/* --- TAB CONTENT --- */}
                <div className="flex-1 bg-gray-50/30">
                    
                    {/* 1. WALLET HUB TAB */}
                    {activeTab === 'wallet' && (
                        <div className="p-6 space-y-8">
                            {/* Transaction Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2"><ArrowDownLeft className="h-4 w-4"/> Recent Platform Transactions</h3>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                                </div>
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(transactions || []).map((txn) => (
                                            <tr key={txn.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-gray-900">{txn.description}</p>
                                                    <p className="text-xs text-gray-400 font-mono">ID: {txn.id}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                                        txn.type === 'fee' ? 'bg-indigo-100 text-indigo-700' :
                                                        txn.type === 'sale' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {txn.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                                                <td className={`px-6 py-4 text-right font-bold text-sm ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        {(transactions || []).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                                    No recent transactions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 2. REFUNDS TAB */}
                    {activeTab === 'refunds' && (
                        <div className="p-6 space-y-4">
                            {(refunds || []).map(refund => (
                                <div key={refund.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-sm transition">
                                    {/* Refund Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                                                refund.status === 'escalated' ? 'bg-red-100 text-red-700' :
                                                refund.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {refund.status}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">Order #{refund.order_id}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{refund.product_name}</h3>
                                        <div className="text-sm text-gray-600 mt-1 flex gap-4">
                                            <span>Buyer: <span className="font-semibold">{refund.customer_name}</span></span>
                                            <span>→</span>
                                            <span>Seller: <span className="font-semibold text-indigo-600">{refund.seller_name}</span></span>
                                        </div>
                                        
                                        <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 inline-block">
                                            <p className="text-xs text-red-500 font-bold uppercase mb-1">Dispute Reason</p>
                                            <p className="text-sm text-gray-800 italic">"{refund.reason}"</p>
                                        </div>
                                    </div>

                                    {/* Action Panel */}
                                    <div className="flex flex-col justify-between items-end min-w-[200px] border-l border-gray-100 pl-6">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Refund Amount</p>
                                            <p className="text-2xl font-bold text-red-600">${refund.amount.toFixed(2)}</p>
                                        </div>
                                        
                                        {refund.status === 'pending' || refund.status === 'escalated' ? (
                                            <div className="flex gap-2 w-full mt-4">
                                                <button 
                                                    disabled={actionLoading === refund.id}
                                                    onClick={() => handleRefundAction(refund.id, 'reject')}
                                                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Deny
                                                </button>
                                                <button 
                                                    disabled={actionLoading === refund.id}
                                                    onClick={() => handleRefundAction(refund.id, 'approve')}
                                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm disabled:opacity-50 flex justify-center gap-2"
                                                >
                                                    {actionLoading === refund.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        "Force Refund"
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mt-4 px-3 py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-500">
                                                {refund.status === 'approved' ? 'Refund Processed' : 'Request Denied'}
                                            </div>
                                        )}
                                        {refund.status === 'pending' && (
                                            <p className="text-[10px] text-gray-400 mt-2">Auto-resolves: {refund.auto_resolve_date}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(refunds || []).length === 0 && (
                                <div className="text-center py-10 text-gray-500">No refund disputes found.</div>
                            )}
                        </div>
                    )}

                    {/* 3. HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div className="p-0">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vendor</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(payouts || []).map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">PO-{p.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{p.created_at}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{p.vendor_name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                                                    p.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">${p.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {(payouts || []).length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                                                No payout history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 4. TAX TAB */}
                    {activeTab === 'tax' && (
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {(taxRecords || []).map(vendor => (
                                <div key={vendor.vendor_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 text-lg">{vendor.vendor_name}</h3>
                                            {vendor.w9_status === 'missing' && 
                                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">W-9 Missing</span>
                                            }
                                        </div>
                                        <p className="text-sm text-gray-500">Tax ID: <span className="font-mono">{vendor.tax_id}</span></p>
                                        <p className="text-sm text-gray-500">YTD Earnings: <span className="font-bold text-green-700">${vendor.total_earnings_ytd.toLocaleString()}</span></p>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleGenerateInvoice(vendor.vendor_name)}
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
                                        >
                                            <FileText className="h-4 w-4"/> Monthly Invoice
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-700 hover:bg-indigo-100">
                                            <Download className="h-4 w-4"/> 1099 Form
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(taxRecords || []).length === 0 && (
                                <div className="text-center py-10 text-gray-500">No tax records found.</div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}