"use client";

import { useEffect, useState } from "react";
import { QuestionCard } from "@/components/Questions/QuestionCard";
import { Filters } from "@/components/Questions/Filters";
import { PaginationControls } from "@/components/Questions/Pagination";
import { QuestionSkeleton } from "@/components/Questions/QuestionSkeleton";
import { api } from "@/lib/axios";

import { Question } from "@/types/question";
import { onFilterChange } from "@/lib/onFilterChange";

export interface FiltersState {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  answered?: boolean;
  status?: string;

  userId?: string;
  minVotes?: number;
  maxVotes?: number;
  sortBy?: "newest" | "mostVoted" | "mostAnswered" | "trending" | "oldest";
  page?: number;
}
const sortMap: Record<string, string> = {
  newest: "newest",
  mostVoted: "votes",
  mostAnswered: "answers",
  trending: "trending",
  oldest:"oldest"
};


export default function ExplorePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState<FiltersState>({
    keyword: "",
    startDate: undefined,
    endDate: undefined,
    answered: undefined,
    minVotes: undefined,
    maxVotes: undefined,
    userId: undefined,
    sortBy: "newest",
    page: 1,
  });
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", (filters.page ?? 1).toString());

        if (filters.keyword) queryParams.set("keyword", filters.keyword);
        if (filters.sortBy) {
          queryParams.set("sortBy", sortMap[filters.sortBy] || "newest");
        }
        if (filters.status) queryParams.set("status", filters.status);

        if (filters.minVotes)
          queryParams.set("minVotes", filters.minVotes.toString());
        if (filters.maxVotes)
          queryParams.set("maxVotes", filters.maxVotes.toString());
        if (filters.userId) queryParams.set("user", filters.userId);
        if (filters.startDate) queryParams.set("startDate", filters.startDate);
        if (filters.endDate) queryParams.set("endDate", filters.endDate);

        const res = await api.get(`/questions?${queryParams.toString()}`);
        console.log(res.data.questions.tags);
        setQuestions(res.data.questions);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters, page]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Explore Questions</h1>
      <Filters
        filters={filters}
        onFilterChange={(updated) => onFilterChange(updated, setFilters)}
      />
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <QuestionSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q._id} question={q} />
          ))}
        </div>
      )}
      <PaginationControls
        page={filters.page ?? 1}
        setPage={(newPage) =>
          setFilters((prev) => ({ ...prev, page: newPage }))
        }
        totalPages={totalPages}
      />
    </main>
  );
}
