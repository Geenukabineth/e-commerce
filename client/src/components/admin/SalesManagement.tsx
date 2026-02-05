import { useState } from "react";
import { 
    TrendingUp, 
    Users, 
    Tag, 
    CheckCircle, 
    XCircle, 
    Search, 
    Download, 
    Instagram, 
    Megaphone,
    Plus,
    BarChart3,
    Award,
    Filter,
    Loader2
} from "lucide-react";

// --- TYPES ---
interface SalesMetric {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
}

interface PromotionRequest {
    id: string;
    seller_name: string;
    product_name: string;
    discount_amount: string;
    duration: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface Influencer {
    id: string;
    handle: string;
    category: string;
    followers: string;
    engagement_rate: string;
    top_hashtags: string[];
    match_score: number;
}

export default function SalesManagementDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'promotions' | 'approvals' | 'influencers'>('overview');
    
    // --- MOCK DATA ---
    const metrics: SalesMetric[] = [
        { label: "Total Revenue", value: "$124,500", change: "+12.5%", trend: "up" },
        { label: "Active Promotions", value: "8", change: "+2", trend: "up" },
        { label: "Influencer ROI", value: "310%", change: "+5.2%", trend: "up" },
        { label: "Pending Approvals", value: "14", change: "-3", trend: "down" },
    ];

    const [pendingApprovals, setPendingApprovals] = useState<PromotionRequest[]>([
        { id: 'REQ-001', seller_name: 'Tech Haven', product_name: 'Wireless Earbuds', discount_amount: '20% OFF', duration: '7 Days', status: 'pending' },
        { id: 'REQ-002', seller_name: 'Style Loft', product_name: 'Summer Dress', discount_amount: 'Buy 1 Get 1', duration: '3 Days', status: 'pending' },
        { id: 'REQ-003', seller_name: 'Home Decor Co', product_name: 'Ceramic Vase', discount_amount: '$15 Flat', duration: 'Weekend', status: 'pending' },
    ]);

