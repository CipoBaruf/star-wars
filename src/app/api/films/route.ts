import {
  SWAPI_BASE_URL,
  SWAPI_ENDPOINTS,
  CACHE_DURATION,
  ERROR_MESSAGES,
} from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const id = searchParams.get("id");

    let url = `${SWAPI_BASE_URL}${SWAPI_ENDPOINTS.FILMS}`;

    if (id) {
      url = `${SWAPI_BASE_URL}${SWAPI_ENDPOINTS.FILMS}${id}/`;
    } else {
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (search) params.append("search", search);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    console.log("Fetching from SWAPI:", url);
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
    console.error("Films API Error:", error);
    return new Response(JSON.stringify({ error: ERROR_MESSAGES.FILMS }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
