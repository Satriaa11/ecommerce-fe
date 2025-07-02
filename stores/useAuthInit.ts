import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthInit = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
};
