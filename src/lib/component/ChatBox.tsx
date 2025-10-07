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
      const response = await fetch("/api/chat-enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversationHistory: messages,
        }),
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
      <div className="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="text-sm font-semibold text-gray-600 mb-2">
          {message.role === "user" ? "You" : "AI"}
        </div>
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full max-w-4xl", className)}>
      <div className="mb-4 max-h-[600px] overflow-y-auto rounded-lg border border-input bg-background p-6 shadow-sm">
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
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Chat message"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-lg bg-foreground px-6 py-3 text-background transition-colors hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          disabled={!prompt.trim() || isLoading}
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
