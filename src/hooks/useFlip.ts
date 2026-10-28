import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * FLIP layout engine — gives the event grid the familiar Isotope-style
 * re-ordering feel. Call `capture()` immediately before a state change that
 * reshuffles the list; after React commits, surviving items glide from their
 * old position to the new one and entrants fade up.
 */
export function useFlip<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T | null>(null);
  const first = useRef<Map<string, DOMRect>>(new Map());

  const capture = useCallback(() => {
    const map = new Map<string, DOMRect>();
    ref.current?.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const id = el.dataset.flip;
      if (id) map.set(id, el.getBoundingClientRect());
    });
    first.current = map;
  }, []);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const firstMap = first.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    node.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const id = el.dataset.flip as string;
      const prev = firstMap.get(id);
      const next = el.getBoundingClientRect();

      if (prev && !reduce) {
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        const dScale = prev.width / next.width;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || Math.abs(dScale - 1) > 0.01) {
          el.animate(
            [
              { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${dScale})` },
              { transform: "translate3d(0, 0, 0) scale(1)" },
            ],
            { duration: 560, easing: "cubic-bezier(0.22, 0.9, 0.24, 1)" },
          );
        }
      } else if (!prev && !reduce && firstMap.size) {
        el.animate(
          [
            { opacity: 0, transform: "translate3d(0, 22px, 0) scale(0.95)" },
            { opacity: 1, transform: "none" },
          ],
          // No fill-mode: a forwards fill would permanently override the
          // card's CSS hover-lift transform after the shuffle settles.
          { duration: 460, easing: "cubic-bezier(0.22, 0.9, 0.24, 1)" },
        );
      }
    });

    first.current = new Map();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, capture };
}
