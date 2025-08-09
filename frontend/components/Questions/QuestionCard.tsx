"use client";

import { Question } from "@/types/question";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../ConfirmDialog";

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(question.createdAt), {
    addSuffix: true,
  });
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const isAuthor = currentUser && currentUser._id === question.author._id;

  const handleDelete = async () => {
    try {
      await api.delete(`/questions/${question._id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleStatusChange = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const newStatus =
        question.status === "open"
          ? "answered"
          : question.status === "answered"
          ? "closed"
          : "open";
      await api.patch(`/questions/${question._id}/status`, {
        status: newStatus,
      });
      window.location.reload();
    } catch (err) {
      console.error("Status change failed", err);
    }
  };

  return (
    <div className="border border-border p-4 rounded-lg shadow-sm hover:shadow transition bg-background space-y-3">
      {/* Title + Status */}
      <div className="flex items-start justify-between mb-1">
        <Link href={`/questions/${question._id}`} className="flex-1">
          <h2 className="text-lg font-semibold">{question.title}</h2>
        </Link>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            question.status === "answered"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : question.status === "closed"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {question.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-3">
        {question.description}
      </p>

      {/* Tags */}
      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Author, Time, Votes */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {question.author.avatar ? (
            <Image
              src={question.author.avatar}
              alt="Author avatar"
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted" />
          )}
          <span className="truncate max-w-[100px]">
            @{question.author._id.slice(0, 6)}
          </span>
          <span className="opacity-70">• {timeAgo}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>🗳️ {question.upvoteCount}</span>
          <span>💬 {question.answerCount}</span>
        </div>
      </div>

      {/* Author Controls or Answer Button */}
      {isAuthor ? (
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/questions/edit/${question._id}`);
            }}
          >
            <Edit size={14} />
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
          <Button variant="secondary" size="sm" onClick={handleStatusChange}>
            <CheckCircle2 size={14} />
            {question.status === "open"
              ? "Mark as Answered"
              : question.status === "answered"
              ? "Mark as Closed"
              : "Reopen"}
          </Button>
        </div>
      ) : (
        <div className="pt-2 border-t">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              if (!currentUser) {
                router.push("/login");
              } else {
                router.push(`/questions/${question._id}#answer-form`);
              }
            }}
          >
            <MessageCircle size={14} className="mr-1" />
            Answer this Question
          </Button>
        </div>
      )}
    </div>
  );
};
