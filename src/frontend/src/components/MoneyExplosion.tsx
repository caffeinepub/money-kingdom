import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

const COINS = ["💰", "🪙", "💵", "💴", "💶", "💷"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface MoneyExplosionProps {
  active: boolean;
  onDone?: () => void;
}

export default function MoneyExplosion({
  active,
  onDone,
}: MoneyExplosionProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active && onDone) {
      timerRef.current = setTimeout(onDone, 2200);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, onDone]);

  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: COINS[Math.floor(Math.random() * COINS.length)],
      angle: randomBetween(0, 360),
      distance: randomBetween(150, 400),
      rotation: randomBetween(-360, 360),
      delay: randomBetween(0, 0.3),
      size: randomBetween(24, 44),
    })),
  ).current;

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[500] pointer-events-none flex items-center justify-center">
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;
            return (
              <motion.span
                key={p.id}
                className="absolute select-none"
                style={{ fontSize: p.size }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: tx,
                  y: ty,
                  scale: [0, 1.4, 0.9, 0],
                  opacity: [1, 1, 0.7, 0],
                  rotate: p.rotation,
                }}
                transition={{
                  duration: 1.8,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1],
                  scale: { duration: 1.8, delay: p.delay },
                  opacity: { duration: 1.8, delay: p.delay },
                }}
              >
                {p.emoji}
              </motion.span>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
