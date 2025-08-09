"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Textarea } from "@/components/ui/textarea";

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/questions",
        {
          title,
          description,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      toast.success("Question posted successfully!");
      router.push("/explore");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post question");
    }
  };

  return (
    <div className="flex justify-center px-4 py-10 min-h-screen bg-muted">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Ask a Public Question
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Be specific and imagine you're asking a question to another developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Include all the information someone would need to answer your question"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="e.g. javascript, react, nextjs"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Add up to 5 tags to describe what your question is about.
                Separate them with commas.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Post Your Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
