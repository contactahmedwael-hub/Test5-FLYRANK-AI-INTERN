import { useCallback, useEffect, useRef, useState } from "react";

/**
 * use-auto-scroll
 * ----------------
 * Implements the "pin to bottom, release on scroll-up" pattern called out
 * in the assignment's mentor tips. Naive auto-scroll (just always calling
 * scrollIntoView on every new token) fights the user the moment they try
 * to scroll up to re-read something while a response is still streaming.
 *
 * Behavior:
 * - While the user is at (or very near) the bottom, new content
 *   auto-scrolls the view to keep the latest text in view.
 * - The instant the user scrolls up, the pin releases -- further content
 *   updates do NOT yank the view back down.
 * - A "jump to latest" affordance re-engages the pin on demand.
 *
 * A small `BOTTOM_THRESHOLD_PX` tolerance is used instead of an exact
 * equality check because sub-pixel scroll positions and streaming layout
 * shifts make an exact "at bottom" check unreliable.
 */

const BOTTOM_THRESHOLD_PX = 48;

export function useAutoScroll<T>(dependency: T) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(true);

  const isNearBottom = useCallback((el: HTMLDivElement) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD_PX;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setIsPinned(true);
  }, []);

  // Track user-initiated scrolling to decide whether we're still pinned.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setIsPinned(isNearBottom(el));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isNearBottom]);

  // Whenever the dependency changes (new tokens, new messages), only
  // auto-scroll if the user was already pinned to the bottom.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isPinned) return;
    el.scrollTop = el.scrollHeight;
    // Intentionally instant (no "smooth") during streaming -- smooth
    // scrolling re-triggered on every token looks janky and lags behind
    // the actual content.
  }, [dependency, isPinned]);

  return { containerRef, isPinned, scrollToBottom };
}
