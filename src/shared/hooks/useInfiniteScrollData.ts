import { useState, useCallback, useEffect, useRef } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";

interface UseInfiniteScrollDataOptions {
  apiEndpoint: string;
  errorMessage: string;
}

interface UseInfiniteScrollDataReturn<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreRef: (node: HTMLElement | null) => void;
  refetch: () => void;
}

/**
 * Custom hook for fetching paginated data with infinite scroll
 *
 * Handles the complete lifecycle of infinite scrolling including:
 * - Initial data fetch
 * - Loading more pages on scroll
 * - Error handling
 * - Request cancellation on cleanup
 */
export function useInfiniteScrollData<T>({
  apiEndpoint,
  errorMessage,
}: UseInfiniteScrollDataOptions): UseInfiniteScrollDataReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Keep errorMessage in a ref to avoid fetchData recreation
  const errorMessageRef = useRef(errorMessage);
  useEffect(() => {
    errorMessageRef.current = errorMessage;
  }, [errorMessage]);

  const fetchData = useCallback(
    async (page: number, append = false) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response = await fetch(`${apiEndpoint}?page=${page}`, {
          signal: abortControllerRef.current.signal,
        });

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
        // Don't set error state if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(errorMessageRef.current);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [apiEndpoint]
  );

  const loadMore = useCallback(() => {
    const nextPage = pageRef.current + 1;
    fetchData(nextPage, true);
  }, [fetchData]);

  const refetch = useCallback(() => {
    pageRef.current = 1;
    fetchData(1, false);
  }, [fetchData]);

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: loadingMore,
  });

  // Initial fetch
  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  // Cleanup: abort any ongoing requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreRef,
    refetch,
  };
}
