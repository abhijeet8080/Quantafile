"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuestionDetails } from "@/hooks/questionHooks";
import { updateQuestion } from "@/lib/api/question";

export default function UpdateQuestionPage() {
  const { questionId } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const [submitting, setSubmitting] = useState(false);

  const {
    question,
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    loading,
  } = useQuestionDetails(questionId);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      updateQuestion(
        questionId,
        title,
        description,
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        token
      );
      toast.success("Question updated successfully.");
      router.push(`/questions/${questionId}`);
    } catch (err) {
      toast.error("Failed to update question.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-1/4" />
      </div>
    );
  }

  if (!question) {
    return (
      <p className="text-center mt-12 text-muted-foreground">
        Question not found.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Update Question</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your question in detail..."
            rows={6}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. javascript, react, nodejs"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Question"}
          </Button>
        </div>
      </form>
    </div>
  );
}
