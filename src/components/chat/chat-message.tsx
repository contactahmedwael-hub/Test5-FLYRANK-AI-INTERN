import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  return (
    <div className={cn("flex w-full min-w-0", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "min-w-0 max-w-[85%] overflow-x-hidden rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words sm:max-w-[75%]",
          isUser
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-900",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{text}</p>
        ) : (
          <div className="prose prose-sm prose-neutral max-w-none break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full">
            <Streamdown>{text}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
}