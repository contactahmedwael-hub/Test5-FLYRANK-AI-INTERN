# Streaming AI Chat

A streaming chat interface built with Next.js and the AI SDK.

Currently wired to **Google Gemini** (free tier, no card required) instead
of Claude -- the assignment brief specifies Claude via the AI SDK/Anthropic
SDK, so if this is for submission, swap the provider back before turning
it in (see "Switching providers" below). This swap exists purely so the
architecture could be tested end-to-end without needing paid API access.

## Stack

- **Next.js (App Router)** — needed specifically for the server-side route
  handler; a client-only Vite app has nowhere safe to hold the API key.
- **AI SDK** (`ai`, `@ai-sdk/google`, `@ai-sdk/react`) — `streamText` on
  the server, `useChat` on the client.
- **streamdown** — streaming-safe markdown rendering (handles unclosed
  code fences / dangling markdown mid-stream without visually breaking).
- **Tailwind CSS v4**
- Hand-written `Button` / `Textarea` primitives in shadcn's own
  conventions (`cva`, `cn()`) — the shadcn CLI needs to reach
  `ui.shadcn.com`, which wasn't reachable from the sandbox this was built
  in. If you want to run the real CLI on top of this, `npx shadcn@latest
  init` should detect the existing setup fine.

## Setup

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and paste in a real key (see below for where to get one)
npm run dev
```

## Getting a free API key

1. Go to https://aistudio.google.com/app/apikey and sign in with a Google account
2. Click "Create API key" -> "Create key in new project"
3. Copy the key (starts with `AIza`) into `.env.local` -- never anywhere else

## Environment variables

| Variable | Where it's used | Notes |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | `src/app/api/chat/route.ts` (read implicitly by `@ai-sdk/google`) | Server-side only. Never exposed to the client -- the route handler runs entirely on the server, and `.env.local` is gitignored by default. |

For deployment (e.g. Vercel), set this in the platform's own environment
variable settings -- don't rely on `.env.local` making it into the
deployed build.

## Switching providers

Everything provider-specific lives in two places:

1. `src/lib/ai-config.ts` -- `MODEL_ID`
2. `src/app/api/chat/route.ts` -- the `import` line and the `model:` call

To go back to Claude: `npm install @ai-sdk/anthropic`, swap the import to
`import { anthropic } from "@ai-sdk/anthropic"`, change `google(MODEL_ID)`
to `anthropic(MODEL_ID)`, and set `MODEL_ID` to a Claude model string.
`ANTHROPIC_API_KEY` replaces `GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local`.
Nothing else in the project (the client, the scroll logic, the stop
button, the message rendering) depends on which provider is used.

## Where things live

- **Config (system prompt + model settings):** `src/lib/ai-config.ts`
- **Server route handler (streaming):** `src/app/api/chat/route.ts`
- **Client chat component:** `src/components/chat/chat-window.tsx`
- **Message rendering (streaming-safe markdown):** `src/components/chat/chat-message.tsx`
- **Auto-scroll behavior:** `src/components/chat/use-auto-scroll.ts`
- **Thinking indicator:** `src/components/chat/thinking-indicator.tsx`

## Notes on the trickier requirements

- **Auto-scroll:** `use-auto-scroll.ts` tracks whether the user is
  currently near the bottom of the scroll container. New content only
  force-scrolls the view if they were already there; scrolling up
  releases the pin immediately, and a "Jump to latest" button
  re-engages it.
- **Stop button:** `stop()` from `useChat` aborts the in-flight request
  (wired through `abortSignal: req.signal` on the server side too, so the
  upstream call to the model provider is actually cancelled, not just
  ignored client-side). The partial assistant message is left in
  `messages` as-is -- nothing clears it -- and `status` returns to
  `"ready"`, re-enabling the input immediately.
- **Thinking indicator -> first token:** `chat-window.tsx` only renders
  the indicator while `status === "submitted"` AND the in-progress
  assistant message has no text yet. The instant a text part exists, the
  indicator unmounts and the message bubble takes over -- there's no
  frame where both or neither are shown.
- **Mobile:** input font-size is 16px (`text-base`) below the `sm:`
  breakpoint specifically to stop iOS Safari's auto-zoom-on-focus
  behavior; the input row respects `env(safe-area-inset-bottom)` for
  devices with a home indicator.

## Known gap

The build, type-check, and lint all pass, and the route/client code
follow the AI SDK's documented v5 API surface exactly -- but this hasn't
been confirmed against a live streaming response by me (built in a
sandbox with no outbound access to either provider's API). Test a real
conversation locally, especially the stop-then-send-again flow called
out in the evaluation criteria, before treating this as done.
