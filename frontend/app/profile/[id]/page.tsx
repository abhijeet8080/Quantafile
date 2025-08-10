"use client";

import { useState } from "react";
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
import { useGetUserDetails, useRequireAuth } from "@/hooks/userHooks";
import { RequireAuthModal } from "@/components/RequireAuthModal ";

export default function ProfilePage() {
    const { isAuthenticated, showModal } = useRequireAuth();
  
  const { id } = useParams();
  const [openEdit, setOpenEdit] = useState(false);
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const { user, loading, setUser } = useGetUserDetails(id);
  const isOwnProfile = loggedInUser?._id==user?._id
  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };
  if (!isAuthenticated) {
      return (
        <>
          <RequireAuthModal open={showModal}  />
        </>
      );
    }
  if (loading) return <SkeletonLoader />;

  if (!user) {
    return (
      <p className="text-center mt-16 text-muted-foreground text-lg font-medium">
        User not found.
      </p>
    );
  }
  
  return (
    <div className="w-full min-h-screen py-16 px-6 space-y-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 rounded-lg shadow-lg">
      <LoginPromptModal isOpen={!isAuthenticated} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-card rounded-xl shadow-md border border-border transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-6">
          <Image
            src={user.avatar || "/assets/default-avatar.png"}
            alt="User Avatar"
            width={96}
            height={96}
            className="rounded-full border-2 border-purple-600"
          />

          <div className="space-y-1 max-w-xs">
            <h2 className="text-3xl font-extrabold text-purple-700 dark:text-purple-300 truncate">
              {user.username}
            </h2>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>

            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold border border-primary">
                {user.role}
              </span>

              {user.isVerified ? (
                <span className="text-xs px-3 py-1 rounded-full bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300 font-semibold border border-green-400">
                  ✅ Verified
                </span>
              ) : (
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 font-semibold border border-yellow-400">
                  ⚠️ Not Verified
                </span>
              )}

              {user.isBanned && (
                <span className="text-xs px-3 py-1 rounded-full bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300 font-semibold border border-red-400">
                  🚫 Banned
                </span>
              )}
            </div>
          </div>
        </div>

       {isOwnProfile && (
  <Button
    onClick={() => setOpenEdit(true)}
    className="self-start sm:self-auto bg-purple-600 text-white hover:bg-purple-700 transition rounded-md shadow-md px-5 py-2 font-semibold"
  >
    Edit Profile
  </Button>
)}
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
