"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Vehicle } from "@/shared/types";
import {
  InfoCard,
  InfiniteScrollLoader,
  DataPageLayout,
} from "@/shared/components";
import { useInfiniteScrollData } from "@/shared/hooks";

export default function VehiclesPage() {
  const {
    items: vehicles,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreRef,
    refetch,
  } = useInfiniteScrollData<Vehicle>({
    apiEndpoint: API_ENDPOINTS.VEHICLES,
    errorMessage: ERROR_MESSAGES.VEHICLES,
  });

  return (
    <DataPageLayout
      title={locales.pages.vehicles.title}
      description={locales.pages.vehicles.description}
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map(vehicle => (
          <InfoCard
            key={vehicle.url}
            title={vehicle.name}
            fields={[
              {
                label: locales.fields.model,
                value: vehicle.model,
                alignRight: true,
              },
              {
                label: locales.fields.manufacturer,
                value: vehicle.manufacturer,
                alignRight: true,
              },
              {
                label: locales.fields.class,
                value: vehicle.vehicle_class,
                capitalize: true,
              },
              { label: locales.fields.length, value: `${vehicle.length} m` },
              { label: locales.fields.crew, value: vehicle.crew },
              { label: locales.fields.passengers, value: vehicle.passengers },
              {
                label: locales.fields.cost,
                value: `${vehicle.cost_in_credits} credits`,
              },
            ]}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="min-h-[100px] w-full">
        {hasMore && loadingMore && <InfiniteScrollLoader />}
      </div>

      {!hasMore && vehicles.length > 0 && (
        <div className="py-8 text-center text-muted-foreground">
          {locales.ui.endOfList}
        </div>
      )}
    </DataPageLayout>
  );
}
