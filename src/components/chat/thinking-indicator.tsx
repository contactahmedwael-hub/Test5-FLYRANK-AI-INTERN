import { cn } from "@/lib/utils";

/**
 * Shown while a request is in flight but no text has arrived yet.
 * The parent (ChatWindow) is responsible for unmounting this the moment
 * the first text part exists -- see the comment there about why this
 * needs to be a hand-off rather than an abrupt swap.
 */
export function ThinkingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-2xl bg-neutral-100 px-4 py-3",
          "animate-[fade-in_150ms_ease-out]",
        )}
        aria-live="polite"
        aria-label="Assistant is thinking"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
