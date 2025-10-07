"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  className?: string;
  placeholder?: string;
  onSubmit?: (message: string) => void;
}

export default function ChatBox({
  className,
  placeholder = "Ask anything about the galaxy...",
  onSubmit,
}: ChatBoxProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [incomingMessage, setIncomingMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setPrompt("");

    setMessages(prevState => [...prevState, { role: "user", content: prompt }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) return;

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    if (reader) setIsLoading(false);

    let incomingMessage = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        setMessages(prevState => [
          ...prevState,
          { role: "assistant", content: incomingMessage },
        ]);

        setIncomingMessage("");

        break;
      }

      if (value) {
        incomingMessage += value;

        setIncomingMessage(incomingMessage);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };
  const ChatMessageItem = ({ message }: { message: Message }) => {
    return (
      <div>
        {message.role === "user" ? "User: " : "AI: "}
        {message.content}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-xl", className)}>
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background p-2 shadow-sm">
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <ChatMessageItem key={index} message={message} />
          ))}

          {incomingMessage && (
            <ChatMessageItem
              message={{ role: "assistant", content: incomingMessage }}
            />
          )}
          <input
            type="text"
            value={prompt}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 py-2 outline-none"
            aria-label="Chat message"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background transition-colors hover:opacity-90 disabled:opacity-50"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
