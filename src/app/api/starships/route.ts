import { SWAPI_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { createSwapiRoute } from "@/lib/api-utils";

export const GET = createSwapiRoute({
  endpoint: SWAPI_ENDPOINTS.STARSHIPS,
  resourceName: "Starships",
  errorMessage: ERROR_MESSAGES.STARSHIPS,
});
