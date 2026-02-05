import { useState } from "react";
import { 
    Banknote, 
    ClockIcon, 
    FileText, 
    Download,
    Wallet,
    ArrowDownLeft,
    RefreshCcw,
} from "lucide-react";

// --- TYPES ---
interface Payout {
    id: string;
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
    id: string;
    type: 'sale' | 'payout' | 'refund' | 'fee';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    reference_id?: string; 
}

interface RefundRequest {
    id: string;
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

export default function PayoutManagement() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'wallet' | 'history' | 'refunds' | 'tax'>('wallet');
    const [automationEnabled, setAutomationEnabled] = useState(true);

    // --- MOCK DATA: PAYOUTS ---
    const [payouts] = useState<Payout[]>([
        { id: 'PO-0998', vendor_name: 'GamingPro', vendor_id: 103, amount: 8900.00, currency: 'USD', status: 'paid', method: 'stripe', created_at: '2026-01-31' },
        { id: 'PO-0997', vendor_name: 'TechGadgets Inc', vendor_id: 101, amount: 2500.00, currency: 'USD', status: 'paid', method: 'bank_transfer', created_at: '2026-01-28' },
    ]);

    // --- MOCK DATA: WALLET & TRANSACTIONS ---
    const [balance] = useState({
        platform_revenue: 15420.00, 
        pending_clearance: 3400.50, 
        vendor_holdings: 125000.00, 
    });

    const [transactions] = useState<Transaction[]>([
        { id: 'TXN-8821', type: 'fee', amount: 12.00, description: 'Platform Fee: Order #101', date: '2026-02-05', status: 'completed' },
        { id: 'TXN-8820', type: 'sale', amount: 120.00, description: 'Payment In: Order #101', date: '2026-02-05', status: 'completed' },
        { id: 'TXN-8819', type: 'payout', amount: -500.00, description: 'Payout to TechGadgets Inc', date: '2026-02-01', status: 'completed' },
        { id: 'TXN-8818', type: 'refund', amount: -60.00, description: 'Refund: Order #055', date: '2026-01-28', status: 'completed' },
    ]);

    // --- MOCK DATA: REFUNDS ---
    const [refunds, setRefunds] = useState<RefundRequest[]>([
        { id: 'RF-202', order_id: 'ORD-115', customer_name: 'John Doe', seller_name: 'TechGadgets Inc', product_name: 'Mechanical Keyboard', amount: 85.00, reason: 'Item defective', date_requested: '2026-02-04', status: 'pending', auto_resolve_date: '2026-02-07' },
        { id: 'RF-201', order_id: 'ORD-110', customer_name: 'Sarah Lee', seller_name: 'Alice Smith', product_name: 'USB Cable', amount: 15.00, reason: 'Wrong item', date_requested: '2026-02-03', status: 'escalated', auto_resolve_date: '2026-02-06' }
    ]);

    const [taxRecords] = useState<VendorTaxRecord[]>([
        { vendor_id: 101, vendor_name: 'TechGadgets Inc', tax_id: '**-***4589', total_earnings_ytd: 6600.00, last_invoice_date: '2026-01-31', w9_status: 'submitted' },
        { vendor_id: 102, vendor_name: 'Alice Smith', tax_id: '**-***9921', total_earnings_ytd: 120.50, last_invoice_date: '2026-02-01', w9_status: 'missing' },
    ]);

    // --- ACTIONS ---
    const handleRefundAction = (id: string, action: 'approve' | 'reject') => {
        if(!window.confirm(`Confirm ${action} for this refund?`)) return;
        setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r));
    };

    const handleGenerateInvoice = (vendorName: string) => {
        alert(`Generating Invoice for ${vendorName}...`);
    };

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
                            <p className="text-3xl font-extrabold text-green-700 mt-2">${balance.platform_revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Available for business withdrawal</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase">Vendor Holdings</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">${balance.vendor_holdings.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Funds held on behalf of sellers</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-xs font-bold text-gray-400 uppercase">Pending Clearance</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">${balance.pending_clearance.toLocaleString()}</p>
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
                        {refunds.filter(r => r.status === 'escalated' || r.status === 'pending').length > 0 && 
                            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full ml-1">
                                {refunds.filter(r => r.status === 'escalated' || r.status === 'pending').length}
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
                                        {transactions.map((txn) => (
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 2. REFUNDS TAB */}
                    {activeTab === 'refunds' && (
                        <div className="p-6 space-y-4">
                            {refunds.map(refund => (
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
                                                    onClick={() => handleRefundAction(refund.id, 'reject')}
                                                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                                                >
                                                    Deny
                                                </button>
                                                <button 
                                                    onClick={() => handleRefundAction(refund.id, 'approve')}
                                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm"
                                                >
                                                    Force Refund
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
                                    {payouts.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.id}</td>
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
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 4. TAX TAB */}
                    {activeTab === 'tax' && (
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {taxRecords.map(vendor => (
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
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}