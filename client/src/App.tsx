import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/auth.store";
import { tokenStore } from "./service/http";

export default function App() {
  const nav = useNavigate();
  const { profile, setProfile, logout } = useAuth();

  const isLoggedIn = !!tokenStore.getAccess();

  const onLogout = () => {
    logout();
    setProfile(null);
    nav("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold">
            DigiKing Auth
          </Link>

          <nav className="flex items-center gap-3">
            

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-sm hover:underline">
                  Profile
                </Link>

                <button
                  onClick={onLogout}
                  className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Optional user badge */}
        {isLoggedIn && profile && (
          <div className="mb-4 rounded-lg border bg-white p-3 text-sm">
            Logged in as <b>{profile.username}</b> ({profile.role})
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
