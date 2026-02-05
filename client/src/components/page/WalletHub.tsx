import { useState } from "react";
import { 
    Wallet, 
    Coins, 
    Search, 
    Download, 
    CreditCard,
    History,
    TrendingUp,
    CalendarClock,
    Eye,           // <--- Added Icon
    X,             // <--- Added Icon
    CheckCircle2,
    AlertCircle,
    Clock
} from "lucide-react";

// --- TYPES ---
interface BankTransaction {
    id: string;
    date: string;
    description: string;
    merchant_or_source: string;
    type: 'credit' | 'debit'; 
    category: 'sale' | 'payout' | 'fee' | 'service' | 'installment';
    amount: number;
    status: 'completed' | 'pending' | 'processing' | 'failed';
    reference_code: string;
    installment_plan?: {
        current: number;
        total: number;
        next_due?: string;
    };
}

interface CoinTransaction {
    id: string;
    date: string;
    activity: string;
    amount: number;
    type: 'earned' | 'spent';
}

export default function WalletHub() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'banking' | 'coins'>('banking');
    const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null); // <--- New State for Modal
    
    // Balances
    const [fiatBalance] = useState(1130.45);
    const [coinBalance] = useState(450); 

    // Mock Bank Statement Data
    const [transactions] = useState<BankTransaction[]>([
        { 
            id: 'TXN-1006', 
            date: '2026-02-06', 
            description: 'Camera Lens Equipment', 
            merchant_or_source: 'BNPL Provider', 
            type: 'debit', 
            category: 'installment', 
            amount: 120.00, 
            status: 'completed', 
            reference_code: 'INS-4421',
            installment_plan: { current: 1, total: 4, next_due: '2026-03-06' } 
        },
        { id: 'TXN-1001', date: '2026-02-05', description: 'Order Payment #ORD-992', merchant_or_source: 'Buyer: John Doe', type: 'credit', category: 'sale', amount: 120.00, status: 'completed', reference_code: 'REF-8821' },
        { id: 'TXN-1002', date: '2026-02-04', description: 'Platform Selling Fee', merchant_or_source: 'Marketplace Inc', type: 'debit', category: 'fee', amount: 12.50, status: 'completed', reference_code: 'FEE-9912' },
        { id: 'TXN-1003', date: '2026-02-01', description: 'Withdrawal to Bank Account', merchant_or_source: 'Chase Bank ****4455', type: 'debit', category: 'payout', amount: 500.00, status: 'processing', reference_code: 'WDR-1120' },
        { id: 'TXN-1004', date: '2026-01-28', description: 'Order Payment #ORD-980', merchant_or_source: 'Buyer: Sarah Lee', type: 'credit', category: 'sale', amount: 45.00, status: 'failed', reference_code: 'REF-8805' },
    ]);

    // Mock Mini Coin History
    const [coinHistory] = useState<CoinTransaction[]>([
        { id: 'CN-55', date: '2026-02-05', activity: 'High Volume Bonus', amount: 50, type: 'earned' },
        { id: 'CN-54', date: '2026-02-03', activity: 'Purchased "Featured" Listing', amount: -100, type: 'spent' },
        { id: 'CN-53', date: '2026-01-30', activity: 'Order Completion Reward', amount: 10, type: 'earned' },
    ]);

    // --- FILTERS ---
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = transactions.filter(txn => 
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        txn.reference_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- HELPERS ---
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
            
            {/* --- HEADER --- */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Wallet className="h-8 w-8 text-indigo-600" />
                        Financial Hub
                    </h1>
                    <p className="text-gray-500 mt-1">Overview of your accounts, assets, and transaction records.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
                        <Download className="h-4 w-4" /> Export Statement
                    </button>
                </div>
            </div>

            {/* --- ASSET CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 1. Main Currency Balance */}
                <div 
                    onClick={() => setActiveTab('banking')}
                    className={`p-6 rounded-2xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group ${
                        activeTab === 'banking' ? 'bg-white border-indigo-600 ring-1 ring-indigo-600' : 'bg-white border-gray-200 hover:border-indigo-300'
                    }`}
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> Main Account
                            </p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-3">${fiatBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p className="text-sm text-green-600 font-bold mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> +12% this month
                            </p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <Wallet className="h-6 w-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                </div>

                {/* 2. Mini Coins Balance */}
                <div 
                    onClick={() => setActiveTab('coins')}
                    className={`p-6 rounded-2xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group ${
                        activeTab === 'coins' ? 'bg-white border-yellow-500 ring-1 ring-yellow-500' : 'bg-white border-gray-200 hover:border-yellow-300'
                    }`}
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <Coins className="h-4 w-4" /> Mini Coins
                            </p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-3">{coinBalance.toLocaleString()}</p>
                            <p className="text-sm text-yellow-600 font-bold mt-1">Loyalty Points</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <Coins className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
                
                {/* 1. BANKING VIEW */}
                {activeTab === 'banking' && (
                    <div className="flex-1 flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <History className="h-5 w-5 text-gray-500" /> Transaction History
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search transactions..." 
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 transition w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Bank Statement Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Date</th>
                                        <th className="px-6 py-4 text-left">Description</th>
                                        <th className="px-6 py-4 text-left">Reference</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Debit</th>
                                        <th className="px-6 py-4 text-right">Credit</th>
                                        <th className="px-6 py-4 text-center">Details</th> {/* Added Header */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredTransactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">
                                                {txn.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 flex items-center gap-2">
                                                    {txn.description}
                                                    {/* Installment Badge */}
                                                    {txn.installment_plan && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded-full border border-purple-200">
                                                            <CalendarClock className="h-3 w-3" />
                                                            {txn.installment_plan.current}/{txn.installment_plan.total}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">{txn.merchant_or_source}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                                {txn.reference_code}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(txn.status)}`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                {txn.type === 'debit' ? `-$${txn.amount.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-green-600">
                                                {txn.type === 'credit' ? `+$${txn.amount.toFixed(2)}` : '-'}
                                            </td>
                                            {/* Action Button */}
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedTransaction(txn)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <tr><td colSpan={7} className="p-8 text-center text-gray-400">No records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 2. MINI COINS VIEW */}
                {activeTab === 'coins' && (
                    <div className="flex-1 p-6 bg-yellow-50/20">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left: Info Card */}
                            <div className="md:w-1/3 space-y-4">
                                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <Coins className="h-10 w-10 opacity-80" />
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Tier: Gold</span>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Current Balance</p>
                                        <h2 className="text-4xl font-extrabold mt-1">{coinBalance}</h2>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/20 flex gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs text-white/70">Lifetime Earned</p>
                                            <p className="font-bold">1,250</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-white/70">Redeemed</p>
                                            <p className="font-bold">800</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Coin History */}
                            <div className="md:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2">
                                    <History className="h-4 w-4" /> Coin Activity Log
                                </div>
                                <div className="overflow-y-auto flex-1 p-0">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <tbody className="divide-y divide-gray-100">
                                            {coinHistory.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-900">{log.activity}</p>
                                                        <p className="text-xs text-gray-500">{log.date}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`font-bold text-lg ${log.type === 'earned' ? 'text-green-600' : 'text-red-500'}`}>
                                                            {log.amount > 0 ? '+' : ''}{log.amount}
                                                        </span>
                                                        <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">{log.type}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- TRANSACTION DETAILS MODAL --- */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Transaction Details</h3>
                            <button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            
                            {/* Amount Display */}
                            <div className="text-center">
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">Total Amount</p>
                                <h2 className={`text-4xl font-extrabold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {selectedTransaction.type === 'debit' ? '-' : '+'}${selectedTransaction.amount.toFixed(2)}
                                </h2>
                                <span className={`inline-flex mt-3 items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(selectedTransaction.status)}`}>
                                    {selectedTransaction.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1"/>}
                                    {selectedTransaction.status === 'pending' && <Clock className="h-3 w-3 mr-1"/>}
                                    {selectedTransaction.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1"/>}
                                    {selectedTransaction.status}
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date & Time</span>
                                    <span className="font-semibold text-gray-900">{selectedTransaction.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Transaction Type</span>
                                    <span className="font-semibold text-gray-900 capitalize">{selectedTransaction.category} ({selectedTransaction.type})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Reference Code</span>
                                    <span className="font-mono text-gray-700 bg-gray-200 px-2 py-0.5 rounded">{selectedTransaction.reference_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Merchant / Source</span>
                                    <span className="font-semibold text-gray-900">{selectedTransaction.merchant_or_source}</span>
                                </div>
                            </div>

                            {/* Installment Info Section */}
                            {selectedTransaction.installment_plan && (
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CalendarClock className="h-5 w-5 text-purple-600" />
                                        <h4 className="font-bold text-purple-900">Installment Plan Active</h4>
                                    </div>
                                    <div className="w-full bg-purple-200 rounded-full h-2.5 mb-2">
                                        <div 
                                            className="bg-purple-600 h-2.5 rounded-full" 
                                            style={{ width: `${(selectedTransaction.installment_plan.current / selectedTransaction.installment_plan.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-purple-800 font-medium">
                                        <span>Payment {selectedTransaction.installment_plan.current} of {selectedTransaction.installment_plan.total}</span>
                                        <span>Next Due: {selectedTransaction.installment_plan.next_due}</span>
                                    </div>
                                </div>
                            )}

                            {/* Description Note */}
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Description</p>
                                <p className="text-gray-700 bg-white p-3 border border-gray-200 rounded-lg">
                                    {selectedTransaction.description}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-sm text-indigo-600 font-bold hover:underline">
                                Report an issue with this transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}