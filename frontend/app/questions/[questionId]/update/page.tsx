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
import { updateQuestion } from "@/services/questionServices";
import { useRequireAuth } from "@/hooks/userHooks";
import { RequireAuthModal } from "@/components/RequireAuthModal ";

export default function UpdateQuestionPage() {
      const { isAuthenticated, showModal } = useRequireAuth();
  
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
      await updateQuestion(
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
  if (!isAuthenticated) {
        return (
          <>
            <RequireAuthModal open={showModal}  />
          </>
        );
      }
  if (loading) {
    return (
      <div
        className="
          max-w-3xl mx-auto py-12 px-6
          rounded-2xl
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/20
          space-y-6
        "
      >
        <Skeleton className="h-10 w-full rounded-lg bg-purple-200/50 dark:bg-purple-800/50 animate-pulse" />
        <Skeleton className="h-32 w-full rounded-lg bg-purple-200/50 dark:bg-purple-800/50 animate-pulse" />
        <Skeleton className="h-10 w-1/3 rounded-lg bg-purple-200/50 dark:bg-purple-800/50 animate-pulse" />
      </div>
    );
  }

  if (!question) {
    return (
      <p className="text-center mt-12 text-muted-foreground text-lg font-semibold">
        Question not found.
      </p>
    );
  }

  return (
    <div
      className="
        mt-32
        max-w-3xl mx-auto py-12 px-8
        rounded-2xl
        backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
        shadow-lg shadow-purple-500/20
        transition-all duration-300 ease-in-out
      "
    >
      <h1 className="text-3xl font-extrabold mb-8 text-zinc-900 dark:text-zinc-100">
        Update Question
      </h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question title"
            className="
              focus:border-purple-500 focus:ring-2 focus:ring-purple-400
              transition-all duration-300
            "
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your question in detail..."
            rows={6}
            className="
              focus:border-purple-500 focus:ring-2 focus:ring-purple-400
              transition-all duration-300
            "
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
            Tags (comma separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. javascript, react, nodejs"
            className="
              focus:border-purple-500 focus:ring-2 focus:ring-purple-400
              transition-all duration-300
            "
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="
              bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
              text-white
              hover:scale-[1.05]
              transition-transform duration-300 ease-in-out
            "
          >
            {submitting ? "Updating..." : "Update Question"}
          </Button>
        </div>
      </form>
    </div>
  );
}
