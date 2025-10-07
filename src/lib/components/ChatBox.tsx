"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";

type ChatBoxProps = {
  className?: string;
  placeholder?: string;
  onSubmit?: (message: string) => void;
};

export default function ChatBox({
  className,
  placeholder = "Ask anything about the galaxy...",
  onSubmit,
}: ChatBoxProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background p-2 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2 outline-none"
          aria-label="Chat message"
        />
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background transition-colors hover:opacity-90 disabled:opacity-50"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
}


