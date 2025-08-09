"use client";

import { useEffect, useState } from "react";
import { QuestionSkeleton } from "./QuestionSkeleton";
import { QuestionCard } from "./QuestionCard";
import { Question } from "@/types/question";
import { getLatestQuestions } from "@/lib/api/question";
import ExploreMore from "./ExploreMore";

export default function QuestionFeed() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getLatestQuestions(5);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <section className="w-full py-12 bg-muted/50 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Latest Questions</h2>

        <div className="space-y-6">
          {loading ? (
            <>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <QuestionSkeleton key={i} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {questions.map((q) => (
                  <QuestionCard key={q._id} question={q} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <ExploreMore />
    </section>
  );
}
