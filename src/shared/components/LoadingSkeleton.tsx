"use client";

import { memo } from "react";
import type { LoadingSkeletonProps } from "@/shared/types";

const LoadingSkeleton = memo(
  ({ count = 6, className = "" }: LoadingSkeletonProps) => {
    return (
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="card-base bg-glass animate-pulse">
            {/* Title skeleton */}
            <div className="mb-4 h-7 w-3/4 rounded-lg bg-gray-700" />

            {/* Content skeleton - 6 lines */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-800" />
              <div className="h-4 w-5/6 rounded bg-gray-800" />
              <div className="h-4 w-full rounded bg-gray-800" />
              <div className="h-4 w-4/5 rounded bg-gray-800" />
              <div className="h-4 w-full rounded bg-gray-800" />
              <div className="h-4 w-3/4 rounded bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
