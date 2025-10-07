// API Configuration
export const SWAPI_BASE_URL = "https://swapi.dev/api";

// Pagination
export const ITEMS_PER_PAGE = 10;

// Cache Configuration
export const CACHE_DURATION = "public, max-age=3600"; // 1 hour

// API Endpoints
export const API_ENDPOINTS = {
  CHARACTERS: "/api/characters",
  PLANETS: "/api/planets",
  STARSHIPS: "/api/starships",
  VEHICLES: "/api/vehicles",
  CHAT: "/api/chat",
} as const;

// SWAPI Resource Endpoints
export const SWAPI_ENDPOINTS = {
  PEOPLE: "/people/",
  PLANETS: "/planets/",
  STARSHIPS: "/starships/",
  VEHICLES: "/vehicles/",
} as const;

// UI Constants
export const PAGINATION = {
  MAX_VISIBLE_PAGES: 5,
  BUTTON_STYLES: {
    DEFAULT: "px-3 py-2 border rounded-md hover:bg-gray-50",
    ACTIVE:
      "px-3 py-2 border rounded-md bg-blue-500 text-white border-blue-500",
    DISABLED:
      "px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed",
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  CHARACTERS: "Failed to fetch characters",
  PLANETS: "Failed to fetch planets",
  STARSHIPS: "Failed to fetch starships",
  VEHICLES: "Failed to fetch vehicles",
  CHAT: "Failed to process chat request",
  GENERIC: "An error occurred",
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  CHARACTERS: "Loading characters...",
  PLANETS: "Loading planets...",
  STARSHIPS: "Loading starships...",
  VEHICLES: "Loading vehicles...",
} as const;

// Page Descriptions
export const PAGE_DESCRIPTIONS = {
  CHARACTERS: "Browse notable figures across the Star Wars saga.",
  PLANETS: "Discover worlds from Tatooine to Coruscant and beyond.",
  STARSHIPS: "Explore starships from the Star Wars universe.",
  VEHICLES: "Explore speeders, walkers, and everything in between.",
} as const;
