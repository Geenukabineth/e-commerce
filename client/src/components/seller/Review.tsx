import { useState } from "react";
import { 
    Star, 
    MessageSquare, 
    Filter, 
    Search, 
    ThumbsUp, 
    MoreHorizontal, 
    CheckCircle2, 
    AlertCircle, 
    CornerUpLeft, 
    Sparkles, 
    Copy,
    Reply,
    Bot
} from "lucide-react";

// --- TYPES ---
interface Review {
    id: string;
    customer: {
        name: string;
        avatar_color: string;
        verified: boolean;
    };
    product: {
        name: string;
        image_url: string;
    };
    rating: number;
    date: string;
    content: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    status: 'pending' | 'replied' | 'flagged';
    likes: number;
    seller_reply?: string;
}

export default function ReviewManagementDashboard() {
    // --- STATE ---
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'replied'>('all');
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [autoReplyEnabled, setAutoReplyEnabled] = useState(false); // State for On/Off Toggle

    // --- MOCK DATA ---
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 'REV-101',
            customer: { name: "Alice Freeman", avatar_color: "bg-purple-100 text-purple-600", verified: true },
            product: { name: "Wireless Pro Headphones", image_url: "/api/placeholder/40/40" },
            rating: 5,
            date: "2 hours ago",
            content: "These are hands down the best headphones I've ever owned. The noise cancellation is top tier!",
            sentiment: 'positive',
            status: 'pending',
            likes: 12
        },
        {
            id: 'REV-102',
            customer: { name: "Mark Wilson", avatar_color: "bg-blue-100 text-blue-600", verified: true },
            product: { name: "Ergo Mech Keyboard", image_url: "/api/placeholder/40/40" },
            rating: 2,
            date: "1 day ago",
            content: "The switches feel scratchy and the keycaps are loose. Expected better quality for the price.",
            sentiment: 'negative',
            status: 'pending',
            likes: 4
        },
        {
            id: 'REV-103',
            customer: { name: "Sarah Connor", avatar_color: "bg-green-100 text-green-600", verified: true },
            product: { name: "USB-C Hub", image_url: "/api/placeholder/40/40" },
            rating: 4,
            date: "3 days ago",
            content: "Works as advertised, but the cable is a bit short for my laptop stand setup.",
            sentiment: 'neutral',
            status: 'replied',
            likes: 1,
            seller_reply: "Thanks for the feedback Sarah! We're noting the cable length for our V2 design."
        },
        {
            id: 'REV-104',
            customer: { name: "John Doe", avatar_color: "bg-gray-100 text-gray-600", verified: false },
            product: { name: "Gaming Mouse", image_url: "/api/placeholder/40/40" },
            rating: 5,
            date: "1 week ago",
            content: "Fast shipping and great packaging. Product works perfectly.",
            sentiment: 'positive',
            status: 'replied',
            likes: 0,
            seller_reply: "Glad to hear it arrived safely, John! Game on! 🎮"
        }
    ]);

    // --- TEMPLATES ---
    const responseTemplates = [
        { label: "Gratitude", text: "Thank you so much for your kind words! We're thrilled to hear you love it." },
        { label: "Apology", text: "We're so sorry to hear this didn't meet your expectations. Please DM us so we can make it right." },
        { label: "Feedback", text: "Thanks for the feedback! We'll pass this along to our product team immediately." }
    ];

    // --- ACTIONS ---
    const handlePostReply = (reviewId: string) => {
        if (!replyText.trim()) return;
        
        setReviews(prev => prev.map(r => r.id === reviewId ? { 
            ...r, 
            status: 'replied', 
            seller_reply: replyText 
        } : r));
        
        setReplyingTo(null);
        setReplyText("");
    };

    const handleUseTemplate = (text: string) => {
        setReplyText(text);
    };

    // --- FILTERING ---
    const filteredReviews = reviews.filter(r => {
        const statusMatch = activeFilter === 'all' || r.status === activeFilter;
        const ratingMatch = ratingFilter === 'all' || r.rating === ratingFilter;
        return statusMatch && ratingMatch;
    });

    const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-8">
            
            {/* --- HEADER & METRICS --- */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                            Review Hub
                        </h1>
                        <p className="text-gray-500 mt-1">Manage brand reputation and customer feedback.</p>
                    </div>
                    <div className="flex gap-3">
                         {/* Metrics Cards */}
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 font-bold text-xl">{averageRating}</div>
                            <div className="text-xs">
                                <p className="font-bold text-gray-900">Avg Rating</p>
                                <p className="text-gray-500">Last 30 days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 font-bold text-xl">{reviews.filter(r => r.status === 'pending').length}</div>
                            <div className="text-xs">
                                <p className="font-bold text-gray-900">Pending</p>
                                <p className="text-gray-500">Needs reply</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTROLS BAR --- */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-10">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['all', 'pending', 'replied'].map(status => (
                            <button
                                key={status}
                                onClick={() => setActiveFilter(status as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors whitespace-nowrap ${
                                    activeFilter === status 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        
                        {/* Auto-Reply ON/OFF Toggle */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${autoReplyEnabled ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-1.5">
                                <div className={`p-1 rounded-full ${autoReplyEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <Bot className="h-3 w-3" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase text-gray-500 leading-none">Auto-Reply</span>
                                    <span className={`text-xs font-bold leading-none ${autoReplyEnabled ? 'text-indigo-700' : 'text-gray-400'}`}>
                                        {autoReplyEnabled ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${autoReplyEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoReplyEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                            <span className="text-xs font-bold text-gray-400 uppercase hidden md:inline">Stars:</span>
                            <select 
                                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            >
                                <option value="all">All</option>
                                <option value="5">5 ★</option>
                                <option value="4">4 ★</option>
                                <option value="3">3 ★</option>
                                <option value="2">2 ★</option>
                                <option value="1">1 ★</option>
                            </select>
                        </div>
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search reviews..." 
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- REVIEWS FEED --- */}
            <div className="max-w-5xl mx-auto space-y-6 pb-20">
                {filteredReviews.length === 0 ? (
                     <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No reviews found</h3>
                        <p className="text-gray-500">Adjust your filters to see more results.</p>
                     </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition hover:shadow-md">
                            <div className="p-6">
                                {/* Review Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${review.customer.avatar_color}`}>
                                            {review.customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900">{review.customer.name}</h3>
                                                {review.customer.verified && (
                                                    <span className="text-[10px] flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                        <CheckCircle2 className="h-3 w-3" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                                {review.date} • <span className="text-indigo-600 font-medium hover:underline cursor-pointer">{review.product.name}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} 
                                                />
                                            ))}
                                        </div>
                                        {/* Sentiment Badge */}
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                            review.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                            review.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {review.sentiment} Sentiment
                                        </span>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mb-6 pl-16">
                                    <p className="text-gray-800 leading-relaxed text-sm">
                                        "{review.content}"
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition">
                                            <ThumbsUp className="h-4 w-4" /> Helpful ({review.likes})
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition ml-auto">
                                            <AlertCircle className="h-4 w-4" /> Report
                                        </button>
                                    </div>
                                </div>

                                {/* Action / Reply Area */}
                                <div className="pl-16">
                                    {review.status === 'replied' ? (
                                        // Display Existing Reply
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                                            <div className="absolute top-4 left-0 w-1 h-8 bg-indigo-500 rounded-r"></div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">Your Reply</span>
                                                <span className="text-xs text-gray-400">Posted just now</span>
                                            </div>
                                            <p className="text-sm text-gray-600 italic">
                                                {review.seller_reply}
                                            </p>
                                            <button className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        // Reply Interface
                                        replyingTo === review.id ? (
                                            <div className="bg-white border border-indigo-100 rounded-xl shadow-sm p-4 animate-in fade-in slide-in-from-top-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                        <Reply className="h-4 w-4" /> Replying to {review.customer.name}
                                                    </span>
                                                    
                                                    {/* Quick Templates */}
                                                    <div className="flex gap-2">
                                                        {responseTemplates.map(template => (
                                                            <button
                                                                key={template.label}
                                                                onClick={() => handleUseTemplate(template.text)}
                                                                className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded hover:bg-indigo-100 transition"
                                                            >
                                                                <Sparkles className="h-3 w-3" /> {template.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-3"
                                                    rows={3}
                                                    placeholder="Write a personalized response..."
                                                    autoFocus
                                                ></textarea>
                                                
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                                        className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={() => handlePostReply(review.id)}
                                                        className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                                                    >
                                                        Post Reply
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setReplyingTo(review.id)}
                                                className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
                                            >
                                                <CornerUpLeft className="h-4 w-4" /> Reply to Review
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}