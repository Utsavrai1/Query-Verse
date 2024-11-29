import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/zustand/auth";

export interface PendingQuestion {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export const usePendingQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPendingQuestion = async (): Promise<PendingQuestion[] | null> => {
    setLoading(true);
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const response = await axios.get<PendingQuestion[]>(
        "http://localhost:3000/api/v1/question/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error fetching pending questions"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editQuestion = async (
    id: string,
    updatedData: Partial<PendingQuestion>
  ) => {
    const token = useAuthStore.getState().token;
    try {
      const response = await axios.put<PendingQuestion>(
        `http://localhost:3000/api/v1/question/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating question");
      return null;
    }
  };

  const deleteQuestion = async (id: string) => {
    const token = useAuthStore.getState().token;
    try {
      await axios.delete(`http://localhost:3000/api/v1/question/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting question");
    }
  };

  return { getPendingQuestion, loading, error, editQuestion, deleteQuestion };
};