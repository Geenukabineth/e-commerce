import { useState } from "react";
import { 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    AlertTriangle, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Printer, 
    Download, 
    MessageSquare, 
    X,
    LayoutGrid,
    List,
    ChevronRight,
    MapPin,
    CreditCard
} from "lucide-react";

// --- TYPES ---
type OrderStatus = 'new' | 'processing' | 'ready_to_ship' | 'shipped' | 'delivered' | 'returned';

interface OrderItem {
    name: string;
    variant: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        location: string;
        avatar_color: string;
    };
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    date: string;
    payment_status: 'paid' | 'pending' | 'refunded';
    shipping_method: string;
    sla_status: 'on_track' | 'at_risk' | 'late'; // SLA = Service Level Agreement (Shipping deadline)
}

export default function SellerOrderDashboard() {
    // --- STATE ---
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // --- MOCK DATA ---
    const [orders, setOrders] = useState<Order[]>([
        {
            id: "ORD-7782",
            customer: { name: "Alice Freeman", email: "alice@example.com", phone: "+1 (555) 019-2834", location: "New York, USA", avatar_color: "bg-blue-500" },
            items: [
                { name: "Wireless Pro Headphones", variant: "Black / Noise Cancelling", quantity: 1, price: 299.00, image: "/api/placeholder/50/50" },
            ],
            total: 299.00,
            status: "new",
            date: "2026-02-05 14:30",
            payment_status: "paid",
            shipping_method: "Express (2 Days)",
            sla_status: "on_track"
        },
        {
            id: "ORD-7781",
            customer: { name: "Michael Chen", email: "m.chen@tech.co", phone: "+1 (555) 992-1122", location: "Toronto, CA", avatar_color: "bg-green-500" },
            items: [
                { name: "Ergo Mech Keyboard", variant: "Switch: Red", quantity: 1, price: 145.00, image: "/api/placeholder/50/50" },
                { name: "Desk Mat Large", variant: "Galaxy Print", quantity: 1, price: 25.00, image: "/api/placeholder/50/50" }
            ],
            total: 170.00,
            status: "processing",
            date: "2026-02-05 09:15",
            payment_status: "paid",
            shipping_method: "Standard",
            sla_status: "at_risk"
        },
        {
            id: "ORD-7780",
            customer: { name: "Sarah Jones", email: "s.jones@design.net", phone: "+44 20 7123 4567", location: "London, UK", avatar_color: "bg-purple-500" },
            items: [
                { name: "4K Monitor 27\"", variant: "USB-C Hub", quantity: 2, price: 450.00, image: "/api/placeholder/50/50" }
            ],
            total: 900.00,
            status: "ready_to_ship",
            date: "2026-02-04 18:45",
            payment_status: "paid",
            shipping_method: "DHL Express",
            sla_status: "on_track"
        },
        {
            id: "ORD-7779",
            customer: { name: "David Miller", email: "dave.m@corp.com", phone: "+1 (555) 334-5566", location: "Austin, TX", avatar_color: "bg-yellow-500" },
            items: [
                { name: "USB-C Hub 7-in-1", variant: "Space Grey", quantity: 1, price: 45.00, image: "/api/placeholder/50/50" }
            ],
            total: 45.00,
            status: "new",
            date: "2026-02-05 15:10",
            payment_status: "pending",
            shipping_method: "Standard",
            sla_status: "late"
        },
    ]);

    // --- HELPER FUNCTIONS ---
    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'ready_to_ship': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getSlaBadge = (status: 'on_track' | 'at_risk' | 'late') => {
        switch(status) {
            case 'at_risk': return <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3"/> Risk</span>;
            case 'late': return <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full"><AlertTriangle className="h-3 w-3"/> Late</span>;
            default: return null;
        }
    };

    // --- SUB-COMPONENTS ---
    
    // 1. Kanban Card
    const OrderCard = ({ order }: { order: Order }) => (
        <div 
            onClick={() => setSelectedOrder(order)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-xs font-mono text-gray-500 font-bold">{order.id}</span>
                    <h4 className="font-bold text-gray-900 text-sm mt-0.5">{order.customer.name}</h4>
                </div>
                {getSlaBadge(order.sla_status)}
            </div>
            
            <div className="space-y-2 mb-4">
                {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center font-bold text-[9px] text-gray-400">
                           {/* Placeholder for img */}
                           Img
                        </div>
                        <span className="truncate flex-1">{item.quantity}x {item.name}</span>
                    </div>
                ))}
                {order.items.length > 2 && <p className="text-[10px] text-gray-400 font-bold">+{order.items.length - 2} more items</p>}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900 text-sm">${order.total.toFixed(2)}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">{order.shipping_method}</span>
            </div>
            
            {/* Quick Actions (Hover) */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700" title="Print Label">
                    <Printer className="h-3 w-3" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            
            {/* --- TOP HEADER --- */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-6 w-6 text-indigo-600" /> Order Manager
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            <span className="font-bold text-gray-900">12</span> orders pending shipment • <span className="font-bold text-red-600">1 late</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search order ID, customer..." 
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                            />
                        </div>

                        {/* View Toggles */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm">
                            <Download className="h-4 w-4" /> Export
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {['All Orders', 'Priority', 'Local Pickup', 'International', 'Returns'].map(f => (
                        <button key={f} className="px-3 py-1.5 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 whitespace-nowrap">
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-8 overflow-x-auto">
                
                {/* VIEW: KANBAN BOARD */}
                {viewMode === 'kanban' && (
                    <div className="flex gap-6 min-w-[1200px]">
                        {[
                            { id: 'new', title: 'New Orders', icon: Package, count: 2 },
                            { id: 'processing', title: 'Processing', icon: Clock, count: 1 },
                            { id: 'ready_to_ship', title: 'Ready to Ship', icon: CheckCircle, count: 1 },
                            { id: 'shipped', title: 'In Transit', icon: Truck, count: 0 },
                        ].map(column => (
                            <div key={column.id} className="w-80 flex-shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                        <column.icon className="h-4 w-4 text-gray-400" /> {column.title}
                                    </h3>
                                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{column.count}</span>
                                </div>
                                <div className="space-y-3 min-h-[500px] p-2 -m-2 rounded-xl">
                                    {orders.filter(o => o.status === column.id).map(order => (
                                        <OrderCard key={order.id} order={order} />
                                    ))}
                                    {/* Drop Area Placeholder */}
                                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-wider">
                                        Drop here
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VIEW: LIST TABLE */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                        <td className="px-6 py-4 text-sm font-bold text-indigo-600">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-full ${order.customer.avatar_color} text-white flex items-center justify-center text-xs font-bold`}>
                                                    {order.customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{order.customer.name}</p>
                                                    <p className="text-xs text-gray-500">{order.customer.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">${order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* --- ORDER DETAILS SLIDEOVER / MODAL --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
                        onClick={() => setSelectedOrder(null)}
                    ></div>
                    
                    {/* Slide-over Panel */}
                    <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        
                        {/* Panel Header */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.id}</h2>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.replace(/_/g, " ")}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Placed on {selectedOrder.date}
                                </p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-500 border border-gray-200">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            
                            {/* Workflow Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex flex-col items-center justify-center p-4 border border-indigo-100 bg-indigo-50 rounded-xl text-indigo-700 hover:bg-indigo-100 transition">
                                    <Printer className="h-6 w-6 mb-2" />
                                    <span className="text-xs font-bold">Print Shipping Label</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 bg-white rounded-xl text-gray-700 hover:bg-gray-50 transition">
                                    <FileText className="h-6 w-6 mb-2 text-gray-400" />
                                    <span className="text-xs font-bold">Generate Invoice</span>
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Customer Details</h3>
                                <div className="flex items-start gap-4">
                                    <div className={`h-12 w-12 rounded-full ${selectedOrder.customer.avatar_color} flex items-center justify-center text-white font-bold text-lg`}>
                                        {selectedOrder.customer.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-bold text-gray-900">{selectedOrder.customer.name}</p>
                                        <p className="text-indigo-600 hover:underline cursor-pointer">{selectedOrder.customer.email}</p>
                                        <p className="text-gray-500">{selectedOrder.customer.phone}</p>
                                        <div className="flex items-center gap-1 text-gray-500 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {selectedOrder.customer.location}
                                        </div>
                                    </div>
                                    <button className="ml-auto p-2 text-gray-400 hover:text-indigo-600 border rounded-lg hover:bg-indigo-50">
                                        <MessageSquare className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Order Items ({selectedOrder.items.length})</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-200">
                                                Img
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                                                    <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">{item.variant}</p>
                                                <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-bold text-gray-800">{item.quantity}</span> × ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Totals */}
                                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Shipping ({selectedOrder.shipping_method})</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                        <span>Total</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-bold text-gray-700">Payment Status</span>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                        {selectedOrder.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-white transition shadow-sm">
                                    Cancel Order
                                </button>
                                <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg transition">
                                    Mark as Shipped
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper component for icon
function FileText({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
    );
}