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
import { CommentsModal } from "@/components/Answer/CommentsModal"; // path adjusted as needed

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId: string;
}

export const AnswerCard = ({ answer, questionAuthorId }: AnswerCardProps) => {
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

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!token) {
      toast.error("Please login to vote");
      return;
    }

    setLoadingVote(true);

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
    <div className="border border-border p-4 rounded-lg bg-background space-y-3">
      {/* Author & Meta */}
      <div className="flex items-center gap-3">
        <Image
          src={answer.author.avatar || "/assets/default-avatar.png"}
          alt={answer.author.username || "user avatar"}
          width={32}
          height={32}
          className="rounded-full border"
        />
        <div>
          <p className="font-medium">{answer.author.username}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {answer.isBestAnswer && (
          <Badge variant="default" className="ml-auto bg-green-500 text-white">
            Best Answer
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <p>{answer.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t pt-2">
        <div className="flex gap-2">
          <Button
            variant={userVote === "upvote" ? "default" : "ghost"}
            className="flex items-center gap-1"
            onClick={() => handleVote("upvote")}
            disabled={loadingVote}
          >
            <ThumbsUp size={16} />
            {upvoteCount}
          </Button>
          <Button
            variant={userVote === "downvote" ? "default" : "ghost"}
            className="flex items-center gap-1"
            onClick={() => handleVote("downvote")}
            disabled={loadingVote}
          >
            <ThumbsDown size={16} />
            {downvoteCount}
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

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommentsOpen(true)}
          >
            <MessageCircle size={16} /> {comments.length}
          </Button>
        </div>

        <div className="flex gap-2">
          {isQuestionAuthor && !answer.isBestAnswer && (
            <Button variant="secondary" size="sm" onClick={handleMarkBest}>
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
              >
                <Edit size={14} /> Edit
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="destructive" size="sm">
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
