'use client'

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface TagUsage {
  _id: string;
  count: number;
  name:string
}

interface AnalyticsData {
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  mostUsedTags: TagUsage[];
}

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    api.get<AnalyticsData>("/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Card className="p-6 text-center text-lg font-medium text-muted-foreground">
        Loading analytics...
      </Card>
    );
  }

  return (
    <Card
      className="
        p-6 rounded-2xl
        bg-white/90 dark:bg-zinc-900/80
        backdrop-blur-md
        shadow-lg shadow-purple-500/20
        transition-transform duration-300 ease-in-out
        hover:scale-[1.02] hover:shadow-xl
      "
    >
      <h3 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
        Analytics Overview
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-purple-300/30 shadow-md shadow-purple-300/10 hover:shadow-purple-400/30 transition-shadow cursor-default">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-3xl font-extrabold text-purple-600">{data?.totalUsers ?? "—"}</div>
        </div>
        <div className="p-4 rounded-xl border border-purple-300/30 shadow-md shadow-purple-300/10 hover:shadow-purple-400/30 transition-shadow cursor-default">
          <div className="text-sm text-muted-foreground">Active Users</div>
          <div className="text-3xl font-extrabold text-pink-600">{data?.activeUsers ?? "—"}</div>
        </div>
        <div className="p-4 rounded-xl border border-purple-300/30 shadow-md shadow-purple-300/10 hover:shadow-purple-400/30 transition-shadow cursor-default">
          <div className="text-sm text-muted-foreground">Total Questions</div>
          <div className="text-3xl font-extrabold text-orange-600">{data?.totalQuestions ?? "—"}</div>
        </div>
        <div className="p-4 rounded-xl border border-purple-300/30 shadow-md shadow-purple-300/10 hover:shadow-purple-400/30 transition-shadow cursor-default">
          <div className="text-sm text-muted-foreground">Total Answers</div>
          <div className="text-3xl font-extrabold text-purple-700">{data?.totalAnswers ?? "—"}</div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold mb-3 text-lg">Top Tags</h4>
        {data?.mostUsedTags?.length ? (
          <ul
            className="
              max-h-48 overflow-y-auto
              list-disc pl-6 space-y-1
              scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent
              text-lg font-medium
            "
          >
            {data.mostUsedTags.map(({ _id, count,name }) => (
              <li
                key={_id}
                className="
                  text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                  transition-transform duration-200 ease-in-out
                  hover:scale-105 hover:drop-shadow-lg
                  cursor-default select-none
                "
              >
                {`${name} — ${count}`}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground select-none">No tags found</div>
        )}
      </div>
    </Card>
  );
}
