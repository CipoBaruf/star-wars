import { NextResponse } from "next/server";
import { SWAPI_BASE_URL, CACHE_DURATION } from "./constants";

interface CreateSwapiRouteOptions {
  endpoint: string;
  resourceName: string;
  errorMessage: string;
}

export function createSwapiRoute({
  endpoint,
  resourceName,
  errorMessage,
}: CreateSwapiRouteOptions) {
  return async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      const url = id
        ? `${SWAPI_BASE_URL}${endpoint}${id}/`
        : `${SWAPI_BASE_URL}${endpoint}?${searchParams.toString()}`;

      console.log(`Fetching ${resourceName} from SWAPI:`, url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`SWAPI request failed: ${response.status}`);
      }

      const data = await response.json();

      return NextResponse.json(data, {
        headers: {
          "Cache-Control": CACHE_DURATION,
        },
      });
    } catch (error) {
      console.error(`${resourceName} API Error:`, error);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  };
}
