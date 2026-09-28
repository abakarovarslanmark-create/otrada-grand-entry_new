import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Context
interface ExpandableScreenContextValue {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  layoutId: string;
  triggerRadius: string;
  contentRadius: string;
  animationDuration: number;
}

const ExpandableScreenContext = createContext<ExpandableScreenContextValue | null>(null);

function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error("useExpandableScreen must be used within an ExpandableScreen");
  }
  return context;
}

// Root Component
interface ExpandableScreenProps {
  children: ReactNode;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  layoutId?: string;
  triggerRadius?: string;
  contentRadius?: string;
  animationDuration?: number;
  lockScroll?: boolean;
}

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  layoutId = "expandable-card",
  triggerRadius = "100px",
  contentRadius = "24px",
  animationDuration = 0.3,
  lockScroll = true,
}: ExpandableScreenProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const expand = () => {
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const collapse = () => {
    setIsExpanded(false);
    onExpandChange?.(false);
  };

  useEffect(() => {
    if (lockScroll) {
      if (isExpanded) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
  }, [isExpanded, lockScroll]);

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded,
        expand,
        collapse,
        layoutId,
        triggerRadius,
        contentRadius,
        animationDuration,
      }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  );
}

// Trigger Component
interface ExpandableScreenTriggerProps {
  children: ReactNode;
  className?: string;
}

export function ExpandableScreenTrigger({
  children,
  className = "",
}: ExpandableScreenTriggerProps) {
  const { expand } = useExpandableScreen();

  return (
    <div className={`relative inline-block ${className}`}>
      <div onClick={expand} className="relative cursor-pointer">
        {children}
      </div>
    </div>
  );
}

// Content Component
interface ExpandableScreenContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
}

export function ExpandableScreenContent({
  children,
  className = "",
  showCloseButton = true,
  closeButtonClassName = "",
}: ExpandableScreenContentProps) {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } =
    useExpandableScreen();

  const exitMs = animationDuration * 1000 + 60;
  const [mounted, setMounted] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [isExpanded, exitMs]);

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, collapse]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Dimmed backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={collapse}
        className="absolute inset-0 bg-ink/45"
        aria-hidden="true"
      />
      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          scale: isExpanded ? 1 : 0.95,
          y: isExpanded ? 0 : 16,
        }}
        transition={{ duration: animationDuration, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: contentRadius,
        }}
        className={`relative flex transform-gpu overflow-y-auto will-change-transform shadow-2xl ${className}`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ delay: isExpanded ? 0.15 : 0, duration: 0.4 }}
          className="relative z-20 w-full"
        >
          {children}
        </motion.div>

        {showCloseButton && (
          <motion.button
            onClick={collapse}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ delay: isExpanded ? 0.15 : 0, duration: 0.2 }}
            className={`absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              closeButtonClassName ||
              "text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            }`}
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}

export { useExpandableScreen };
