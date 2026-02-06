import { useState } from "react";
import { 
    MessageSquare, 
    Send, 
    Search, 
    MoreVertical, 
    Paperclip, 
    Image as ImageIcon,
    CheckCheck,
    Clock,
} from "lucide-react";

// --- TYPES ---
interface Customer {
    id: string;
    name: string;
    avatar: string; // Color class or image URL
    status: 'online' | 'offline' | 'away';
    last_seen: string;
}

interface Message {
    id: string;
    sender: 'me' | 'customer';
    text: string;
    timestamp: string;
    read: boolean;
    attachments?: string[];
}

interface Conversation {
    id: string;
    customer: Customer;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    messages: Message[];
    order_context?: {
        order_id: string;
        item_name: string;
        status: string;
    };
}

export default function CustomerCommunicationDashboard() {
    // --- STATE ---
    
    // Chat State
    const [selectedConversationId, setSelectedConversationId] = useState<string>('CONV-001');
    const [messageInput, setMessageInput] = useState('');

    // --- MOCK DATA: CONVERSATIONS ---
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: 'CONV-001',
            customer: { id: 'CUST-101', name: 'Sarah Jenkins', avatar: 'bg-purple-500', status: 'online', last_seen: 'Now' },
            last_message: "Is this item available in blue?",
            last_message_time: "10:42 AM",
            unread_count: 2,
            order_context: { order_id: 'ORD-7782', item_name: 'Wireless Pro Headphones', status: 'Shipped' },
            messages: [
                { id: 'm1', sender: 'customer', text: "Hi, I just ordered the headphones.", timestamp: "10:40 AM", read: true },
                { id: 'm2', sender: 'customer', text: "Is this item available in blue? I think I selected black by mistake.", timestamp: "10:42 AM", read: false }
            ]
        },
        {
            id: 'CONV-002',
            customer: { id: 'CUST-102', name: 'Michael Ross', avatar: 'bg-blue-500', status: 'offline', last_seen: '2h ago' },
            last_message: "Thanks for the quick shipping!",
            last_message_time: "Yesterday",
            unread_count: 0,
            messages: [
                { id: 'm1', sender: 'me', text: "Your order #ORD-7780 has been shipped!", timestamp: "Yesterday", read: true },
                { id: 'm2', sender: 'customer', text: "Thanks for the quick shipping!", timestamp: "Yesterday", read: true }
            ]
        },
        {
            id: 'CONV-003',
            customer: { id: 'CUST-103', name: 'Emma Watson', avatar: 'bg-green-500', status: 'away', last_seen: '15m ago' },
            last_message: "When will this be back in stock?",
            last_message_time: "Mon",
            unread_count: 0,
            messages: [
                { id: 'm1', sender: 'customer', text: "When will this be back in stock?", timestamp: "Mon", read: true }
            ]
        }
    ]);

    // --- ACTIONS ---
    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        
        const newMessage: Message = {
            id: `m-${Date.now()}`,
            sender: 'me',
            text: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    last_message: "You: " + messageInput,
                    last_message_time: "Just now"
                };
            }
            return conv;
        }));
        setMessageInput("");
    };

    // Derived State
    const activeConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            
            {/* --- CONVERSATION LIST SIDEBAR --- */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-indigo-600"/> Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div 
                            key={conv.id}
                            onClick={() => setSelectedConversationId(conv.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedConversationId === conv.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className={`h-10 w-10 rounded-full ${conv.customer.avatar} flex items-center justify-center text-white font-bold`}>
                                            {conv.customer.name.charAt(0)}
                                        </div>
                                        {conv.customer.status === 'online' && <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>}
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold ${conv.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{conv.customer.name}</h3>
                                        {conv.order_context && (
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">{conv.order_context.order_id}</span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{conv.last_message_time}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pl-12">
                                <p className={`text-xs truncate max-w-[160px] ${conv.unread_count > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                    {conv.last_message}
                                </p>
                                {conv.unread_count > 0 && (
                                    <span className="h-5 w-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {conv.unread_count}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CHAT WINDOW --- */}
            {activeConversation ? (
                <div className="flex-1 flex flex-col bg-gray-50">
                    {/* Chat Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-gray-900">{activeConversation.customer.name}</h3>
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <span className="h-2 w-2 bg-green-500 rounded-full"></span> Online
                            </span>
                        </div>
                        <div className="flex gap-2 text-gray-400">
                            <button className="hover:bg-gray-100 p-2 rounded-full"><Search className="h-5 w-5" /></button>
                            <button className="hover:bg-gray-100 p-2 rounded-full"><MoreVertical className="h-5 w-5" /></button>
                        </div>
                    </div>

                    {/* Order Context Banner */}
                    {activeConversation.order_context && (
                        <div className="bg-indigo-50 px-6 py-2 border-b border-indigo-100 flex justify-between items-center text-xs">
                            <span className="text-indigo-800">
                                Talking about order <strong>#{activeConversation.order_context.order_id}</strong> - {activeConversation.order_context.item_name}
                            </span>
                            <button className="text-indigo-600 font-bold hover:underline">View Order Details</button>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {activeConversation.messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                                    msg.sender === 'me' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <div className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        <span>{msg.timestamp}</span>
                                        {msg.sender === 'me' && (
                                            msg.read ? <CheckCheck className="h-3 w-3" /> : <Clock className="h-3 w-3" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 flex items-end gap-2">
                            <div className="flex gap-1 pb-2 pl-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"><Paperclip className="h-5 w-5" /></button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"><ImageIcon className="h-5 w-5" /></button>
                            </div>
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 py-3 text-sm"
                                rows={1}
                            />
                            <div className="pb-1 pr-1">
                                <button 
                                    onClick={handleSendMessage}
                                    className={`p-3 rounded-lg transition-all ${messageInput.trim() ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    );
}