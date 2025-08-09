"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Question } from "@/types/question";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import Link from "next/link";
import { AnswerSection } from "@/components/Answer/AnswerSection";

export default function QuestionPage() {
  const { questionId } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${questionId}`);
        console.log(res.data);
        setQuestion(res.data);
      } catch (err) {
        console.error("Failed to fetch question", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleDelete = async () => {
    try {
      await api.delete(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/explore");
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  const handleStatusChange = async (
    newStatus: "open" | "answered" | "closed"
  ) => {
    try {
      const res = await api.patch(
        `/questions/${questionId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data, "sdf");
      setQuestion((prev) =>
        prev ? { ...prev, status: res.data.status } : prev
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
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

  const isAuthor = currentUser && currentUser._id === question.author._id;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Title */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">{question.title}</h1>

        {isAuthor ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/questions/${questionId}/update`)}
            >
              <Edit size={16} />
              Edit
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 size={14} />
                  Delete
                </Button>
              }
              title="Delete Question?"
              description="This will permanently delete the question and its answers."
              confirmText="Delete"
              onConfirm={handleDelete}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                handleStatusChange(
                  question.status === "open"
                    ? "answered"
                    : question.status === "answered"
                    ? "closed"
                    : "open"
                )
              }
            >
              <CheckCircle2 size={16} />
              {question.status === "open"
                ? "Mark as Answered"
                : question.status === "answered"
                ? "Mark as Closed"
                : "Reopen"}
            </Button>
          </div>
        ) : (
          <Link href={`/questions/${question._id}/answer`}>
            <Button variant="default" size="sm">
              <MessageCircle size={16} className="mr-1" />
              Answer this Question
            </Button>
          </Link>
        )}
      </div>

      {/* Author + Meta */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Image
          src={question.author.avatar || "/default-avatar.png"}
          alt="Author Avatar"
          width={32}
          height={32}
          className="rounded-full border"
        />
        <span>Asked by {question.author._id}</span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {new Date(question.createdAt).toLocaleDateString()}
        </span>
        <Badge
          variant={
            question.status === "answered"
              ? "default"
              : question.status === "closed"
              ? "destructive"
              : "secondary"
          }
        >
          {question.status}
        </Badge>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <Badge key={tag._id} variant="outline">
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Description */}
      <div className="prose dark:prose-invert max-w-none">
        <p>{question.description}</p>
      </div>

      {/* Votes & Answers Count */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button variant="ghost" className="flex items-center gap-1">
          <ThumbsUp size={16} />
          {question.upvoteCount}
        </Button>
        <Button variant="ghost" className="flex items-center gap-1">
          <ThumbsDown size={16} />
          {question.downvoteCount}
        </Button>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle size={16} />
          {question.answerCount} answers
        </div>
      </div>

      {/* Answers Section */}
      <AnswerSection
        questionId={questionId as string}
        questionAuthorId={question.author._id}
      />
    </div>
  );
}
