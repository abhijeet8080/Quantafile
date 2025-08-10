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
      <div className="space-y-4 mt-8">
        {Array.from({ length: QUESTIONS_PER_PAGE }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <div className="text-4xl">🤔</div>
        <p className="text-lg font-medium">No questions asked yet</p>
        <p className="text-sm">
          It looks like you haven’t asked any questions. Start a new discussion!
        </p>
        <Link href="/ask">
          <Button variant="default">Ask Your First Question</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Questions Asked</h3>
        <Link href="/ask">
          <Button size="sm" variant="outline">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard key={q._id} question={q} />
        ))}
      </div>

      <div className="pt-4">
        <PaginationControls
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
