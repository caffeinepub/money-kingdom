import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const FESTIVALS = [
  { month: 10, day: 1, name: "दिवाली", emoji: "🪔", effect: "fireworks" },
  { month: 11, day: 14, name: "दिवाली", emoji: "🪔", effect: "fireworks" },
  { month: 2, day: 14, name: "होली", emoji: "🌈", effect: "colors" },
  { month: 3, day: 31, name: "ईद", emoji: "🌙", effect: "stars" },
  { month: 0, day: 26, name: "गणतंत्र दिवस", emoji: "🇮🇳", effect: "confetti" },
  { month: 7, day: 15, name: "स्वतंत्रता दिवस", emoji: "🇮🇳", effect: "confetti" },
];

type Festival = (typeof FESTIVALS)[0];

function getFlagKey(festival: Festival) {
  const year = new Date().getFullYear();
  return `mk_festival_seen_${festival.month}_${festival.day}_${year}`;
}

function getActiveFestival(): Festival | null {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  return FESTIVALS.find((f) => f.month === month && f.day === day) ?? null;
}

interface ParticleProps {
  effect: string;
}

function Particles({ effect }: ParticleProps) {
  const count = 18;
  const colors =
    effect === "fireworks"
      ? ["#FFD700", "#FF6B6B", "#FF8E53", "#FFCE54"]
      : effect === "colors"
        ? ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6A1", "#FFA500"]
        : effect === "stars"
          ? ["#FFCE54", "#A8E6CF", "#DCEDC8", "#C9F0FF"]
          : ["#FF9933", "#FFFFFF", "#138808"];

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {[...Array(count)].map((_e, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: static animation items
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + Math.random() * 8,
            height: 6 + Math.random() * 8,
            background: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 20, -10, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.6, 1, 0.4, 0.8, 0.6],
            scale: [1, 1.3, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function FestivalMode() {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const f = getActiveFestival();
    if (!f) return;
    const key = getFlagKey(f);
    if (localStorage.getItem(key) === "seen") return;
    setFestival(f);
    setVisible(true);
  }, []);

  const dismiss = () => {
    if (festival) {
      localStorage.setItem(getFlagKey(festival), "seen");
    }
    setVisible(false);
  };

  if (!festival) return null;

  return (
    <>
      {/* Floating particles background */}
      {visible && <Particles effect={festival.effect} />}

      {/* Banner */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed top-0 inset-x-0 z-[95] flex items-center justify-between px-4 py-3"
            style={{
              background:
                festival.effect === "fireworks"
                  ? "linear-gradient(90deg, #1a0a00, #3d1a00, #1a0a00)"
                  : festival.effect === "colors"
                    ? "linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1)"
                    : festival.effect === "stars"
                      ? "linear-gradient(90deg, #0d1117, #1a1f35, #0d1117)"
                      : "linear-gradient(90deg, #FF9933, #FFFFFF20, #138808)",
              borderBottom: "1px solid rgba(255,215,0,0.3)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{festival.emoji}</span>
              <div>
                <p className="text-white font-black text-sm leading-tight">
                  {festival.name} की शुभकामनाएं!
                </p>
                <p className="text-white/70 text-xs">
                  Happy {festival.name}! 🎉
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm"
              data-ocid="festival.close_button"
              aria-label="बंद करें"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
