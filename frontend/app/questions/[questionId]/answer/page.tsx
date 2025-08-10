"use client";

import {  useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { createAnswer } from "@/services/answerServices";
import { useGetQuestionFromId } from "@/hooks/questionHooks";
import { toast } from "sonner";

export default function AnswerPage() {
  const { questionId } = useParams();
  const router = useRouter();

  const token = useSelector((state: RootState) => state.auth.token);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {question,loading}=useGetQuestionFromId(questionId)
  

  const handleSubmit = async () => {
    if (!content.trim()) return toast.warning("Answer cannot be empty!");
    setSubmitting(true);
    try {
      createAnswer(questionId,content,token)
      router.push(`/questions/${questionId}`);
    } catch (err) {
      console.error("Failed to post answer", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!question) {
    return <p className="text-center mt-12 text-muted-foreground">Question not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Question Info */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
        <p className="text-muted-foreground">{question.description}</p>
      </div>

      {/* Answer Form */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Answer</h2>
        <Textarea
          placeholder="Write your answer here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Post Answer"}
        </Button>
        <Button variant="outline" onClick={() => router.push(`/questions/${questionId}`)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
