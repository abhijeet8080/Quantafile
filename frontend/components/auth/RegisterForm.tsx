"use client";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import uploadAvatar from "@/lib/upload-avatar";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { registerUser } from "@/lib/api/auth";
export function RegisterForm() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let avatarUrl: string | null = null;
    if (avatar) {
      setUploading(true);
      avatarUrl = await uploadAvatar(avatar);
      setUploading(false);
      if (!avatarUrl) {
        toast.error("Avatar upload failed");
        setAvatar(null);
        setLoading(false);
        return;
      }
    }
    try {
      const res = await registerUser({ ...formData, avatar: avatarUrl });
      toast.success(res.data.message);
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
    <Card className="w-full max-w-md shadow-lg border border-border/40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Avatar (optional)</Label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || uploading}
          >
            {loading || uploading ? "Registering..." : "Register"}
          </Button>
        </form>
        <Link href={`/login`}>Already Registered?</Link>
      </CardContent>
    </Card>
  );
}
