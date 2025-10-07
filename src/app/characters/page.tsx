"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Character } from "@/shared/types";
import {
  LoadingSkeleton,
  InfoCard,
  ErrorMessage,
  InfiniteScrollLoader,
  BackToTop,
} from "@/shared/components";
import { useInfiniteScrollData } from "@/shared/hooks";

export default function CharactersPage() {
  const {
    items: characters,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreRef,
    refetch,
  } = useInfiniteScrollData<Character>({
    apiEndpoint: API_ENDPOINTS.CHARACTERS,
    errorMessage: ERROR_MESSAGES.CHARACTERS,
  });

  if (loading)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.characters.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.characters.description}
        </p>
        <LoadingSkeleton />
      </main>
    );

  if (error)
    return (
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.characters.title}
        </h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </main>
    );

  return (
    <>
      <main className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
          {locales.pages.characters.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          {locales.pages.characters.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {characters.map(character => (
            <InfoCard
              key={character.url}
              title={character.name}
              fields={[
                {
                  label: locales.fields.birthYear,
                  value: character.birth_year,
                },
                { label: locales.fields.gender, value: character.gender },
                {
                  label: locales.fields.height,
                  value: `${character.height} cm`,
                },
                { label: locales.fields.mass, value: `${character.mass} kg` },
                {
                  label: locales.fields.eyeColor,
                  value: character.eye_color,
                  capitalize: true,
                },
                {
                  label: locales.fields.hairColor,
                  value: character.hair_color,
                  capitalize: true,
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
        {!hasMore && characters.length > 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {locales.ui.endOfList}
          </div>
        )}
      </main>
      <BackToTop />
    </>
  );
}
