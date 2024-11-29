import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/zustand/auth";

interface LoginResponse {
  token: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuthStore();

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:3000/api/v1/auth/signup",
        { name, email, password }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);

      return token;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
