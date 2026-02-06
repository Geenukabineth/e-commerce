import { useState } from "react";
import { 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    Search, 
    Filter, 
    Printer, 
    Mail, 
    MoreVertical, 
    CreditCard,
    MapPin,
    User,
    ShieldAlert,
    Send,
    ChevronRight,
    Copy
} from "lucide-react";

// --- TYPES ---
interface OrderItem {
    id: string;
    name: string;
    variant: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
}

interface TimelineEvent {
    status: string;
    date: string;
    completed: boolean;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'on_hold';
    paymentStatus: 'paid' | 'pending' | 'refunded';
    total: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        ltv: number; // Lifetime Value
        risk_score: 'low' | 'medium' | 'high';
        orders_count: number;
    };
    items: OrderItem[];
    timeline: TimelineEvent[];
    notes: string;
}

export default function SmartOrderCommandCenter() {
    // --- STATE ---
    const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-001');
    const [activeTab, setActiveTab] = useState<'open' | 'shipped' | 'issues'>('open');

    // --- MOCK DATA ---
    const orders: Order[] = [
        {
            id: 'ORD-001',
            orderNumber: '#WEB-8821',
            date: 'Just now',
            status: 'processing',
            paymentStatus: 'paid',
            total: 249.00,
            customer: {
                name: "Alex Morgan",
                email: "alex.m@example.com",
                phone: "+1 (555) 012-3456",
                address: "123 Innovation Dr, Suite 400",
                city: "San Francisco, CA",
                country: "USA",
                ltv: 1250.00,
                risk_score: 'low',
                orders_count: 5
            },
            items: [
                { id: '1', name: "Noise Cancelling Headphones", variant: "Matte Black", sku: "NC-HP-01", quantity: 1, price: 249.00, image: "" }
            ],
            timeline: [
                { status: 'Order Placed', date: 'Feb 6, 10:30 AM', completed: true },
                { status: 'Payment Confirmed', date: 'Feb 6, 10:31 AM', completed: true },
                { status: 'Processing', date: 'In Progress', completed: true },
                { status: 'Shipped', date: 'Pending', completed: false },
                { status: 'Delivered', date: 'Pending', completed: false },
            ],
            notes: "Customer requested discreet packaging."
        },
        {
            id: 'ORD-002',
            orderNumber: '#WEB-8820',
            date: '2 hrs ago',
            status: 'on_hold',
            paymentStatus: 'pending',
            total: 85.50,
            customer: {
                name: "Sarah Connors",
                email: "s.connors@skynet.net",
                phone: "+1 (555) 999-8888",
                address: "45 Future Lane",
                city: "Austin, TX",
                country: "USA",
                ltv: 85.50,
                risk_score: 'high',
                orders_count: 1
            },
            items: [
                { id: '2', name: "Mechanical Keyboard Switch Set", variant: "Cherry MX Red", sku: "SW-RED-100", quantity: 1, price: 65.00, image: "" },
                { id: '3', name: "Keycap Puller", variant: "Steel", sku: "ACC-KP-01", quantity: 1, price: 20.50, image: "" }
            ],
            timeline: [
                { status: 'Order Placed', date: 'Feb 6, 08:15 AM', completed: true },
                { status: 'Payment Pending', date: 'Action Required', completed: false },
            ],
            notes: "Address verification failed. Waiting for customer reply."
        },
        {
            id: 'ORD-003',
            orderNumber: '#WEB-8819',
            date: '5 hrs ago',
            status: 'shipped',
            paymentStatus: 'paid',
            total: 1200.00,
            customer: {
                name: "Enterprise Corp",
                email: "purchasing@enterprise.co",
                phone: "+44 20 7123 4567",
                address: "88 Business Park",
                city: "London",
                country: "UK",
                ltv: 45000.00,
                risk_score: 'low',
                orders_count: 42
            },
            items: [
                { id: '4', name: "Office Chair Ergonomic", variant: "Grey Mesh", sku: "FURN-CH-02", quantity: 4, price: 300.00, image: "" }
            ],
            timeline: [
                { status: 'Order Placed', date: 'Feb 5', completed: true },
                { status: 'Shipped', date: 'Feb 6, 09:00 AM', completed: true },
            ],
            notes: "Priority shipping applied."
        }
    ];

    const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

    // --- SUB-COMPONENTS ---
    
    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            processing: "bg-blue-100 text-blue-700 border-blue-200",
            shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
            delivered: "bg-green-100 text-green-700 border-green-200",
            on_hold: "bg-yellow-100 text-yellow-700 border-yellow-200",
            cancelled: "bg-red-100 text-red-700 border-red-200"
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            
            {/* --- LEFT SIDEBAR: ORDER LIST (30%) --- */}
            <div className="w-96 flex flex-col bg-white border-r border-gray-200 shadow-sm z-10">
                {/* Header & Filter */}
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Package className="h-6 w-6 text-indigo-600" /> Dispatch Hub
                    </h2>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        {['open', 'shipped', 'issues'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-md transition-all ${
                                    activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto">
                    {orders.map(order => (
                        <div 
                            key={order.id}
                            onClick={() => setSelectedOrderId(order.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 group ${
                                selectedOrderId === order.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm ${selectedOrderId === order.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                    {order.orderNumber}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">{order.date}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 truncate max-w-[140px]">{order.customer.name}</span>
                                <span className="font-bold text-sm text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={order.status} />
                                {order.customer.risk_score === 'high' && (
                                    <span className="text-[10px] flex items-center gap-1 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                        <AlertTriangle className="h-3 w-3" /> High Risk
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT PANEL: ORDER DETAIL (70%) --- */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                
                {/* Detail Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{selectedOrder.orderNumber}</h1>
                            <StatusBadge status={selectedOrder.status} />
                            {selectedOrder.paymentStatus === 'paid' ? (
                                <span className="text-xs font-bold text-green-700 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    <CreditCard className="h-3 w-3" /> Paid
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-yellow-700 flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                                    <Clock className="h-3 w-3" /> Unpaid
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Placed on {selectedOrder.timeline[0].date} via Online Store</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50">
                            <Printer className="h-4 w-4" /> Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 shadow-md">
                            <Truck className="h-4 w-4" /> Fulfill Items
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Detail Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">
                        
                        {/* COLUMN 1: ITEMS & PAYMENT (2/3 width) */}
                        <div className="col-span-2 space-y-6">
                            
                            {/* Items Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-gray-900">Order Items ({selectedOrder.items.length})</h3>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline">Edit Order</button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {selectedOrder.items.map(item => (
                                        <div key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                                            <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                                                {/* Placeholder for img */}
                                                <Package className="h-8 w-8 opacity-20" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                                    <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{item.variant} • SKU: {item.sku}</p>
                                                <p className="text-xs text-gray-900 mt-2 font-medium">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${(selectedOrder.total * 0.9).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Shipping</span>
                                        <span>${(selectedOrder.total * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                                        <span>Total</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-bold text-gray-900 mb-6">Fulfillment Timeline</h3>
                                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                                    {selectedOrder.timeline.map((event, idx) => (
                                        <div key={idx} className="relative">
                                            <div className={`absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-white ring-1 ${event.completed ? 'bg-indigo-600 ring-indigo-600' : 'bg-gray-200 ring-gray-300'}`}></div>
                                            <p className={`text-sm font-bold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>{event.status}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Internal Notes */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Internal Notes</h3>
                                    <span className="text-xs text-gray-400">Only visible to team</span>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex gap-2">
                                    <div className="mt-0.5"><Clock className="h-4 w-4"/></div>
                                    <p>{selectedOrder.notes}</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <input type="text" placeholder="Add a new note..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg">
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: CUSTOMER & SIDE ACTIONS (1/3 width) */}
                        <div className="space-y-6">
                            
                            {/* Customer Profile Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-gray-900">Customer</h3>
                                        <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            {selectedOrder.customer.name.charAt(0)}
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 mb-1">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-indigo-600 mb-1 hover:underline cursor-pointer">{selectedOrder.customer.orders_count} orders</p>
                                    
                                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="truncate">{selectedOrder.customer.email}</span>
                                        <Copy className="h-3 w-3 text-gray-300 cursor-pointer hover:text-gray-500" />
                                    </div>
                                </div>
                                
                                {/* Smart Insights */}
                                <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Lifetime Value</p>
                                        <p className="text-sm font-bold text-gray-900">${selectedOrder.customer.ltv.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Risk Score</p>
                                        <p className={`text-sm font-bold flex items-center gap-1 ${selectedOrder.customer.risk_score === 'high' ? 'text-red-600' : 'text-green-600'}`}>
                                            {selectedOrder.customer.risk_score === 'high' ? <ShieldAlert className="h-3 w-3"/> : <CheckCircle2 className="h-3 w-3"/>}
                                            {selectedOrder.customer.risk_score.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase">Shipping Address</h4>
                                        <button className="text-indigo-600 hover:text-indigo-700">
                                            <MapPin className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600 leading-relaxed">
                                        <p>{selectedOrder.customer.name}</p>
                                        <p>{selectedOrder.customer.address}</p>
                                        <p>{selectedOrder.customer.city}</p>
                                        <p>{selectedOrder.customer.country}</p>
                                        <p className="mt-2 text-gray-500">{selectedOrder.customer.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <h3 className="font-bold text-gray-900 mb-4 text-sm">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between group">
                                        <span>Send email confirmation</span>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600" />
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between group">
                                        <span>Duplicate order</span>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600" />
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-between group">
                                        <span>Cancel & Refund</span>
                                        <ChevronRight className="h-4 w-4 text-red-300 group-hover:text-red-600" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}