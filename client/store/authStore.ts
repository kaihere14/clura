import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => {
        if (typeof window !== "undefined") {
          document.cookie = "clura_token=; max-age=0; path=/";
        }
        set({ token: null, user: null });
      },
    }),
    { name: "clura_auth" },
  ),
);
