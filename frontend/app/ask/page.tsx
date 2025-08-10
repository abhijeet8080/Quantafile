"use client";

import {  useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "@/lib/api/question";
import { useRequireAuth } from "@/hooks/userHooks";
import { RequireAuthModal } from "@/components/RequireAuthModal ";
export default function AskQuestionPage() {
  const { isAuthenticated, showModal, setShowModal } = useRequireAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);



  const tagArray = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);

  const isFormValid = title.trim() !== "" && description.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill in the title and description.");
      return;
    }

    

    setLoading(true);

    try {
      await createQuestion(title.trim(), description.trim(), tagArray, token);
      toast.success("Question posted successfully!");
      router.push("/explore");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post question");
    } finally {
      setLoading(false);
    }
  };
if (!isAuthenticated) {
    
    return (
      <>
        <RequireAuthModal open={showModal}  />
      </>
    );
  }
  return (
    <div className="min-h-screen bg-muted flex justify-center py-12 px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Form Section */}
        <div
          className="md:col-span-2 rounded-2xl
            backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
            shadow-lg shadow-purple-500/10
            transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-xl
            p-8"
        >
          <header className="mb-8">
            <h1
              className="text-4xl font-extrabold text-transparent bg-clip-text
              bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
              underline decoration-[3px] decoration-pink-400 underline-offset-8"
            >
              Ask a Public Question
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-lg">
              Provide a clear and detailed question to get the best answers from
              the community.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-lg font-semibold text-zinc-800 dark:text-zinc-200"
              >
                Title
              </Label>
              <Input
                id="title"
                placeholder="Be specific and imagine you're asking a question to another developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                className="text-lg
                  transition-all duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-pink-400
                  rounded-2xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-lg font-semibold text-zinc-800 dark:text-zinc-200"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Include all the information someone would need to answer your question"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
                rows={8}
                className="text-base
                  transition-all duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-pink-400
                  rounded-2xl"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-lg font-semibold text-zinc-800 dark:text-zinc-200"
              >
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="e.g. javascript, react, nextjs"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={loading}
                className="text-base
                  transition-all duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-pink-400
                  rounded-2xl"
              />
              <p className="text-sm text-muted-foreground max-w-md">
                Add up to 5 tags to describe your question. Separate them with
                commas.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-lg font-semibold
                bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                text-white rounded-2xl
                transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
              disabled={loading || !isFormValid}
            >
              {loading ? "Posting..." : "Post Your Question"}
            </Button>
          </form>
        </div>

        {/* Sidebar with Tips */}
        <aside
          className="hidden md:flex flex-col
          rounded-2xl
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/10
          p-6 sticky top-20 h-fit"
        >
          <h3
            className="text-xl font-bold mb-4
            text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
          >
            Tips for Asking Good Questions
          </h3>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground text-sm leading-relaxed">
            <li>Search to see if your question has been asked before.</li>
            <li>Be clear and concise in your question title.</li>
            <li>Provide all relevant details and context in the description.</li>
            <li>Add relevant tags to help categorize your question.</li>
            <li>Proofread before posting to avoid typos and confusion.</li>
            <li>Be respectful and patient while waiting for answers.</li>
          </ul>
        </aside>

      </div>
    </div>
  );
}
