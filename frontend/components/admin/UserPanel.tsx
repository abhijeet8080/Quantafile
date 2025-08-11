'use client';

import { Role, UserType } from "@/types/admin";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function UsersPanel() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);
  const [filterBanned, setFilterBanned] = useState<string | undefined>(undefined); // 'true' | 'false' | undefined
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [search, setSearch] = useState("");

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filterRole) q.set("role", filterRole);
      if (filterBanned) q.set("isBanned", filterBanned);
      if (startDate) q.set("startDate", startDate);
      if (endDate) q.set("endDate", endDate);
      if (search) q.set("search", search);

      const res = await api.get<UserType[]>(`/admin/users?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  });

  const toggleBan = async (u: UserType) => {
    try {
      if (u.isBanned) {
        await api.put(`/admin/users/${u._id}/unban`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/admin/users/${u._id}/ban`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
    } catch (e) {
      console.error("Ban toggle failed:", e);
    }
  };

  const changeRole = async (u: UserType, role: Role) => {
    try {
      await api.put(
        `/admin/users/${u._id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (e) {
      console.error("Change role failed:", e);
    }
  };

  return (
    <Card
      className="
        p-6
        rounded-2xl
        backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
        shadow-lg shadow-purple-500/20
        transition-all duration-300 ease-in-out
        hover:scale-[1.01] hover:shadow-xl
      "
    >
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Role filter */}
        <Select
          value={filterRole ?? "all"}
          onValueChange={(v) => setFilterRole(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[160px] rounded-2xl border-purple-400">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {/* Ban status filter */}
        <Select
          value={filterBanned ?? "all"}
          onValueChange={(v) => setFilterBanned(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-[160px] rounded-2xl border-purple-400">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Banned</SelectItem>
          </SelectContent>
        </Select>

        {/* Date filters */}
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-2xl border-purple-400"
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-2xl border-purple-400"
          placeholder="End Date"
        />

        {/* Search */}
        <Input
          placeholder="Search username/email/id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow rounded-2xl border-purple-400"
        />
        <Button
          onClick={fetchUsers}
          className="rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:scale-[1.05] transition-transform duration-300 ease-in-out text-white"
        >
          Search
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-purple-300/30 shadow-md shadow-purple-300/20">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-t-2xl">
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u._id}
                className="
                  hover:scale-[1.02]
                  hover:shadow-lg
                  transition-transform duration-300 ease-in-out
                  cursor-pointer
                  even:bg-white/50 odd:bg-white/30 dark:even:bg-zinc-900/40 dark:odd:bg-zinc-900/30
                "
              >
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(v) => changeRole(u, v as Role)}
                  >
                    <SelectTrigger className="w-[130px] rounded-2xl border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold select-none ${
                      u.isBanned
                        ? "bg-gradient-to-r from-pink-500 via-red-600 to-red-700 text-white"
                        : "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white"
                    }`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(u.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={u.isBanned ? "destructive" : "default"}
                    onClick={() => toggleBan(u)}
                    className="rounded-2xl"
                  >
                    {u.isBanned ? "Unban" : "Ban"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {loading && (
        <div className="mt-4 text-center text-sm text-muted-foreground select-none">
          Loading...
        </div>
      )}
    </Card>
  );
}
