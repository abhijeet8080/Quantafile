import { OverviewPanel } from "@/components/admin/OverviewPanel";

// app/admin-dashboard/page.tsx
export default function AdminOverviewPage() {
  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <h1
          className="text-3xl font-extrabold
            text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
            select-none"
        >
          Overview
        </h1>
      </header>
      <OverviewPanel />
    </>
  );
}
