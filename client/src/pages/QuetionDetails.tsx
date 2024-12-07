import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import { useState, useEffect } from "react";
import { useComment } from "@/hooks/useComments";
import { useQuestionById } from "@/hooks/useApprovedQuestion";
import Loader from "@/components/Loader";

const QuestionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getQuestionById, loading, error, question } = useQuestionById();
  const { addComment, loading: commentLoading } = useComment();

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      getQuestionById(id);
    }
  }, [id]);

  const handleCommentSubmit = async () => {
    try {
      const response = await addComment(id as string, newComment);
      console.log(response);
      if (response) {
        getQuestionById(id as string);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!question) {
    return <div>No question found.</div>;
  }

  return (
    <div className="p-4">
      <QuestionCard reactDisabled={false} question={question} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Answer this Question</h3>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your answer here..."
          className="my-4"
          rows={4}
        />
        <Button
          onClick={handleCommentSubmit}
          disabled={!newComment.trim() || commentLoading}
        >
          {commentLoading ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>

      <div className="mt-4">
        {question.comments.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold">Answers</h2>
            {question.comments.map((comment) => (
              <Card
                key={comment._id}
                className="mb-4 p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <CardContent className="flex items-start space-x-4">
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="font-semibold">{comment.user.name}</div>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm dark:text-white">{comment.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center">
            No Answers yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
