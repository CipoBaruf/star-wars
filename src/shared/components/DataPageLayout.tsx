import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorMessage from "./ErrorMessage";

interface DataPageLayoutProps {
  title: string;
  description: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

export default function DataPageLayout({
  title,
  description,
  loading,
  error,
  onRetry,
  children,
}: DataPageLayoutProps) {
  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">{title}</h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
        <LoadingSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">{title}</h1>
        <ErrorMessage message={error} onRetry={onRetry} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">{title}</h1>
      <p className="mb-6 text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
      {children}
    </main>
  );
}
