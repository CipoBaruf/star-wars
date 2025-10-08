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
  FILMS: "/api/films",
  SPECIES: "/api/species",
  CHAT_ENHANCED: "/api/chat-enhanced",
} as const;

// SWAPI Resource Endpoints
export const SWAPI_ENDPOINTS = {
  PEOPLE: "/people/",
  PLANETS: "/planets/",
  STARSHIPS: "/starships/",
  VEHICLES: "/vehicles/",
  FILMS: "/films/",
  SPECIES: "/species/",
} as const;

// Error Messages - Keep these for API error handling
export const ERROR_MESSAGES = {
  CHARACTERS: "Failed to fetch characters",
  PLANETS: "Failed to fetch planets",
  STARSHIPS: "Failed to fetch starships",
  VEHICLES: "Failed to fetch vehicles",
  FILMS: "Failed to fetch films",
  SPECIES: "Failed to fetch species",
  CHAT: "Failed to process chat request",
  GENERIC: "An error occurred",
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_BASE_URL: "http://localhost:3000",
  PRODUCTION_BASE_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  RESPONSE_TIMEOUT: 30000, // 30 seconds
  MAX_ENTITIES_PER_QUERY: 5,
  MAX_CONVERSATION_HISTORY: 10, // Limit conversation history
  GEMINI_TIMEOUT: 25000, // 25 seconds for Gemini calls
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 second
} as const;
