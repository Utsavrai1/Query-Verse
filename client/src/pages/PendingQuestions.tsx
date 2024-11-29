import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  PendingQuestion,
  usePendingQuestion,
} from "@/hooks/usePendingQuestion";
import Modal from "../components/Modal";

const PendingQuestions: React.FC = () => {
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>(
    []
  );
  const { getPendingQuestion, loading, editQuestion, deleteQuestion } =
    usePendingQuestion();
  const [editData, setEditData] = useState<PendingQuestion | null>(null);
  const [tagsInput, setTagsInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingQuestions = async () => {
      const data = await getPendingQuestion();
      if (data) setPendingQuestions(data);
    };

    fetchPendingQuestions();
  }, []);

  const handleEdit = async () => {
    if (editData) {
      const updatedQuestion = await editQuestion(editData._id, {
        title: editData.title,
        content: editData.content,
        tags: tagsInput.split(",").map((tag) => tag.trim()),
      });
      if (updatedQuestion) {
        setPendingQuestions((prev) =>
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
    setPendingQuestions((prev) =>
      prev.filter((question) => question._id !== id)
    );
    setDeleteQuestionId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Your Pending Questions</h1>
      <div className="space-y-4">
        {pendingQuestions.map((question) => (
          <Card key={question._id}>
            <CardHeader>
              <CardTitle>{question.title}</CardTitle>
            </CardHeader>
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

        {pendingQuestions.length === 0 && (
          <div className="flex items-center justify-center">
            No Pending Questions
          </div>
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

export default PendingQuestions;
