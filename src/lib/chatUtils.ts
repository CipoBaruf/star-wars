import { CHAT_CONFIG } from "./constants";
import type { Message, QueryIntent } from "@/shared/types";

// Utility function to add timeout to promises
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
};

// Utility function for retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = CHAT_CONFIG.MAX_RETRIES,
  delay: number = CHAT_CONFIG.RETRY_DELAY
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise(resolve =>
          setTimeout(resolve, delay * (attempt + 1))
        );
      }
    }
  }

  throw lastError!;
};

// Extract context from conversation history with limits
export const extractContextFromHistory = (
  conversationHistory: Message[]
): string => {
  if (!conversationHistory || conversationHistory.length === 0) return "";

  // Limit conversation history to prevent context overflow
  const limitedHistory = conversationHistory.slice(
    -CHAT_CONFIG.MAX_CONVERSATION_HISTORY
  );
  const contextText = limitedHistory
    .map((msg: Message) => `${msg.role}: ${msg.content}`)
    .join(" ");

  return contextText;
};

// Extract entities from prompt
export const extractEntities = (
  prompt: string,
  entityList: string[]
): string[] => {
  const lowerPrompt = prompt.toLowerCase();
  return entityList.filter(entity => lowerPrompt.includes(entity));
};

// Intent detection function
export const detectUserIntent = (
  prompt: string,
  conversationHistory: Message[] = []
): QueryIntent => {
  const lowerPrompt = prompt.toLowerCase();

  // Extract context from conversation history
  const contextEntities = extractContextFromHistory(conversationHistory);

  // Combine current prompt with context
  const fullContext = `${contextEntities} ${lowerPrompt}`;

  // Character-related keywords
  const characterKeywords = [
    "character",
    "person",
    "people",
    "human",
    "alien",
    "jedi",
    "sith",
    "pilot",
    "commander",
  ];
  const characterNames = [
    "luke",
    "leia",
    "han",
    "obi-wan",
    "anakin",
    "vader",
    "yoda",
    "chewbacca",
    "r2-d2",
    "c-3po",
  ];

  // Planet-related keywords
  const planetKeywords = [
    "planet",
    "world",
    "homeworld",
    "climate",
    "terrain",
    "population",
  ];
  const planetNames = [
    "tatooine",
    "alderaan",
    "hoth",
    "dagobah",
    "bespin",
    "endor",
    "naboo",
    "coruscant",
  ];

  // Starship-related keywords
  const starshipKeywords = [
    "starship",
    "ship",
    "fighter",
    "destroyer",
    "cruiser",
    "battleship",
    "death star",
  ];
  const starshipNames = [
    "x-wing",
    "tie fighter",
    "millennium falcon",
    "death star",
    "star destroyer",
    "y-wing",
  ];

  // Vehicle-related keywords
  const vehicleKeywords = [
    "vehicle",
    "speeder",
    "walker",
    "at-at",
    "at-st",
    "landspeeder",
  ];
  const vehicleNames = ["at-at", "at-st", "landspeeder", "snowspeeder"];

  // Film-related keywords
  const filmKeywords = [
    "film",
    "movie",
    "episode",
    "story",
    "plot",
    "what happened",
    "events",
  ];
  const filmNames = [
    "a new hope",
    "empire strikes back",
    "return of the jedi",
    "phantom menace",
    "attack of the clones",
    "revenge of the sith",
    "episode i",
    "episode ii",
    "episode iii",
    "episode iv",
    "episode v",
    "episode vi",
  ];

  // Species-related keywords
  const speciesKeywords = [
    "species",
    "race",
    "alien",
    "wookiee",
    "ewok",
    "droid",
    "hutt",
    "jedi",
    "sith",
  ];
  const speciesNames = [
    "human",
    "wookiee",
    "ewok",
    "droid",
    "hutt",
    "jedi",
    "sith",
    "gungan",
    "twi'lek",
  ];

  // Comparison keywords
  const comparisonKeywords = [
    "compare",
    "vs",
    "versus",
    "better",
    "stronger",
    "faster",
    "more powerful",
  ];

  // Relationship keywords
  const relationshipKeywords = [
    "friend",
    "enemy",
    "ally",
    "crew",
    "pilot",
    "commander",
    "work with",
    "related to",
  ];

  // Check for comparison intent first (higher priority)
  if (comparisonKeywords.some(keyword => lowerPrompt.includes(keyword))) {
    return {
      type: "comparison",
      entities: extractEntities(prompt, [
        ...characterNames,
        ...planetNames,
        ...starshipNames,
        ...vehicleNames,
      ]),
      requiresMultipleCalls: true,
      relatedData: ["all"],
      isSWAPIRelevant: true,
    };
  }

  // Check for character intent
  if (
    characterKeywords.some(keyword => fullContext.includes(keyword)) ||
    characterNames.some(name => fullContext.includes(name))
  ) {
    return {
      type: "character",
      entities: extractEntities(fullContext, characterNames),
      requiresMultipleCalls: relationshipKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
      ),
      relatedData: ["films", "homeworld", "starships", "vehicles"],
      isSWAPIRelevant: true,
    };
  }

  // Check for planet intent
  if (
    planetKeywords.some(keyword => lowerPrompt.includes(keyword)) ||
    planetNames.some(name => lowerPrompt.includes(name))
  ) {
    return {
      type: "planet",
      entities: extractEntities(prompt, planetNames),
      requiresMultipleCalls: relationshipKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
      ),
      relatedData: ["residents", "films"],
      isSWAPIRelevant: true,
    };
  }

  // Check for starship intent
  if (
    starshipKeywords.some(keyword => lowerPrompt.includes(keyword)) ||
    starshipNames.some(name => lowerPrompt.includes(name))
  ) {
    return {
      type: "starship",
      entities: extractEntities(prompt, starshipNames),
      requiresMultipleCalls: comparisonKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
      ),
      relatedData: ["pilots", "films"],
      isSWAPIRelevant: true,
    };
  }

  // Check for vehicle intent
  if (
    vehicleKeywords.some(keyword => lowerPrompt.includes(keyword)) ||
    vehicleNames.some(name => lowerPrompt.includes(name))
  ) {
    return {
      type: "vehicle",
      entities: extractEntities(prompt, vehicleNames),
      requiresMultipleCalls: comparisonKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
      ),
      relatedData: ["pilots", "films"],
      isSWAPIRelevant: true,
    };
  }

  // Check for film intent
  if (
    filmKeywords.some(keyword => lowerPrompt.includes(keyword)) ||
    filmNames.some(name => lowerPrompt.includes(name))
  ) {
    return {
      type: "film",
      entities: extractEntities(prompt, filmNames),
      requiresMultipleCalls: relationshipKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
      ),
      relatedData: ["characters", "planets", "starships", "vehicles"],
      isSWAPIRelevant: true,
    };
  }

  // Check for species intent
  if (
    speciesKeywords.some(keyword => lowerPrompt.includes(keyword)) ||
    speciesNames.some(name => lowerPrompt.includes(name))
  ) {
    return {
      type: "species",
      entities: extractEntities(prompt, speciesNames),
      requiresMultipleCalls: relationshipKeywords.some(keyword =>
        lowerPrompt.includes(keyword)
      ),
      relatedData: ["people", "homeworld", "films"],
      isSWAPIRelevant: true,
    };
  }

  // Default to unknown
  return {
    type: "unknown",
    entities: [],
    requiresMultipleCalls: false,
    relatedData: [],
    isSWAPIRelevant: false,
  };
};
