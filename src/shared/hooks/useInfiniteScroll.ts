import { useEffect, useRef, useCallback } from "react";
import { UI_CONFIG } from "@/lib/constants";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Custom hook for implementing infinite scroll using Intersection Observer API
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = UI_CONFIG.INFINITE_SCROLL_ROOT_MARGIN,
  threshold = UI_CONFIG.INFINITE_SCROLL_THRESHOLD,
}: UseInfiniteScrollOptions): (node: HTMLElement | null) => void {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);

  // Keep refs updated with latest values
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Early return if no node
      if (!node) return;

      // Create new observer with stable callback using refs
      observerRef.current = new IntersectionObserver(
        entries => {
          const [entry] = entries;
          if (
            entry.isIntersecting &&
            hasMoreRef.current &&
            !isLoadingRef.current
          ) {
            onLoadMoreRef.current();
          }
        },
        {
          root: null,
          rootMargin,
          threshold,
        }
      );

      observerRef.current.observe(node);
    },
    [rootMargin, threshold]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return setRef;
}
