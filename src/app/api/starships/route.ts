import { SWAPI_ENDPOINTS } from "@/lib/constants";
import { locales } from "@/shared/locales";
import { createSwapiRoute } from "@/lib/api-utils";

export const GET = createSwapiRoute({
  endpoint: SWAPI_ENDPOINTS.STARSHIPS,
  resourceName: "Starships",
  errorMessage: locales.errors.starships,
});
