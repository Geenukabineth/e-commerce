import { useState } from "react";
import { 
    Bell, 
    CheckCheck, 
    Trash2, 
    Package, 
    CreditCard, 
    ShieldAlert, 
    Info, 
    Filter, 
    Search
} from "lucide-react";

// --- TYPES ---
interface NotificationItem {
    id: number;
    type: 'order' | 'finance' | 'security' | 'system';
    title: string;
    description: string;
    time: string;
    unread: boolean;
}

export default function NotificationsPage() {
    // --- STATE ---
    const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'finance'>('all');
    
    // Mock Data (Expanded from App.tsx)
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: 1, type: 'order', title: "New Order #ORD-221", description: "John Doe placed an order for 'Wireless Headphones'.", time: "2 mins ago", unread: true },
        { id: 2, type: 'finance', title: "Payout Processed", description: "$500.00 has been sent to your bank account ending in **4455.", time: "1 hour ago", unread: true },
        { id: 3, type: 'security', title: "New Login Detected", description: "A new login from Chrome on Windows (New York, USA).", time: "3 hours ago", unread: true },
        { id: 4, type: 'system', title: "System Maintenance", description: "Scheduled maintenance will occur tonight at 2:00 AM UTC.", time: "5 hours ago", unread: false },
        { id: 5, type: 'order', title: "Order Delivered", description: "Order #ORD-199 has been delivered to the customer.", time: "1 day ago", unread: false },
        { id: 6, type: 'finance', title: "Monthly Invoice Available", description: "Your platform fee invoice for January is ready for download.", time: "2 days ago", unread: false },
    ]);

    // --- COMPUTED ---
    const filteredList = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return n.unread;
        return n.type === filter;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    // --- ACTIONS ---
    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    // Helper for Icons
    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <Package className="h-5 w-5 text-indigo-600" />;
            case 'finance': return <CreditCard className="h-5 w-5 text-green-600" />;
            case 'security': return <ShieldAlert className="h-5 w-5 text-red-600" />;
            default: return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated on your orders, payouts, and account security.</p>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                    >
                        <CheckCheck className="h-4 w-4 text-green-600" /> Mark all read
                    </button>
                </div>
            </div>

            {/* --- FILTERS & LIST --- */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                {/* Filter Bar */}
                <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                    <FilterTab label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                    <FilterTab label="Unread" active={filter === 'unread'} onClick={() => setFilter('unread')} count={unreadCount} />
                    <FilterTab label="Orders" active={filter === 'order'} onClick={() => setFilter('order')} />
                    <FilterTab label="Finance" active={filter === 'finance'} onClick={() => setFilter('finance')} />
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredList.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                            <p>No notifications found.</p>
                        </div>
                    ) : (
                        filteredList.map((notif) => (
                            <div 
                                key={notif.id} 
                                onClick={() => markAsRead(notif.id)}
                                className={`group p-5 flex gap-4 transition-colors cursor-pointer ${
                                    notif.unread 
                                    ? 'bg-indigo-50/40 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                }`}
                            >
                                {/* Icon */}
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                                    notif.unread ? 'bg-white dark:bg-gray-700 shadow-sm' : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                    {getIcon(notif.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm font-bold ${notif.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                    </div>
                                    <p className={`text-sm mt-1 ${notif.unread ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {notif.description}
                                    </p>
                                </div>

                                {/* Actions (Show on hover) */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {notif.unread && (
                                        <button 
                                            title="Mark as read"
                                            onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-indigo-600 dark:text-indigo-400"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                        </button>
                                    )}
                                    <button 
                                        title="Delete"
                                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENT ---
function FilterTab({ label, active, onClick, count }: { label: string, active: boolean, onClick: () => void, count?: number }) {
    return (
        <button 
            onClick={onClick}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                active 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
            {label}
            {count !== undefined && count > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    active ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                    {count}
                </span>
            )}
        </button>
    );
}