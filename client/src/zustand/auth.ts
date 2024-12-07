import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  isAdmin: boolean;
  userId: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  let isAdmin = false;
  let userId: string | null = null;

  if (token) {
    const decodedToken: any = jwtDecode(token);
    isAdmin = decodedToken.isAdmin || false;
    userId = decodedToken.userId || null;
  }

  return {
    token,
    isAdmin,
    userId,
    setToken: (token) => {
      localStorage.setItem("token", token);
      const decodedToken: any = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin || false;
      const userId = decodedToken.userId as string;
      set({ token, isAdmin, userId });
    },
    clearToken: () => {
      localStorage.removeItem("token");
      set({ token: null, isAdmin: false, userId: null });
    },
  };
});
