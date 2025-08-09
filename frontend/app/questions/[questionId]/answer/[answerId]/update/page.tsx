"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function EditAnswerPage() {
  const { answerId } = useParams(); // answer ID
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing answer
  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const res = await api.get(`/answers/${answerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(res.data.content);
      } catch (err) {
        console.error("Failed to fetch answer", err);
      } finally {
        setLoading(false);
      }
    };

    if (answerId) fetchAnswer();
  }, [answerId, token]);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Answer cannot be empty!");
    setSaving(true);
    try {
      const res = await api.put(
        `/answers/${answerId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Redirect back to the related question
      router.push(`/questions/${res.data.question}`);
    } catch (err) {
      console.error("Failed to update answer", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Answer</h1>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="mb-4"
      />

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
