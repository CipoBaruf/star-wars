"use client";

import React, {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { API_ENDPOINTS, UI_CONFIG } from "@/lib/constants";
import { locales } from "@/shared/locales";
import type { Message } from "@/shared/types";
import LoadingDots from "../LoadingDots";
import ChatMessage from "./ChatMessage";

export default function ChatBox() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [incomingMessage, setIncomingMessage] = useState("");
  const lastUserMessageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToLastUserMessage = () => {
    if (lastUserMessageRef.current) {
      const container = lastUserMessageRef.current.parentElement;
      const elementTop = lastUserMessageRef.current.offsetTop;

      container?.scrollTo({
        top: elementTop - UI_CONFIG.CHAT_SCROLL_OFFSET,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;

    scrollToLastUserMessage();
  }, [messages, incomingMessage, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

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
      const response = await fetch(API_ENDPOINTS.CHAT_ENHANCED, {
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
          content: locales.errors.chat,
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

  const lastUserMessageIndex =
    messages.length > 0 ? messages.map(m => m.role).lastIndexOf("user") : -1;

  return (
    <div className="h-full w-full max-w-4xl flex flex-col rounded-lg">
      <div
        className={`flex-1 min-h-0 overflow-y-auto py-4 ${
          messages.length === 0 && !incomingMessage
            ? "flex items-center justify-center"
            : ""
        }`}
      >
        {messages.length === 0 && !incomingMessage && (
          <div className="text-center text-muted-foreground">
            {locales.pages.chat.emptyState}
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLastUserMessage={index === lastUserMessageIndex}
            lastUserMessageRef={lastUserMessageRef}
          />
        ))}
        {incomingMessage && (
          <ChatMessage
            message={{ role: "assistant", content: incomingMessage }}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex-shrink-0 py-4 rounded-b-xl">
        <div className="relative ai-border-animate rounded-full p-4">
          {isLoading && !incomingMessage ? (
            <LoadingDots />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={handleInputChange}
              placeholder={locales.pages.chat.placeholder}
              className="w-full bg-transparent text-white outline-none placeholder:text-white placeholder:opacity-100"
              aria-label={locales.aria.chatMessage}
              disabled={isLoading}
            />
          )}
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-black transition-colors hover:bg-gray-200 disabled:opacity-30"
            disabled={!prompt.trim() || isLoading}
            aria-label={
              isLoading ? locales.aria.sendingMessage : locales.aria.sendMessage
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
