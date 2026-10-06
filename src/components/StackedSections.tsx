import * as React from "react";

import { cn } from "../lib/utils";

export type StackedSectionsProps = {
  /**
   * One pane per direct child — sticky card > inner content (scale only).
   * Siblings in one deck so every sticky shares the deck scroll range (stacking-cards pattern).
   */
  children?: React.ReactNode;
  /** Scale covered panes while the next card rises into pin. @default true */
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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let element = node?.parentElement ?? null;
  while (element && element !== document.body && element !== document.documentElement) {
    const overflowY = getComputedStyle(element).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

export default function StackedSections({
  children,
  withDramaEffect = true,
  stackOffset = 48,
  paneGap = "gap-2",
  scrollRunway = "0px",
  className,
}: StackedSectionsProps) {
  const deckRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const items = React.Children.toArray(children);
  const total = items.length;
  cardRefs.current.length = total;
  contentRefs.current.length = total;

  const scaleAtDepth = React.useCallback((depth: number) => {
    return Math.max(0.9, 1 - 0.03 * depth);
  }, []);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [stackOffset]);

  // Smooth scroll animations on `.card__content`: entrance gliding and stacking depth
  React.useEffect(() => {
    if (!withDramaEffect || total === 0) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const deck = deckRef.current;
    if (!deck) {
      return;
    }

    const scroller = getScrollParent(deck);
    let frame = 0;

    const isPinned = (cardIndex: number, containerTop: number) => {
      const card = cardRefs.current[cardIndex];
      if (!card) return false;
      const pinnedTop = (cardIndex + 1) * currentStackOffset;
      return card.getBoundingClientRect().top - containerTop <= pinnedTop + 1;
    };

    const update = () => {
      frame = 0;
      const containerTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const viewportHeight = window.innerHeight || 800;

      for (let i = 0; i < total; i++) {
        const card = cardRefs.current[i];
        const content = contentRefs.current[i];
        if (!card || !content) {
          continue;
        }

        const pinnedTop = (i + 1) * currentStackOffset;
        const cardTop = card.getBoundingClientRect().top - containerTop;
        const nextCard = cardRefs.current[i + 1];

        // 1. Entrance phase: Card is rising from below to its pinned position
        const distFromPin = cardTop - pinnedTop;
        if (distFromPin > 0) {
          const entranceRange = Math.min(viewportHeight * 0.65, 450);
          const enterProgress = clamp(1 - distFromPin / entranceRange, 0, 1);
          // Eased progress (ease-out)
          const eased = enterProgress * (2 - enterProgress);
          const enterScale = 0.96 + 0.04 * eased;
          const enterOpacity = 0.5 + 0.5 * eased;
          const enterY = (1 - eased) * 16;

          content.style.transform = `translate3d(0, ${enterY.toFixed(1)}px, 0) scale(${enterScale.toFixed(3)})`;
          content.style.opacity = `${enterOpacity.toFixed(2)}`;
          content.style.filter = "";
          delete content.dataset["stackedCovered"];
          continue;
        }

        // 2. Stacking phase: Check how many subsequent cards have pinned above this one
        let cardsPinnedAbove = 0;
        for (let j = i + 1; j < total; j++) {
          if (isPinned(j, containerTop)) {
            cardsPinnedAbove++;
          }
        }

        if (cardsPinnedAbove > 0) {
          content.dataset["stackedCovered"] = "";
          const targetScale = scaleAtDepth(cardsPinnedAbove);
          const targetOpacity = Math.max(0.78, 1 - 0.07 * cardsPinnedAbove);
          const targetBrightness = Math.max(0.88, 1 - 0.05 * cardsPinnedAbove);

          content.style.transform = `scale(${targetScale.toFixed(3)})`;
          content.style.opacity = `${targetOpacity.toFixed(2)}`;
          content.style.filter = `brightness(${targetBrightness.toFixed(2)})`;
          continue;
        }

        delete content.dataset["stackedCovered"];

        // 3. In-flight stacking: Next card is partially sliding over this one
        if (nextCard) {
          const nextTop = nextCard.getBoundingClientRect().top - containerTop;
          const offset = nextTop - pinnedTop;
          const rowH = card.offsetHeight > 0 ? card.offsetHeight : 1;
          const distance = Math.max(rowH - pinnedTop, 1);
          const progress = clamp(1 - offset / distance, 0, 1);

          if (progress > 0.001) {
            const eased = progress * (2 - progress);
            const targetScale = 1 - 0.03 * eased;
            const targetOpacity = 1 - 0.07 * eased;
            const targetBrightness = 1 - 0.05 * eased;

            content.style.transform = `scale(${targetScale.toFixed(3)})`;
            content.style.opacity = `${targetOpacity.toFixed(2)}`;
            content.style.filter = `brightness(${targetBrightness.toFixed(2)})`;
            continue;
          }
        }

        // 4. Default: Fully active pinned card
        content.style.transform = "scale(1)";
        content.style.opacity = "1";
        content.style.filter = "";
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    const target: Window | HTMLElement = scroller ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const contents = contentRefs.current;

    return () => {
      target.removeEventListener("scroll", onScroll, { passive: true } as EventListenerOptions);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
      for (const content of contents) {
        if (content) {
          delete content.dataset["stackedCovered"];
          content.style.transform = "";
          content.style.opacity = "";
          content.style.filter = "";
        }
      }
    };
  }, [total, currentStackOffset, withDramaEffect, scaleAtDepth]);

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

        return (
          <div
            key={key}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
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
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              data-stacked-content=""
              className="origin-[50%_0%] transition-[transform,opacity,filter] duration-300 ease-out will-change-[transform,opacity]"
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
