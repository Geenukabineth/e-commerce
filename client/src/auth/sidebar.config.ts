import type { Role } from './auth.types';

export type SidebarRoute = {
  label: string;
  tab: string;
  roles: Role[];
};

export const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    label: "Overview",
    tab: "overview",
    roles: ["admin"],
  },
  {
    label: "dashboard",
    tab: "dashboard",
    roles: ["seller"],
  },
  {
    label: "Users",
    tab: "users",
    roles: ["admin"], 
  },
  {
    label: "Products",
    tab: "products",
    roles: ["admin", "seller"],
  },
  {
    label: "Fraud Detection",
    tab: "fraud-detection",
    roles: ["admin"],
  },
  { label: "Payouts",
    tab: "payouts",
    roles: ["admin"]
  },
  {
    label: "Wallet",
    tab: "wallet",
    roles: ["user"],
  },
  {
    label: "Sales", 
    tab: "sales",
    roles: ["admin", "seller"],
  },
  {
    label: "Orders",
    tab: "orders",
    roles: [ "seller"],
  },
  {
    label: "Communication",
    tab: "communication",
    roles: ["admin", "seller"],
  },
  {
    label: "Reviews",
    tab: "reviews",
    roles: ["seller"],
  }
  
];