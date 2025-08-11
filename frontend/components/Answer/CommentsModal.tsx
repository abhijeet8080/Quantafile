"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addCommentToAnswer } from "@/services/answerServices";
import Image from "next/image";
import Link from "next/link";

interface Comment {
  _id?: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  answerId: string;
  comments: Comment[];
  token: string | null;
  onCommentAdded?: (newComment: Comment) => void;
}

export function CommentsModal({
  open,
  onClose,
  answerId,
  comments,
  token,
  onCommentAdded,
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("comments",comments)
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const res = await addCommentToAnswer(answerId, newComment.trim(), token);
      const updatedAnswer = res.data;
      const addedComment =
        updatedAnswer.comments[updatedAnswer.comments.length - 1];

      if (onCommentAdded) onCommentAdded(addedComment);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-lg
          rounded-2xl
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/20
          transition-all duration-300 ease-in-out
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Comments
          </DialogTitle>
        </DialogHeader>

        {/* Comments list */}
        <ScrollArea
  className="
    h-64
    border border-purple-300/30 dark:border-purple-700/40
    rounded-md p-4
    bg-white/50 dark:bg-zinc-800/50
    backdrop-blur-sm
    space-y-4
  "
>
  {comments.length > 0 ? (
    comments.map((c, index) => (
      <div
        key={c._id ?? index}
        className="border-b border-purple-200/30 dark:border-purple-700/50 pb-3 flex gap-3 items-start"
      >
        <Image
          src={c.author.avatar || "/assets/default-avatar.png"}
          alt={c.author.username||'user"s profile'}
          width={32}
          height={32}
          className="rounded-full border border-purple-400 dark:border-purple-600 shrink-0"
        />
        <div>
          <Link href={`/profile/${c.author._id}`} className="text-sm font-semibold text-purple-700 dark:text-purple-400">
            {c.author.username}
          </Link>
          <p className="text-sm text-zinc-900 dark:text-zinc-200">{c.content}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-muted-foreground text-sm">No comments yet.</p>
  )}
</ScrollArea>

        {/* Add comment */}
        <div className="flex gap-3 mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="
              focus:border-purple-500 focus:ring-2 focus:ring-purple-400
              transition-all duration-300
              rounded-lg
            "
          />
          <Button
            onClick={handleAddComment}
            disabled={loading || !token}
            className="
              bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-[1.03]
              transition-transform duration-300 ease-in-out
              rounded-lg
              px-6
            "
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
