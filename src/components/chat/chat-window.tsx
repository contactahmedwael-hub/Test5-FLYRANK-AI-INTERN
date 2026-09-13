"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ArrowUp, Square, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat/chat-message";
import { ThinkingIndicator } from "@/components/chat/thinking-indicator";
import { useAutoScroll } from "@/components/chat/use-auto-scroll";

export function ChatWindow() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // "submitted": request sent, no tokens back yet -> thinking indicator.
  // "streaming": tokens are actively arriving.
  // Both count as "busy" for disabling the input / showing the stop button.
  const isBusy = status === "submitted" || status === "streaming";

  // The thinking indicator should only show up to the moment the first
  // text part of the in-progress assistant message exists. Once any text
  // has streamed in, the message bubble itself takes over rendering --
  // this is the "hand-off, not a swap" the assignment calls for: we
  // never show both, and we never have a frame with neither.
  const lastMessage = messages[messages.length - 1];
  const lastMessageHasText =
    lastMessage?.role === "assistant" &&
    lastMessage.parts.some((part) => part.type === "text" && part.text.length > 0);
  const showThinkingIndicator = status === "submitted" && !lastMessageHasText;

  const { containerRef, isPinned, scrollToBottom } = useAutoScroll(messages);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter inserts a newline -- standard chat-input
    // convention, and necessary on mobile where there's no separate
    // "send" key.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="border-b border-neutral-200 px-4 py-3">
        <h1 className="text-sm font-semibold text-neutral-900">Assistant</h1>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="h-full space-y-3 overflow-x-hidden overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 && (
            <p className="pt-8 text-center text-sm text-neutral-400">
              Send a message to start the conversation.
            </p>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {showThinkingIndicator && <ThinkingIndicator />}
        </div>

        {/* "Jump to latest" only appears once the user has actually
            scrolled away from the bottom -- see mentor tip about not
            fighting a user who scrolled up mid-stream. */}
        {!isPinned && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-md transition-colors hover:bg-neutral-50"
          >
            <ArrowDown className="h-3.5 w-3.5" />
            Jump to latest
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-neutral-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message the assistant..."
          rows={1}
          className="max-h-40 min-h-[2.5rem] flex-1 text-base sm:text-sm"
          // text-base (16px) on mobile prevents iOS Safari from
          // auto-zooming the page when the input gains focus.
        />

        {isBusy ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => stop()}
            aria-label="Stop generating"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}