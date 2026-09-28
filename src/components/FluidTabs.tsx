import { motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const indicatorSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.75,
};

type FluidTabsProps = {
  labels: readonly string[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  className?: string;
};

export default function FluidTabs({
  labels,
  activeIndex,
  onActiveIndexChange,
  className,
}: FluidTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();

  const moveFocus = (index: number) => {
    const target = (index + labels.length) % labels.length;
    onActiveIndexChange(target);
    tabRefs.current[target]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(labels.length - 1);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Выбор планировки"
      className={cn(
        "relative grid h-[63px] w-full max-w-[324px] grid-cols-4 items-center rounded-[20px] bg-layouts-tab p-2",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-2 left-2 w-[calc((100%-16px)/4)] rounded-xl bg-card"
        animate={{ x: `${activeIndex * 100}%` }}
        transition={reduceMotion ? { duration: 0 } : indicatorSpring}
      />
      {labels.map((label, index) => {
        const selected = activeIndex === index;

        return (
          <Button
            key={label}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="layouts-panel"
            id={`layouts-tab-${index}`}
            tabIndex={selected ? 0 : -1}
            variant="ghost"
            onClick={() => onActiveIndexChange(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative z-10 h-[47px] min-w-0 w-full rounded-xl px-0 py-3 text-sm font-medium text-foreground hover:bg-transparent hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-layouts",
            )}
          >
            <motion.span
              className={cn("relative z-10 whitespace-nowrap", selected && "text-ink")}
              animate={{ scale: selected ? 1 : 0.98 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            >
              {label}
            </motion.span>
          </Button>
        );
      })}
    </div>
  );
}