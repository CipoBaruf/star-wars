"use client";

import { API_ENDPOINTS } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Starship } from "@/shared/types";
import {
  InfoCard,
  InfiniteScrollLoader,
  DataPageLayout,
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
    errorMessage: locales.errors.starships,
  });

  return (
    <DataPageLayout
      title={locales.pages.spaceships.title}
      description={locales.pages.spaceships.description}
      loading={loading}
      error={error}
      onRetry={refetch}
    >
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
    </DataPageLayout>
  );
}
