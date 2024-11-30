import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Question, Comment } from "@/types";
import { useLocation, useParams } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import { useState } from "react";
import { useComment } from "@/hooks/useComments";

const QuestionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const question = location.state?.question as Question;

  const [newComment, setNewComment] = useState("");
  const { addComment, loading } = useComment();

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    ...question,
    comments: question.comments || [],
  });

  const handleCommentSubmit = async () => {
    try {
      const response = await addComment(id as string, newComment);
      console.log(response);
      if (response) {
        setCurrentQuestion(response);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <QuestionCard reactDisabled={false} question={currentQuestion} />

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
          disabled={!newComment.trim() || loading}
        >
          {loading ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>

      <div className="mt-4">
        {currentQuestion.comments.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold">Answers</h2>
            {currentQuestion.comments.map((comment: Comment) => (
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
