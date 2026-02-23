import { useState } from "react";
import { 
    Package, 
    Truck, 
    CheckCircle, 
    Clock, 
    MapPin, 
    FileText, 
    ChevronRight, 
    AlertCircle,
    Copy,
    Phone,
    MessageSquare,
    Box,
    
} from "lucide-react";

// --- TYPES ---
interface TrackingEvent {
    status: string;
    location: string;
    timestamp: string;
    icon: 'processed' | 'shipped' | 'out_for_delivery' | 'delivered';
}

interface OrderItem {
    id: string;
    name: string;
    variant: string;
    image: string;
    quantity: number;
    price: number;
}

interface Shipment {
    id: string;
    vendor_name: string;
    status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
    carrier: string;
    tracking_number: string;
    estimated_delivery: string;
    items: OrderItem[];
    events: TrackingEvent[];
}

interface OrderDetails {
    order_id: string;
    placed_on: string;
    total_amount: number;
    shipping_address: string;
    payment_method: string;
    shipments: Shipment[];
}

export default function UserOrderTracking() {
    // --- STATE ---
    const [isDarkMode, setIsDarkMode] = useState(false);

    // --- MOCK DATA ---
    const [order] = useState<OrderDetails>({
        order_id: "ORD-2025-8821",
        placed_on: "Feb 6, 2026",
        total_amount: 459.50,
        shipping_address: "123 Innovation Dr, Tech City, CA 94000",
        payment_method: "Visa ending in 4242",
        shipments: [
            {
                id: "SHP-001",
                vendor_name: "TechGadgets Inc",
                status: 'out_for_delivery',
                carrier: "FedEx Express",
                tracking_number: "1Z999AA10123456784",
                estimated_delivery: "Today by 8:00 PM",
                items: [
                    { id: "1", name: "Sony WH-1000XM5", variant: "Midnight Blue", quantity: 1, price: 348.00, image: "" },
                    { id: "2", name: "USB-C Fast Charger", variant: "White / 30W", quantity: 1, price: 25.00, image: "" }
                ],
                events: [
                    { status: "Out for Delivery", location: "Tech City, CA", timestamp: "Feb 8, 08:30 AM", icon: 'out_for_delivery' },
                    { status: "Arrived at Local Facility", location: "Tech City, CA", timestamp: "Feb 8, 04:15 AM", icon: 'shipped' },
                    { status: "Departed FedEx Hub", location: "Memphis, TN", timestamp: "Feb 7, 11:00 PM", icon: 'shipped' },
                    { status: "Package Received by Carrier", location: "Austin, TX", timestamp: "Feb 7, 02:00 PM", icon: 'processed' }
                ]
            },
            {
                id: "SHP-002",
                vendor_name: "UrbanWear Clothing",
                status: 'processing',
                carrier: "UPS Ground",
                tracking_number: "Pending",
                estimated_delivery: "Feb 12 - Feb 14",
                items: [
                    { id: "3", name: "Essential Cotton Hoodie", variant: "Heather Grey / L", quantity: 2, price: 43.25, image: "" }
                ],
                events: [
                    { status: "Order Confirmed", location: "System", timestamp: "Feb 6, 10:35 AM", icon: 'processed' },
                    { status: "Preparing for Dispatch", location: "Warehouse B", timestamp: "Feb 7, 09:00 AM", icon: 'processed' }
                ]
            }
        ]
    });

    const [activeShipmentId, setActiveShipmentId] = useState<string>(order.shipments[0].id);

    // --- HELPERS ---
    const getStatusStep = (status: string) => {
        switch(status) {
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'out_for_delivery': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    const handleDownloadInvoice = () => {
        alert("Downloading Combined Invoice PDF...");
    };

    const activeShipment = order.shipments.find(s => s.id === activeShipmentId) || order.shipments[0];
    const currentStep = getStatusStep(activeShipment.status);

    return (
        <div className={`${isDarkMode ? 'dark' : ''} min-h-screen transition-colors duration-200`}>
            <div className="min-h-screen bg-white-50 dark:bg-gray-950 p-6 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="max-w-6xl mx-auto">
                    
                    {/* --- HEADER --- */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order {order.order_id}</h1>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200 dark:border-green-800">
                                    Confirmed
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Placed on {order.placed_on} • Total: <span className="font-bold text-gray-900 dark:text-white">${order.total_amount.toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            

                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                                <MessageSquare className="h-4 w-4" /> Need Help?
                            </button>
                            <button 
                                onClick={handleDownloadInvoice}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md transition"
                            >
                                <FileText className="h-4 w-4" /> Download Invoice
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* --- LEFT COLUMN: SHIPMENTS LIST --- */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shipments ({order.shipments.length})</h2>
                            
                            {order.shipments.map(shipment => (
                                <div 
                                    key={shipment.id}
                                    onClick={() => setActiveShipmentId(shipment.id)}
                                    className={`rounded-xl border p-5 cursor-pointer transition-all ${
                                        activeShipmentId === shipment.id 
                                        ? 'bg-white dark:bg-gray-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-1 ring-indigo-600 dark:ring-indigo-500' 
                                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <Package className={`h-5 w-5 ${activeShipmentId === shipment.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{shipment.vendor_name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{shipment.carrier}</p>
                                            </div>
                                        </div>
                                        {shipment.status === 'delivered' ? (
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-1 rounded-full"><CheckCircle className="h-4 w-4" /></span>
                                        ) : (
                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-1 rounded-full"><Truck className="h-4 w-4" /></span>
                                        )}
                                    </div>

                                    {/* Items Preview */}
                                    <div className="flex gap-2 overflow-hidden mb-3">
                                        {shipment.items.map(item => (
                                            <div key={item.id} className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                                                {/* Img Placeholder */}
                                                <Box className="h-6 w-6 text-gray-400 dark:text-gray-500 opacity-50" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-800">
                                        <span className={`text-xs font-bold uppercase ${
                                            shipment.status === 'delivered' ? 'text-green-600 dark:text-green-400' : 
                                            shipment.status === 'out_for_delivery' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {shipment.status.replace(/_/g, " ")}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                    </div>
                                </div>
                            ))}

                            {/* Order Info Card */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mt-8 transition-colors">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Shipping Details</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Delivery Address</p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mt-1">
                                                {order.shipping_address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Contact Info</p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">+1 (555) 019-2834</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: ACTIVE TRACKING DETAILS --- */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* 1. Status Hero Card */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                                {/* Map Placeholder Header */}
                                <div className="h-48 bg-indigo-50 dark:bg-gray-800 relative flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/map-light.png')] opacity-30 dark:opacity-10 dark:invert"></div>
                                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-10 animate-in fade-in zoom-in border border-white/50 dark:border-gray-700">
                                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold text-indigo-900 dark:text-indigo-100 text-sm">
                                            {activeShipment.status === 'out_for_delivery' ? 'Driver is nearby' : activeShipment.estimated_delivery}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{activeShipment.status === 'delivered' ? 'Delivered' : 'Arriving Soon'}</h2>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Est. Delivery: <span className="font-bold text-gray-900 dark:text-white">{activeShipment.estimated_delivery}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Tracking Number</p>
                                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                                <span className="font-mono font-bold">{activeShipment.tracking_number}</span>
                                                <button className="hover:text-indigo-800 dark:hover:text-indigo-200"><Copy className="h-3 w-3" /></button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Stepper */}
                                    <div className="relative mb-12 px-4">
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full"></div>
                                        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${(currentStep - 1) * 33}%` }}></div>
                                        
                                        <div className="relative flex justify-between w-full">
                                            {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                                const stepNum = idx + 1;
                                                const isCompleted = currentStep >= stepNum;
                                                const isCurrent = currentStep === stepNum;
                                                
                                                return (
                                                    <div key={step} className="flex flex-col items-center gap-2">
                                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-4 z-10 transition-colors ${
                                                            isCompleted 
                                                            ? 'bg-green-500 border-green-500 text-white' 
                                                            : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                                                        }`}>
                                                            {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="h-2.5 w-2.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>}
                                                        </div>
                                                        <span className={`text-xs font-bold absolute top-10 w-24 text-center ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Detailed Activity Feed */}
                                    <div className="mt-12 space-y-6 border-l-2 border-gray-100 dark:border-gray-800 ml-4 pl-8 relative">
                                        {activeShipment.events.map((event, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[41px] top-1 h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center">
                                                    <div className={`h-2 w-2 rounded-full ${idx === 0 ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                                    <div>
                                                        <p className={`text-sm font-bold ${idx === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            {event.status}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{event.location}</p>
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                                        {event.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Package Contents */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 transition-colors">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Package Contents</h3>
                                <div className="space-y-4">
                                    {activeShipment.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700">
                                                <Package className="h-8 w-8 opacity-20" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">${item.price.toFixed(2)}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.variant}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}