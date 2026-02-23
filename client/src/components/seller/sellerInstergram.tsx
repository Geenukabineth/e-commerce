import { useState, useEffect } from "react";
import { 
    TrendingUp, 
    Users, 
    Search, 
    Download, 
    Instagram, 
    Megaphone,
    BarChart3,
    Filter,
    Loader2,
    Tag,
    PlusCircle,
    CheckCircle
} from "lucide-react";

// Import your API functions (You will need to create getMetrics and getPromotions in your auth file)
import { getInfluencers } from "../../auth/auth.sales";

// --- TYPES ---
interface SalesMetric {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
}

interface Influencer {
    handle: string;
    followers: string;
    match_score: number;
    platform: string; 
    bio_snippet: string; 
}

interface Promotion {
    id: number | string;
    product_name: string;
    discount_amount: string;
    duration: string;
    status: string;
}

export default function SalesInstergram() {
    const [activeTab, setActiveTab] = useState<'overview' | 'promotions' | 'influencers'>('overview');
    
    // --- STATE FOR REAL DATA ---
    const [metrics, setMetrics] = useState<SalesMetric[]>([
        // Fallback default data while real data loads
        { label: "Total Revenue", value: "$0", change: "0%", trend: "up" },
        { label: "Active Campaigns", value: "0", change: "0", trend: "up" },
        { label: "Influencer ROI", value: "0%", change: "0%", trend: "up" },
        { label: "Reach", value: "0", change: "0%", trend: "up" },
    ]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // --- INFLUENCER STATE ---
    const [searchCategory, setSearchCategory] = useState('');
    const [searchHashtag, setSearchHashtag] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);

    // --- PROMOTION FORM STATE ---
    const [newProduct, setNewProduct] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [newDuration, setNewDuration] = useState('');
    const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);

    // --- FETCH REAL INITIAL DATA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoadingData(true);
            try {
                // REPLACE THESE WITH YOUR ACTUAL API CALLS
                // const metricsData = await getMetrics();
                // const promoData = await getPromotions();
                // setMetrics(metricsData);
                // setPromotions(promoData);

                // SIMULATED REAL DATA FETCH FOR DEMONSTRATION:
                setTimeout(() => {
                    setMetrics([
                        { label: "Total Revenue", value: "$124,500", change: "+12.5%", trend: "up" },
                        { label: "Active Campaigns", value: "8", change: "+2", trend: "up" },
                        { label: "Influencer ROI", value: "310%", change: "+5.2%", trend: "up" },
                        { label: "Reach", value: "1.2M", change: "+15%", trend: "up" },
                    ]);
                    setPromotions([
                        { id: 1, product_name: "Wireless Earbuds", discount_amount: "20% OFF", duration: "7 Days", status: "active" },
                        { id: 2, product_name: "Yoga Mat", discount_amount: "$10 OFF", duration: "14 Days", status: "active" },
                    ]);
                    setIsLoadingData(false);
                }, 800);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                setIsLoadingData(false);
            }
        };

        fetchDashboardData();
    }, []);

    // --- ACTIONS ---
    const handleAutoFindInfluencers = async () => {
        if (!searchCategory && !searchHashtag) {
            alert("Please enter a category or hashtag to search.");
            return;
        }

        setIsSearching(true);
        setInfluencers([]); 
        
        try {
            const data = await getInfluencers(searchCategory, searchHashtag);
            setInfluencers(data);           
        } catch (error) {
            console.error("Failed to fetch influencers", error);
            alert("Failed to connect to the server.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleCreatePromotion = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newProduct || !newDiscount || !newDuration) return;

        setIsSubmittingPromo(true);
        try {
            // REPLACE WITH REAL API POST CALL:
            // const createdPromo = await createPromotion({ product_name: newProduct, discount_amount: newDiscount, duration: newDuration });
            
            // SIMULATED CREATION:
            setTimeout(() => {
                const newPromo: Promotion = {
                    id: Date.now(),
                    product_name: newProduct,
                    discount_amount: newDiscount,
                    duration: newDuration,
                    status: "active"
                };
                setPromotions([newPromo, ...promotions]);
                setNewProduct('');
                setNewDiscount('');
                setNewDuration('');
                setIsSubmittingPromo(false);
                alert("Promotion successfully added to product!");
            }, 500);

        } catch (error) {
            console.error("Error creating promotion", error);
            setIsSubmittingPromo(false);
        }
    };

    const getProfileUrl = (handle: string, platform: string) => {
        const cleanHandle = handle.replace('@', '');
        if (platform?.toLowerCase() === 'tiktok') {
            return `https://www.tiktok.com/@${cleanHandle}`;
        }
        return `https://www.instagram.com/${cleanHandle}/`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Megaphone className="h-8 w-8 text-indigo-600" />
                        Sales & Marketing Hub
                    </h1>
                    <p className="text-gray-500 mt-1">Manage performance, add discounts to products, and find brand ambassadors.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
                        <Download className="h-4 w-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8 w-fit overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'promotions', label: 'Product Promotions', icon: Tag },
                    { id: 'influencers', label: 'Influencer Finder', icon: Instagram },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {isLoadingData ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                            <span className="ml-3 text-gray-500 font-medium">Loading live data...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {metrics.map((metric, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{metric.label}</p>
                                    <div className="mt-2 flex items-end justify-between">
                                        <h3 className="text-3xl font-extrabold text-gray-900">{metric.value}</h3>
                                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                                            {metric.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 2. PROMOTIONS TAB */}
            {activeTab === 'promotions' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Promotion Form */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleCreatePromotion} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PlusCircle className="h-5 w-5 text-indigo-600" /> Add Discount to Product
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Product Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newProduct}
                                        onChange={(e) => setNewProduct(e.target.value)}
                                        placeholder="e.g. Wireless Headphones" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Discount Amount</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newDiscount}
                                        onChange={(e) => setNewDiscount(e.target.value)}
                                        placeholder="e.g. 20% OFF or $15 OFF" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Duration / Expiry</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newDuration}
                                        onChange={(e) => setNewDuration(e.target.value)}
                                        placeholder="e.g. 7 Days, Ends Friday" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmittingPromo}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                                >
                                    {isSubmittingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                                    Create Promotion
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Active Promotions List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" /> Active Product Promotions
                            </h3>
                            
                            {isLoadingData ? (
                                <p className="text-sm text-gray-500">Loading promotions...</p>
                            ) : promotions.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Tag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No active promotions. Create one to get started.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {promotions.map((promo) => (
                                        <div key={promo.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{promo.product_name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                                                        {promo.discount_amount}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        Duration: {promo.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm" title="Active"></span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. INFLUENCER FINDER TAB */}
            {activeTab === 'influencers' && (
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Instagram className="h-64 w-64 transform rotate-12" />
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Find Perfect Brand Ambassadors</h2>
                            <p className="text-purple-200 mb-6 text-sm">Use AI to match products with high-converting TikTok & Instagram influencers.</p>
                            
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-purple-200 uppercase ml-1 mb-1 block">Category / Niche</label>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                                        <input 
                                            type="text" 
                                            value={searchCategory}
                                            onChange={(e) => setSearchCategory(e.target.value)}
                                            placeholder="e.g. Fitness, Tech, Beauty" 
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-purple-200 uppercase ml-1 mb-1 block">Target Keyword</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-purple-300 font-bold">#</span>
                                        <input 
                                            type="text" 
                                            value={searchHashtag}
                                            onChange={(e) => setSearchHashtag(e.target.value)}
                                            placeholder="gadgets" 
                                            className="w-full pl-8 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button 
                                        onClick={handleAutoFindInfluencers}
                                        disabled={isSearching}
                                        className="h-[42px] px-6 bg-white text-purple-900 font-bold rounded-lg hover:bg-purple-50 transition shadow-lg flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        Auto-Find
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {influencers.length > 0 ? (
                            influencers.map((inf, index) => (
                                <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition">
                                    <div className="h-20 w-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5 rounded-full mb-4">
                                        <div className="h-full w-full bg-white rounded-full p-1">
                                            <div className="h-full w-full bg-gray-200 rounded-full overflow-hidden">
                                                <Users className="h-full w-full text-gray-400 p-3" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg text-gray-900">{inf.handle}</h3>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-4">
                                        {inf.platform}
                                    </p>
                                    
                                    <div className="flex justify-center gap-6 w-full mb-4 border-t border-b border-gray-50 py-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Followers</p>
                                            <p className="font-bold text-gray-900">{inf.followers}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 mb-6 italic line-clamp-2 min-h-[40px]">
                                        "{inf.bio_snippet}"
                                    </div>

                                    <div className="w-full mt-auto">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-gray-500">Match Score</span>
                                            <span className="text-green-600">{inf.match_score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${inf.match_score}%` }}></div>
                                        </div>
                                        
                                        <a 
                                            href={getProfileUrl(inf.handle, inf.platform)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition mb-2"
                                        >
                                            View Profile on {inf.platform}
                                        </a>
                                        {/* Optional button to link the influencer with a created promotion */}
                                        <button 
                                            onClick={() => alert(`Propose your active promotions to ${inf.handle} via DM!`)}
                                            className="block w-full text-center py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold rounded-lg hover:bg-indigo-100 transition"
                                        >
                                            Send Product Promotion
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isSearching && (
                                <div className="col-span-3 text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                    <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>Enter a category or hashtag and click "Auto-Find" to discover influencers.</p>
                                </div>
                            )
                        )}
                        
                        {isSearching && (
                            <div className="col-span-3 flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
                                <p className="text-gray-500 font-medium">Scanning TikTok & Instagram profiles using AI...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}