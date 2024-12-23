import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/zustand/auth";
import { Question } from "@/types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = async (
    id: string,
    content: string
  ): Promise<Question | null> => {
    setLoading(true);
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/comment/${id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError(null);
      return response.data.question;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error while adding answer");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
};
