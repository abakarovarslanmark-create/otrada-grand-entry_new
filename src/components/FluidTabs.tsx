import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

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
  const [touchedTab, setTouchedTab] = useState<number | null>(null);
  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);
  const timeoutRef = useRef<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const selectTab = (index: number) => {
    setPrevActiveIndex(activeIndex);
    onActiveIndexChange(index);
    setTouchedTab(index);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setTouchedTab(null);
    }, 300);
  };

  const moveFocus = (index: number) => {
    const target = (index + labels.length) % labels.length;
    selectTab(target);
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

  const getTabDirection = (index: number) => {
    if (index === activeIndex && prevActiveIndex !== activeIndex) {
      return index > prevActiveIndex ? 1 : -1;
    }
    return 0;
  };

  return (
    <div
      role="tablist"
      aria-label="Выбор планировки"
      className={cn(
        "relative grid h-[63px] w-full max-w-full sm:w-[324px] sm:shrink-0 grid-cols-4 items-center rounded-[20px] bg-layouts-tab p-2",
        className,
      )}
    >
      {labels.map((label, index) => {
        const selected = activeIndex === index;
        const direction = getTabDirection(index);

        return (
          <button
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
            onClick={() => selectTab(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative z-10 h-[47px] min-w-0 w-full rounded-xl px-0 py-3 text-sm font-medium text-foreground hover:bg-transparent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-layouts inline-flex items-center justify-center cursor-pointer transition-colors",
              touchedTab === index && "blur-[0.5px]",
            )}
          >
            {selected ? (
              <motion.span
                layoutId="fluid-tabs-active-pill"
                className="pointer-events-none absolute inset-0 rounded-xl bg-card"
                transition={{
                  type: "spring",
                  stiffness: 360,
                  damping: 28,
                }}
              />
            ) : null}
            <motion.span
              initial={false}
              animate={{
                scale: selected ? 1 : 0.96,
                x: selected && direction !== 0 ? [direction * 4, 0] : 0,
              }}
              transition={{ duration: 0.25 }}
              className={cn(
                "relative z-10 whitespace-nowrap transition-colors duration-200",
                selected && "text-ink font-medium",
              )}
            >
              {label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
