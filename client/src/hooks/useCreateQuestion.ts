import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/zustand/auth";

export const useCreateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuestion = async (
    title: string,
    content: string,
    tags: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      await axios.post(
        "http://localhost:3000/api/v1/question",
        { title, content, tags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error while creating question");
    } finally {
      setLoading(false);
    }
  };

  return { createQuestion, loading, error };
};