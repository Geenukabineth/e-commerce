import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/auth.store";
import { tokenStore } from "./service/http";
// 1. IMPORT THE API FUNCTION
import { getProfileApi } from "./auth/auth.api"; 

export default function App() {
  const nav = useNavigate();
  const { profile, setProfile, logout } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = !!tokenStore.getAccess();

  // 2. ADD THIS EFFECT TO FETCH DATA ON LOAD
  useEffect(() => {
    // If user has a token (isLoggedIn) but no profile data yet...
    if (isLoggedIn && !profile) {
      getProfileApi()
        .then((data) => {
          setProfile(data); // Save profile to store
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
          // Optional: If fetching fails (e.g., token expired), logout
          // logout(); 
        });
    }
  }, [isLoggedIn, profile, setProfile]);

  const onLogout = () => {
    logout();
    setProfile(null);
    nav("/", { replace: true });
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          
          <Link to="/" className="text-xl font-bold uppercase tracking-wide text-gray-900">
            MarketPlace
          </Link>

          <nav className="flex items-center gap-9">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 p-1 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  {/* User Avatar Logic */}
                  {profile?.image ? (
                    <img
                      src={profile.image} // Make sure your backend returns the full URL!
                      alt="Avatar"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                      {/* Show First Initial or 'U' if loading */}
                      {profile?.username ? profile.username.charAt(0).toUpperCase() : "..."}
                    </div>
                  )}
                  
                  {/* Chevron Icon */}
                  <svg className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    
                    <div className="block px-4 py-2 text-xs text-gray-400 sm:hidden">
                      {profile?.username ? `Signed in as ${profile.username}` : "Signed in"}
                    </div>

                    <div className="border-t border-gray-100 sm:border-none"></div>

                    {/* Admin Link */}
                    {profile?.role === 'admin' && (
                        <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>

                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}