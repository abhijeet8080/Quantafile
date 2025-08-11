"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

interface RequireAuthModalProps {
  open: boolean;
}

export function RequireAuthModal({ open }: RequireAuthModalProps) {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <Dialog open={open} modal>
      <DialogContent
        className="
          rounded-2xl 
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/10
          transition-all duration-300 ease-in-out
          animate-in fade-in-50 zoom-in-95
        "
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-3">
            <Lock className="h-10 w-10 text-purple-500 animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            You must be logged in to access this page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-center">
          <Button
            onClick={handleLoginRedirect}
            className="
              rounded-xl px-6 py-2 font-semibold text-white
              bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
              shadow-md shadow-purple-500/20
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg
              focus:ring-2 focus:ring-purple-400 focus:outline-none
            "
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
