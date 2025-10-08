import type { Message } from "@/shared/types";
import type { RefObject } from "react";

interface ChatMessageProps {
  message: Message;
  isLastUserMessage?: boolean;
  lastUserMessageRef?: RefObject<HTMLDivElement | null>;
}

export default function ChatMessage({
  message,
  isLastUserMessage = false,
  lastUserMessageRef,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      ref={isLastUserMessage ? lastUserMessageRef : null}
      className={`mb-4 max-w-[80%] ${isUser ? "ml-auto text-right" : "mr-auto"}`}
    >
      <div
        className={`inline-block whitespace-pre-wrap rounded-full py-3 px-5 leading-relaxed ${
          isUser ? "bg-gray-800 text-white" : "text-gray-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
