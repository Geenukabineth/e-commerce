import { Link } from "react-router-dom";
import { useAuth } from "../../auth/auth.store";
import { tokenStore } from "../../service/http";

// Dummy data for display purposes
const CATEGORIES = [
  { id: 1, name: "Electronics", color: "bg-blue-100 text-blue-700" },
  { id: 2, name: "Fashion", color: "bg-pink-100 text-pink-700" },
  { id: 3, name: "Home", color: "bg-green-100 text-green-700" },
  { id: 4, name: "Sports", color: "bg-orange-100 text-orange-700" },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: "$120.00", tag: "New" },
  { id: 2, name: "Smart Watch Series 7", price: "$250.00", tag: "Sale" },
  { id: 3, name: "Running Shoes", price: "$85.00", tag: "" },
  { id: 4, name: "Leather Backpack", price: "$110.00", tag: "" },
];

export default function Home() {
  const { profile } = useAuth();
  const isLoggedIn = !!tokenStore.getAccess();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      
      {/* --- HERO SECTION --- */}
      <div className="rounded-2xl bg-black px-8 py-12 text-center text-white shadow-lg md:py-20">
        <h1 className="text-3xl font-bold md:text-5xl">
          {/* Dynamic Welcome Logic */}
          {isLoggedIn && profile?.username 
            ? `Welcome back, ${profile.username}! 👋` 
            : "Welcome to MarketPlace 👋"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Discover the latest trends in electronics, fashion, and home accessories. 
          {isLoggedIn ? " Check out your exclusive member deals below." : " Sign in to track your orders and get exclusive coupons."}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-gray-200">
            Shop Now
          </button>
          
          {!isLoggedIn && (
            <Link
              to="/login"
              className="rounded-full border border-white px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* --- CATEGORIES SECTION --- */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`flex h-24 cursor-pointer items-center justify-center rounded-xl font-semibold transition hover:opacity-80 ${cat.color}`}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>

      {/* --- FEATURED PRODUCTS SECTION --- */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Trending Products</h2>
          <Link to="/products" className="text-sm font-medium text-blue-600 hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
              {/* Product Image Placeholder */}
              <div className="relative h-48 w-full bg-gray-200">
                {product.tag && (
                  <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs font-bold text-white">
                    {product.tag}
                  </span>
                )}
                <div className="flex h-full items-center justify-center text-gray-400">
                  Product Image
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-gray-500">{product.price}</p>
                <button className="mt-4 w-full rounded-md bg-black py-2 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ADMIN PANEL LINK (Only if admin) --- */}
      {isLoggedIn && profile?.role === "admin" && (
        <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Admin Dashboard</h3>
              <p className="text-sm text-blue-700">You have administrative access.</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}