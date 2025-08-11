'use client'
import { UsersPanel } from "@/components/admin/UserPanel";

export default function UsersPage() {
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">Users</h1>
      </header>
      <UsersPanel />
    </>
  );
}
