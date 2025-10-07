import React from "react";
import type { InfoCardProps } from "@/shared/types";

export default function InfoCard({ title, fields }: InfoCardProps) {
  return (
    <div className="card-interactive bg-glass group">
      <h3 className="mb-4 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
        {title}
      </h3>
      <div className="space-y-2 text-sm">
        {fields.map((field, index) => (
          <p key={index} className="flex justify-between gap-2">
            <span className="text-gray-400">{field.label}:</span>
            <span
              className={`text-gray-200 ${field.capitalize ? "capitalize" : ""} ${
                field.alignRight ? "text-right" : ""
              }`}
            >
              {field.value}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
