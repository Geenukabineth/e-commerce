import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi, googleLoginApi, getProfileApi } from "../../auth/auth.api";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../auth/auth.store";

// --- 1. Separate Google Button Component ---
const GoogleBtn = ({ onSuccess, onError }: { onSuccess: (token: string) => void, onError: () => void }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccess(tokenResponse.access_token),
    onError: () => onError(),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="flex w-full items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Sign up with Google
    </button>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const { setProfile } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "", 
    role: "client", // Default to client/buyer
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Handle Standard Registration ---
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerApi(form);
      // Automatically login or redirect to login page
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Google Registration ---
  const handleGoogleSuccess = async (accessToken: string) => {
    setError(null);
    setLoading(true);
    try {
      // 1. Register/Login via Google
      await googleLoginApi(accessToken);
      
      // 2. Fetch Profile & Update Store
      const profile = await getProfileApi();
      setProfile(profile);

      // 3. Redirect
      navigate("/", { replace: true });

    } catch (err: any) {
      console.error(err);
      setError("Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="mx-auto max-w-md py-10 px-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-center uppercase">Create Client Account</h2>
          <p className="text-center text-xs text-gray-500 mt-1">Join our marketplace today</p>

          {/* --- Google Register Button --- */}
          <div className="flex flex-col gap-3 mt-6">
            <GoogleBtn 
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google registration failed")}
            />
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <span className="relative bg-white px-3 text-xs uppercase text-gray-500">
              Or register via email
            </span>
          </div>

          <form onSubmit={submit} className="space-y-4">
            
            {/* Account Type Navigation */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              {/* Buyer (Active State) */}
              <button
                type="button"
                className="text-sm font-medium py-1.5 rounded-md transition bg-white text-black shadow-sm cursor-default"
              >
                Buyer
              </button>
              
              {/* Seller (Navigates to separate page) */}
              <button
                type="button"
                onClick={() => navigate("/register-seller")}
                className="text-sm font-medium py-1.5 rounded-md transition text-gray-500 hover:text-black hover:bg-gray-200"
              >
                Seller
              </button>
            </div>

            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Phone Number (e.g. +1 234 567 890)"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}