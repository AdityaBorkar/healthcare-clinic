import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

export function SidebarHoverItem({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hideHover = useCallback(() => setIsHovered(false), []);
  const showHover = useCallback(() => setIsHovered(true), []);

  return (
    <motion.div
      className="relative"
      onBlur={hideHover}
      onFocus={showHover}
      onPointerEnter={showHover}
      onPointerLeave={hideHover}
    >
      {isHovered ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-md bg-muted shadow-[var(--shadow-subtle)]"
          initial={false}
          layoutId="sidebar-hover"
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  damping: 30,
                  mass: 0.6,
                  stiffness: 420,
                  type: "spring",
                }
          }
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
