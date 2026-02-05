import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/auth.store";
import { tokenStore } from "./service/http";
import { getProfileApi } from "./auth/auth.api";
import { 
  Sun, 
  Moon, 
  LogOut, 
  Settings, 
  User, 
  ShieldCheck, 
  Bell, 
  Coins, 
  CheckCheck,
  Package,
  Wallet,
  Info 
} from "lucide-react"; 

export default function App() {
  const nav = useNavigate();
  const { profile, setProfile, logout } = useAuth();
  
  // --- UI STATE ---
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // --- REFS (For clicking outside) ---
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // --- THEME STATE ---
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const isLoggedIn = !!tokenStore.getAccess();

  // --- MOCK NOTIFICATIONS DATA ---
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Order Received", desc: "Order #ORD-221 has been placed.", time: "2m ago", unread: true, type: 'order' },
    { id: 2, title: "Payout Processed", desc: "$500.00 sent to your bank.", time: "1h ago", unread: true, type: 'finance' },
    { id: 3, title: "System Update", desc: "Maintenance scheduled for tonight.", time: "5h ago", unread: false, type: 'system' },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // --- EFFECTS ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch Profile
  useEffect(() => {
    if (isLoggedIn && !profile) {
      getProfileApi()
        .then((data) => setProfile(data))
        .catch((err) => console.error("Failed to fetch profile", err));
    }
  }, [isLoggedIn, profile, setProfile]);

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ACTIONS ---
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  
  const onLogout = () => {
    logout();
    setProfile(null);
    nav("/", { replace: true });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, unread: false})));
  };

  const handleNotifClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({...n, unread: false}) : n));
  };

  // Helper to get icon based on notification type
  const getNotifIcon = (type: string) => {
    switch(type) {
      case 'order': return <Package className="h-4 w-4 text-indigo-600" />;
      case 'finance': return <Wallet className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <Link to="/" className="text-xl font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            MarketPlace
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            
            {/* --- THEME TOGGLE --- */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                
                {/* --- COINS DISPLAY --- */}
                <div className="hidden md:flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700/50">
                  <Coins className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500">
                    1,250
                  </span>
                </div>

                {/* --- ADVANCED NOTIFICATION BELL --- */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-gray-600"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-pulse" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-white dark:ring-opacity-10 animate-in fade-in zoom-in duration-200 overflow-hidden z-50">
                      
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllRead} 
                            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1 transition-colors"
                          >
                            <CheckCheck className="h-3 w-3" /> Mark all read
                          </button>
                        )}
                      </div>
                      
                      {/* List */}
                      <div className="max-h-[24rem] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 text-sm">
                            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => handleNotifClick(notif.id)}
                              className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer flex gap-3 ${notif.unread ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : ''}`}
                            >
                              <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${notif.unread ? 'bg-white dark:bg-gray-700 shadow-sm' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                {getNotifIcon(notif.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm font-medium ${notif.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {notif.title}
                                  </p>
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                  {notif.desc}
                                </p>
                              </div>
                              {notif.unread && (
                                <div className="mt-2 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Footer */}
                      <Link 
                        to="/notifications" 
                        onClick={() => setIsNotifOpen(false)} 
                        className="block text-center py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700 transition-colors"
                      >
                        View All Activity
                      </Link>
                    </div>
                  )}
                </div>

                {/* --- USER DROPDOWN --- */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 rounded-full border border-gray-200 p-1 pr-3 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  >
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt="Avatar"
                        className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm">
                        {profile?.username ? profile.username.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    
                    <svg className={`h-4 w-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white dark:ring-opacity-10 animate-in fade-in zoom-in duration-200 z-50">
                      
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {profile?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {profile?.email}
                        </p>
                      </div>

                      {profile?.role === 'admin' && (
                          <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShieldCheck className="h-4 w-4 text-indigo-500" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>

                      <div className="border-t border-gray-100 my-1 dark:border-gray-700"></div>

                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-transform active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}