import React, {createContext,useContext,useMemo,useState} from "react";
import type { Profile } from "./auth.types";
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
};

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);


  const value = useMemo<AuthState>(
    () => ({
      profile,
      setProfile,
      logout: () => {
        logoutApi();
        setProfile(null);
      },
      isLoading: false,
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