"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Planet } from "@/shared/types";
import {
  InfoCard,
  InfiniteScrollLoader,
  DataPageLayout,
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

  return (
    <DataPageLayout
      title={locales.pages.planets.title}
      description={locales.pages.planets.description}
      loading={loading}
      error={error}
      onRetry={refetch}
    >
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

      <div ref={loadMoreRef} className="min-h-[100px] w-full">
        {hasMore && loadingMore && <InfiniteScrollLoader />}
      </div>

      {!hasMore && planets.length > 0 && (
        <div className="py-8 text-center text-muted-foreground">
          {locales.ui.endOfList}
        </div>
      )}
    </DataPageLayout>
  );
}
