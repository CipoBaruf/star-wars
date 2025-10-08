import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatBox from "../ChatBox";

// Mock fetch
global.fetch = jest.fn();

// Mock scrollTo
Element.prototype.scrollTo = jest.fn();

describe("ChatBox", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for cleaner test output
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    consoleErrorSpy.mockRestore();
  });

  // Test 1: Renders with default placeholder
  it("should render with default placeholder", () => {
    render(<ChatBox />);
    expect(
      screen.getByPlaceholderText("Ask me anything...")
    ).toBeInTheDocument();
  });

  // Test 2: Renders with custom placeholder
  it("should render with custom placeholder", () => {
    render(<ChatBox placeholder="Custom placeholder" />);
    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  // Test 3: Shows empty state initially
  it("should show empty state message initially", () => {
    render(<ChatBox />);
    expect(
      screen.getByText("Ask anything about the Star Wars universe")
    ).toBeInTheDocument();
  });

  // Test 4: Input updates on change
  it("should update input value on change", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    expect(input).toHaveValue("Hello");
  });

  // Test 5: Submit button is disabled when input is empty
  it("should disable submit button when input is empty", () => {
    render(<ChatBox />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    expect(submitButton).toBeDisabled();
  });

  // Test 6: Submit button is enabled when input has text
  it("should enable submit button when input has text", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    expect(submitButton).not.toBeDisabled();
  });

  // Test 7: Submit button is disabled with only whitespace
  it("should disable submit button with only whitespace", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "   ");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    expect(submitButton).toBeDisabled();
  });

  // Test 8: Adds user message on submit
  it("should add user message to chat on submit", async () => {
    const user = userEvent.setup();

    // Mock streaming response with proper pipeThrough
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Response" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    const mockPipeThrough = jest.fn().mockReturnValue({
      getReader: () => mockReader,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: mockPipeThrough,
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello Star Wars!");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Hello Star Wars!")).toBeInTheDocument();
    });

    // Verify pipeThrough was called with TextDecoderStream
    expect(mockPipeThrough).toHaveBeenCalled();
  });

  // Test 9: Clears input after submit
  it("should clear input after submit", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Response" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    await user.type(screen.getByRole("textbox"), "Hello");

    expect(screen.getByRole("textbox")).toHaveValue("Hello");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Input should be cleared after submit - query it fresh
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("");
    });
  });

  // Test 10: Shows loading state during request
  it("should show loading indicator during request", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise(resolve =>
              setTimeout(() => resolve({ done: true, value: undefined }), 100)
            )
        ),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const form = input.closest("form");
    fireEvent.submit(form!);

    // Should show loading dots (check in the form's container)
    await waitFor(() => {
      const container = form?.querySelector(".ai-border-animate");
      const loadingDots = container?.querySelectorAll(".animate-bounce");
      expect(loadingDots?.length).toBe(3);
    });
  });

  // Test 11: Shows submit button is disabled while loading
  it("should disable submit button while loading", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise(resolve =>
              setTimeout(() => resolve({ done: true, value: undefined }), 50)
            )
        ),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const submitButton = screen.getByRole("button");
    expect(submitButton).not.toBeDisabled();

    const form = input.closest("form");
    fireEvent.submit(form!);

    // Submit button should be disabled during loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  // Test 12: Displays streaming response
  it("should display streaming assistant response", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Hello, " })
        .mockResolvedValueOnce({ done: false, value: "how can " })
        .mockResolvedValueOnce({ done: false, value: "I help?" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(screen.getByText("Hello, how can I help?")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  // Test 13: Handles API errors gracefully
  it("should handle API errors gracefully", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, I encountered an error. Please try again.")
      ).toBeInTheDocument();
    });
  });

  // Test 14: Handles network errors
  it("should handle network errors", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, I encountered an error. Please try again.")
      ).toBeInTheDocument();
    });
  });

  // Test 15: Maintains conversation history
  it("should maintain conversation history", async () => {
    const user = userEvent.setup();

    // First message
    const mockReader1 = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Response 1" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader1,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");

    // Send first message
    await user.type(input, "Message 1");
    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(screen.getByText("Response 1")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Second message
    const mockReader2 = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Response 2" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader2,
        }),
      },
    });

    await user.type(input, "Message 2");
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(screen.getByText("Response 2")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Both messages should be visible
    expect(screen.getByText("Message 1")).toBeInTheDocument();
    expect(screen.getByText("Response 1")).toBeInTheDocument();
    expect(screen.getByText("Message 2")).toBeInTheDocument();
    expect(screen.getByText("Response 2")).toBeInTheDocument();
  });

  // Test 16: Sends conversation history in request
  it("should send conversation history in request", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest.fn().mockResolvedValue({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");

    // First message
    await user.type(input, "First message");
    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Second message
    await user.type(input, "Second message");
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      },
      { timeout: 3000 }
    );

    // Check that second request includes conversation history
    const secondCallBody = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[1][1].body
    );
    expect(secondCallBody.conversationHistory).toBeDefined();
    expect(secondCallBody.conversationHistory.length).toBeGreaterThan(0);
  });

  // Test 17: User messages are right-aligned
  it("should right-align user messages", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Response" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "User message");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      const userMessage = screen.getByText("User message");
      const messageContainer = userMessage.closest(".mb-4");
      expect(messageContainer).toHaveClass("ml-auto");
    });
  });

  // Test 18: Assistant messages are left-aligned
  it("should left-align assistant messages", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Assistant response" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(
      () => {
        const assistantMessage = screen.getByText("Assistant response");
        const messageContainer = assistantMessage.closest(".mb-4");
        expect(messageContainer).toHaveClass("mr-auto");
      },
      { timeout: 3000 }
    );
  });

  // Test 19: Custom className is applied
  it("should apply custom className", () => {
    render(<ChatBox className="custom-class" />);

    const container = screen.getByRole("textbox").closest(".custom-class");
    expect(container).toBeInTheDocument();
  });

  // Test 20: Handles missing response body
  it("should handle missing response body", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: null,
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, I encountered an error. Please try again.")
      ).toBeInTheDocument();
    });
  });

  // Test 21: Submit button has correct aria-label during loading
  it("should update submit button aria-label during loading", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise(resolve =>
              setTimeout(() => resolve({ done: true, value: undefined }), 100)
            )
        ),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    const submitButton = screen.getByRole("button");
    expect(submitButton).toHaveAttribute("aria-label", "Send message");

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(submitButton).toHaveAttribute("aria-label", "Sending message");
      },
      { timeout: 2000 }
    );
  });

  // Test 22: Prevents empty message submission
  it("should not submit empty message", async () => {
    render(<ChatBox />);

    const form = screen.getByRole("textbox").closest("form");
    fireEvent.submit(form!);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  // Test 23: Form submission with Enter key
  it("should submit form with Enter key", async () => {
    const user = userEvent.setup();

    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: "Response" })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        pipeThrough: jest.fn().mockReturnValue({
          getReader: () => mockReader,
        }),
      },
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello{Enter}");

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });
});
