import { useState, useCallback, useEffect, useRef } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";

interface UseInfiniteScrollDataOptions {
  apiEndpoint: string;
  errorMessage: string;
}

export function useInfiniteScrollData<T>({
  apiEndpoint,
  errorMessage,
}: UseInfiniteScrollDataOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const fetchData = useCallback(
    async (page: number, append = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await fetch(`${apiEndpoint}?page=${page}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (append) {
          setItems(prev => [...prev, ...data.results]);
        } else {
          setItems(data.results);
        }

        setHasMore(!!data.next);
        pageRef.current = page;
      } catch (err) {
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [apiEndpoint, errorMessage]
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = pageRef.current + 1;
      fetchData(nextPage, true);
    }
  }, [loadingMore, hasMore, fetchData]);

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: loadingMore,
  });

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreRef,
    refetch: () => fetchData(1),
  };
}
