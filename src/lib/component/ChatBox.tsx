"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import type { Message, ChatBoxProps } from "@/shared/types";

export default function ChatBox({
  className,
  placeholder = "Ask anything about the galaxy...",
}: ChatBoxProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [incomingMessage, setIncomingMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsLoading(true);
    const userMessage = prompt;
    setPrompt("");

    setMessages(prevState => [
      ...prevState,
      { role: "user", content: userMessage },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      setIsLoading(false);
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
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prevState => [
        ...prevState,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setIncomingMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const ChatMessageItem = ({ message }: { message: Message }) => {
    return (
      <div className="mb-2 p-2 rounded-md bg-gray-50">
        <div className="text-sm font-semibold text-gray-600 mb-1">
          {message.role === "user" ? "You" : "AI"}
        </div>
        <div className="text-gray-800">{message.content}</div>
      </div>
    );
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <div className="mb-4 max-h-96 overflow-y-auto rounded-lg border border-input bg-background p-4 shadow-sm">
        {messages.length === 0 && !incomingMessage && (
          <div className="text-center text-muted-foreground">
            Start a conversation about Star Wars!
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} />
        ))}
        {incomingMessage && (
          <ChatMessageItem
            message={{ role: "assistant", content: incomingMessage }}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Chat message"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background transition-colors hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={!prompt.trim() || isLoading}
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
