import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1400, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    // Try to extract a numeric target from the string (e.g. "2006", "24+", "48,000+", "120")
    // Match numeric digits (possibly with commas)
    const match = value.match(/^([^0-9]*)([\d,]+)([^0-9]*)$/);
    if (!match) {
      // Non-numeric string (e.g. "MoEc No. 1201" or "Women-Led")
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const rawNumberStr = match[2].replace(/,/g, "");
    const suffix = match[3] || "";
    const targetNumber = parseInt(rawNumberStr, 10);

    if (isNaN(targetNumber)) {
      setDisplayValue(value);
      return;
    }

    const hasCommas = match[2].includes(",");

    // Initialize with 0 or starting value
    setDisplayValue(`${prefix}0${suffix}`);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;

          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic curve: 1 - Math.pow(1 - progress, 3)
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.round(targetNumber * easeOutProgress);

            const formattedNumber = hasCommas
              ? currentNumber.toLocaleString("en-US")
              : currentNumber.toString();

            setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(updateCounter);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    const el = elementRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className={`inline-block tabular-nums transition-opacity duration-300 ${className}`}>
      {displayValue}
    </span>
  );
}
