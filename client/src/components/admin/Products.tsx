import { useEffect, useState } from "react";
import { 
    getAdminProductsApi, 
    approveProductApi, 
    rejectProductApi,
    analyzeProductApi // Ensure this is exported from your auth.Productapi.ts
} from "../../auth/auth.Productapi";
import type { Product } from "../../auth/auth.types";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Line, ComposedChart, Cell 
} from 'recharts';

// --- Interfaces for AI & Market Analysis ---
interface MarketPrice {
    site: string;
    price: number;
    url: string;
}

interface AIAnalysis {
    visualMatchConfidence: number;
    detectedCategory: string;
    marketAverage: number;
    competitorPrices: MarketPrice[];
    mlDemandForecast: number;
    globalInterest: 'upward' | 'downward' | 'stable';
    interestGrowth: number; 
    demandTrend: { month: string; score: number; marketAvg: number }[];
}

export default function ProductApproval() {
    // --- STATE ---
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    // UI State
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    
    // Evaluation State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<AIAnalysis | null>(null);

    // --- FETCH DATA ---
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

    // --- REAL API ANALYSIS LOGIC ---
    const runProductAnalysis = async (product: Product) => {
        if (!product.id) return;

        setIsAnalyzing(true);
        setAnalysisData(null); // Clear previous data

        try {
            // CALL THE REAL DJANGO ENDPOINT
            // This returns data matching the AIAnalysis interface
            const result = await analyzeProductApi(product.id);
            setAnalysisData(result);
            
        } catch (err) {
            console.error("Analysis failed", err);
            // Optional: fallback to mock data if API fails during demo
            // setAnalysisData(mockFallbackData); 
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Trigger analysis automatically when modal opens
    useEffect(() => {
        if (selectedProduct) {
            runProductAnalysis(selectedProduct);
        } else {
            setAnalysisData(null);
        }
    }, [selectedProduct]);

    const filteredProducts = allProducts.filter(product => product.status === activeTab);

    // --- HELPER: Calculate Market Parity ---
    const getPriceParity = () => {
        if (!selectedProduct || !analysisData) return 0;
        return (Number(selectedProduct.price) / analysisData.marketAverage) * 100;
    };

    // --- ACTIONS ---
    const handleMenuAction = async (action: 'approve' | 'reject' | 'view', product: Product) => {
        setOpenMenuId(null); 
        if (action === 'view') {
            setSelectedProduct(product);
            return;
        }
        if (action === 'approve' && product.id) {
            if(!window.confirm("Quick Approve this product?")) return;
            await approveProductApi(product.id, 50); // Default score for quick approve
            fetchProducts();
        }
        if (action === 'reject' && product.id) {
            if(!window.confirm("Reject this product?")) return;
            await rejectProductApi(product.id);
            fetchProducts();
        }
    };

    const handleModalApprove = async () => {
        if (!selectedProduct?.id) return;
        // Use the ML Forecast score from the backend
        const finalScore = analysisData?.mlDemandForecast || 50;
        await approveProductApi(selectedProduct.id, finalScore);
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
                <p className="text-gray-500 mt-1">Cross-reference seller listings with Global Market Data & ML.</p>
            </div>

            {/* TABS */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                {['pending', 'approved', 'rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={(e) => { e.stopPropagation(); setActiveTab(tab as any); }}
                        className={`pb-3 text-sm font-bold capitalize transition-colors border-b-2 ${
                            activeTab === tab 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                    >
                        {tab} Listings
                    </button>
                ))}
            </div>

            {/* TABLE VIEW */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible min-h-[300px]">
                {loading ? (
                    <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Fetching inventory data...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No {activeTab} products found.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Seller</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-indigo-50/30 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                className="h-12 w-12 rounded-lg object-cover border bg-white" 
                                                src={product.img ? `http://127.0.0.1:8000${product.img}` : '/placeholder.png'} 
                                                alt="" 
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-400">{product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {product.seller_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-emerald-600">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === product.id ? null : product.id!); }}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        </button>

                                        {openMenuId === product.id && (
                                            <div className="absolute right-10 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                                                <button onClick={(e) => { e.stopPropagation(); handleMenuAction('view', product); }} className="w-full text-left px-4 py-3 text-sm text-indigo-700 font-bold hover:bg-indigo-50 border-b">
                                                    Open AI Evaluation
                                                </button>
                                                {activeTab === 'pending' && (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('approve', product); }} className="w-full text-left px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50">Quick Approve</button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleMenuAction('reject', product); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50">Reject Listing</button>
                                                    </>
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

            {/* --- ADVANCED EVALUATION MODAL --- */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
                        
                        {/* LEFT: Product Meta & Parity */}
                        <div className="md:w-1/3 bg-gray-50 border-r border-gray-100 p-8 flex flex-col overflow-y-auto">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-center">
                                <img 
                                    src={selectedProduct.img ? `http://127.0.0.1:8000${selectedProduct.img}` : '/placeholder.png'} 
                                    className="max-h-64 object-contain" 
                                    alt="Product" 
                                />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                            <p className="text-3xl font-black text-emerald-600 mt-2">${selectedProduct.price}</p>
                            <p className="text-gray-500 text-sm mt-4 leading-relaxed">{selectedProduct.description}</p>
                            
                            {/* Market Parity Box */}
                            {analysisData && (
                                <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Market Price Parity</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className={`text-3xl font-black ${getPriceParity() > 105 ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {getPriceParity().toFixed(1)}%
                                        </p>
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 mt-2">
                                        {getPriceParity() > 100 
                                            ? `Listing is higher than market avg ($${analysisData.marketAverage.toFixed(2)})` 
                                            : `Competitive pricing vs market avg ($${analysisData.marketAverage.toFixed(2)})`}
                                    </p>
                                </div>
                            )}

                            <div className="mt-auto pt-6 border-t border-gray-200">
                                <span className="text-xs font-bold text-gray-400 uppercase">Submitted By</span>
                                <p className="font-medium text-gray-900">{selectedProduct.seller_name}</p>
                            </div>
                        </div>

                        {/* RIGHT: AI, Charts, & Adjustments */}
                        <div className="md:w-2/3 p-10 flex flex-col bg-white overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-indigo-900">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs">AI</span>
                                    Market Intelligence Report
                                </h3>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-900 text-3xl transition">&times;</button>
                            </div>

                            {isAnalyzing ? (
                                <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium animate-pulse">Running ML prediction models & scanning global web...</p>
                                </div>
                            ) : analysisData && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    
                                    {/* Intel Top Row (Global Interest & Vision) */}
                                    <div className="grid grid-cols-2 gap-6">
                                        
                                        {/* Global Trend Box */}
                                        <div className={`p-6 rounded-2xl border-2 ${analysisData.globalInterest === 'upward' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Global Market Interest</p>
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${analysisData.globalInterest === 'upward' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {analysisData.globalInterest === 'upward' 
                                                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />}
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className={`text-3xl font-black ${analysisData.globalInterest === 'upward' ? 'text-emerald-700' : 'text-red-700'}`}>
                                                        {analysisData.globalInterest === 'upward' ? '+' : '-'}{analysisData.interestGrowth}%
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-500">Trending {analysisData.globalInterest}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vision Box */}
                                        <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Visual Match Confidence</p>
                                            <p className="text-4xl font-black text-indigo-900">{(analysisData.visualMatchConfidence * 100).toFixed(0)}%</p>
                                            <div className="w-full bg-indigo-200 h-2 rounded-full mt-4">
                                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${analysisData.visualMatchConfidence * 100}%` }}></div>
                                            </div>
                                            <p className="text-xs font-bold text-indigo-600 mt-2">Predicted: {analysisData.detectedCategory}</p>
                                        </div>
                                    </div>

                                    {/* Composed Chart Section */}
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Historical Demand vs Market Avg Price</h4>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={analysisData.demandTrend}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                    <Tooltip 
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Bar dataKey="score" name="Demand Score" radius={[6, 6, 0, 0]} barSize={40}>
                                                        {analysisData.demandTrend.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#4f46e5' : '#a5b4fc'} />
                                                        ))}
                                                    </Bar>
                                                    <Line type="monotone" dataKey="marketAvg" name="Avg Market Price ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Competitor Price Comparison (Replaces Manual Slider) */}
                                    <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
                                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-5">Competitor Price Analysis</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            
                                            {/* Current Product Card */}
                                            <div className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50 flex flex-col items-center justify-center text-center">
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Your Listing</span>
                                                <span className="text-xl font-black text-indigo-900 mt-1">${selectedProduct.price}</span>
                                            </div>

                                            {/* Competitor Cards */}
                                            {analysisData.competitorPrices.map((comp, idx) => {
                                                const isCheaper = comp.price < Number(selectedProduct.price);
                                                return (
                                                    <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition flex flex-col items-center justify-center text-center">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{comp.site}</span>
                                                        <span className="text-xl font-black text-gray-800 mt-1">${comp.price}</span>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded mt-2 uppercase ${
                                                            !isCheaper 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            {isCheaper ? 'Cheaper' : 'Higher'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="pt-4 border-t border-gray-100 flex gap-4">
                                        <button 
                                            onClick={handleModalReject} 
                                            className="flex-1 px-6 py-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition"
                                        >
                                            Reject Listing
                                        </button>
                                        <button 
                                            onClick={handleModalApprove} 
                                            className="flex-[2] px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl transition transform hover:-translate-y-1"
                                        >
                                            Confirm & Publish to Catalog
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}