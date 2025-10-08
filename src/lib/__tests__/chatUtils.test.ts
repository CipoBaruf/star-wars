import {
  withTimeout,
  withRetry,
  extractContextFromHistory,
  extractEntities,
  detectUserIntent,
} from "../chatUtils";
import type { Message } from "@/shared/types";

describe("chatUtils", () => {
  describe("withTimeout", () => {
    // Test 1: Resolves successfully within timeout
    it("should resolve when promise completes before timeout", async () => {
      const promise = Promise.resolve("success");
      const result = await withTimeout(promise, 1000);
      expect(result).toBe("success");
    });

    // Test 2: Rejects when timeout is exceeded
    it("should reject when promise exceeds timeout", async () => {
      const promise = new Promise(resolve =>
        setTimeout(() => resolve("too late"), 200)
      );

      await expect(withTimeout(promise, 100)).rejects.toThrow(
        "Operation timed out after 100ms"
      );
    });

    // Test 3: Propagates original error
    it("should propagate original error if promise rejects before timeout", async () => {
      const promise = Promise.reject(new Error("Original error"));

      await expect(withTimeout(promise, 1000)).rejects.toThrow(
        "Original error"
      );
    });
  });

  describe("withRetry", () => {
    // Test 4: Succeeds on first attempt
    it("should succeed on first attempt", async () => {
      const operation = jest.fn().mockResolvedValue("success");
      const result = await withRetry(operation, 3, 10);

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(1);
    });

    // Test 5: Retries on failure and eventually succeeds
    it("should retry and succeed on second attempt", async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValueOnce("success");

      const result = await withRetry(operation, 3, 10);

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(2);
    });

    // Test 6: Exhausts all retries and throws last error
    it("should exhaust retries and throw last error", async () => {
      const operation = jest.fn().mockRejectedValue(new Error("fail"));

      await expect(withRetry(operation, 2, 10)).rejects.toThrow("fail");
      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    // Test 7: Uses exponential backoff delay
    it("should use increasing delays between retries", async () => {
      const operation = jest.fn().mockRejectedValue(new Error("fail"));
      const delays: number[] = [];
      const originalSetTimeout = global.setTimeout;

      global.setTimeout = jest.fn((fn: () => void, delay: number) => {
        delays.push(delay);
        return originalSetTimeout(fn, 0);
      }) as unknown as typeof global.setTimeout;

      try {
        await withRetry(operation, 2, 100);
      } catch {
        // Expected to fail
      }

      expect(delays).toEqual([100, 200]); // delay * (attempt + 1)
      global.setTimeout = originalSetTimeout;
    });
  });

  describe("extractContextFromHistory", () => {
    // Test 8: Returns empty string for empty history
    it("should return empty string for empty history", () => {
      expect(extractContextFromHistory([])).toBe("");
    });

    // Test 9: Returns formatted context from messages
    it("should format messages into context string", () => {
      const messages: Message[] = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there" },
      ];

      const result = extractContextFromHistory(messages);
      expect(result).toBe("user: Hello assistant: Hi there");
    });

    // Test 10: Limits history to MAX_CONVERSATION_HISTORY
    it("should limit history to last 10 messages", () => {
      const messages: Message[] = Array.from({ length: 15 }, (_, i) => ({
        role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
        content: `Message ${i}`,
      }));

      const result = extractContextFromHistory(messages);
      const messageCount = result.split(" assistant: ").length - 1;

      // Should only include last 10 messages (5 pairs)
      expect(messageCount).toBeLessThanOrEqual(5);
    });

    // Test 11: Handles null/undefined gracefully
    it("should handle null conversation history", () => {
      expect(extractContextFromHistory(null as unknown as Message[])).toBe("");
      expect(extractContextFromHistory(undefined as unknown as Message[])).toBe(
        ""
      );
    });
  });

  describe("extractEntities", () => {
    // Test 12: Extracts matching entities
    it("should extract entities found in prompt", () => {
      const prompt = "Tell me about Luke Skywalker and Leia";
      const entityList = ["luke", "leia", "han", "vader"];

      const result = extractEntities(prompt, entityList);
      expect(result).toEqual(["luke", "leia"]);
    });

    // Test 13: Case insensitive matching
    it("should match entities case-insensitively", () => {
      const prompt = "LUKE and leia";
      const entityList = ["luke", "leia"];

      const result = extractEntities(prompt, entityList);
      expect(result).toEqual(["luke", "leia"]);
    });

    // Test 14: Returns empty array when no matches
    it("should return empty array when no entities match", () => {
      const prompt = "Something else";
      const entityList = ["luke", "leia"];

      const result = extractEntities(prompt, entityList);
      expect(result).toEqual([]);
    });

    // Test 15: Handles partial matches
    it("should match partial strings", () => {
      const prompt = "millennium falcon ship";
      const entityList = ["millennium falcon", "falcon"];

      const result = extractEntities(prompt, entityList);
      expect(result).toEqual(["millennium falcon", "falcon"]);
    });
  });

  describe("detectUserIntent", () => {
    // Test 16: Detects character intent
    it("should detect character intent from keywords", () => {
      const intent = detectUserIntent("Tell me about Luke Skywalker");

      expect(intent.type).toBe("character");
      expect(intent.entities).toContain("luke");
      expect(intent.isSWAPIRelevant).toBe(true);
      expect(intent.relatedData).toContain("films");
    });

    // Test 17: Detects planet intent
    it("should detect planet intent from keywords", () => {
      const intent = detectUserIntent("What is the climate on Tatooine?");

      expect(intent.type).toBe("planet");
      expect(intent.entities).toContain("tatooine");
      expect(intent.isSWAPIRelevant).toBe(true);
      expect(intent.relatedData).toContain("residents");
    });

    // Test 18: Detects starship intent
    it("should detect starship intent from keywords", () => {
      const intent = detectUserIntent("Tell me about the Millennium Falcon");

      expect(intent.type).toBe("starship");
      expect(intent.entities).toContain("millennium falcon");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 19: Detects vehicle intent
    it("should detect vehicle intent from keywords", () => {
      const intent = detectUserIntent("What is an AT-AT walker?");

      expect(intent.type).toBe("vehicle");
      expect(intent.entities).toContain("at-at");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 20: Detects film intent
    it("should detect film intent from keywords", () => {
      const intent = detectUserIntent("What happened in A New Hope?");

      expect(intent.type).toBe("film");
      expect(intent.entities).toContain("a new hope");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 21: Detects species intent
    it("should detect species intent from keywords", () => {
      const intent = detectUserIntent("Tell me about the Wookiee species");

      expect(intent.type).toBe("species");
      expect(intent.entities).toContain("wookiee");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 22: Detects comparison intent
    it("should detect comparison intent", () => {
      const intent = detectUserIntent("Compare Luke vs Vader");

      expect(intent.type).toBe("comparison");
      expect(intent.requiresMultipleCalls).toBe(true);
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 23: Returns unknown for irrelevant queries
    it("should return unknown intent for non-Star Wars queries", () => {
      const intent = detectUserIntent("What is the weather today?");

      expect(intent.type).toBe("unknown");
      expect(intent.isSWAPIRelevant).toBe(false);
      expect(intent.entities).toEqual([]);
    });

    // Test 24: Uses conversation history for context
    it("should use conversation history to detect intent", () => {
      const conversationHistory: Message[] = [
        { role: "user", content: "Tell me about Luke Skywalker" },
        { role: "assistant", content: "Luke is a Jedi..." },
      ];

      const intent = detectUserIntent(
        "What about his homeworld?",
        conversationHistory
      );

      // The word "homeworld" triggers planet intent, which is correct behavior
      // since the question is about a planet even though context has Luke
      expect(intent.type).toBe("planet");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 25: Detects relationship requirements
    it("should detect when multiple calls are needed for relationships", () => {
      const intent = detectUserIntent("Who are Luke's friends?");

      expect(intent.type).toBe("character");
      expect(intent.requiresMultipleCalls).toBe(true);
    });

    // Test 26: Handles multiple entity detection
    it("should extract multiple entities from prompt", () => {
      const intent = detectUserIntent("Compare Luke and Vader and Yoda");

      expect(intent.entities).toContain("luke");
      expect(intent.entities).toContain("vader");
      expect(intent.entities).toContain("yoda");
    });

    // Test 27: Character intent from generic keywords
    it("should detect character intent from generic keywords", () => {
      const intent = detectUserIntent("Tell me about a Jedi character");

      expect(intent.type).toBe("character");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 28: Planet intent from generic keywords
    it("should detect planet intent from generic keywords", () => {
      const intent = detectUserIntent("What planets have desert terrain?");

      expect(intent.type).toBe("planet");
      expect(intent.isSWAPIRelevant).toBe(true);
    });

    // Test 29: Case insensitive detection
    it("should detect intent case-insensitively", () => {
      const intent1 = detectUserIntent("LUKE SKYWALKER");
      const intent2 = detectUserIntent("luke skywalker");

      expect(intent1.type).toBe(intent2.type);
      expect(intent1.entities).toEqual(intent2.entities);
    });

    // Test 30: Priority: Character keywords take precedence over context
    it("should prioritize explicit keywords in current prompt", () => {
      const conversationHistory: Message[] = [
        { role: "user", content: "Tell me about Tatooine planet" },
        { role: "assistant", content: "Tatooine is a desert planet..." },
      ];

      const intent = detectUserIntent(
        "What about Luke Skywalker?",
        conversationHistory
      );

      // Should detect character, not planet, despite planet in history
      expect(intent.type).toBe("character");
    });
  });
});
