'use client'

import { TagsPanel } from "@/components/admin/TagsPanel";

export default function TagsPage() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">Tags</h1>
      </header>
      < TagsPanel/>
    </>
  );
}
