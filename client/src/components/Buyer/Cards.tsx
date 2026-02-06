import { useState } from "react";
import { 
    CreditCard, 
    Plus, 
    Trash2, 
    MoreHorizontal, 
    Calendar, 
    Store, 
    Package, 
    CheckCircle2, 
    XCircle, 
    PauseCircle, 
    AlertCircle,
    History
} from "lucide-react";

// --- TYPES ---
interface PaymentMethod {
    id: string;
    type: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiry: string;
    is_default: boolean;
    holder_name: string;
}

interface Subscription {
    id: string;
    vendor_name: string;
    product_name: string;
    product_image: string;
    amount: number;
    frequency: 'Weekly' | 'Monthly' | 'Quarterly';
    next_billing_date: string;
    status: 'active' | 'paused' | 'cancelled' | 'payment_failed';
    payment_method_id: string;
}

export default function BillingManagement() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'methods' | 'subscriptions'>('methods');

    // MOCK DATA: CARDS
    const [cards, setCards] = useState<PaymentMethod[]>([
        { id: 'PM-1', type: 'visa', last4: '4242', expiry: '12/28', is_default: true, holder_name: 'John Doe' },
        { id: 'PM-2', type: 'mastercard', last4: '8821', expiry: '09/26', is_default: false, holder_name: 'John Doe' },
    ]);

    // MOCK DATA: SUBSCRIPTIONS
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([
        { 
            id: 'SUB-001', 
            vendor_name: 'BeanRoasters Co.', 
            product_name: 'Premium Coffee Blend (1kg)', 
            product_image: 'bg-amber-100 text-amber-600',
            amount: 28.50, 
            frequency: 'Monthly', 
            next_billing_date: 'Feb 15, 2026', 
            status: 'active',
            payment_method_id: 'PM-1'
        },
        { 
            id: 'SUB-002', 
            vendor_name: 'EcoHome Supplies', 
            product_name: 'Bamboo Paper Towels (6 Pack)', 
            product_image: 'bg-green-100 text-green-600',
            amount: 19.99, 
            frequency: 'Monthly', 
            next_billing_date: 'Feb 22, 2026', 
            status: 'paused',
            payment_method_id: 'PM-1'
        },
        { 
            id: 'SUB-003', 
            vendor_name: 'TechWeekly', 
            product_name: 'Digital Magazine Access', 
            product_image: 'bg-blue-100 text-blue-600',
            amount: 4.99, 
            frequency: 'Weekly', 
            next_billing_date: 'Feb 12, 2026', 
            status: 'payment_failed',
            payment_method_id: 'PM-2'
        }
    ]);

    // --- ACTIONS ---
    const handleDeleteCard = (id: string) => {
        if (window.confirm("Remove this card?")) {
            setCards(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSubscriptionAction = (id: string, action: 'pause' | 'resume' | 'cancel') => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === id) {
                if (action === 'pause') return { ...sub, status: 'paused' };
                if (action === 'resume') return { ...sub, status: 'active' };
                if (action === 'cancel') return { ...sub, status: 'cancelled' };
            }
            return sub;
        }));
    };

    // --- HELPERS ---
    const getCardIcon = (type: string) => {
        // Simple placeholder logic for card brands
        return <div className="font-bold uppercase tracking-wider text-xs">{type}</div>;
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: "bg-green-100 text-green-700 border-green-200",
            paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
            cancelled: "bg-gray-100 text-gray-500 border-gray-200",
            payment_failed: "bg-red-100 text-red-700 border-red-200"
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status as keyof typeof styles]}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* --- HEADER --- */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-indigo-600" />
                        Billing & Subscriptions
                    </h1>
                    <p className="text-gray-500 mt-2">Manage your saved payment methods and recurring orders.</p>
                </div>

                {/* --- TABS --- */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
                    <button
                        onClick={() => setActiveTab('methods')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'methods' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Saved Cards
                    </button>
                    <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'subscriptions' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Recurring Orders
                    </button>
                </div>

                {/* --- TAB CONTENT: PAYMENT METHODS --- */}
                {activeTab === 'methods' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4">
                        {cards.map(card => (
                            <div key={card.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative group overflow-hidden">
                                {/* Decorative Circles */}
                                <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/5 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 h-24 w-24 bg-indigo-500/20 rounded-full blur-xl"></div>

                                <div className="relative z-10 flex flex-col h-full justify-between h-48">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded border border-white/20">
                                            {getCardIcon(card.type)}
                                        </div>
                                        {card.is_default && (
                                            <span className="text-[10px] font-bold uppercase bg-indigo-500 px-2 py-0.5 rounded text-white shadow-sm">Default</span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-2xl font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Card Holder</p>
                                                <p className="text-sm font-medium">{card.holder_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Expires</p>
                                                <p className="text-sm font-medium">{card.expiry}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                                    <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-gray-100">Edit</button>
                                    {!card.is_default && (
                                        <button 
                                            onClick={() => handleDeleteCard(card.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add New Card Button */}
                        <button className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all bg-white">
                            <Plus className="h-10 w-10 mb-2" />
                            <span className="font-bold">Add Payment Method</span>
                        </button>
                    </div>
                )}

                {/* --- TAB CONTENT: SUBSCRIPTIONS --- */}
                {activeTab === 'subscriptions' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    
                                    {/* Product Image Placeholder */}
                                    <div className={`h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0 ${sub.product_image}`}>
                                        <Package className="h-8 w-8" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900">{sub.product_name}</h3>
                                            {getStatusBadge(sub.status)}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Store className="h-3 w-3" />
                                            <span>{sub.vendor_name}</span>
                                        </div>
                                        
                                        {/* Status Alert for Failed Payment */}
                                        {sub.status === 'payment_failed' && (
                                            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg w-fit">
                                                <AlertCircle className="h-4 w-4" />
                                                Payment failed. Please update your card.
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Grid */}
                                    <div className="flex gap-8 text-sm md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400">Frequency</p>
                                            <p className="font-bold text-gray-700">{sub.frequency}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400">Amount</p>
                                            <p className="font-bold text-gray-900">${sub.amount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400">Next Bill</p>
                                            <p className="font-medium text-gray-600 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {sub.next_billing_date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions Dropdown (Simulated) */}
                                    <div className="flex gap-2">
                                        {sub.status === 'active' ? (
                                            <button 
                                                onClick={() => handleSubscriptionAction(sub.id, 'pause')}
                                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition" 
                                                title="Pause Subscription"
                                            >
                                                <PauseCircle className="h-5 w-5" />
                                            </button>
                                        ) : sub.status === 'paused' ? (
                                            <button 
                                                onClick={() => handleSubscriptionAction(sub.id, 'resume')}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" 
                                                title="Resume Subscription"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </button>
                                        ) : null}
                                        
                                        {sub.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleSubscriptionAction(sub.id, 'cancel')}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                                                title="Cancel Subscription"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        )}
                                        
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                            <History className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}