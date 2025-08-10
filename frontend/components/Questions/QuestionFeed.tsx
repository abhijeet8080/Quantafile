"use client";

import { QuestionSkeleton } from "./QuestionSkeleton";
import { QuestionCard } from "./QuestionCard";
import ExploreMore from "./ExploreMore";
import { useFetchLatestQuestions } from "@/hooks/questionHooks";

export default function QuestionFeed() {
  const { questions, loading } = useFetchLatestQuestions(5);

  return (
    <section className="w-full py-16 bg-gradient-to-tr from-purple-50 via-pink-50 to-orange-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-t border-purple-300/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600"
        >
          Latest Questions
        </h2>

        <div className="space-y-8">
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <QuestionSkeleton key={i} />
              ))}
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((q) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  className="transition-transform hover:-translate-y-1 hover:shadow-lg rounded-2xl"
                />
              ))}
              <ExploreMore />
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white/70 dark:bg-zinc-800/70 text-center text-lg font-semibold text-purple-700 dark:text-purple-400 shadow-md">
              No questions asked yet. Be the first to{" "}
              <span className="font-bold underline cursor-pointer hover:text-purple-600">
                ask a question
              </span>
              !
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
