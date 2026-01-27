import React, {useContext,useMemo,useState} from "react";
import type { Profile, Role } from "./auth.types";
import { logoutApi } from "./auth.api";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}



type AuthState = {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  logout: () => void;
  isLoading: boolean;
  role: Role | null;
};


export const AuthContext = React.createContext<AuthState | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  // You may want to derive role from profile, for example:
  const role: Role | null = profile ? profile.role : null;

  const value = useMemo<AuthState>(
    () => ({
      profile,
      setProfile,
      logout: () => {
        logoutApi();
        setProfile(null);
      },
      isLoading: false,
      role,
    }),
    [profile]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
