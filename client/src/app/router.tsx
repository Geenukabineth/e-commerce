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
import SettingsPage from "../components/page/Settings";
import NotificationPage from "../components/page/notifications";
import Communication from "../components/page/Communication";
import WalletHub from "../components/page/WalletHub";
import UserOrderTracking from "../components/Buyer/Order_Tracking";
import LoyaltyRewards from "../components/Buyer/Rewards";
import BillingManagement from "../components/Buyer/Cards";

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
          {path: "/communication", element:<Communication/>},
          {path: "/wallet", element: <WalletHub />},
          {path: "/orders", element: <UserOrderTracking />},
          {path: "/loyalty", element: <LoyaltyRewards /> },
          {path: "/billing", element: <BillingManagement /> },

        ],
      },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/seller/dashboard", element: <SellerDashboard /> },
      { path: "/register-seller", element: <RegisterSeller/> },
      {path: "/settings", element: <SettingsPage/>}
    ],
  },
]);
