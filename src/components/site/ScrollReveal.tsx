import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  direction?: "up" | "down" | "none";
  className?: string;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  delayMs = 0,
  direction = "up",
  className = "",
  as: Component = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, reveal immediately
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Check if element is already in initial viewport on mount
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Element is already visible on screen
      const timer = setTimeout(() => setIsRevealed(true), Math.min(delayMs, 100));
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delayMs]);

  const getTransformStyle = () => {
    if (isRevealed) return "none";
    if (direction === "up") return "translateY(24px)";
    if (direction === "down") return "translateY(-24px)";
    return "none";
  };

  return (
    <Component
      ref={ref}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: getTransformStyle(),
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: isRevealed ? "auto" : "opacity, transform",
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
