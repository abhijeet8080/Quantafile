'use client'

import { AnswersPanel } from "@/components/admin/AnswerPanel";

export default function AnswersPage() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">Answers</h1>
      </header>
      < AnswersPanel/>
    </>
  );
}
