"use client";

import { useState, useEffect, useCallback } from "react";
import {
  API_ENDPOINTS,
  ITEMS_PER_PAGE,
  ERROR_MESSAGES,
  PAGE_DESCRIPTIONS,
} from "@/lib/constants";
import type { Vehicle } from "@/shared/types";
import { Pagination, LoadingSkeleton } from "@/shared/components";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_ENDPOINTS.VEHICLES}?page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVehicles(data.results);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {
      setError(ERROR_MESSAGES.VEHICLES);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  if (loading)
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Vehicles</h1>
        <p className="text-muted-foreground mb-6">
          {PAGE_DESCRIPTIONS.VEHICLES}
        </p>
        <LoadingSkeleton />
      </main>
    );
  if (error)
    return (
      <div className="max-w-5xl mx-auto p-8 text-red-500">Error: {error}</div>
    );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Vehicles</h1>
      <p className="text-muted-foreground mb-6">{PAGE_DESCRIPTIONS.VEHICLES}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map(vehicle => (
          <div
            key={vehicle.url}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Model:</strong> {vehicle.model}
              </p>
              <p>
                <strong>Manufacturer:</strong> {vehicle.manufacturer}
              </p>
              <p>
                <strong>Class:</strong> {vehicle.vehicle_class}
              </p>
              <p>
                <strong>Length:</strong> {vehicle.length} m
              </p>
              <p>
                <strong>Crew:</strong> {vehicle.crew}
              </p>
              <p>
                <strong>Passengers:</strong> {vehicle.passengers}
              </p>
              <p>
                <strong>Cost:</strong> {vehicle.cost_in_credits} credits
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </main>
  );
}
