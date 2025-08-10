"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { createAnswer } from "@/services/answerServices";
import { useGetQuestionFromId } from "@/hooks/questionHooks";
import { toast } from "sonner";
import { RequireAuthModal } from "@/components/RequireAuthModal ";
import { useRequireAuth } from "@/hooks/userHooks";

export default function AnswerPage() {
      const { isAuthenticated, showModal } = useRequireAuth();
  
  const { questionId } = useParams();
  const router = useRouter();

  const token = useSelector((state: RootState) => state.auth.token);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { question, loading } = useGetQuestionFromId(questionId);

  const handleSubmit = async () => {
    if (!content.trim()) return toast.warning("Answer cannot be empty!");
    setSubmitting(true);
    try {
      await createAnswer(questionId, content, token);
      router.push(`/questions/${questionId}`);
    } catch (err) {
      console.error("Failed to post answer", err);
      toast.error("Failed to submit answer. Please try again.");
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
      <div className="pt-20 max-w-4xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-2/3 rounded-2xl" />
        <Skeleton className="h-4 w-1/2 rounded-2xl" />
      </div>
    );
  }

  if (!question||!question._id) {
    return (
      <p className=" h-[100vh] flex items-center justify-center text-3xl font-extrabold text-purple-700 dark:text-purple-400 mb-3 text-center mt-12 ">
        Question not found.
      </p>
    );
  }

  return (
    <div className="pt-24 max-w-4xl mx-auto py-8 px-6 space-y-8">
      {/* Question Info */}
      <div
        className="
          rounded-2xl
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/20
          p-6
          transition-all duration-300
        "
      >
        <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mb-3">
          {question.title}
        </h1>
        <p className="text-zinc-800 dark:text-zinc-200">{question.description}</p>
      </div>

      {/* Answer Form */}
      <div
        className="
          rounded-2xl
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/20
          p-6
          transition-all duration-300
        "
      >
        <h2 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">
          Your Answer
        </h2>
        <Textarea
          placeholder="Write your answer here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] rounded-lg border border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition"
        />

        {/* Actions */}
        <div className="flex gap-4 mt-6 justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold hover:brightness-105 transition rounded-2xl px-8"
          >
            {submitting ? "Submitting..." : "Post Answer"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/questions/${questionId}`)}
            className="rounded-2xl border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition px-6"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
