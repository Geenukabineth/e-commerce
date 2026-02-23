import { useState, useEffect } from "react";
import { 
    CreditCard, Plus, Trash2, Calendar, Store, Package, 
    CheckCircle2, XCircle, PauseCircle, AlertCircle, 
    History, Loader2, X, RefreshCcw, Send, Check
} from "lucide-react";
import { 
    getCardsApi, addCardApi, deleteCardApi, updateCardApi,
    getSubscriptionsApi, subscriptionActionApi,
    getMyRefundsApi, createRefundRequestApi
} from "../../auth/auth.payment";

// --- TYPES ---
interface PaymentMethod {
    id: number;
    type: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiry: string;
    is_default: boolean;
    holder_name: string;
}

interface Subscription {
    id: number;
    vendor_name: string;
    product_name: string;
    product_image: string;
    amount: number;
    frequency: 'Weekly' | 'Monthly' | 'Quarterly';
    next_billing_date: string;
    status: 'active' | 'paused' | 'cancelled' | 'payment_failed';
    payment_method_id: number;
}

interface RefundRequest {
    id: number;
    order_id: string;
    product_name: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'escalated';
    date_requested: string;
}

export default function BillingManagement() {
    const [activeTab, setActiveTab] = useState<'methods' | 'subscriptions' | 'refunds'>('methods');
    const [loading, setLoading] = useState(false);
    
    // Data State
    const [cards, setCards] = useState<PaymentMethod[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);

    // Modal States
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({ holder_name: '', last4: '', expiry: '', type: 'visa' });
    const [showRefundForm, setShowRefundForm] = useState(false);
    const [newRefund, setNewRefund] = useState({ order_id: '', product_name: '', seller_name: '', amount: '', reason: '' });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'methods') {
                    const data = await getCardsApi();
                    setCards(data);
                } else if (activeTab === 'subscriptions') {
                    const data = await getSubscriptionsApi();
                    setSubscriptions(data);
                } else if (activeTab === 'refunds') {
                    const data = await getMyRefundsApi();
                    setRefunds(data);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    // --- CARD ACTIONS ---
    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addCardApi({ ...newCard, is_default: cards.length === 0 });
            setShowAddCard(false);
            setNewCard({ holder_name: '', last4: '', expiry: '', type: 'visa' });
            const data = await getCardsApi(); // Refresh
            setCards(data);
        } catch (err) {
            alert("Failed to add card");
        }
    };

    const handleDeleteCard = async (id: number) => {
        if (!window.confirm("Remove this card?")) return;
        try {
            await deleteCardApi(id);
            setCards(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete card");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await updateCardApi(id, { is_default: true });
            // Refresh to update UI state for all cards
            const data = await getCardsApi();
            setCards(data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- SUBSCRIPTION ACTIONS ---
    const handleSubAction = async (id: number, action: 'pause' | 'resume' | 'cancel') => {
        const confirmMsg = action === 'cancel' 
            ? "Are you sure you want to cancel? You will lose access at the end of the billing period." 
            : `Confirm to ${action} this subscription?`;
            
        if (!window.confirm(confirmMsg)) return;

        try {
            await subscriptionActionApi(id, action);
            setSubscriptions(prev => prev.map(sub => {
                if (sub.id === id) {
                    let newStatus = sub.status;
                    if (action === 'pause') newStatus = 'paused';
                    if (action === 'resume') newStatus = 'active';
                    if (action === 'cancel') newStatus = 'cancelled';
                    return { ...sub, status: newStatus as any };
                }
                return sub;
            }));
        } catch (err) {
            alert(`Failed to ${action} subscription`);
        }
    };

    // --- REFUND ACTIONS ---
    const handleSubmitRefund = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRefundRequestApi({ ...newRefund, amount: parseFloat(newRefund.amount) });
            alert("Refund request submitted successfully.");
            setShowRefundForm(false);
            setNewRefund({ order_id: '', product_name: '', seller_name: '', amount: '', reason: '' });
            const data = await getMyRefundsApi(); // Refresh
            setRefunds(data);
        } catch (err) {
            alert("Failed to submit refund request.");
        }
    };

    // --- HELPERS ---
    const getCardIcon = (type: string) => <div className="font-bold uppercase tracking-wider text-xs">{type}</div>;
    
    const getStatusBadge = (status: string) => {
        const styles: any = {
            active: "bg-green-100 text-green-700 border-green-200",
            paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
            cancelled: "bg-gray-100 text-gray-500 border-gray-200",
            payment_failed: "bg-red-100 text-red-700 border-red-200",
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            approved: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            escalated: "bg-purple-100 text-purple-700 border-purple-200"
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status]}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-white-50 font-sans text-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 dark:text-white">
                        <CreditCard className="h-8 w-8 text-indigo-600" />
                        Billing & Subscriptions
                    </h1>
                    <p className="text-gray-500 mt-2 dark:text-white">Manage your saved payment methods, recurring orders, and refund requests.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit overflow-x-auto">
                    {['methods', 'subscriptions', 'refunds'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab === 'methods' ? 'Saved Cards' : tab === 'subscriptions' ? 'Recurring Orders' : 'Refund Requests'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600"/></div>
                ) : (
                    <>
                        {/* --- CARDS TAB --- */}
                        {activeTab === 'methods' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                                {cards.map(card => (
                                    <div key={card.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative group overflow-hidden">
                                        <div className="relative z-10 flex flex-col h-48 justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded border border-white/20">
                                                    {getCardIcon(card.type)}
                                                </div>
                                                {card.is_default && <span className="text-[10px] font-bold uppercase bg-indigo-500 px-2 py-0.5 rounded text-white shadow-sm">Default</span>}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-2xl font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
                                                <div className="flex justify-between items-end mt-4">
                                                    <div><p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Holder</p><p className="text-sm font-medium">{card.holder_name}</p></div>
                                                    <div><p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Expires</p><p className="text-sm font-medium">{card.expiry}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                                            {!card.is_default && (
                                                <button onClick={() => handleSetDefault(card.id)} className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100 flex items-center gap-2">
                                                    <Check className="h-4 w-4"/> Set Default
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteCard(card.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex items-center gap-2">
                                                <Trash2 className="h-4 w-4"/> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setShowAddCard(true)} className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all bg-white">
                                    <Plus className="h-10 w-10 mb-2" /><span className="font-bold">Add Payment Method</span>
                                </button>
                            </div>
                        )}

                        {/* --- SUBSCRIPTIONS TAB --- */}
                        {activeTab === 'subscriptions' && (
                            <div className="space-y-4 animate-in fade-in">
                                {subscriptions.map(sub => (
                                    <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className={`h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0 ${sub.product_image || 'bg-gray-100 text-gray-500'}`}>
                                                <Package className="h-8 w-8" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900">{sub.product_name}</h3>
                                                    {getStatusBadge(sub.status)}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500"><Store className="h-3 w-3" /><span>{sub.vendor_name}</span></div>
                                            </div>
                                            <div className="flex gap-8 text-sm md:text-right w-full md:w-auto justify-between md:justify-end">
                                                <div><p className="text-[10px] uppercase font-bold text-gray-400">Amount</p><p className="font-bold text-gray-900">${sub.amount}</p></div>
                                                <div><p className="text-[10px] uppercase font-bold text-gray-400">Next Bill</p><p className="font-medium text-gray-600 flex items-center gap-1"><Calendar className="h-3 w-3" /> {sub.next_billing_date}</p></div>
                                            </div>
                                            <div className="flex gap-2">
                                                {sub.status === 'active' && (
                                                    <button onClick={() => handleSubAction(sub.id, 'pause')} className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Pause">
                                                        <PauseCircle className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {sub.status === 'paused' && (
                                                    <button onClick={() => handleSubAction(sub.id, 'resume')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Resume">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {sub.status !== 'cancelled' && (
                                                    <button onClick={() => handleSubAction(sub.id, 'cancel')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Cancel">
                                                        <XCircle className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {subscriptions.length === 0 && <div className="text-center text-gray-500 py-10">No active subscriptions found.</div>}
                            </div>
                        )}

                        {/* --- REFUNDS TAB --- */}
                        {activeTab === 'refunds' && (
                            <div className="space-y-6 animate-in fade-in">
                                <div className="flex justify-between items-center bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                    <div>
                                        <h3 className="font-bold text-indigo-900">Have an issue with an order?</h3>
                                        <p className="text-sm text-indigo-700 mt-1">Submit a refund request and our team will review it within 24 hours.</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowRefundForm(true)}
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
                                    >
                                        <RefreshCcw className="h-4 w-4" /> Request Refund
                                    </button>
                                </div>
                                {refunds.length === 0 && <div className="text-center text-gray-500 py-10">No refund requests found.</div>}
                                {refunds.map(refund => (
                                    <div key={refund.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900">{refund.product_name}</h3>
                                                    {getStatusBadge(refund.status)}
                                                </div>
                                                <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{refund.order_id}</span></p>
                                                <p className="text-xs text-gray-400 mt-2 bg-gray-50 p-2 rounded block">"{refund.reason}"</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Refund Amount</p>
                                                <p className="font-bold text-xl text-gray-900">${refund.amount.toFixed(2)}</p>
                                                <p className="text-xs text-gray-400 mt-1">{refund.date_requested}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* --- ADD CARD MODAL --- */}
            {showAddCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add New Card</h3>
                            <button onClick={() => setShowAddCard(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Card Holder</label><input required className="w-full border rounded-lg p-2" value={newCard.holder_name} onChange={e => setNewCard({...newCard, holder_name: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Last 4 Digits</label><input required maxLength={4} className="w-full border rounded-lg p-2" value={newCard.last4} onChange={e => setNewCard({...newCard, last4: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Expiry (MM/YY)</label><input required className="w-full border rounded-lg p-2" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} /></div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                <select className="w-full border rounded-lg p-2" value={newCard.type} onChange={e => setNewCard({...newCard, type: e.target.value as any})}>
                                    <option value="visa">Visa</option>
                                    <option value="mastercard">Mastercard</option>
                                    <option value="amex">Amex</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Save Card</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- REFUND MODAL --- */}
            {showRefundForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">New Refund Request</h3>
                            <button onClick={() => setShowRefundForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSubmitRefund} className="p-6 space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order ID</label><input required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newRefund.order_id} onChange={e => setNewRefund({...newRefund, order_id: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label><input required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newRefund.product_name} onChange={e => setNewRefund({...newRefund, product_name: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Seller Name</label><input required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newRefund.seller_name} onChange={e => setNewRefund({...newRefund, seller_name: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount ($)</label><input type="number" step="0.01" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={newRefund.amount} onChange={e => setNewRefund({...newRefund, amount: e.target.value})} /></div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason</label><textarea required className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none" value={newRefund.reason} onChange={e => setNewRefund({...newRefund, reason: e.target.value})} /></div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Send className="h-4 w-4" /> Submit Request</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}