import { Character } from "./character";
import { Planet } from "./planet";
import { Starship } from "./starship";

// Enhanced SWAPI data interfaces
export interface EnhancedCharacter extends Character {
  homeworld_name?: string;
}

export interface EnhancedPlanet extends Planet {
  resident_names?: string[];
}

export interface EnhancedStarship extends Starship {
  pilot_names?: string[];
}

// SWAPI data interface for chat-enhanced
export interface SWAPIData {
  characters?: EnhancedCharacter[];
  planets?: EnhancedPlanet[];
  starships?: EnhancedStarship[];
  vehicles?: import("./vehicle").Vehicle[];
  films?: import("./film").Film[];
  species?: import("./species").Species[];
}

// Intent detection interface
export interface QueryIntent {
  type:
    | "character"
    | "planet"
    | "starship"
    | "vehicle"
    | "film"
    | "species"
    | "comparison"
    | "relationship"
    | "unknown";
  entities: string[];
  requiresMultipleCalls: boolean;
  relatedData: string[];
  isSWAPIRelevant: boolean;
}
