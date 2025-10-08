import { renderHook, act } from "@testing-library/react";
import { useScrollTitle } from "../useScrollTitle";

describe("useScrollTitle", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Initial state is false
  it("should return false initially when scrollY is 0", () => {
    const { result } = renderHook(() => useScrollTitle());
    expect(result.current).toBe(false);
  });

  // Test 2: Returns true when scrolled past threshold
  it("should return true when scrolled past default threshold", () => {
    const { result } = renderHook(() => useScrollTitle());

    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 150,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  // Test 3: Returns false when scrolled back below threshold
  it("should return false when scrolled back below threshold", () => {
    const { result } = renderHook(() => useScrollTitle());

    // Scroll down
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 150,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);

    // Scroll back up
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 50,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  // Test 4: Uses custom threshold
  it("should use custom threshold", () => {
    const customThreshold = 200;
    const { result } = renderHook(() => useScrollTitle(customThreshold));

    // Scroll to just below threshold
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 199,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    // Scroll past threshold
    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 201,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  // Test 5: Exactly at threshold is considered not scrolled
  it("should return false when exactly at threshold", () => {
    const threshold = 100;
    const { result } = renderHook(() => useScrollTitle(threshold));

    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 100,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  // Test 6: Removes event listener on unmount
  it("should remove scroll event listener on unmount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollTitle());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  // Test 7: Updates when threshold prop changes
  it("should update threshold when prop changes", () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useScrollTitle(threshold),
      { initialProps: { threshold: 100 } }
    );

    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 150,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);

    // Change threshold to higher value
    rerender({ threshold: 200 });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  // Test 8: Handles zero threshold
  it("should handle zero threshold", () => {
    const { result } = renderHook(() => useScrollTitle(0));

    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 1,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  // Test 9: Handles negative scroll values (edge case)
  it("should handle negative scroll values", () => {
    const { result } = renderHook(() => useScrollTitle());

    act(() => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: -10,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });
});
