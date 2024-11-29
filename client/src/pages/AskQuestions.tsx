import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateQuestion } from "@/hooks/useCreateQuestion";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createQuestion, loading } = useCreateQuestion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Question submitted:", {
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
    });

    await createQuestion(title, content, tags);

    toast({
      title: "Question Submitted",
      description: "Your question has been submitted for approval.",
    });
    navigate("/pending");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          Submit Question
        </Button>
      </form>
    </div>
  );
};

export default AskQuestion;
