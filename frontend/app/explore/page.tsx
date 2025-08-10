"use client";

import {  useMemo, useState } from "react";
import { QuestionCard } from "@/components/Questions/QuestionCard";
import { Filters } from "@/components/Questions/Filters";
import { PaginationControls } from "@/components/Questions/Pagination";
import { QuestionSkeleton } from "@/components/Questions/QuestionSkeleton";

import { onFilterChange } from "@/lib/onFilterChange";
import { useGetQuestionsWithFilters } from "@/hooks/questionHooks";

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
const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", (filters.page ?? 1).toString());
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.sortBy) params.set("sortBy", sortMap[filters.sortBy] || "newest");
    if (filters.status) params.set("status", filters.status);
    if (filters.minVotes) params.set("minVotes", filters.minVotes.toString());
    if (filters.maxVotes) params.set("maxVotes", filters.maxVotes.toString());
    if (filters.userId) params.set("user", filters.userId);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    return params;
  }, [filters]);

   const { questions, totalPages, loading } = useGetQuestionsWithFilters(queryParams);
  

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
