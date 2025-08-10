"use client";

import { AnswerCard } from "./AnswerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAnswers } from "@/hooks/answersHooks";

interface AnswerSectionProps {
  questionId: string;
  questionAuthorId: string;
}

export const AnswerSection = ({
  questionId,
  questionAuthorId,
}: AnswerSectionProps) => {
  const token = useSelector((state: RootState) => state.auth.token);

  const { answers, loading } = useAnswers(questionId, token);
  console.log('answers',answers)
  if (loading) {
    return (
      <div
        className="
          space-y-6
          rounded-2xl
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/10
          p-6
          
           hover:shadow-xl
        "
      >
        <Skeleton className="h-20 w-full rounded-2xl bg-purple-200/40 dark:bg-purple-800/40 animate-pulse" />
        <Skeleton className="h-20 w-full rounded-2xl bg-purple-200/40 dark:bg-purple-800/40 animate-pulse" />
      </div>
    );
  }

  return (
    <section
      className=""
    >
      {answers.length === 0 ? (
        <p
          className="
            text-center
            text-lg font-semibold
            bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
            bg-clip-text text-transparent
            select-none
          "
        >
          No answers yet. Be the first to answer!
        </p>
      ) : (
        answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            answer={answer}
            questionAuthorId={questionAuthorId}
          />
        ))
      )}
    </section>
  );
};
