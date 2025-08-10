"use client";

import {  useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/User/EditProfileModal";
import { User } from "@/types/user";
import UserQuestions from "@/components/User/UserQuestions";
import SkeletonLoader from "@/components/User/SkeletonLoader ";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetUserDetails } from "@/hooks/userHooks";

export default function ProfilePage() {
  const { id } = useParams();
  const [openEdit, setOpenEdit] = useState(false);
  const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)
  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const {user,loading,setUser } = useGetUserDetails(id);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!user) {
    return (
      <p className="text-center mt-12 text-muted-foreground">User not found.</p>
    );
  }

  return (
    <div className="w-full  py-12 px-4 space-y-6 bg-background">
      <LoginPromptModal isOpen={!isAuthenticated}/>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-4 border rounded-lg bg-card shadow-sm">
        <div className="flex items-center gap-6">
          <Image
            src={user.avatar || "/assets/default-avatar.png"}
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full border border-border"
          />

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{user.username}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary">
                {user.role}
              </span>

              {user.isVerified ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-400">
                  ✅ Verified
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border border-yellow-400">
                  ⚠️ Not Verified
                </span>
              )}

              {user.isBanned && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-400">
                  🚫 Banned
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={() => setOpenEdit(true)}
          className="self-start sm:self-auto"
        >
          Edit Profile
        </Button>
      </div>

      <UserQuestions userId={user._id} />

      {openEdit && (
        <EditProfileModal
          user={user}
          setOpen={setOpenEdit}
          onProfileUpdated={handleProfileUpdate}
        />
      )}
    </div>
  );
}
