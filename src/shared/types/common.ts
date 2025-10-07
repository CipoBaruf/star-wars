// Common types used across the application

export interface SWAPIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatBoxProps {
  className?: string;
  placeholder?: string;
  onSubmit?: (message: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

// API Response types
export interface APIResponse<T> {
  data: SWAPIResponse<T> | null;
  error: string | null;
}

// Page state interface
export interface PageState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}
