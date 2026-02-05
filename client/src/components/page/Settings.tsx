import { useState, useEffect } from "react";
import { 
    Moon, 
    Sun, 
    Bell, 
    Shield, 
    Monitor, 
    Smartphone,
    Mail,
    Globe,
    Lock, // Added Lock icon
    KeyRound // Added KeyRound icon
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'privacy'>('appearance');
    
    // --- THEME LOGIC (Matches App.tsx) ---
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

    // --- PASSWORD CHANGE STATE ---
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
        
        // Dispatch event so other components (like Header) can react if they listen
        window.dispatchEvent(new Event("storage"));
    }, [theme]);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your password change logic here (e.g., API call)
        console.log("Password change submitted:", passwordData);
        alert("Password change functionality would be implemented here.");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
    };

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">App Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your application preferences and workspace.</p>

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* --- SIDEBAR --- */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col gap-2">
                        <SidebarItem 
                            icon={<Monitor className="h-5 w-5"/>} 
                            label="Appearance" 
                            active={activeTab === 'appearance'} 
                            onClick={() => setActiveTab('appearance')} 
                        />
                        <SidebarItem 
                            icon={<Bell className="h-5 w-5"/>} 
                            label="Notifications" 
                            active={activeTab === 'notifications'} 
                            onClick={() => setActiveTab('notifications')} 
                        />
                        <SidebarItem 
                            icon={<Shield className="h-5 w-5"/>} 
                            label="Privacy & Security" 
                            active={activeTab === 'privacy'} 
                            onClick={() => setActiveTab('privacy')} 
                        />
                    </nav>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    
                    {/* 1. APPEARANCE TAB */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Interface Theme</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <ThemeCard 
                                        active={theme === 'light'} 
                                        onClick={() => setTheme('light')}
                                        icon={<Sun className="h-6 w-6 text-yellow-500"/>}
                                        title="Light Mode"
                                        desc="Best for bright environments"
                                    />
                                    <ThemeCard 
                                        active={theme === 'dark'} 
                                        onClick={() => setTheme('dark')}
                                        icon={<Moon className="h-6 w-6 text-indigo-400"/>}
                                        title="Dark Mode"
                                        desc="Easy on the eyes at night"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Language</h4>
                                <select className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option>English (United States)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* 2. NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email Preferences</h3>
                            <div className="space-y-4">
                                <ToggleRow 
                                    icon={<Mail className="h-5 w-5 text-indigo-500"/>}
                                    label="Order Updates" 
                                    description="Receive emails about your order status and shipping." 
                                    checked 
                                />
                                <ToggleRow 
                                    icon={<Bell className="h-5 w-5 text-yellow-500"/>}
                                    label="Promotions" 
                                    description="Receive emails about new products and sales." 
                                    checked={false} 
                                />
                                <ToggleRow 
                                    icon={<Shield className="h-5 w-5 text-green-500"/>}
                                    label="Security Alerts" 
                                    description="Get notified about logins from new devices." 
                                    checked 
                                />
                            </div>
                        </div>
                    )}

                    {/* 3. PRIVACY TAB */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-8">
                            {/* Privacy Settings Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Settings</h3>
                                <div className="space-y-4">
                                    <ToggleRow 
                                        icon={<Globe className="h-5 w-5 text-blue-500"/>}
                                        label="Public Profile" 
                                        description="Allow others to see your profile details." 
                                        checked 
                                    />
                                    <ToggleRow 
                                        icon={<Smartphone className="h-5 w-5 text-purple-500"/>}
                                        label="Activity Status" 
                                        description="Show when you were last active." 
                                        checked={false} 
                                    />
                                </div>
                            </div>

                            {/* Password Change Section */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyRound className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                                                placeholder="Current Password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                                                placeholder="New Password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
                                                placeholder="Confirm New Password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        Update Password
                                    </button>
                                </form>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <button className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-2">
                                    Sign out of all devices
                                </button>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                active 
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function ThemeCard({ active, onClick, icon, title, desc }: any) {
    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer p-4 rounded-xl border-2 flex items-start gap-4 transition-all ${
                active 
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
        >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm shrink-0">{icon}</div>
            <div>
                <span className={`block font-bold ${active ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>{title}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{desc}</span>
            </div>
        </div>
    );
}

function ToggleRow({ icon, label, description, checked }: any) {
    const [isOn, setIsOn] = useState(checked);
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-start gap-3">
                <div className="mt-1">{icon}</div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
            <button 
                onClick={() => setIsOn(!isOn)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}