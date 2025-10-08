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
      const page = searchParams.get("page") || "1";
      const search = searchParams.get("search") || "";
      const id = searchParams.get("id");

      let url = `${SWAPI_BASE_URL}${endpoint}`;

      if (id) {
        url = `${SWAPI_BASE_URL}${endpoint}${id}/`;
      } else {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (search) params.append("search", search);
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      console.log(`Fetching ${resourceName} from SWAPI:`, url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`SWAPI request failed: ${response.status}`);
      }

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": CACHE_DURATION,
        },
      });
    } catch (error) {
      console.error(`${resourceName} API Error:`, error);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
