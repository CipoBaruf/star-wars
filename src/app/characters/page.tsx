"use client";

import { API_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Character } from "@/shared/types";
import {
  InfoCard,
  InfiniteScrollLoader,
  DataPageLayout,
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

  return (
    <DataPageLayout
      title={locales.pages.characters.title}
      description={locales.pages.characters.description}
      loading={loading}
      error={error}
      onRetry={refetch}
    >
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

      <div ref={loadMoreRef} className="min-h-[100px] w-full">
        {hasMore && loadingMore && <InfiniteScrollLoader />}
      </div>

      {!hasMore && characters.length > 0 && (
        <div className="py-8 text-center text-muted-foreground">
          {locales.ui.endOfList}
        </div>
      )}
    </DataPageLayout>
  );
}
