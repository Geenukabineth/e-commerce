import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { tokenStore } from "../service/http";

type Props = {
  redirectTo?: string;
};

export default function RequireAuth({ redirectTo = "/login" }: Props) {
  const token = tokenStore.getAccess();
  if (!token) return React.createElement(Navigate, { to: redirectTo, replace: true });
  return React.createElement(Outlet);
}
