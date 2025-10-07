"use client";

import { memo, useMemo } from "react";
import { locales } from "@/shared/locales";
import type { PaginationProps } from "@/shared/types";

const MAX_VISIBLE_PAGES = 5;

const Pagination = memo(
  ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const pages = useMemo(() => {
      const maxVisible = Math.min(MAX_VISIBLE_PAGES, totalPages);
      return Array.from({ length: maxVisible }, (_, i) => i + 1);
    }, [totalPages]);

    return (
      <nav
        className="mt-8 flex items-center justify-center gap-2"
        aria-label={locales.aria.pagination}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-gray-700 px-3 py-2 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={locales.aria.previousPage}
        >
          {locales.ui.previous}
        </button>

        <div className="flex gap-1">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-md border px-3 py-2 transition-colors ${
                currentPage === page
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-700 hover:bg-gray-800"
              }`}
              aria-label={`${locales.aria.goToPage} ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border border-gray-700 px-3 py-2 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={locales.aria.nextPage}
        >
          {locales.ui.next}
        </button>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
