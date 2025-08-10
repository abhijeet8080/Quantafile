"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import uploadAvatar from "@/lib/upload-avatar";
import { User } from "@/types/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateUser } from "@/lib/api/auth";
import Image from "next/image";

interface Props {
  user: User;
  setOpen: (v: boolean) => void;
  onProfileUpdated?: (updated: User) => void;
}

export default function EditProfileModal({ user, setOpen, onProfileUpdated }: Props) {
  const [name, setName] = useState(user?.username || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  // Preview selected avatar
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(user?.avatar || "");
      return;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, user?.avatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    let avatarUrl: string | undefined = user?.avatar;

    if (avatarFile) {
      const uploadedUrl = await uploadAvatar(avatarFile);
      if (!uploadedUrl) {
        setLoading(false);
        toast.error("Failed to upload avatar");
        return;
      }
      avatarUrl = uploadedUrl;
    }

    try {
      const res = await updateUser({ name: name.trim(), avatarUrl, token });

      onProfileUpdated?.(res.data);

      toast.success("Profile updated!");
      setOpen(false);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-purple-300 dark:border-purple-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <div className="flex flex-col items-center gap-4">
            {avatarPreview ? (
              <Image
              width={100}
              height={100}
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xl font-semibold">
                ?
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="name" className="font-semibold text-purple-700 dark:text-purple-300">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              className="mt-1"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <Label
              htmlFor="avatar"
              className="font-semibold text-purple-700 dark:text-purple-300"
            >
              Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={loading}
              className="mt-1 cursor-pointer"
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white hover:brightness-110 transition"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
