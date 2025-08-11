'use client'

import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";

export default function AnalyticsPage() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">Analytics</h1>
      </header>
      < AnalyticsPanel/>
    </>
  );
}
