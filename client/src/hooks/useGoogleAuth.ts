import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/zustand/auth";

interface GoogleLoginResponse {
  token: string;
}

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuthStore();

  const googleLogin = async (googleToken: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<GoogleLoginResponse>(
        "http://localhost:3000/api/v1/auth/google",
        { token: googleToken }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);

      return token;
    } catch (err: any) {
      setError(err.response?.data?.message || "Google login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { googleLogin, loading, error };
};
