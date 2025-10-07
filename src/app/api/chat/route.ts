import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("GOOGLE_API_KEY is not set");
  throw new Error("GOOGLE_API_KEY is not set");
}

let genAI: GoogleGenerativeAI;
try {
  genAI = new GoogleGenerativeAI(apiKey);
} catch (error) {
  console.error("Failed to initialize Google AI client:", error);
  throw new Error("Failed to initialize Google AI client");
}

export async function POST(req: Request) {
  try {
    console.log("Chat API called");

    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);

    if (!prompt) {
      return new Response("No prompt provided", { status: 400 });
    }

    console.log("Creating Gemini model with gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    console.log("Sending message to Gemini...");
    const result = await model.generateContent(
      `You are a Star Wars expert AI assistant. Answer questions about Star Wars characters, planets, spaceships, and lore with enthusiasm and accuracy. Always respond in character as a knowledgeable Star Wars expert.

User question: ${prompt}`
    );

    console.log("Got response from Gemini");
    const response = await result.response;
    const text = response.text();

    console.log("Returning response:", text);
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(`Error processing request: ${errorMessage}`, {
      status: 500,
    });
  }
}
