// src/components/skeletons/PostSkeleton.jsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PostSkeleton = () => {
  return (
    <div className="w-full md:w-[500px] space-y-3">
      <div className="flex items-center gap-3 ">
        <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
        <Skeleton className="w-32 h-4 rounded bg-gray-700" />
      </div>
      <Skeleton className="w-full h-[400px] rounded bg-gray-700" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4 rounded bg-gray-700" />
        <Skeleton className="w-[80%] h-4 rounded bg-gray-700" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10 rounded bg-gray-700" />
        <Skeleton className="w-16 h-10 rounded bg-gray-700" />
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="flex items-center space-y-3 gap-3.5">
      <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />

      <div className="flex flex-col space-y-2 w-full">
        <Skeleton className="w-24 h-4 rounded bg-gray-700" />
        <Skeleton className="w-48 h-3 rounded bg-gray-700" />
      </div>
    </div>
  );
};

export const HomeUsersSkeleton = () => {
  return (
    <div className="flex items-center justify-center space-x-4 overflow-x-auto p-4 w-full">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center space-y-1"
        >
          <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse" />
          <div className="h-3 w-[70px] rounded-md bg-gray-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
};
