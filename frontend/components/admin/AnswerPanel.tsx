'use client';

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ConfirmDialog } from "../ConfirmDialog";

interface Author {
  _id: string;
  username: string;
  email: string;
}

interface QuestionRef {
  _id: string;
  title: string;
}

export interface AnswerType {
  _id: string;
  content: string;
  author: Author | string;
  question: QuestionRef | string;
  createdAt: string;
}

export function AnswersPanel() {
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchAnswers = async () => {
    try {
      const res = await api.get<AnswerType[]>("/admin/answers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(res.data);
    } catch (e) {
      console.error("Failed to fetch answers:", e);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, );

  const deleteAnswer = async (id: string) => {
    try {
      await api.delete(`/admin/answers/${id}`, {
        data: { reason: "Admin removal" },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnswers();
    } catch (e) {
      console.error("Failed to delete answer:", e);
    }
  };

  return (
    <Card
      className="
        p-6 rounded-2xl
        backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
        shadow-lg shadow-purple-500/20
        transition-all duration-300 ease-in-out
        hover:scale-[1.01] hover:shadow-xl
      "
    >
      <div className="overflow-x-auto rounded-2xl border border-purple-300/30 shadow-md shadow-purple-300/20">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-t-2xl">
            <TableRow>
              <TableHead>Answer</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers.map((a) => (
              <TableRow
                key={a._id}
                className="
                  hover:scale-[1.02]
                  hover:shadow-lg
                  transition-transform duration-300 ease-in-out
                  cursor-pointer
                  even:bg-white/50 odd:bg-white/30 dark:even:bg-zinc-900/40 dark:odd:bg-zinc-900/30
                "
              >
                <TableCell className="max-w-[420px] truncate">{a.content}</TableCell>
                <TableCell>{typeof a.author === "string" ? a.author : a.author?.username}</TableCell>
                <TableCell>{typeof a.question === "string" ? a.question : a.question?.title}</TableCell>
                <TableCell>
                  {new Date(a.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1 rounded-2xl"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    }
                    title="Delete Answer?"
                    description="This will permanently delete the answer."
                    confirmText="Delete"
                    onConfirm={() => deleteAnswer(a._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
