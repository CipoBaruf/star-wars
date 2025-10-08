// API Configuration
export const SWAPI_BASE_URL = "https://swapi.dev/api";

// Cache Configuration
export const CACHE_DURATION = "public, max-age=3600"; // 1 hour

// UI Configuration
export const UI_CONFIG = {
  HEADER_HEIGHT_MOBILE: 64,
  HEADER_HEIGHT_DESKTOP: 73,
  SCROLL_TITLE_THRESHOLD: 50,
  BACK_TO_TOP_THRESHOLD: 300,
  TITLE_ANIMATION_DURATION: 500,
  CHAT_SCROLL_OFFSET: 100,
} as const;

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

// Route Configuration
export const ROUTES = {
  HOME: "/",
  CHARACTERS: "/characters",
  PLANETS: "/planets",
  SPACESHIPS: "/spaceships",
  VEHICLES: "/vehicles",
  CHAT: "/chat",
} as const;

export const DATA_PAGES = [
  ROUTES.CHARACTERS,
  ROUTES.PLANETS,
  ROUTES.SPACESHIPS,
  ROUTES.VEHICLES,
] as const;
