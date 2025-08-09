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
import { useState } from "react";
import uploadAvatar from "@/lib/upload-avatar";
import { api } from "@/lib/axios";
import { User } from "@/types/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  user: User;
  setOpen: (v: boolean) => void;
  onProfileUpdated?: (updated: User) => void;
}

export default function EditProfileModal({ user, setOpen,onProfileUpdated }: Props) {
  const [name, setName] = useState(user!.username);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleUpdate = async () => {
    setLoading(true);
    let avatarUrl: string | undefined = user.avatar;

    if (avatarFile) {
      const uploadedUrl = await uploadAvatar(avatarFile);
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      avatarUrl = uploadedUrl;
    }

    try {
      const res = await api.put(
        `/users/profile`,
        { username: name, avatar: avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ directly use response data
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Avatar</Label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
