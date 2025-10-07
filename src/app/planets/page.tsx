"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Planet } from "@/shared/types";
import {
  LoadingSkeleton,
  InfoCard,
  ErrorMessage,
  InfiniteScrollLoader,
  BackToTop,
} from "@/shared/components";
import { useInfiniteScrollData } from "@/shared/hooks";

export default function PlanetsPage() {
  const {
    items: planets,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreRef,
    refetch,
  } = useInfiniteScrollData<Planet>({
    apiEndpoint: API_ENDPOINTS.PLANETS,
    errorMessage: ERROR_MESSAGES.PLANETS,
  });

  if (loading)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.planets.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.planets.description}
        </p>
        <LoadingSkeleton />
      </main>
    );

  if (error)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.planets.title}
        </h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </main>
    );

  return (
    <>
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.planets.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.planets.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {planets.map(planet => (
            <InfoCard
              key={planet.url}
              title={planet.name}
              fields={[
                {
                  label: locales.fields.climate,
                  value: planet.climate,
                  capitalize: true,
                },
                {
                  label: locales.fields.terrain,
                  value: planet.terrain,
                  capitalize: true,
                },
                { label: locales.fields.population, value: planet.population },
                {
                  label: locales.fields.diameter,
                  value: `${planet.diameter} km`,
                },
                { label: locales.fields.gravity, value: planet.gravity },
                {
                  label: locales.fields.surfaceWater,
                  value: `${planet.surface_water}%`,
                },
              ]}
            />
          ))}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="min-h-[100px] w-full">
          {hasMore && loadingMore && <InfiniteScrollLoader />}
        </div>

        {/* End of list message */}
        {!hasMore && planets.length > 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {locales.ui.endOfList}
          </div>
        )}
      </main>
      <BackToTop />
    </>
  );
}
