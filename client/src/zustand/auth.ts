import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
  getUserId: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    const decodedToken: any = jwtDecode(token);
    isAdmin = decodedToken.isAdmin || false;
    console.log(isAdmin);
  }

  return {
    token,
    isAdmin,
    setToken: (token) => {
      localStorage.setItem("token", token);
      const decodedToken: any = jwtDecode(token);
      const isAdmin = decodedToken.isAdmin || false;
      set({ token, isAdmin });
    },
    clearToken: () => {
      localStorage.removeItem("token");
      set({ token: null, isAdmin: false });
    },
    getUserId: () => {
      if (!token) {
        return null;
      }
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId as string;
    },
  };
});
