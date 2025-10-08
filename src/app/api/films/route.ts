import { SWAPI_ENDPOINTS } from "@/lib/constants";
import { locales } from "@/shared/locales";
import { createSwapiRoute } from "@/lib/api-utils";

export const GET = createSwapiRoute({
  endpoint: SWAPI_ENDPOINTS.FILMS,
  resourceName: "Films",
  errorMessage: locales.errors.films,
});
