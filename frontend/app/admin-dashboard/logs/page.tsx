'use client'

import LogPanel from "@/components/admin/LogPanel";

export default function LogPage() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">Admin Logs</h1>
      </header>
      < LogPanel/>
    </>
  );
}
