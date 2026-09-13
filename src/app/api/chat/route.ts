import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { MODEL_ID, MODEL_SETTINGS, SYSTEM_PROMPT } from "@/lib/ai-config";

// This route only ever runs on the server (Next.js Route Handlers are
// server code by definition). GOOGLE_GENERATIVE_AI_API_KEY is read from
// the environment by the @ai-sdk/google provider -- it is never sent to,
// or readable by, the browser. Set it in `.env.local` (gitignored) and,
// separately, in your deployment platform's environment variables.

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature: MODEL_SETTINGS.temperature,
    maxOutputTokens: MODEL_SETTINGS.maxOutputTokens,
    // Allows the client's stop button to actually abort the upstream
    // request to Google, not just stop rendering tokens locally.
    abortSignal: req.signal,
  });

  // toUIMessageStreamResponse() is what useChat() on the client expects:
  // it emits typed message parts (text deltas, start/finish events, etc.)
  // as an SSE stream, rather than raw text.
  return result.toUIMessageStreamResponse();
}
