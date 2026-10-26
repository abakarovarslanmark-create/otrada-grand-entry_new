import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

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
  contentRadius = "12px",
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
  const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen();

  if (isValidElement(children)) {
    const childElement = children as ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      className?: string;
    }>;
    return (
      <AnimatePresence initial={false}>
        {!isExpanded && (
          <motion.div
            layoutId={layoutId}
            style={{ borderRadius: triggerRadius }}
            className={cn("inline-block relative", className)}
          >
            {cloneElement(childElement, {
              onClick: (e: React.MouseEvent) => {
                childElement.props.onClick?.(e);
                expand();
              },
              className: cn("cursor-pointer", childElement.props.className),
            })}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {!isExpanded && (
        <motion.div
          layoutId={layoutId}
          style={{ borderRadius: triggerRadius }}
          onClick={expand}
          className={cn("inline-block cursor-pointer relative", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, collapse]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Dimmed backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration }}
            onClick={collapse}
            className="absolute inset-0 bg-ink/45 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />
          {/* Morphing Modal Dialog */}
          <motion.div
            layoutId={layoutId}
            transition={{ duration: animationDuration }}
            style={{
              borderRadius: contentRadius,
            }}
            layout
            className={cn("relative z-10 flex transform-gpu will-change-transform", className)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: animationDuration * 0.4, duration: 0.2 }}
              className="relative z-20 flex w-full flex-col items-center justify-center"
            >
              {children}
            </motion.div>

            {showCloseButton && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: animationDuration * 0.5, duration: 0.15 }}
                onClick={collapse}
                className={cn(
                  "absolute top-3.5 right-3.5 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors",
                  closeButtonClassName ||
                    "text-primary-foreground hover:bg-primary-foreground/10 bg-transparent",
                )}
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export { useExpandableScreen };
