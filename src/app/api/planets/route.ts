import { SWAPI_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { createSwapiRoute } from "@/lib/api-utils";

export const GET = createSwapiRoute({
  endpoint: SWAPI_ENDPOINTS.PLANETS,
  resourceName: "Planets",
  errorMessage: ERROR_MESSAGES.PLANETS,
});
