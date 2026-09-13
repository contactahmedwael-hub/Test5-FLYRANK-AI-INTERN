# Streaming AI Chat

A streaming chat interface built with Next.js and the AI SDK — token-by-token
responses, a stoppable generation, scroll-aware auto-scroll, and a
mobile-friendly input.

Built as a frontend internship capstone project.

## Features

- Real-time token-by-token streaming responses
- Stop button that cancels generation mid-stream without breaking state
- Auto-scroll that pins to the bottom while you're reading live, and
  releases the moment you scroll up manually
- Distinct user/assistant message bubbles with safe markdown rendering
  (code blocks, lists, bold text — even mid-stream)
- Mobile-friendly input (no auto-zoom on iOS, respects safe-area insets)
- API key stays server-side only, never exposed to the browser

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [AI SDK](https://ai-sdk.dev) (`streamText` + `useChat`)
- [Tailwind CSS](https://tailwindcss.com)
- [Streamdown](https://github.com/vercel/streamdown) for streaming-safe markdown

## Getting started

```bash
npm install
cp .env.local.example .env.local
# add your API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes — get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

## Project structure

- `src/lib/ai-config.ts` — system prompt and model settings
- `src/app/api/chat/route.ts` — server route that streams responses
- `src/components/chat/` — chat UI (message list, input, auto-scroll, stop button)