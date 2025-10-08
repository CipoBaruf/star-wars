import type { ReactNode } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import ErrorMessage from "../ErrorMessage";
import PageHeader from "./PageHeader";

interface DataPageLayoutProps {
  title: string;
  description: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;
}

export default function DataPageLayout({
  title,
  description,
  loading,
  error,
  onRetry,
  children,
}: DataPageLayoutProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <PageHeader title={title} description={description} />
          <LoadingSkeleton />
        </>
      );
    }

    if (error) {
      return (
        <>
          <PageHeader title={title} showDescription={false} />
          <ErrorMessage message={error} onRetry={onRetry} />
        </>
      );
    }

    return (
      <>
        <PageHeader title={title} description={description} />
        {children}
      </>
    );
  };

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">{renderContent()}</main>
  );
}
