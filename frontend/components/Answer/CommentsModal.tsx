// components/CommentsModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addCommentToAnswer } from "@/services/answerServices";

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
  onCommentAdded?: (newComment: Comment) => void; // optional callback
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const res = await addCommentToAnswer(answerId, newComment.trim(), token);

      // Backend returns the updated answer with comments
      const updatedAnswer = res.data;
      const addedComment = updatedAnswer.comments[updatedAnswer.comments.length - 1];

      if (onCommentAdded) {
        onCommentAdded(addedComment);
      }

      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        {/* Comments list */}
        <ScrollArea className="h-64 border rounded-md p-2">
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div key={c._id ?? index} className="mb-3 border-b pb-2">
                <p className="text-sm font-semibold">{c.author.username}</p>
                <p className="text-sm">{c.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No comments yet.</p>
          )}
        </ScrollArea>

        {/* Add comment */}
        <div className="flex gap-2 mt-3">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button onClick={handleAddComment} disabled={loading || !token}>
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
