'use client';

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface TagUsage {
  _id: string;
  count: number;
}

interface AnalyticsData {
  totalUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  activeUsers: number;
  mostUsedTags: TagUsage[];
}

export function OverviewPanel() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    api
      .get<AnalyticsData>("/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((e) => console.error("Failed to fetch analytics:", e))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium text-muted-foreground">
        Loading overview...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stats Cards */}
      {[
        { label: "Total Users", value: stats?.totalUsers },
        { label: "Total Questions", value: stats?.totalQuestions },
        { label: "Total Answers", value: stats?.totalAnswers },
      ].map(({ label, value }) => (
        <Card
          key={label}
          className="
            p-6 rounded-2xl
            backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
            shadow-lg shadow-purple-500/10
            transition-all duration-300 ease-in-out
            hover:scale-[1.03] hover:shadow-xl
          "
        >
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
            {value ?? "—"}
          </div>
        </Card>
      ))}

      {/* Most Used Tags Section */}
      <div className="col-span-1 md:col-span-3 mt-8">
        <Card
          className="
            p-6 rounded-2xl
            backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
            shadow-lg shadow-purple-500/10
            transition-all duration-300 ease-in-out
            hover:scale-[1.01] hover:shadow-xl
          "
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Most Used Tags</h3>
          </div>

          {stats?.mostUsedTags?.length ? (
  <ul className="flex flex-wrap gap-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
    {stats.mostUsedTags.map(({ _id, count }) => (
      <li
        key={_id}
        className="
          flex items-center gap-2
          rounded-2xl
          px-4 py-1.5
          bg-white/40 dark:bg-zinc-800/60
          backdrop-blur-md
          border border-transparent
          hover:border-purple-400
          shadow-md shadow-purple-400/20
          transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-purple-500/60
          cursor-default select-none
        "
      >
        <span
          className="
            font-semibold
            text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
            tracking-wide
          "
        >
          {_id}
        </span>
        <span
          className="
            text-sm font-medium
            bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
            text-white
            rounded-full px-2 py-0.5
            shadow-md shadow-pink-500/50
          "
          title="Usage count"
        >
          {count}
        </span>
      </li>
    ))}
  </ul>
) : (
  <div className="text-sm text-muted-foreground select-none">No data</div>
)}

        </Card>
      </div>
    </div>
  );
}
