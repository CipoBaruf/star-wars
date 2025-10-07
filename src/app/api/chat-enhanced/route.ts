import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_CONFIG, CHAT_CONFIG } from "@/lib/constants";
import {
  Character,
  Planet,
  Starship,
  Message,
  EnhancedCharacter,
  EnhancedPlanet,
  EnhancedStarship,
  SWAPIData,
  QueryIntent,
} from "@/shared/types";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Utility function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
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
const withRetry = async <T>(
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
const extractContextFromHistory = (conversationHistory: Message[]): string => {
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

// Intent detection function
const detectUserIntent = (
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

  // Check for comparison intent
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

  // Default to unknown
  return {
    type: "unknown",
    entities: [],
    requiresMultipleCalls: false,
    relatedData: [],
    isSWAPIRelevant: false,
  };
};

// Extract entities from prompt
const extractEntities = (prompt: string, entityList: string[]): string[] => {
  const lowerPrompt = prompt.toLowerCase();
  return entityList.filter(entity => lowerPrompt.includes(entity));
};

// SWAPI data fetcher using internal API routes with improved error handling
const fetchSWAPIData = async (intent: QueryIntent): Promise<SWAPIData> => {
  const data: SWAPIData = {};

  try {
    // Limit entities to prevent excessive API calls
    const limitedEntities = intent.entities.slice(
      0,
      CHAT_CONFIG.MAX_ENTITIES_PER_QUERY
    );
    // Fetch characters if needed
    if (intent.type === "character" || intent.relatedData.includes("all")) {
      const characterPromises = limitedEntities.map(async entity => {
        try {
          const url = `${API_CONFIG.PRODUCTION_BASE_URL}/api/characters?search=${entity}`;
          const response = await withTimeout(fetch(url), API_CONFIG.TIMEOUT);

          if (!response.ok) {
            console.warn(
              `Failed to fetch character data for ${entity}: ${response.status}`
            );
            return [];
          }

          const result = await response.json();
          const characters = result.results || [];

          // Fetch related data for each character
          const enrichedCharacters = await Promise.all(
            characters.map(async (character: Character) => {
              const enriched: EnhancedCharacter = { ...character };

              // Fetch homeworld name
              if (
                character.homeworld &&
                character.homeworld.includes("/api/planets/")
              ) {
                try {
                  const homeworldResponse = await fetch(character.homeworld);
                  const homeworldData = await homeworldResponse.json();
                  enriched.homeworld_name = homeworldData.name;
                } catch {
                  enriched.homeworld_name = "Unknown";
                }
              }

              return enriched;
            })
          );

          return enrichedCharacters;
        } catch (error) {
          console.error(`Error fetching character data for ${entity}:`, error);
          return [];
        }
      });
      data.characters = (await Promise.all(characterPromises)).flat();
    }

    // Fetch planets if needed
    if (intent.type === "planet" || intent.relatedData.includes("all")) {
      const planetPromises = intent.entities.map(async entity => {
        const url = `${API_CONFIG.PRODUCTION_BASE_URL}/api/planets?search=${entity}`;
        const response = await fetch(url);
        const result = await response.json();
        const planets = result.results || [];

        // Enrich planets with resident names
        const enrichedPlanets = await Promise.all(
          planets.map(async (planet: Planet) => {
            const enriched: EnhancedPlanet = { ...planet };

            // Fetch resident names
            if (planet.residents && planet.residents.length > 0) {
              try {
                const residentPromises = planet.residents
                  .slice(0, 5)
                  .map(async (residentUrl: string) => {
                    const residentResponse = await fetch(residentUrl);
                    const residentData = await residentResponse.json();
                    return residentData.name;
                  });
                enriched.resident_names = await Promise.all(residentPromises);
              } catch {
                enriched.resident_names = [];
              }
            }

            return enriched;
          })
        );

        return enrichedPlanets;
      });
      data.planets = (await Promise.all(planetPromises)).flat();
    }

    // Fetch starships if needed
    if (intent.type === "starship" || intent.relatedData.includes("all")) {
      const starshipPromises = intent.entities.map(async entity => {
        const response = await fetch(
          `${API_CONFIG.PRODUCTION_BASE_URL}/api/starships?search=${entity}`
        );
        const result = await response.json();
        const starships = result.results || [];

        // Enrich starships with pilot names
        const enrichedStarships = await Promise.all(
          starships.map(async (starship: Starship) => {
            const enriched: EnhancedStarship = { ...starship };

            // Fetch pilot names
            if (starship.pilots && starship.pilots.length > 0) {
              try {
                const pilotPromises = starship.pilots
                  .slice(0, 5)
                  .map(async (pilotUrl: string) => {
                    const pilotResponse = await fetch(pilotUrl);
                    const pilotData = await pilotResponse.json();
                    return pilotData.name;
                  });
                enriched.pilot_names = await Promise.all(pilotPromises);
              } catch {
                enriched.pilot_names = [];
              }
            }

            return enriched;
          })
        );

        return enrichedStarships;
      });
      data.starships = (await Promise.all(starshipPromises)).flat();
    }

    // Fetch vehicles if needed
    if (intent.type === "vehicle" || intent.relatedData.includes("all")) {
      const vehiclePromises = intent.entities.map(async entity => {
        const response = await fetch(
          `${API_CONFIG.PRODUCTION_BASE_URL}/api/vehicles?search=${entity}`
        );
        const result = await response.json();
        return result.results || [];
      });
      data.vehicles = (await Promise.all(vehiclePromises)).flat();
    }

    // Fetch films if needed
    if (intent.type === "film" || intent.relatedData.includes("all")) {
      const filmPromises = intent.entities.map(async entity => {
        const response = await fetch(
          `${API_CONFIG.PRODUCTION_BASE_URL}/api/films?search=${entity}`
        );
        const result = await response.json();
        return result.results || [];
      });
      data.films = (await Promise.all(filmPromises)).flat();
    }

    // Fetch species if needed
    if (intent.type === "species" || intent.relatedData.includes("all")) {
      const speciesPromises = intent.entities.map(async entity => {
        const response = await fetch(
          `${API_CONFIG.PRODUCTION_BASE_URL}/api/species?search=${entity}`
        );
        const result = await response.json();
        return result.results || [];
      });
      data.species = (await Promise.all(speciesPromises)).flat();
    }
  } catch (error) {
    console.error("Error fetching SWAPI data:", error);
  }

  return data;
};

// Generate enhanced response
const generateEnhancedResponse = async (
  prompt: string,
  swapiData: SWAPIData,
  intent: QueryIntent,
  conversationHistory: Message[] = []
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Build context from SWAPI data
  let contextData = "";

  if (swapiData.characters && swapiData.characters.length > 0) {
    contextData += `\n\nCHARACTERS DATA:\n${JSON.stringify(swapiData.characters, null, 2)}`;
  }

  if (swapiData.planets && swapiData.planets.length > 0) {
    contextData += `\n\nPLANETS DATA:\n${JSON.stringify(swapiData.planets, null, 2)}`;
  }

  if (swapiData.starships && swapiData.starships.length > 0) {
    contextData += `\n\nSTARSHIPS DATA:\n${JSON.stringify(swapiData.starships, null, 2)}`;
  }

  if (swapiData.vehicles && swapiData.vehicles.length > 0) {
    contextData += `\n\nVEHICLES DATA:\n${JSON.stringify(swapiData.vehicles, null, 2)}`;
  }

  if (swapiData.films && swapiData.films.length > 0) {
    contextData += `\n\nFILMS DATA:\n${JSON.stringify(swapiData.films, null, 2)}`;
  }

  if (swapiData.species && swapiData.species.length > 0) {
    contextData += `\n\nSPECIES DATA:\n${JSON.stringify(swapiData.species, null, 2)}`;
  }

  // Build conversation context
  const conversationContext =
    conversationHistory.length > 0
      ? `\n\nCONVERSATION HISTORY:\n${conversationHistory.map((msg: Message) => `${msg.role}: ${msg.content}`).join("\n")}`
      : "";

  // Create enhanced prompt
  const enhancedPrompt = `You are a Star Wars expert AI assistant with access to real Star Wars data from the SWAPI (Star Wars API).

USER QUESTION: ${prompt}${conversationContext}

RELEVANT STAR WARS DATA:${contextData}

INSTRUCTIONS:
1. Use the provided Star Wars data to give accurate, detailed responses
2. Always use human-readable names instead of API URLs (e.g., "Tatooine" instead of "https://swapi.dev/api/planets/1/")
3. If you see homeworld_name in character data, use that instead of the URL
4. IMPORTANT: Use the conversation history to understand context. If the user refers to "he", "she", "him", "her", "it", or "they" without specifying a name, use the conversation history to determine who they're referring to
5. Provide specific details like planet names, character relationships, and contextual information
6. If the user asks about something not covered by the data, explain what you can tell them based on the available information
7. If the question is not related to Star Wars characters, planets, starships, or vehicles, politely explain that you can only help with Star Wars universe topics
8. Be enthusiastic and knowledgeable about Star Wars
9. Write in a conversational, engaging tone that feels like talking to a Star Wars expert
10. Use specific details from the data to make your response rich and informative
11. Maintain conversation context - remember what was discussed previously

Please provide a comprehensive, human-readable response based on the Star Wars data provided.`;

  try {
    const result = await withRetry(() =>
      withTimeout(
        model.generateContent(enhancedPrompt),
        CHAT_CONFIG.GEMINI_TIMEOUT
      )
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timed out")) {
        return "I'm sorry, the request timed out. Please try again with a shorter question.";
      }
      if (error.message.includes("quota") || error.message.includes("limit")) {
        return "I'm experiencing high demand right now. Please try again in a moment.";
      }
    }

    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};

export async function POST(req: Request) {
  try {
    const { prompt, conversationHistory = [] } = await req.json();

    // Input validation
    if (!prompt || typeof prompt !== "string") {
      return new Response("No prompt provided", { status: 400 });
    }

    if (prompt.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      return new Response(
        `Message too long. Maximum ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters allowed.`,
        { status: 400 }
      );
    }

    if (!Array.isArray(conversationHistory)) {
      return new Response("Invalid conversation history format", {
        status: 400,
      });
    }

    // Step 1: Detect user intent (with conversation context)
    const intent = detectUserIntent(prompt, conversationHistory);

    // Step 2: Fetch relevant SWAPI data
    let swapiData: SWAPIData = {};
    if (intent.isSWAPIRelevant) {
      swapiData = await fetchSWAPIData(intent);
    }

    // Step 3: Generate enhanced response with conversation context
    const response = await generateEnhancedResponse(
      prompt,
      swapiData,
      intent,
      conversationHistory
    );

    return new Response(response, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Enhanced Chat API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(`Error processing request: ${errorMessage}`, {
      status: 500,
    });
  }
}
