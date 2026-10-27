import * as React from "react";

import { cn } from "../lib/utils";

export type StackedSectionsProps = {
  /**
   * One pane per direct child — sticky card > inner content.
   * Siblings in one deck so every sticky shares the deck scroll range (stacking-cards pattern).
   */
  children?: React.ReactNode;
  /** Scale/dim covered cards as the next pane scrolls over them. @default true */
  withDramaEffect?: boolean;
  /**
   * Stagger between stacked panes (`padding-top` on each sticky card, 1-based index).
   * Match peek strip height. @default 48
   */
  stackOffset?: number;
  /** Tailwind gap classes between cards (block `gap-*`). Pass `false` to disable. @default `gap-2` */
  paneGap?: false | string;
  /**
   * In-flow spacer height after the last card so the final pane stays pinned through the outro scroll.
   * @default `0px`
   */
  scrollRunway?: string;
  className?: string;
};

export default function StackedSections({
  children,
  withDramaEffect = true,
  stackOffset = 48,
  paneGap = "gap-2",
  scrollRunway = "0px",
  className,
}: StackedSectionsProps) {
  const deckRef = React.useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const total = items.length;

  const [currentStackOffset, setCurrentStackOffset] = React.useState(stackOffset);

  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setCurrentStackOffset(Math.min(stackOffset, 12));
      } else {
        setCurrentStackOffset(stackOffset);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [stackOffset]);

  React.useEffect(() => {
    const deck = deckRef.current;
    if (!deck || !withDramaEffect || total < 2) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;

    const updateCards = () => {
      rafId = 0;
      const cards = deck.querySelectorAll<HTMLElement>("[data-stacked-card]");
      const contents = deck.querySelectorAll<HTMLElement>("[data-stacked-content]");
      const vh = window.innerHeight || 1;

      for (let i = 0; i < cards.length - 1; i++) {
        const nextCard = cards[i + 1];
        const content = contents[i];
        if (!nextCard || !content) continue;

        const nextRect = nextCard.getBoundingClientRect();
        const targetTop = (i + 2) * currentStackOffset;
        const rawProgress = 1 - (nextRect.top - targetTop) / (vh - targetTop);
        const progress = Math.max(0, Math.min(1, rawProgress));

        if (progress > 0.005) {
          const scale = 1 - progress * 0.06;
          const brightness = 1 - progress * 0.22;
          content.style.transform = `scale(${scale.toFixed(4)})`;
          content.style.filter = `brightness(${brightness.toFixed(3)})`;
        } else {
          content.style.transform = "";
          content.style.filter = "";
        }
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateCards);
      }
    };

    updateCards();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [withDramaEffect, total, currentStackOffset]);

  if (total === 0) {
    return null;
  }

  const gapClass = paneGap === false ? undefined : paneGap;

  return (
    <div
      ref={deckRef}
      data-stacked-deck=""
      className={cn("flex w-full flex-col", gapClass, className)}
      style={
        {
          "--numcards": total,
          "--stacked-top-offset": `${currentStackOffset}px`,
          paddingBottom: `calc(${total} * ${currentStackOffset}px)`,
        } as React.CSSProperties
      }
    >
      {items.map((child, index) => {
        const key = React.isValidElement(child) && child.key != null ? child.key : `pane-${index}`;
        const cardIndex = index + 1;
        const isCovered = withDramaEffect && index < total - 1;

        return (
          <div
            key={key}
            data-stacked-card=""
            className="sticky top-0 w-full"
            style={
              {
                "--index": cardIndex,
                zIndex: cardIndex,
                paddingTop: `calc(${cardIndex} * var(--stacked-top-offset))`,
              } as React.CSSProperties
            }
          >
            <div
              data-stacked-content=""
              {...(isCovered ? { "data-stacked-covered": "" } : {})}
              className="origin-[50%_0%] will-change-transform"
            >
              {child}
            </div>
          </div>
        );
      })}
      {scrollRunway !== "0px" ? (
        <div
          aria-hidden
          className="w-full shrink-0"
          style={{ height: scrollRunway }}
          data-stacked-runway=""
        />
      ) : null}
    </div>
  );
}
