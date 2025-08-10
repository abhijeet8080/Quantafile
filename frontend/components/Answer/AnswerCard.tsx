"use client";

import { Answer } from "@/types/answer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { deleteAnswer, markBestAnswer } from "@/services/answerServices";
import { useState } from "react";
import { changeVote } from "@/services/questionServices";
import { toast } from "sonner";
import { CommentsModal } from "@/components/Answer/CommentsModal";
import Link from "next/link";

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId: string;
}

export const AnswerCard = ({ answer, questionAuthorId }: AnswerCardProps) => {
  console.log(answer)
  const timeAgo = formatDistanceToNow(new Date(answer.createdAt), {
    addSuffix: true,
  });
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [loadingVote, setLoadingVote] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const router = useRouter();
  const { questionId } = useParams();
  const isAnswerAuthor = currentUser?._id === answer.author._id;
  const isQuestionAuthor = currentUser?._id === questionAuthorId;
  const [upvoteCount, setUpvoteCount] = useState(answer.upvotes.length);
  const [downvoteCount, setDownvoteCount] = useState(answer.downvotes.length);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [comments, setComments] = useState(answer.comments);

  // For vote button pulse animation
  const [pulseUp, setPulseUp] = useState(false);
  const [pulseDown, setPulseDown] = useState(false);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!token) {
      toast.error("Please login to vote");
      return;
    }

    setLoadingVote(true);

    // Trigger pulse animation
    if (type === "upvote") {
      setPulseUp(true);
      setTimeout(() => setPulseUp(false), 300);
    } else {
      setPulseDown(true);
      setTimeout(() => setPulseDown(false), 300);
    }

    try {
      const res = await changeVote("answer", answer._id, type, token);

      const { upvoteCount, downvoteCount } = res.data;
      setUpvoteCount(upvoteCount);
      setDownvoteCount(downvoteCount);

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

  const handleDelete = async () => {
    try {
      await deleteAnswer(answer._id, token);
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleMarkBest = async () => {
    try {
      await markBestAnswer(answer._id, token);
      window.location.reload();
    } catch (err) {
      console.error("Mark best answer failed", err);
    }
  };

  return (
    <div
      className="
        rounded-2xl
        backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
        shadow-lg shadow-purple-500/10
        p-6 space-y-4
        transition-all duration-300 ease-in-out
        hover:scale-[1.02] hover:shadow-xl
      "
    >
      {/* Author & Meta */}
      <div className="flex items-center gap-4">
        <Image
          src={answer.author.avatar || "/assets/default-avatar.png"}
          alt={answer.author.username || "user avatar"}
          width={40}
          height={40}
          className="rounded-full border border-purple-400"
        />
        <div>
          <Link href={`/profile/${answer.author._id}`} className="font-semibold text-zinc-900 dark:text-zinc-100">
            {answer.author.username}
          </Link>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>

        {answer.isBestAnswer && (
          <Badge
            variant="default"
            className="
              ml-auto
              bg-gradient-to-r from-green-400 via-green-500 to-green-600
              text-white
              shadow-md shadow-green-400/40
              font-semibold
              px-3 py-1 rounded-full
              select-none
            "
          >
            Best Answer
          </Badge>
        )}
      </div>

      {/* Content */}
      <div
        className="
          prose prose-sm dark:prose-invert max-w-none
          text-zinc-800 dark:text-zinc-200
          select-text
        "
      >
        <p>{answer.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-purple-300/30 pt-3">
        <div className="flex gap-3">
          {/* Upvote */}
          <Button
            variant="ghost"
            onClick={() => handleVote("upvote")}
            disabled={loadingVote}
            className={`
              flex items-center gap-1
              rounded-full
              text-purple-600 dark:text-purple-400
              ${userVote === "upvote" ? "bg-purple-100 dark:bg-purple-900" : ""}
              transition-all duration-300 ease-in-out
              hover:scale-[1.1] hover:shadow-lg
              ${pulseUp ? "animate-pulse" : ""}
            `}
          >
            <ThumbsUp size={18} />
            <span className="font-semibold">{upvoteCount}</span>
          </Button>

          {/* Downvote */}
          <Button
            variant="ghost"
            onClick={() => handleVote("downvote")}
            disabled={loadingVote}
            className={`
              flex items-center gap-1
              rounded-full
              text-pink-600 dark:text-pink-400
              ${userVote === "downvote" ? "bg-pink-100 dark:bg-pink-900" : ""}
              transition-all duration-300 ease-in-out
              hover:scale-[1.1] hover:shadow-lg
              ${pulseDown ? "animate-pulse" : ""}
            `}
          >
            <ThumbsDown size={18} />
            <span className="font-semibold">{downvoteCount}</span>
          </Button>

          {/* Comments */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommentsOpen(true)}
            className="
              flex items-center gap-1
              text-zinc-600 dark:text-zinc-400
              hover:text-purple-600 dark:hover:text-purple-400
              transition-colors duration-300 ease-in-out
            "
          >
            <MessageCircle size={16} /> {comments.length}
          </Button>

          <CommentsModal
            open={commentsOpen}
            onClose={() => setCommentsOpen(false)}
            answerId={answer._id}
            comments={comments}
            token={token}
            onCommentAdded={(newComment) => {
              setComments((prev) => [...prev, newComment]);
            }}
          />
        </div>

        {/* Right action buttons */}
        <div className="flex gap-2">
          {isQuestionAuthor && !answer.isBestAnswer && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkBest}
              className="flex items-center gap-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-lg"
            >
              <CheckCircle2 size={14} /> Mark Best
            </Button>
          )}

          {isAnswerAuthor && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(
                    `/questions/${questionId}/answer/${answer._id}/update`
                  )
                }
                className="flex items-center gap-1 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900"
              >
                <Edit size={14} /> Edit
              </Button>

              <ConfirmDialog
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                }
                title="Delete Answer?"
                description="This will permanently delete your answer."
                confirmText="Delete"
                onConfirm={handleDelete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
