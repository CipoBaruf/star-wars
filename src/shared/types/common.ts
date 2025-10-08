// Common types used across the application

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export interface InfoCardField {
  label: string;
  value: string | number;
  capitalize?: boolean;
  alignRight?: boolean;
}

export interface InfoCardProps {
  title: string;
  fields: InfoCardField[];
}
