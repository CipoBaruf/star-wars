import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
  threshold?: number;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = "300px",
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep the callback ref updated
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Callback ref - called when element mounts/unmounts
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Don't set up observer if no node
      if (!node) {
        return;
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        entries => {
          const [entry] = entries;

          if (entry.isIntersecting && hasMore && !isLoading) {
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
    [hasMore, isLoading, rootMargin, threshold]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return setRef;
}
