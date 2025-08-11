// app/AuthSyncClient.tsx
"use client";

import { useAuthSync } from "@/hooks/userHooks";

export default function AuthSyncClient() {
  useAuthSync();
  return null; // no UI, just logic
}
