"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Vehicle } from "@/shared/types";
import {
  LoadingSkeleton,
  InfoCard,
  ErrorMessage,
  InfiniteScrollLoader,
  BackToTop,
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

  if (loading)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.vehicles.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.vehicles.description}
        </p>
        <LoadingSkeleton />
      </main>
    );

  if (error)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.vehicles.title}
        </h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </main>
    );

  return (
    <>
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.vehicles.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.vehicles.description}
        </p>

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
      </main>
      <BackToTop />
    </>
  );
}
