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

  const validateInputs = () => {
    if (title.trim().length < 10 || title.trim().length > 100) {
      toast({
        title: "Invalid Title",
        description: "Title must be between 10 and 100 characters.",
        variant: "destructive",
      });
      return false;
    }

    if (content.trim().length < 20) {
      toast({
        title: "Invalid Content",
        description: "Content must be at least 20 characters.",
        variant: "destructive",
      });
      return false;
    }

    const tagList = tags.split(",").map((tag) => tag.trim());
    if (tagList.length === 0 || tagList.some((tag) => tag.length === 0)) {
      toast({
        title: "Invalid Tags",
        description: "Please provide at least one valid tag.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    console.log("Question submitted:", {
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
    });

    try {
      await createQuestion(title, content, tags);
      toast({
        title: "Question Submitted",
        description: "Your question has been submitted for approval.",
      });
      navigate("/pending");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your question.",
        variant: "destructive",
      });
    }
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
