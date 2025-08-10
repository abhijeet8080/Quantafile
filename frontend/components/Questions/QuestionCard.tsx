"use client";

import { Question } from "@/types/question";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../ConfirmDialog";
import { changeQuestionStatus, deleteQuestion } from "@/services/questionServices";

interface QuestionCardProps {
  question: Question;
  className?: string;
}

export const QuestionCard = ({ question, className = "" }: QuestionCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(question.createdAt), {
    addSuffix: true,
  });
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const isAuthor = currentUser && currentUser._id === question.author._id;

  const handleDelete = async () => {
    try {
      await deleteQuestion(question._id, token);
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
      await changeQuestionStatus(question._id, newStatus, token);
      window.location.reload();
    } catch (err) {
      console.error("Status change failed", err);
    }
  };

  // Status badge styles with gradient backgrounds
  const statusStyles = {
    open: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-300",
    answered:
      "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-md",
    closed: "bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white shadow-md",
  };

  return (
    <div
      className={`bg-white/60 dark:bg-zinc-900/70 backdrop-blur-md border border-purple-300 dark:border-purple-700 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 ${className}`}
    >
      {/* Title + Status */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/questions/${question._id}`} className="flex-1 group">
          <h2 className="text-xl font-bold text-purple-800 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
            {question.title}
          </h2>
        </Link>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide select-none ${
            statusStyles[question.status] || statusStyles.open
          }`}
        >
          {question.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
        {question.description}
      </p>

      {/* Tags */}
      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag) => (
            <span
              key={tag._id}
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 text-white px-3 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:brightness-110 transition"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Author, Time, Votes */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex items-center gap-2">
          {question.author.avatar ? (
            <Image
              src={question.author.avatar}
              alt="Author avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          )}
          <span className="truncate max-w-[110px] font-semibold text-purple-700 dark:text-purple-400">
            @{question.author._id.slice(0, 6)}
          </span>
          <span className="opacity-75">• {timeAgo}</span>
        </div>
        <div className="flex items-center gap-5 text-purple-700 dark:text-purple-400 font-semibold">
          <span>🗳️ {question.upvoteCount}</span>
          <span>💬 {question.answerCount}</span>
        </div>
      </div>

      {/* Author Controls or Answer Button */}
      {isAuthor ? (
        <div className="flex flex-wrap gap-3 pt-3 border-t border-purple-300 dark:border-purple-700">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/questions/${question._id}/update`);
            }}
            className="flex items-center gap-1 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 transition"
          >
            <Edit size={14} />
            Edit
          </Button>
          <ConfirmDialog
            trigger={
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
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
            onClick={handleStatusChange}
            className="flex items-center gap-1"
          >
            <CheckCircle2 size={14} />
            {question.status === "open"
              ? "Mark as Answered"
              : question.status === "answered"
              ? "Mark as Closed"
              : "Reopen"}
          </Button>
        </div>
      ) : (
        <div className="pt-3 border-t border-purple-300 dark:border-purple-700">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              if (!currentUser) {
                router.push("/login");
              } else {
                router.push(`/questions/${question._id}/answer`);
              }
            }}
            className="flex items-center gap-1"
          >
            <MessageCircle size={14} />
            Answer this Question
          </Button>
        </div>
      )}
    </div>
  );
};
