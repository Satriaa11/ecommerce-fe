import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/index";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          const userData = localStorage.getItem("user_data");

          if (token && userData) {
            try {
              const user = JSON.parse(userData);
              set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (error) {
              console.error("Error parsing user data:", error);
              localStorage.removeItem("access_token");
              localStorage.removeItem("user_data");
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
