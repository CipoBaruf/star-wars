"use client";

import { useState, useEffect } from "react";
import { UI_CONFIG } from "@/lib/constants";

export function useScrollTitle(
  threshold: number = UI_CONFIG.SCROLL_TITLE_THRESHOLD
) {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      setShowTitle(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return showTitle;
}
