/**
 * ai-config.ts
 * ------------
 * Single source of truth for everything that shapes the assistant's
 * behavior: which model it runs on, how it's tuned, and what it's told
 * to do. Keeping this in one file means changing the assistant's
 * personality or swapping models never requires touching the route
 * handler or any component.
 *
 * This file is server-only-safe: it contains no secrets itself (the API
 * key is read from the environment inside the Google provider, not
 * here), but it's imported exclusively from `app/api/chat/route.ts`,
 * which runs on the server. Never import this into a client component.
 */

/**
 * The model string passed to the Google (Gemini) provider. Centralized
 * here so upgrading models is a one-line change instead of a grep across
 * the codebase.
 *
 * Currently on Gemini 3.6 Flash, which has a documented free tier --
 * Google has this scheduled for shutdown around 16 Oct 2026, so this is
 * the one line to update when that happens (e.g. to a Gemini 3 model).
 */
export const MODEL_ID = "gemini-3.6-flash";
/**
 * System prompt: defines the assistant's role, tone, and constraints for
 * every conversation. This is sent once per request as the `system`
 * field -- it is NOT part of the visible message list, so it never shows
 * up in the chat UI.
 */
export const SYSTEM_PROMPT = `You are the AI assistant embedded in this portfolio project.

- Be direct and concise. Prefer short paragraphs over long ones.
- If you're not sure about something, say so plainly instead of guessing.
- Use markdown when it genuinely helps (code blocks, short lists), but
  don't over-format simple answers.
- You have no memory of previous conversations outside the current chat
  session -- don't imply otherwise.`;

/**
 * Generation parameters. Adjust these to change how the model responds
 * without touching prompt text or route logic.
 *
 * - temperature: lower = more deterministic/focused, higher = more varied.
 * - maxOutputTokens: hard ceiling on response length, mainly a cost/latency
 *   guard rail rather than a UX lever.
 */
export const MODEL_SETTINGS = {
  temperature: 0.7,
  maxOutputTokens: 2048,
  thinkingBudget: 0,
} as const;
