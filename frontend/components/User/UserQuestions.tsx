"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { PaginationControls } from "../Questions/Pagination";
import { QuestionCard } from "../Questions/QuestionCard";
import Link from "next/link";
import { Button } from "../ui/button";
import { useGetQuestionsWithFilters } from "@/hooks/questionHooks";

const QUESTIONS_PER_PAGE = 5;

export default function UserQuestions({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (userId) params.set("user", userId);
    params.set("page", page.toString());
    params.set("limit", QUESTIONS_PER_PAGE.toString());
    return params;
  }, [userId, page]);

  const { questions, totalPages, loading } = useGetQuestionsWithFilters(queryParams);

  if (loading) {
    return (
      <div className="space-y-6 mt-8">
        {Array.from({ length: QUESTIONS_PER_PAGE }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-20 w-full rounded-2xl bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-5 text-center text-purple-700 dark:text-purple-400">
        <div className="text-5xl">🤔</div>
        <h3 className="text-xl font-semibold">No questions asked yet</h3>
        <p className="max-w-xs text-sm text-purple-600 dark:text-purple-300">
          It looks like you haven’t asked any questions. Start a new discussion!
        </p>
        <Link href="/ask" passHref>
          <Button
            variant="default"
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white hover:brightness-110 transition"
          >
            Ask Your First Question
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">
          Questions Asked
        </h3>
        <Link href="/ask" passHref>
          <Button
            size="sm"
            variant="outline"
            className="border-purple-600 text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800 dark:border-purple-500 dark:text-purple-300"
          >
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="space-y-5">
        {questions.map((q) => (
          <QuestionCard
            key={q._id}
            question={q}
            className="rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
          />
        ))}
      </div>

      <div className="pt-6">
        <PaginationControls
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          className="justify-center"
        />
      </div>
    </div>
  );
}
