import { useEffect, useState } from "react";
import { 
    getAdminProductsApi, 
    approveProductApi, 
    rejectProductApi 
} from "../../auth/auth.Productapi";
import type { Product } from "../../auth/auth.types";

export default function ProductApproval() {
    // STATE
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Stores everything from server
    const [loading, setLoading] = useState(false);
    
    // UI State
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    
    // Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [demandLevel, setDemandLevel] = useState(50);

    // Fetch ALL products from the server
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getAdminProductsApi(); 
            setAllProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchProducts();
    }, []);

    // --- FILTERING LOGIC ---
    // Since backend returns .all(), we filter here based on the tab
    const filteredProducts = allProducts.filter(product => {
        if (activeTab === 'pending') return product.status === 'pending';
        if (activeTab === 'approved') return product.status === 'approved';
        if (activeTab === 'rejected') return product.status === 'rejected';
        return false;
    });

    // --- ACTIONS ---

    const handleMenuAction = async (action: 'approve' | 'reject' | 'view', product: Product) => {
        setOpenMenuId(null); 

        if (action === 'view') {
            setSelectedProduct(product);
            return;
        }

        if (action === 'approve') {
            if (!product.id) return;
            if(!window.confirm("Approve this product?")) return;
            await approveProductApi(product.id, 50);
            fetchProducts(); // Refresh list to move item to 'approved' tab
        }

        if (action === 'reject') {
            if (!product.id) return;
            if(!window.confirm("Reject this product?")) return;
            await rejectProductApi(product.id);
            fetchProducts(); // Refresh list to move item to 'rejected' tab
        }
    };

    const handleModalApprove = async () => {
        if (!selectedProduct?.id) return;
        await approveProductApi(selectedProduct.id, demandLevel);
        setSelectedProduct(null);
        fetchProducts();
    };

    const handleModalReject = async () => {
        if (!selectedProduct?.id) return;
        await rejectProductApi(selectedProduct.id);
        setSelectedProduct(null);
        fetchProducts();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen" onClick={() => setOpenMenuId(null)}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Product Approval Queue</h1>
                <p className="text-gray-500 mt-1">Manage seller submissions.</p>
            </div>

            {/* --- TABS --- */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                {['pending', 'approved', 'rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={(e) => { e.stopPropagation(); setActiveTab(tab as any); }}
                        className={`pb-3 text-sm font-bold capitalize transition-colors border-b-2 ${
                            activeTab === tab 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab} Products
                    </button>
                ))}
            </div>

            {/* --- TABLE VIEW --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No {activeTab} products found.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Seller</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img 
                                                    className="h-10 w-10 rounded-lg object-cover border" 
                                                    src={product.img ? `http://127.0.0.1:8000${product.img}` : '/placeholder.png'} 
                                                    alt="" 
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {product.seller_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${
                                            product.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                        ${product.price}
                                    </td>
                                    
                                    {/* --- 3 DOTS MENU CELL --- */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === product.id ? null : product.id!);
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="1"></circle>
                                                <circle cx="12" cy="5" r="1"></circle>
                                                <circle cx="12" cy="19" r="1"></circle>
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openMenuId === product.id && (
                                            <div className="absolute right-8 top-12 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in duration-100">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleMenuAction('view', product); }}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    View Details
                                                </button>
                                                
                                                {/* Logic to show relevant actions based on status */}
                                                {activeTab === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleMenuAction('approve', product); }}
                                                            className="w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleMenuAction('reject', product); }}
                                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {/* Allow re-evaluating rejected products */}
                                                {activeTab === 'rejected' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleMenuAction('approve', product); }}
                                                        className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                                    >
                                                        Re-Approve
                                                    </button>
                                                )}

                                                 {/* Allow revoking approved products */}
                                                 {activeTab === 'approved' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleMenuAction('reject', product); }}
                                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        Revoke (Reject)
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- MODAL --- */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
                        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
                            <img 
                                src={selectedProduct.img ? `http://127.0.0.1:8000${selectedProduct.img}` : '/placeholder.png'} 
                                className="max-h-full max-w-full object-contain shadow-md rounded-lg" 
                                alt="Preview" 
                            />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Product Evaluation</h2>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                            </div>
                            
                            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                                    <p className="text-gray-500 text-sm mt-2">{selectedProduct.description}</p>
                                    <div className="mt-2 inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                                        Current Status: {selectedProduct.status}
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-700 uppercase mb-3">Market Data</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-blue-500 uppercase font-bold">Internal</p>
                                            <p className="text-xl font-bold text-blue-900">{selectedProduct.internal_interest}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-blue-500 uppercase font-bold">External</p>
                                            <p className="text-xl font-bold text-blue-900 truncate">{selectedProduct.external_interest}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {activeTab === 'pending' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Demand Score ({demandLevel})</label>
                                        <input 
                                            type="range" min="0" max="100" value={demandLevel} 
                                            onChange={(e) => setDemandLevel(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t mt-6 flex gap-4">
                                <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
                                
                                {activeTab === 'pending' && (
                                    <>
                                        <button onClick={handleModalReject} className="flex-1 px-4 py-3 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50">Reject</button>
                                        <button onClick={handleModalApprove} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg">Approve</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}