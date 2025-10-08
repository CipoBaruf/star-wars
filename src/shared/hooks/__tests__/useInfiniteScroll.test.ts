import { renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "../useInfiniteScroll";

describe("useInfiniteScroll", () => {
  let mockIntersectionObserver: jest.Mock;
  let observeMock: jest.Mock;
  let disconnectMock: jest.Mock;

  beforeEach(() => {
    observeMock = jest.fn();
    disconnectMock = jest.fn();

    mockIntersectionObserver = jest.fn(function (
      this: IntersectionObserver & {
        triggerIntersection?: (isIntersecting: boolean) => void;
      },
      callback: IntersectionObserverCallback
    ) {
      this.observe = observeMock;
      this.disconnect = disconnectMock;
      this.unobserve = jest.fn();
      this.takeRecords = jest.fn();
      // Store callback for testing
      this.triggerIntersection = (isIntersecting: boolean) => {
        callback(
          [
            {
              isIntersecting,
              target: document.createElement("div"),
              boundingClientRect: {} as DOMRectReadOnly,
              intersectionRatio: isIntersecting ? 1 : 0,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: Date.now(),
            },
          ],
          this
        );
      };
      return this;
    });

    global.IntersectionObserver =
      mockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Returns a callback ref function
  it("should return a callback ref function", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    expect(typeof result.current).toBe("function");
  });

  // Test 2: Creates IntersectionObserver when node is provided
  it("should create IntersectionObserver when node is provided", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      })
    );
    expect(observeMock).toHaveBeenCalledWith(mockNode);
  });

  // Test 3: Uses custom rootMargin and threshold
  it("should use custom rootMargin and threshold", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
        rootMargin: "500px",
        threshold: 0.5,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: "500px",
        threshold: 0.5,
      })
    );
  });

  // Test 4: Calls onLoadMore when intersecting with hasMore=true and isLoading=false
  it("should call onLoadMore when element intersects and hasMore is true", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    // Get the observer instance and trigger intersection
    const observerInstance = mockIntersectionObserver.mock.results[0]
      .value as IntersectionObserver & {
      triggerIntersection: (isIntersecting: boolean) => void;
    };
    observerInstance.triggerIntersection(true);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  // Test 5: Does not call onLoadMore when hasMore is false
  it("should not call onLoadMore when hasMore is false", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: false,
        isLoading: false,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    const observerInstance = mockIntersectionObserver.mock.results[0]
      .value as IntersectionObserver & {
      triggerIntersection: (isIntersecting: boolean) => void;
    };
    observerInstance.triggerIntersection(true);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  // Test 6: Does not call onLoadMore when isLoading is true
  it("should not call onLoadMore when isLoading is true", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: true,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    const observerInstance = mockIntersectionObserver.mock.results[0]
      .value as IntersectionObserver & {
      triggerIntersection: (isIntersecting: boolean) => void;
    };
    observerInstance.triggerIntersection(true);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  // Test 7: Does not call onLoadMore when not intersecting
  it("should not call onLoadMore when element is not intersecting", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    const observerInstance = mockIntersectionObserver.mock.results[0]
      .value as IntersectionObserver & {
      triggerIntersection: (isIntersecting: boolean) => void;
    };
    observerInstance.triggerIntersection(false);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  // Test 8: Disconnects previous observer when ref changes
  it("should disconnect previous observer when ref changes", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    // First node
    const mockNode1 = document.createElement("div");
    result.current(mockNode1);

    const firstDisconnect = disconnectMock;

    // Second node
    const mockNode2 = document.createElement("div");
    result.current(mockNode2);

    expect(firstDisconnect).toHaveBeenCalled();
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
  });

  // Test 9: Disconnects observer on unmount
  it("should disconnect observer on unmount", () => {
    const onLoadMore = jest.fn();
    const { result, unmount } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  // Test 10: Handles null node gracefully
  it("should handle null node gracefully", () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    // Should not throw
    expect(() => result.current(null)).not.toThrow();
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  // Test 11: Updates onLoadMore callback without recreating observer
  it("should use updated onLoadMore callback", () => {
    const onLoadMore1 = jest.fn();
    const onLoadMore2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ callback }) =>
        useInfiniteScroll({
          onLoadMore: callback,
          hasMore: true,
          isLoading: false,
        }),
      { initialProps: { callback: onLoadMore1 } }
    );

    const mockNode = document.createElement("div");
    result.current(mockNode);

    // Trigger with first callback
    const observerInstance = mockIntersectionObserver.mock.results[0]
      .value as IntersectionObserver & {
      triggerIntersection: (isIntersecting: boolean) => void;
    };
    observerInstance.triggerIntersection(true);
    expect(onLoadMore1).toHaveBeenCalledTimes(1);

    // Update callback
    rerender({ callback: onLoadMore2 });

    // Trigger with second callback
    observerInstance.triggerIntersection(true);
    expect(onLoadMore2).toHaveBeenCalledTimes(1);
    expect(onLoadMore1).toHaveBeenCalledTimes(1); // Should not be called again
  });
});
