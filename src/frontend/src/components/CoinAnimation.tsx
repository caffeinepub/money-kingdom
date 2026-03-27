import { motion } from "motion/react";
import { useEffect } from "react";

interface CoinAnimationProps {
  onComplete: () => void;
}

const COINS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 85,
  delay: i * 0.15,
  size: 28 + Math.floor(Math.random() * 18),
}));

export default function CoinAnimation({ onComplete }: CoinAnimationProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {/* Earth line */}
      <div className="absolute bottom-[12%] inset-x-0 h-1.5 bg-amber-700/60 rounded-full" />

      {COINS.map((coin) => (
        <motion.div
          key={coin.id}
          initial={{ y: "-10vh", opacity: 1, scale: 1 }}
          animate={{ y: "82vh", opacity: 0, scale: 0.45 }}
          transition={{
            duration: 2,
            delay: coin.delay,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          style={{ left: `${coin.x}%`, width: coin.size, height: coin.size }}
          className="absolute top-0 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center shadow-lg"
        >
          <span
            className="font-bold text-amber-800 leading-none select-none"
            style={{ fontSize: coin.size * 0.45 }}
          >
            ₹
          </span>
        </motion.div>
      ))}
    </div>
  );
}
