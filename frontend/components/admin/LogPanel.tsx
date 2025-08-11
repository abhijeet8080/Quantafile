'use client'

import { api } from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface PerformedByUser {
  _id: string;
  username: string;
  email: string;
}

export interface LogType {
  _id: string;
  action: string;
  targetModel: string;
  targetId: string;
  performedBy: PerformedByUser | string;
  reason?: string;
  createdAt: string;
}

export const LogPanel = () => {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    api.get<LogType[]>("/admin/logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to fetch logs:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Card className="p-6 text-center text-lg font-medium text-muted-foreground">
        Loading logs...
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
        Admin Logs
      </h3>

      <Table className="table-auto">
        <TableHeader>
          <TableRow className="bg-purple-100 dark:bg-zinc-800">
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((l) => (
            <TableRow
              key={l._id}
              className="hover:bg-purple-50 dark:hover:bg-zinc-700 transition-colors cursor-default"
            >
              <TableCell className="font-medium">{l.action}</TableCell>
              <TableCell>
                <span className="font-mono text-sm text-purple-600 dark:text-purple-400">
                  {l.targetModel} / {l.targetId}
                </span>
              </TableCell>
              <TableCell>
                {typeof l.performedBy === "string"
                  ? l.performedBy
                  : l.performedBy?.username}
              </TableCell>
              <TableCell className="italic text-muted-foreground">{l.reason ?? "—"}</TableCell>
              <TableCell>{new Date(l.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default LogPanel;
