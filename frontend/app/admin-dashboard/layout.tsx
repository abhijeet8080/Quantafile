"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Tag, ChartBar, FileText, List, Clock } from "lucide-react";
import AppInitializer from "@/components/AppInitializer";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: ChartBar, href: "/admin-dashboard" },
  { id: "users", label: "Users", icon: User, href: "/admin-dashboard/users" },
  { id: "questions", label: "Questions", icon: FileText, href: "/admin-dashboard/questions" },
  { id: "answers", label: "Answers", icon: List, href: "/admin-dashboard/answers" },
  { id: "tags", label: "Tags", icon: Tag, href: "/admin-dashboard/tags" },
  { id: "analytics", label: "Analytics", icon: ChartBar, href: "/admin-dashboard/analytics" },
  { id: "logs", label: "Logs", icon: Clock, href: "/admin-dashboard/logs" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const active = NAV_ITEMS.find((item) =>
    item.href === "/admin-dashboard"
      ? pathname === "/admin-dashboard" || pathname === "/admin-dashboard/"
      : pathname.startsWith(item.href)
  )?.id || "overview";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-200 mt-16">
  <div className="max-w-[1400px] mx-auto p-4">
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 sticky top-4 h-fit">
        {/* Admin Card with Glassmorphism */}
        <Card
          className="
            p-4
            rounded-2xl
            backdrop-blur-lg bg-white/70 dark:bg-zinc-900/80
            shadow-lg shadow-purple-500/20 dark:shadow-purple-700/40
            transition-all duration-300 ease-in-out
            hover:scale-[1.01] hover:shadow-xl
            dark:hover:shadow-purple-600/70
          "
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
              Admin Dashboard
            </h3>
            <div className="text-sm text-muted-foreground select-none dark:text-zinc-400">v1</div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl text-left
                  transition-all duration-300 ease-in-out
                  hover:scale-[1.03] hover:shadow-purple-400/60 dark:hover:shadow-purple-600/80
                  ${
                    active === id
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-400/70 font-semibold"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-white/40 dark:hover:bg-zinc-800/70"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active === id ? "text-white" : "text-purple-600 dark:text-pink-400"
                  }`}
                />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </Card>

        {/* Quick Actions Card */}
        <Card
          className="
            mt-6 p-4 rounded-2xl
            backdrop-blur-lg bg-white/70 dark:bg-zinc-900/80
            shadow-lg shadow-purple-500/20 dark:shadow-purple-700/40
            transition-all duration-300 ease-in-out
            hover:scale-[1.01] hover:shadow-xl
            dark:hover:shadow-purple-600/70
          "
        >
          <div className="text-sm text-muted-foreground font-semibold mb-3 select-none dark:text-zinc-400">
            Quick Actions
          </div>
          <div className="flex flex-col gap-3">
            <Button
              asChild
              variant={active === "users" ? "secondary" : "ghost"}
              className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-[1.05] transition-transform duration-300 ease-in-out"
            >
              <Link href="/admin-dashboard/users">Manage Users</Link>
            </Button>
            <Button
              asChild
              variant={active === "questions" ? "secondary" : "ghost"}
              className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-[1.05] transition-transform duration-300 ease-in-out"
            >
              <Link href="/admin-dashboard/questions">Moderate Questions</Link>
            </Button>
            <Button
              asChild
              variant={active === "answers" ? "secondary" : "ghost"}
              className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-[1.05] transition-transform duration-300 ease-in-out"
            >
              <Link href="/admin-dashboard/answers">Moderate Answers</Link>
            </Button>
          </div>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <AppInitializer />
        {children}
      </main>
    </div>
  </div>
</div>

  );
}
