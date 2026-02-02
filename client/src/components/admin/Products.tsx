import { useEffect, useState } from "react";
import { getPendingProductsApi, approveProductApi, rejectProductApi } from "../../auth/auth.Productapi";

interface ProductApplication {
    id: number;
    name: string;
    seller_name: string;
    category: string;
    price: number;
    description: string;
    image_url: string;
    internal_interest: number; // e.g., 0-100 scale based on site searches
    external_interest: string; // e.g., "High", "Trending on Social"
}

export default function ProductApproval() {
    const [products, setProducts] = useState<ProductApplication[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductApplication | null>(null);
    const [demandLevel, setDemandLevel] = useState(50); // Admin slider for manual demand tagging

    const fetchProducts = async () => {
        try {
            const data = await getPendingProductsApi();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleApprove = async (id: number) => {
        await approveProductApi(id, demandLevel);
        setSelectedProduct(null);
        fetchProducts();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Product Approval Queue</h1>
                <p className="text-gray-500 mt-1">Review seller submissions and analyze market demand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold">{product.category}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="text-lg font-bold text-green-600">${product.price}</span>
                                <button 
                                    onClick={() => setSelectedProduct(product)}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                                >
                                    Review & Approve
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Detailed Approval Modal --- */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
                        {/* Left: Product Media */}
                        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center">
                            <img src={selectedProduct.image_url} className="max-h-full object-contain" alt="Preview" />
                        </div>

                        {/* Right: Analysis & Actions */}
                        <div className="md:w-1/2 p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Product Evaluation</h2>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 text-2xl">✕</button>
                            </div>

                            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                                {/* Demand Section */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-700 uppercase mb-3">Market Interest Analysis</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-blue-500 uppercase font-bold">Internal Searches</p>
                                            <p className="text-xl font-bold text-blue-900">{selectedProduct.internal_interest}% <span className="text-xs font-normal italic">match rate</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-blue-500 uppercase font-bold">External Trend</p>
                                            <p className="text-xl font-bold text-blue-900">{selectedProduct.external_interest}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Demand Tagging */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Set Platform Demand Score ({demandLevel})</label>
                                    <input 
                                        type="range" min="0" max="100" value={demandLevel} 
                                        onChange={(e) => setDemandLevel(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 italic">Higher scores boost product visibility in "Recommended" sections.</p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm font-bold text-gray-500 uppercase mb-1">Seller Identity</p>
                                    <p className="text-gray-900 font-medium">{selectedProduct.seller_name}</p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-6 border-t mt-6 flex gap-4">
                                <button 
                                    onClick={() => rejectProductApi(selectedProduct.id)}
                                    className="flex-1 px-6 py-3 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => handleApprove(selectedProduct.id)}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg"
                                >
                                    Approve Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}