    // Influencer Finder State
    const [searchCategory, setSearchCategory] = useState('');
    const [searchHashtag, setSearchHashtag] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);

    // --- ACTIONS ---
    const handleApprove = (id: string) => {
        setPendingApprovals(prev => prev.filter(req => req.id !== id));
        // Logic to add to active promotions would go here
    };

    const handleReject = (id: string) => {
        if(window.confirm("Reject this promotion request?")) {
            setPendingApprovals(prev => prev.filter(req => req.id !== id));
        }
    };

    const handleAutoFindInfluencers = () => {
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setInfluencers([
                { id: 'INF-1', handle: '@tech_guru_daily', category: 'Tech', followers: '125k', engagement_rate: '4.5%', top_hashtags: ['#tech', '#gadgets'], match_score: 98 },
                { id: 'INF-2', handle: '@lifestyle_lisa', category: 'Lifestyle', followers: '450k', engagement_rate: '2.1%', top_hashtags: ['#summer', '#deals'], match_score: 85 },
                { id: 'INF-3', handle: '@unbox_therapy_fan', category: 'Tech', followers: '80k', engagement_rate: '6.8%', top_hashtags: ['#unboxing', '#reviews'], match_score: 92 },
            ]);
            setIsSearching(false);
        }, 1500);
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
                    <p className="text-gray-500 mt-1">Manage campaigns, approve seller deals, and find influencers.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
                        <Download className="h-4 w-4" /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md">
                        <Plus className="h-4 w-4" /> New Campaign
                    </button>
                </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8 w-fit">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'promotions', label: 'Promotion Builder', icon: Tag },
                    { id: 'approvals', label: 'Seller Approvals', icon: CheckCircle },
                    { id: 'influencers', label: 'Influencer Finder', icon: Instagram },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                            activeTab === tab.id 
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        {tab.id === 'approvals' && pendingApprovals.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                {pendingApprovals.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* --- CONTENT AREA --- */}
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Metrics Grid */}
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

                    {/* Sales Report Chart Placeholder */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex items-center justify-center relative">
                        <div className="text-center">
                            <BarChart3 className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">Sales Performance Report</h3>
                            <p className="text-gray-500 max-w-md mx-auto mt-2">Detailed visualization of sales trends, promotion impact, and conversion rates would render here.</p>
                            <button className="mt-6 text-indigo-600 font-bold text-sm hover:underline">View Detailed Analytics →</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. PROMOTION BUILDER TAB */}
            {activeTab === 'promotions' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Create Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-indigo-600" /> Create New Promotion
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Campaign Name</label>
                                    <input type="text" placeholder="e.g. Summer Flash Sale" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Discount Type</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>Percentage Off (%)</option>
                                        <option>Fixed Amount ($)</option>
                                        <option>Free Shipping</option>
                                        <option>Buy X Get Y</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Start Date</label>
                                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">End Date</label>
                                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Badge Creator */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Award className="h-5 w-5 text-indigo-600" /> Promotion Badge Creator
                            </h3>
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 space-y-4 w-full">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Badge Label</label>
                                        <input type="text" placeholder="e.g. BEST SELLER" defaultValue="FLASH DEAL" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Color Theme</label>
                                        <div className="flex gap-3">
                                            {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map(color => (
                                                <button key={color} className={`h-8 w-8 rounded-full ${color} ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 focus:ring-gray-400 transition-all`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Live Preview */}
                                <div className="p-8 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-w-[200px]">
                                    <p className="text-xs text-gray-400 font-bold mb-4 uppercase">Live Preview</p>
                                    <div className="relative">
                                        <div className="h-24 w-24 bg-white rounded-lg shadow-sm border border-gray-200"></div>
                                        <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm transform rotate-3">
                                            FLASH DEAL
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                                <button className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition">
                                    Save Promotion & Badge
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Active List */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                        <h3 className="font-bold text-gray-900 mb-4">Active Campaigns</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">Season Clearance</p>
                                            <p className="text-xs text-gray-500 mt-1">Ends in 4 days</p>
                                        </div>
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                                        <Tag className="h-3 w-3" />
                                        <span>20% Off All Items</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. APPROVALS TAB */}
            {activeTab === 'approvals' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Filter className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">Approval Queue Policy</h4>
                            <p className="text-xs text-blue-700 mt-1">
                                Ensure products meet quality guidelines before approving "Featured" or "Deal of the Day" badges.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Seller / Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Requested Promo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Duration</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingApprovals.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                            No pending approvals found.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingApprovals.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900 text-sm">{req.product_name}</p>
                                                <p className="text-xs text-indigo-600 font-semibold mt-0.5">{req.seller_name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {req.discount_amount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{req.duration}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleReject(req.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleApprove(req.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 shadow-sm transition"
                                                    >
                                                        <CheckCircle className="h-3 w-3" /> Approve
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. INFLUENCER FINDER TAB */}
            {activeTab === 'influencers' && (
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Search Panel */}
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Instagram className="h-64 w-64 transform rotate-12" />
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Find Perfect Brand Ambassadors</h2>
                            <p className="text-purple-200 mb-6 text-sm">Use AI to match products with high-converting Instagram influencers.</p>
                            
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
                                    <label className="text-xs font-bold text-purple-200 uppercase ml-1 mb-1 block">Target Hashtag</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-purple-300 font-bold">#</span>
                                        <input 
                                            type="text" 
                                            value={searchHashtag}
                                            onChange={(e) => setSearchHashtag(e.target.value)}
                                            placeholder="summeroutfit" 
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
                            influencers.map((inf) => (
                                <div key={inf.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition">
                                    <div className="h-20 w-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5 rounded-full mb-4">
                                        <div className="h-full w-full bg-white rounded-full p-1">
                                            <div className="h-full w-full bg-gray-200 rounded-full overflow-hidden">
                                                {/* Placeholder for avatar */}
                                                <Users className="h-full w-full text-gray-400 p-3" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg text-gray-900">{inf.handle}</h3>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-4">{inf.category}</p>
                                    
                                    <div className="flex justify-center gap-6 w-full mb-6 border-t border-b border-gray-50 py-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Followers</p>
                                            <p className="font-bold text-gray-900">{inf.followers}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Engagement</p>
                                            <p className="font-bold text-gray-900">{inf.engagement_rate}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                                        {inf.top_hashtags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="w-full">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-gray-500">Match Score</span>
                                            <span className="text-green-600">{inf.match_score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${inf.match_score}%` }}></div>
                                        </div>
                                        
                                        <button className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition">
                                            Connect & Propose
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
                                <p className="text-gray-500 font-medium">Scanning Instagram profiles...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}