import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/page/Home";
import Login from "../components/page/Login";
import Register from "../components/page/Register";
import Profile from "../components/page/Profile";
import RequireAuth from "../auth/RequireAuth";
import AdminDashboard from "../components/admin/dashboard";
import RegisterSeller from "../components/page/RegisterSeller";
import SellerDashboard from "../components/seller/SellerDashboard";
import UserDashboard from "../components/Buyer/UserDashboard";
import SettingsPage from "../components/page/Settings";
import NotificationPage from "../components/page/notifications";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      {
        element: <RequireAuth />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/notifications", element: <NotificationPage /> },
        ],
      },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/seller/dashboard", element: <SellerDashboard /> },
      { path: "/register-seller", element: <RegisterSeller/> },
      { path: "/dashboard", element: <UserDashboard/> },
      {path: "/settings", element: <SettingsPage/>}
    ],
  },
]);
