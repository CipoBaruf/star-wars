"use client";

import { useState, useEffect, useCallback } from "react";
import {
  API_ENDPOINTS,
  ITEMS_PER_PAGE,
  ERROR_MESSAGES,
  PAGE_DESCRIPTIONS,
} from "@/lib/constants";
import type { Character } from "@/shared/types";
import { Pagination, LoadingSkeleton } from "@/shared/components";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_ENDPOINTS.CHARACTERS}?page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCharacters(data.results);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {
      setError(ERROR_MESSAGES.CHARACTERS);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (loading)
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Characters</h1>
        <p className="text-muted-foreground mb-6">
          {PAGE_DESCRIPTIONS.CHARACTERS}
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
      <h1 className="text-3xl font-bold mb-4">Characters</h1>
      <p className="text-muted-foreground mb-6">
        {PAGE_DESCRIPTIONS.CHARACTERS}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {characters.map(character => (
          <div
            key={character.url}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{character.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Birth Year:</strong> {character.birth_year}
              </p>
              <p>
                <strong>Gender:</strong> {character.gender}
              </p>
              <p>
                <strong>Height:</strong> {character.height} cm
              </p>
              <p>
                <strong>Mass:</strong> {character.mass} kg
              </p>
              <p>
                <strong>Eye Color:</strong> {character.eye_color}
              </p>
              <p>
                <strong>Hair Color:</strong> {character.hair_color}
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
