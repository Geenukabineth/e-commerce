import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../../auth/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "", // Added Phone
    role: "client", // Added Role/Account Type
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Pass the expanded form data to the API
      await registerApi(form);
      // Redirect to login on success
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    alert(`${provider} registration is coming soon!`);
  };

  return (
    <div className="mx-auto max-w-md py-10 px-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-center uppercase">Create Client Account</h2>
        <p className="text-center text-xs text-gray-500 mt-1">Join our marketplace today</p>

        {/* --- Social Register Buttons --- */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="button"
            onClick={() => handleSocialRegister("Google")}
            className="flex w-full items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
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
          
          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "client" })}
              className={`text-sm font-medium py-1.5 rounded-md transition ${
                form.role === "client" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "vendor" })}
              className={`text-sm font-medium py-1.5 rounded-md transition ${
                form.role === "vendor" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
              }`}
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
  );
}