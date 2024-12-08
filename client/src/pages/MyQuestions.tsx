import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Modal from "../components/Modal";
import { Question } from "@/types";
import { useAllQuestion } from "@/hooks/useAllQuestions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const AllQuestions: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const { getAllQuestion, loading, editQuestion, deleteQuestion } =
    useAllQuestion();
  const [editData, setEditData] = useState<Question | null>(null);
  const [tagsInput, setTagsInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const data = await getAllQuestion();
      if (data) setAllQuestions(data);
    };

    fetchAllQuestions();
  }, []);

  const handleEdit = async () => {
    if (editData) {
      const updatedQuestion = await editQuestion(editData._id, {
        title: editData.title,
        content: editData.content,
        tags: tagsInput.split(",").map((tag) => tag.trim()),
      });
      if (updatedQuestion) {
        setAllQuestions((prev) =>
          prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q))
        );
        setEditData(null);
        setTagsInput("");
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteQuestion(id);
    setAllQuestions((prev) => prev.filter((question) => question._id !== id));
    setDeleteQuestionId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Your Questions</h1>
      <div className="space-y-4">
        {allQuestions.map((question) => (
          <Card key={question._id}>
            <div className="flex justify-between items-center px-6 py-2">
              <CardTitle>{question.title}</CardTitle>
              <div>
                <div
                  className={cn(
                    "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
                    question.isApproved ? `bg-green-500` : `bg-red-500`
                  )}
                >
                  {question.isApproved ? "Approved" : "Pending"}
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatDate(question.createdAt)}
                </p>
              </div>
            </div>{" "}
            <CardContent>
              <p>{question.content}</p>
              <div className="mt-2 space-x-2">
                {question.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Submitted on {new Date(question.createdAt).toLocaleDateString()}
              </p>
              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => {
                  setEditData(question);
                  setTagsInput(question.tags.join(", "));
                  setModalType("edit");
                  setIsModalOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="ml-2"
                onClick={() => {
                  setDeleteQuestionId(question._id);
                  setModalType("delete");
                  setIsModalOpen(true);
                }}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}

        {allQuestions.length === 0 && (
          <div className="flex items-center justify-center">No Questions</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "edit" ? "Edit Question" : "Confirm Deletion"}
      >
        {modalType === "edit" && editData && (
          <>
            <Input
              type="text"
              placeholder="Title"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="mb-2"
            />
            <Textarea
              placeholder="Content"
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
              className="mb-2"
              rows={3}
            />
            <Input
              type="text"
              placeholder="Tags (comma separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mb-2"
            />
            <div className="flex justify-end">
              <Button onClick={handleEdit} className="mt-2">
                Save Changes
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                className="mt-2 ml-2"
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {modalType === "delete" && (
          <div>
            <p>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsModalOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  deleteQuestionId && handleDelete(deleteQuestionId)
                }
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllQuestions;
