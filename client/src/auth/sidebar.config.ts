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
    roles: ["admin", "seller", "user"],
  },
  {
    label: "Products",
    tab: "products",
    roles: ["admin", "seller"],
  },
  {
    label: "Orders",
    tab: "orders",
    roles: ["admin", "seller", "user"],
  },
  {
    label: "Users",
    tab: "users",
    roles: ["admin"], // 🔒 admin only
  },
];