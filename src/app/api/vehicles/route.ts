import { SWAPI_ENDPOINTS, ERROR_MESSAGES } from "@/lib/constants";
import { createSwapiRoute } from "@/lib/api-utils";

export const GET = createSwapiRoute({
  endpoint: SWAPI_ENDPOINTS.VEHICLES,
  resourceName: "Vehicles",
  errorMessage: ERROR_MESSAGES.VEHICLES,
});
