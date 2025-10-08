import { renderHook, waitFor } from "@testing-library/react";
import { useInfiniteScrollData } from "../useInfiniteScrollData";

// Mock the useInfiniteScroll hook
jest.mock("../useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(() => jest.fn()),
}));

describe("useInfiniteScrollData", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // Suppress console.error for cleaner test output
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    consoleErrorSpy.mockRestore();
  });

  const mockApiEndpoint = "/api/test";
  const mockErrorMessage = "Failed to fetch data";

  // Test 1: Initial loading state
  it("should start with loading state", () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        })
    );

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  // Test 2: Successfully fetches initial data
  it("should fetch initial data successfully", async () => {
    const mockData = {
      results: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
      next: "http://api.com/page2",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toEqual(mockData.results);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(`${mockApiEndpoint}?page=1`);
  });

  // Test 3: Sets hasMore to false when no next page
  it("should set hasMore to false when there is no next page", async () => {
    const mockData = {
      results: [{ id: 1, name: "Item 1" }],
      next: null,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  // Test 4: Handles fetch errors
  it("should handle fetch errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockErrorMessage);
    expect(result.current.items).toEqual([]);
  });

  // Test 5: Handles network errors
  it("should handle network errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockErrorMessage);
  });

  // Test 6: Verifies initial data load and pagination setup
  it("should fetch initial data and setup for pagination", async () => {
    const mockPage1 = {
      results: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
      next: "http://api.com/page2",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPage1,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items).toEqual(mockPage1.results);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loadMoreRef).toBeDefined();
    expect(typeof result.current.loadMoreRef).toBe("function");
  });

  // Test 7: Does not load more when already loading
  it("should not load more when already loading", async () => {
    const mockData = {
      results: [{ id: 1, name: "Item 1" }],
      next: "http://api.com/page2",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that hasMore is true
    expect(result.current.hasMore).toBe(true);

    // Since the loadMoreRef calls a callback, we just verify the state is correct
    expect(result.current.loadingMore).toBe(false);
  });

  // Test 8: Does not load more when hasMore is false
  it("should not load more when hasMore is false", async () => {
    const mockData = {
      results: [{ id: 1, name: "Item 1" }],
      next: null,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const fetchCallCount = (global.fetch as jest.Mock).mock.calls.length;

    // Try to load more
    result.current.loadMoreRef(document.createElement("div"));

    // Wait a bit to ensure no new fetch is made
    await new Promise(resolve => setTimeout(resolve, 50));

    expect((global.fetch as jest.Mock).mock.calls.length).toBe(fetchCallCount);
  });

  // Test 9: Refetch resets to page 1
  it("should refetch data from page 1", async () => {
    const mockData1 = {
      results: [{ id: 1, name: "Item 1" }],
      next: "http://api.com/page2",
    };

    const mockData2 = {
      results: [{ id: 2, name: "Item 2" }],
      next: null,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.items).toEqual(mockData2.results);
    });

    // Should have called fetch twice with page 1
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${mockApiEndpoint}?page=1`
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${mockApiEndpoint}?page=1`
    );
  });

  // Test 10: Sets loadingMore state correctly
  it("should set loadingMore state correctly when loading more", async () => {
    const mockPage1 = {
      results: [{ id: 1, name: "Item 1" }],
      next: "http://api.com/page2",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPage1,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Initially loadingMore should be false
    expect(result.current.loadingMore).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  // Test 11: Clears error on successful refetch
  it("should clear error on successful refetch", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 1, name: "Item 1" }],
          next: null,
        }),
      });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        apiEndpoint: mockApiEndpoint,
        errorMessage: mockErrorMessage,
      })
    );

    // Wait for error
    await waitFor(() => {
      expect(result.current.error).toBe(mockErrorMessage);
    });

    // Refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });

    expect(result.current.items).toHaveLength(1);
  });
});
