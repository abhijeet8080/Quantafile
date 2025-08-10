"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import Link from "next/link";
import { AnswerSection } from "@/components/Answer/AnswerSection";
import { useGetQuestionFromId } from "@/hooks/questionHooks";
import { changeQuestionStatus, changeVote, deleteQuestion } from "@/services/questionServices";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/userHooks";
import { RequireAuthModal } from "@/components/RequireAuthModal ";
export default function QuestionPage() {
  const { isAuthenticated, showModal } = useRequireAuth();

  
  const { questionId } = useParams();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Vote states
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [loadingVote, setLoadingVote] = useState(false);

  const { question, loading, setQuestion,upvoteCount,downvoteCount, setUpvoteCount, setDownvoteCount } = useGetQuestionFromId(questionId);

  const handleDelete = async () => {
    try {
      await deleteQuestion(questionId, token);
      router.push("/explore");
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };
  const handleStatusChange = async (
    newStatus: "open" | "answered" | "closed"
  ) => {
    try {
      const res = await changeQuestionStatus(questionId,newStatus,token);
      
      setQuestion((prev) =>
        prev ? { ...prev, status: res.data.status } : prev
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!token) {
      toast.error("Please login to vote");
      return;
    }
    if (!question || loadingVote) return;

    setLoadingVote(true);

    try {
      const res = await changeVote("question",questionId, type, token); 

      const { score, upvoteCount, downvoteCount } = res.data;
      setUpvoteCount(upvoteCount);
      setDownvoteCount(downvoteCount);
      setQuestion((prev) => (prev ? { ...prev, score } : prev));

      if (type === "upvote") {
        if (userVote === "upvote") {
          setUpvoteCount((count) => Math.max(count - 1, 0));
          setUserVote(null);
        } else if (userVote === "downvote") {
          setUpvoteCount((count) => count + 1);
          setDownvoteCount((count) => Math.max(count - 1, 0));
          setUserVote("upvote");
        } else {
          setUpvoteCount((count) => count + 1);
          setUserVote("upvote");
        }
      } else {
        if (userVote === "downvote") {
          setDownvoteCount((count) => Math.max(count - 1, 0));
          setUserVote(null);
        } else if (userVote === "upvote") {
          setDownvoteCount((count) => count + 1);
          setUpvoteCount((count) => Math.max(count - 1, 0));
          setUserVote("downvote");
        } else {
          setDownvoteCount((count) => count + 1);
          setUserVote("downvote");
        }
      }
    } catch (err) {
      console.error("Failed to vote", err);
      toast.error("Failed to record your vote. Please try again.");
    } finally {
      setLoadingVote(false);
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
    <div
  className="
  pt-16
    max-w-4xl mx-auto py-10 px-6
    rounded-2xl hover:shadow-xl
    space-y-8
  "
>
  {/* Title + Actions */}
  <div className="flex flex-wrap justify-between items-start gap-4">
    <h1
      className="
        text-4xl font-extrabold
        text-zinc-900 dark:text-zinc-100
        relative
        after:absolute after:left-0 after:-bottom-1 after:h-1.5
        after:w-24
        after:bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
        after:rounded-full
        after:transition-all after:duration-500
      "
    >
      {question.title}
    </h1>

    {isAuthor ? (
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/questions/${questionId}/update`)}
          className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900"
        >
          <Edit size={16} />
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
          onClick={() =>
            handleStatusChange(
              question.status === "open"
                ? "answered"
                : question.status === "answered"
                ? "closed"
                : "open"
            )
          }
          className="
            bg-gradient-to-r from-green-400 via-green-500 to-green-600
            text-white shadow-lg
            hover:scale-[1.05]
            transition-transform duration-300 ease-in-out
          "
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
        <Button
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg hover:scale-[1.05] transition-transform duration-300 ease-in-out"
        >
          <MessageCircle size={16} className="mr-1" />
          Answer this Question
        </Button>
      </Link>
    )}
  </div>

  {/* Author + Meta */}
  <div className="flex items-center gap-4 text-sm text-muted-foreground">
    <Image
      src={question.author.avatar || "/default-avatar.png"}
      alt="Author Avatar"
      width={36}
      height={36}
      className="rounded-full border-2 border-purple-500"
    />
    <span className="font-medium text-zinc-700 dark:text-zinc-300">
      Asked by {question.author._id}
    </span>
    <span className="flex items-center gap-1">
      <Clock size={14} />
      {new Date(question.createdAt).toLocaleDateString()}
    </span>
    <Badge
      variant="default"
      className={`
        select-none
        px-3 py-1 rounded-full
        font-semibold
        ${
          question.status === "answered"
            ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-md shadow-green-400/50"
            : question.status === "closed"
            ? "bg-gradient-to-r from-pink-500 via-red-600 to-pink-700 text-white shadow-md shadow-pink-500/50"
            : "bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 text-white shadow-md shadow-purple-500/50"
        }
      `}
    >
      {question.status}
    </Badge>
  </div>

  {/* Tags */}
  <div className="flex flex-wrap gap-3">
  {question.tags.map((tag) => (
    <Badge
      key={tag._id}
      variant="outline"
      className="
        rounded-full
        border-transparent
        bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
        bg-clip-border
        cursor-pointer
        px-3 py-1
        font-semibold
        text-white
      "
      style={{
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        borderImageSlice: 1,
        borderImageSource:
          "linear-gradient(to right, #7e22ce, #ec4899, #fb923c)",
        WebkitTextStroke: "0.4px transparent",
        textShadow:
          "0 0 8px rgba(255, 182, 193, 0.8), 0 0 6px rgba(255, 160, 122, 0.6)",
      }}
    >
      {tag.name}
    </Badge>
  ))}
</div>


  {/* Description */}
  <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
    <p>{question.description}</p>
  </div>

  {/* Votes & Answers Count */}
  <div className="flex items-center gap-6 pt-6 border-t border-purple-300/30">
    <Button
      variant={userVote === "upvote" ? "default" : "ghost"}
      className={`
        flex items-center gap-2
        rounded-full
        text-purple-600 dark:text-purple-400
        ${userVote === "upvote" ? "bg-purple-100 dark:bg-purple-900" : ""}
        transition-all duration-300 ease-in-out
        hover:scale-[1.1] hover:shadow-lg
      `}
      onClick={() => handleVote("upvote")}
      disabled={loadingVote}
    >
      <ThumbsUp size={20} />
      <span className="font-semibold">{upvoteCount}</span>
    </Button>
    <Button
      variant={userVote === "downvote" ? "default" : "ghost"}
      className={`
        flex items-center gap-2
        rounded-full
        text-pink-600 dark:text-pink-400
        ${userVote === "downvote" ? "bg-pink-100 dark:bg-pink-900" : ""}
        transition-all duration-300 ease-in-out
        hover:scale-[1.1] hover:shadow-lg
      `}
      onClick={() => handleVote("downvote")}
      disabled={loadingVote}
    >
      <ThumbsDown size={20} />
      <span className="font-semibold">{downvoteCount}</span>
    </Button>

    
  </div>

  {/* Answers Section */}
  <AnswerSection
    questionId={questionId as string}
    questionAuthorId={question.author._id}
  />
</div>

  );
}
