"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Answer } from "@/types/answer";

export function useAnswers(questionId: string, token?: string | null) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questionId) return; // guard for missing ID

    const fetchAnswers = async () => {
      try {
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const res = await api.get(`/questions/${questionId}/answers`, {
          headers,
        });
        setAnswers(res.data);
      } catch (err) {
        console.error("Failed to fetch answers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionId, token]);

  return { answers, loading, setAnswers };
}
