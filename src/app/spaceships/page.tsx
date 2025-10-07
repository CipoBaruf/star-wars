"use client";

import { useState, useEffect, useCallback } from "react";
import {
  API_ENDPOINTS,
  ITEMS_PER_PAGE,
  ERROR_MESSAGES,
  PAGE_DESCRIPTIONS,
} from "@/lib/constants";
import type { Starship } from "@/shared/types";
import { Pagination, LoadingSkeleton } from "@/shared/components";

export default function SpaceshipsPage() {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStarships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_ENDPOINTS.STARSHIPS}?page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStarships(data.results);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {
      setError(ERROR_MESSAGES.STARSHIPS);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchStarships();
  }, [fetchStarships]);

  if (loading)
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Spaceships</h1>
        <p className="text-muted-foreground mb-6">
          {PAGE_DESCRIPTIONS.STARSHIPS}
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
      <h1 className="text-3xl font-bold mb-4">Spaceships</h1>
      <p className="text-muted-foreground mb-6">
        {PAGE_DESCRIPTIONS.STARSHIPS}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {starships.map(starship => (
          <div
            key={starship.url}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{starship.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Model:</strong> {starship.model}
              </p>
              <p>
                <strong>Manufacturer:</strong> {starship.manufacturer}
              </p>
              <p>
                <strong>Class:</strong> {starship.starship_class}
              </p>
              <p>
                <strong>Length:</strong> {starship.length} m
              </p>
              <p>
                <strong>Crew:</strong> {starship.crew}
              </p>
              <p>
                <strong>Passengers:</strong> {starship.passengers}
              </p>
              <p>
                <strong>Cost:</strong> {starship.cost_in_credits} credits
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
