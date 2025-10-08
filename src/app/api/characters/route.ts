import { SWAPI_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { createSwapiRoute } from "@/lib/api-utils";

export const GET = createSwapiRoute({
  endpoint: SWAPI_ENDPOINTS.PEOPLE,
  resourceName: "Characters",
  errorMessage: ERROR_MESSAGES.CHARACTERS,
});
