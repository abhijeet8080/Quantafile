import { QuestionsPanel } from "@/components/admin/QuestionPanel";

export default function QuestionsPage() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">Questions</h1>
      </header>
      <QuestionsPanel />
    </>
  );
}
