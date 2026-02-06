import { useState } from "react";
import { 
    Gift, 
    Trophy, 
    Crown, 
    ChevronRight, 
    Sparkles, 
    Ticket, 
    Clock, 
    CheckCircle2, 
    Lock,
    ArrowUpRight
} from "lucide-react";

// --- TYPES ---
interface Reward {
    id: string;
    title: string;
    description: string;
    points_cost: number;
    image_color: string;
    category: 'coupon' | 'product' | 'service';
}

interface PointHistory {
    id: string;
    action: string;
    date: string;
    points: number;
    type: 'earned' | 'spent';
}

export default function LoyaltyRewards() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'redeem' | 'history' | 'rules'>('redeem');
    
    // User Stats (Mock)
    const userStats = {
        current_points: 2450,
        lifetime_points: 5800,
        tier: 'Silver',
        next_tier: 'Gold',
        points_to_next: 550,
        tier_progress: 82 // percentage
    };

    // Rewards Catalog
    const rewards: Reward[] = [
        { id: 'RWD-001', title: '$10 Off Coupon', description: 'Valid on orders over $50', points_cost: 500, image_color: 'bg-green-100 text-green-600', category: 'coupon' },
        { id: 'RWD-002', title: 'Free Shipping', description: 'One-time free shipping voucher', points_cost: 800, image_color: 'bg-blue-100 text-blue-600', category: 'service' },
        { id: 'RWD-003', title: '$25 Gift Card', description: 'Store credit for any item', points_cost: 2000, image_color: 'bg-purple-100 text-purple-600', category: 'coupon' },
        { id: 'RWD-004', title: 'Mystery Box', description: 'Curated tech accessories', points_cost: 3500, image_color: 'bg-pink-100 text-pink-600', category: 'product' },
        { id: 'RWD-005', title: 'Premium Support', description: '30 days of priority access', points_cost: 1200, image_color: 'bg-yellow-100 text-yellow-600', category: 'service' },
        { id: 'RWD-006', title: '$50 Off Coupon', description: 'Valid on orders over $200', points_cost: 4500, image_color: 'bg-indigo-100 text-indigo-600', category: 'coupon' },
    ];

    // History Mock
    const history: PointHistory[] = [
        { id: 'H-1', action: 'Order #ORD-221', date: 'Feb 5, 2026', points: 150, type: 'earned' },
        { id: 'H-2', action: 'Redeemed Free Shipping', date: 'Jan 28, 2026', points: -800, type: 'spent' },
        { id: 'H-3', action: 'Order #ORD-198', date: 'Jan 15, 2026', points: 320, type: 'earned' },
        { id: 'H-4', action: 'Review Bonus', date: 'Jan 10, 2026', points: 50, type: 'earned' },
    ];

    // --- HELPERS ---
    const getTierColor = (tier: string) => {
        switch(tier) {
            case 'Bronze': return 'from-orange-400 to-orange-600';
            case 'Silver': return 'from-gray-300 to-gray-500';
            case 'Gold': return 'from-yellow-400 to-yellow-600';
            case 'Platinum': return 'from-indigo-400 to-indigo-600';
            default: return 'from-blue-400 to-blue-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* --- HEADER & STATUS CARD --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Welcome & Context */}
                    <div className="lg:col-span-1 space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Gift className="h-8 w-8 text-pink-500" />
                            Loyalty Club
                        </h1>
                        <p className="text-gray-500">
                            Earn points with every purchase and unlock exclusive rewards.
                        </p>
                        
                        <div className="pt-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Current Benefits</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> 1.5x Points Multiplier
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Early Access to Sales
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-400">
                                    <Lock className="h-4 w-4" /> Priority Support (Gold)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-400">
                                    <Lock className="h-4 w-4" /> Free Returns (Gold)
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Tier Status Card (Visual) */}
                    <div className={`lg:col-span-2 rounded-2xl p-8 text-white shadow-xl bg-gradient-to-br ${getTierColor(userStats.tier)} relative overflow-hidden`}>
                        {/* Background Patterns */}
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Trophy className="h-64 w-64 transform rotate-12" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white/80 font-medium text-sm uppercase tracking-wider">Current Status</p>
                                    <h2 className="text-4xl font-black mt-1 flex items-center gap-3">
                                        {userStats.tier} Member <Crown className="h-8 w-8 text-yellow-300" />
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 font-medium text-sm uppercase tracking-wider">Available Points</p>
                                    <h2 className="text-4xl font-black mt-1">{userStats.current_points.toLocaleString()}</h2>
                                </div>
                            </div>

                            <div className="mt-12">
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span>{userStats.tier}</span>
                                    <span>{userStats.next_tier}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div 
                                        className="h-full bg-white/90 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                                        style={{ width: `${userStats.tier_progress}%` }}
                                    ></div>
                                </div>
                                <p className="mt-3 text-sm font-medium text-white/90">
                                    Only <span className="font-bold">{userStats.points_to_next} points</span> away from unlocking {userStats.next_tier} status!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-100 flex px-6">
                        {[
                            { id: 'redeem', label: 'Redeem Rewards', icon: Ticket },
                            { id: 'history', label: 'Points History', icon: Clock },
                            { id: 'rules', label: 'How it Works', icon: Sparkles },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-5 text-sm font-bold border-b-2 transition-colors ${
                                    activeTab === tab.id 
                                    ? 'border-indigo-600 text-indigo-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <tab.icon className="h-4 w-4" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 bg-gray-50/50 min-h-[400px]">
                        
                        {/* 1. REDEEM TAB */}
                        {activeTab === 'redeem' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rewards.map(reward => (
                                    <div key={reward.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-md transition group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${reward.image_color}`}>
                                                <Gift className="h-6 w-6" />
                                            </div>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                                                {reward.category}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{reward.title}</h3>
                                        <p className="text-sm text-gray-500 mb-6 flex-1">{reward.description}</p>
                                        
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="font-bold text-indigo-600 flex items-center gap-1">
                                                <Sparkles className="h-4 w-4" /> {reward.points_cost} pts
                                            </span>
                                            <button 
                                                disabled={userStats.current_points < reward.points_cost}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                                    userStats.current_points >= reward.points_cost
                                                    ? 'bg-gray-900 text-white hover:bg-black shadow-sm'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                Redeem
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. HISTORY TAB */}
                        {activeTab === 'history' && (
                            <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Activity</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {history.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900 text-sm">{item.action}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {item.date}
                                                </td>
                                                <td className={`px-6 py-4 text-right font-bold text-sm ${item.type === 'earned' ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {item.type === 'earned' ? '+' : ''}{item.points}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* 3. RULES TAB */}
                        {activeTab === 'rules' && (
                            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Shop & Earn", desc: "Earn 1 point for every $1 you spend on our store.", icon: ArrowUpRight },
                                    { title: "Level Up", desc: "Reach higher tiers to unlock multipliers and exclusive perks.", icon: Trophy },
                                    { title: "Get Rewarded", desc: "Redeem your points for coupons, free gifts, and more.", icon: Gift }
                                ].map((rule, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <rule.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">{rule.title}</h3>
                                        <p className="text-sm text-gray-500">{rule.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}