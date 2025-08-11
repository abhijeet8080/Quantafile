"use client";

import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent
        className="
          rounded-2xl 
          backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
          shadow-lg shadow-purple-500/10
          transition-all duration-300 ease-in-out
          animate-in fade-in-50 slide-in-from-top-4
        "
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            className="
              rounded-xl px-4 py-2 transition-all duration-300
              hover:bg-gray-200/40 dark:hover:bg-zinc-800/50
            "
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="
              rounded-xl px-4 py-2 font-semibold text-white
              bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
              shadow-md shadow-purple-500/20
              transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg
              focus:ring-2 focus:ring-purple-400 focus:outline-none
            "
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
