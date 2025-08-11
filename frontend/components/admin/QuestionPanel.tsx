'use client';

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "../ConfirmDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

interface Author {
  username: string;
  email: string;
}

interface Tag {
  name: string;
}

export interface QuestionType {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  author: Author | string;
  tags: (Tag | string)[];
}

export function QuestionsPanel() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchQuestions = async () => {
    try {
      const q = new URLSearchParams();
      if (statusFilter) q.set("status", statusFilter === "all" ? "" : statusFilter);
      if (search) q.set("search", search);

      const res = await api.get<QuestionType[]>(`/admin/questions?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQuestions();
  });

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/questions/${id}`, {
        data: { reason: "Admin removal" },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await api.put(`/admin/questions/${id}/status`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card
      className="
        p-6 rounded-2xl
        backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
        shadow-lg shadow-purple-500/20
      
         hover:shadow-xl
      "
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select
          value={statusFilter ?? "all"}
          onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[160px] rounded-2xl border-purple-400">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search title / description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow rounded-2xl border-purple-400"
        />
        <Button
          onClick={fetchQuestions}
          className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:scale-[1.05] transition-transform duration-300 ease-in-out text-white"
        >
          Search
        </Button>
      </div>

      {/* Questions Table */}
      <div className="overflow-x-auto rounded-2xl border border-purple-300/30 shadow-md shadow-purple-300/20">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-t-2xl">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => (
              <TableRow
                key={q._id}
                className="
                  hover:scale-[1.02]
                  hover:shadow-lg
                  transition-transform duration-300 ease-in-out
                  cursor-pointer
                  even:bg-white/50 odd:bg-white/30 dark:even:bg-zinc-900/40 dark:odd:bg-zinc-900/30
                "
              >
                <TableCell className="max-w-[260px] truncate">{q.title}</TableCell>
                <TableCell>
                  {typeof q.author === "string" ? q.author : q.author?.username}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold select-none ${
                      q.status === "open"
                        ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white"
                        : q.status === "answered"
                        ? "bg-gradient-to-r from-purple-500 via-pink-600 to-pink-700 text-white"
                        : "bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 text-white"
                    }`}
                  >
                    {q.status}
                  </span>
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {Array.isArray(q.tags)
                    ? q.tags
                        .map((t) => (typeof t === "string" ? t : t.name))
                        .join(", ")
                    : ""}
                </TableCell>
                <TableCell>
                  {new Date(q.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/questions/${q._id}`)}
                      className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-[1.05] transition-transform"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleStatus(q._id)}
                      className="rounded-2xl"
                    >
                      Toggle Status
                    </Button>

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
                      title="Delete Question?"
                      description="This will permanently delete the question and its answers."
                      confirmText="Delete"
                      onConfirm={() => handleDelete(q._id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
