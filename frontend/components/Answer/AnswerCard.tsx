"use client";

import { Answer } from "@/types/answer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageCircle, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { api } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId: string; // To check if current user can mark best answer
}

export const AnswerCard = ({ answer, questionAuthorId }: AnswerCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true });
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state:RootState)=>state.auth.token)
  const router = useRouter();
    const { questionId } = useParams();
  const isAnswerAuthor = currentUser?._id === answer.author._id;
  const isQuestionAuthor = currentUser?._id === questionAuthorId;

  const handleVote = async (type: "upvote" | "downvote") => {
    try {
      await api.post(`/answers/${answer._id}/${type}`, {}, {
        headers: { Authorization: `Bearer ${currentUser?.token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(currentUser)

      await api.delete(`/answers/${answer._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleMarkBest = async () => {
    try {
      await api.patch(`/answers/${answer._id}/best`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
          alt={answer.author.username||'user avatar'}
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
          <Button variant="ghost" size="sm" onClick={() => handleVote("upvote")}>
            <ThumbsUp size={16} /> {answer.upvotes.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleVote("downvote")}>
            <ThumbsDown size={16} /> {answer.downvotes.length}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle size={16} /> {answer.comments.length}
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
                onClick={() => router.push(`/questions/${questionId}/answer/${answer._id}/update`)}
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
