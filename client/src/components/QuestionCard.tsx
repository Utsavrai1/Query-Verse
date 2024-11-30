// QuestionCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useLikeDislike from "@/hooks/useLikeDislike";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import { Question } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  reactDisabled?: boolean;
  className?: string;
  showStatus?: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  reactDisabled = true,
  className = "",
  showStatus = false,
}) => {
  const {
    likes,
    dislikes,
    handleLike,
    handleDislike,
    userLiked,
    userDisliked,
  } = useLikeDislike(
    question.likes.length,
    question.dislikes.length,
    reactDisabled,
    question.likes,
    question.dislikes
  );

  return (
    <Card key={question._id} className={cn("cursor-pointer", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{question.title}</CardTitle>
          <div>
            {showStatus && (
              <div
                className={cn(
                  "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
                  question.isApproved ? `bg-green-500` : `bg-red-500`
                )}
              >
                {question.isApproved ? "Approved" : "Pending"}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {formatDate(question.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleLike(question._id)}
          >
            <FaThumbsUp
              className={`text-lg ${
                userLiked ? "text-red-500" : "text-gray-500"
              }`}
            />
            <span className="ml-1">{likes}</span>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleDislike(question._id)}
          >
            <FaThumbsDown
              className={`text-lg ${
                userDisliked ? "text-red-500" : "text-gray-500"
              }`}
            />
            <span className="ml-1">{dislikes}</span>
          </div>
          <div className="flex items-center cursor-pointer">
            <FaComment className="text-lg" />
            <span className="ml-1">{question.comments.length}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{question.content}</p>
        {question.tags.length > 0 && (
          <div className="mt-2 space-x-2">
            {question.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default QuestionCard;
