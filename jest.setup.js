// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock TextDecoderStream for ChatBox tests
global.TextDecoderStream = class TextDecoderStream {
  constructor() {
    // Create a mock readable stream that just passes through
    this.readable = {
      getReader: () => {
        throw new Error(
          "TextDecoderStream mock: use body.pipeThrough mock instead"
        );
      },
    };
    this.writable = null;
  }
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe(target) {
    // Mock observe
  }

  unobserve(target) {
    // Mock unobserve
  }

  disconnect() {
    // Mock disconnect
  }

  takeRecords() {
    return [];
  }
};

// Mock window.scrollY
Object.defineProperty(window, "scrollY", {
  writable: true,
  configurable: true,
  value: 0,
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
