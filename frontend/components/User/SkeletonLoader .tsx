import React from "react";
import { Skeleton } from "../ui/skeleton";

const SkeletonLoader = () => {
  return (
    <div className="w-full min-h-screen py-16 px-6 flex flex-col items-center space-y-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 rounded-lg shadow-lg">
      <Skeleton className="h-28 w-28 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-pulse" />
      <Skeleton className="h-8 w-1/2 rounded-md bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 animate-pulse" />
      <Skeleton className="h-5 w-1/3 rounded-md bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 animate-pulse" />
    </div>
  );
};

export default SkeletonLoader;
