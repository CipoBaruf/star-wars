"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Starship } from "@/shared/types";
import {
  LoadingSkeleton,
  InfoCard,
  ErrorMessage,
  InfiniteScrollLoader,
  BackToTop,
} from "@/shared/components";
import { useInfiniteScrollData } from "@/shared/hooks";

export default function SpaceshipsPage() {
  const {
    items: starships,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreRef,
    refetch,
  } = useInfiniteScrollData<Starship>({
    apiEndpoint: API_ENDPOINTS.STARSHIPS,
    errorMessage: ERROR_MESSAGES.STARSHIPS,
  });

  if (loading)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.spaceships.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.spaceships.description}
        </p>
        <LoadingSkeleton />
      </main>
    );

  if (error)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.spaceships.title}
        </h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </main>
    );

  return (
    <>
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.spaceships.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.spaceships.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {starships.map(starship => (
            <InfoCard
              key={starship.url}
              title={starship.name}
              fields={[
                {
                  label: locales.fields.model,
                  value: starship.model,
                  alignRight: true,
                },
                {
                  label: locales.fields.manufacturer,
                  value: starship.manufacturer,
                  alignRight: true,
                },
                {
                  label: locales.fields.class,
                  value: starship.starship_class,
                  capitalize: true,
                },
                { label: locales.fields.length, value: `${starship.length} m` },
                { label: locales.fields.crew, value: starship.crew },
                {
                  label: locales.fields.passengers,
                  value: starship.passengers,
                },
                {
                  label: locales.fields.cost,
                  value: `${starship.cost_in_credits} credits`,
                },
              ]}
            />
          ))}
        </div>

        <div ref={loadMoreRef} className="min-h-[100px] w-full">
          {hasMore && loadingMore && <InfiniteScrollLoader />}
        </div>

        {!hasMore && starships.length > 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {locales.ui.endOfList}
          </div>
        )}
      </main>
      <BackToTop />
    </>
  );
}
