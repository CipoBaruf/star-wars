"use client";

import { memo, useMemo } from "react";
import { PAGINATION } from "@/lib/constants";
import type { PaginationProps } from "@/shared/types";

const Pagination = memo(
  ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const pages = useMemo(() => {
      const maxVisible = Math.min(PAGINATION.MAX_VISIBLE_PAGES, totalPages);
      return Array.from({ length: maxVisible }, (_, i) => i + 1);
    }, [totalPages]);

    return (
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={PAGINATION.BUTTON_STYLES.DISABLED}
          aria-label="Previous page"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={
                currentPage === page
                  ? PAGINATION.BUTTON_STYLES.ACTIVE
                  : PAGINATION.BUTTON_STYLES.DEFAULT
              }
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={PAGINATION.BUTTON_STYLES.DISABLED}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
