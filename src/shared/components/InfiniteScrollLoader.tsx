import React from "react";

export default function InfiniteScrollLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex gap-2">
        <span
          className="h-3 w-3 animate-bounce rounded-full bg-blue-500"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-3 w-3 animate-bounce rounded-full bg-blue-500"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-3 w-3 animate-bounce rounded-full bg-blue-500"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
