import { useMemo } from "react";

interface RupeeSymbol {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export default function MoneyRain() {
  const symbols = useMemo<RupeeSymbol[]>(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: (i * 3.7 + Math.sin(i * 1.3) * 3 + 100) % 100,
      delay: (i * 0.41 + Math.cos(i * 0.7) * 0.5 + 2) % 12,
      duration: 8 + (i % 7) * 1.5,
      size: 12 + (i % 4) * 2,
      opacity: 0.06 + (i % 5) * 0.012,
    }));
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {symbols.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            top: "-2rem",
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            color: "oklch(0.72 0.14 75)",
            fontWeight: 700,
            animationName: "moneyFall",
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            userSelect: "none",
          }}
        >
          ₹
        </span>
      ))}
    </div>
  );
}
