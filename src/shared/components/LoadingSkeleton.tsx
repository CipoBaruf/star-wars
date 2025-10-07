"use client";

import { memo } from "react";
import type { LoadingSkeletonProps } from "@/shared/types";

const LoadingSkeleton = memo(
  ({ count = 6, className = "" }: LoadingSkeletonProps) => {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
