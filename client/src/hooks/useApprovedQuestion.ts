import { useState } from "react";
import { useAuthStore } from "@/zustand/auth";
import axios from "axios";
import { Question } from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useApprovedQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tags, setTags] = useState<string[]>([]);

  const getApprovedQuestion = async (
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    tags: string[] = []
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    const token = useAuthStore.getState().token;

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        searchText,
        tags: tags.join(","),
      });

      const response = await axios.get<{
        questions: Question[];
        totalQuestions: number;
        totalPages: number;
        currentPage: number;
      }>(`${BACKEND_URL}/api/v1/question?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions(response.data.questions);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error fetching approved questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const getTags = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<string[]>(
        `${BACKEND_URL}/api/v1/question/tags/`
      );

      setTags(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching tags");
    } finally {
      setLoading(false);
    }
  };

  return {
    getApprovedQuestion,
    getTags,
    questions,
    loading,
    error,
    totalPages,
    currentPage,
    tags,
  };
};

export const useQuestionById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const getQuestionById = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Question>(
        `${BACKEND_URL}/api/v1/question/id/${id}`
      );
      setQuestion(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching question");
    } finally {
      setLoading(false);
    }
  };
  return { getQuestionById, loading, error, question };
};
