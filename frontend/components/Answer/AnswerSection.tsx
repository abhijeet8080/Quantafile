"use client";

import { useEffect, useState } from "react";
import { AnswerCard } from "./AnswerCard";
import { Answer } from "@/types/answer";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AnswerSectionProps {
  questionId: string;
  questionAuthorId: string;
}

export const AnswerSection = ({ questionId, questionAuthorId }: AnswerSectionProps) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.token);
  
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await api.get(`/questions/${questionId}/answers`,{
        headers: { Authorization: `Bearer ${token}` }
      });
        setAnswers(res.data);
      } catch (err) {
        console.error("Failed to fetch answers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionId,token]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {answers.length === 0 ? (
        <p className="text-muted-foreground">No answers yet. Be the first to answer!</p>
      ) : (
        answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            answer={answer}
            questionAuthorId={questionAuthorId}
          />
        ))
      )}
    </div>
  );
};
