"use client";

import { useState, useEffect, useRef } from "react";
import { UI_CONFIG } from "@/lib/constants";

/**
 * Custom hook to track whether the page has been scrolled past a threshold
 */
export function useScrollTitle(
  threshold: number = UI_CONFIG.SCROLL_TITLE_THRESHOLD
): boolean {
  const [showTitle, setShowTitle] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Check initial scroll position
    const checkScroll = () => {
      const scrolled = window.scrollY > threshold;
      setShowTitle(prev => (prev !== scrolled ? scrolled : prev));
    };

    // Check on mount
    checkScroll();

    // Throttle scroll handler using requestAnimationFrame
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Schedule check for next frame
      rafIdRef.current = requestAnimationFrame(checkScroll);
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [threshold]);

  return showTitle;
}
