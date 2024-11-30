import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const usePendingQuestions = () => {
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingQuestions();
  }, []);

  const fetchPendingQuestions = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/pending-questions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPendingQuestions(data);
      } else {
        throw new Error("Failed to fetch pending questions");
      }
    } catch (error) {}
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/approve/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "Question approved successfully",
        });
        fetchPendingQuestions();
      } else {
        throw new Error("Failed to approve question");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve question",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/reject/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Question deleted successfully",
        });
        fetchPendingQuestions();
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  return {
    pendingQuestions,
    handleApprove,
    handleReject,
  };
};

export default usePendingQuestions;
