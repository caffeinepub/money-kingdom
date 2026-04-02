import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { LAST_CLEAN_KEY } from "./DustOverlay";
export const DOUBLE_EARN_KEY = "mk_double_earn_until";

type Phase = "idle" | "arrival" | "sweeping" | "done";

const SPARKLES = [
  { id: "sp1", icon: "✨" },
  { id: "sp2", icon: "⭐" },
  { id: "sp3", icon: "✨" },
  { id: "sp4", icon: "🌟" },
  { id: "sp5", icon: "✨" },
];

function addCoins(amount: number) {
  try {
    const raw = localStorage.getItem("mk_wallet");
    let wallet = { coins: 0, cash: 0 };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        wallet = { coins: parsed.coins ?? 0, cash: parsed.cash ?? 0 };
      }
    }
    wallet.coins += amount;
    localStorage.setItem("mk_wallet", JSON.stringify(wallet));
    try {
      const txRaw = localStorage.getItem("mk_transactions");
      const txList = txRaw ? JSON.parse(txRaw) : [];
      txList.unshift({
        id: Date.now().toString(),
        type: "credit",
        amount,
        desc: "🧹 Midnight Cleaner Reward",
        time: new Date().toLocaleString("hi-IN"),
      });
      localStorage.setItem(
        "mk_transactions",
        JSON.stringify(txList.slice(0, 50)),
      );
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function alreadyCleanedToday() {
  return localStorage.getItem(LAST_CLEAN_KEY) === todayString();
}

export default function MidnightCleaner() {
  const [phase, setPhase] = useState<Phase>("idle");

  const startCleaning = useCallback(() => {
    setPhase("arrival");
    setTimeout(() => setPhase("sweeping"), 2200);
    setTimeout(() => {
      addCoins(10);
      // Set double earnings power-up for 1 hour
      const until = Date.now() + 60 * 60 * 1000;
      localStorage.setItem(DOUBLE_EARN_KEY, String(until));
      window.dispatchEvent(new Event("mk_dust_reset"));
      setPhase("done");
      localStorage.setItem(LAST_CLEAN_KEY, todayString());
    }, 4200);
    setTimeout(() => setPhase("idle"), 7000);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        if (!alreadyCleanedToday()) startCleaning();
      }
    }, 60000);
    return () => clearInterval(id);
  }, [startCleaning]);

  useEffect(() => {
    (window as any).__mkTestMidnight = startCleaning;
  }, [startCleaning]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="midnight-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.82)" }}
        >
          <AnimatePresence>
            {phase === "sweeping" && (
              <motion.div
                key="sweep"
                initial={{ x: "-110%", opacity: 0.9 }}
                animate={{ x: "110%", opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.45) 40%, rgba(255,255,255,0.7) 50%, rgba(255,215,0,0.45) 60%, transparent 100%)",
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(phase === "arrival" || phase === "sweeping") && (
              <motion.div
                key="character"
                initial={{ y: 80, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 200 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{
                    rotate: phase === "sweeping" ? [-5, 5, -5] : 0,
                    x: phase === "sweeping" ? [-8, 8, -8] : 0,
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.5,
                  }}
                  className="text-7xl select-none"
                >
                  🧹
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-yellow-400 text-black rounded-2xl px-5 py-3 max-w-xs text-center text-base font-bold shadow-2xl"
                  style={{ borderRadius: "18px 18px 18px 4px" }}
                >
                  रुको! बहुत धूल-मिट्टी हो गई है,
                  <br />
                  मुझे साफ करने दो! 🧹
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", damping: 14 }}
                className="flex flex-col items-center gap-5 text-center px-6"
              >
                <div className="flex gap-2 text-4xl">
                  {SPARKLES.map((sp, i) => (
                    <motion.span
                      key={sp.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      {sp.icon}
                    </motion.span>
                  ))}
                </div>
                <p className="text-white text-2xl font-bold">
                  किंगडम चमक गया! ✨
                </p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-yellow-400 text-black font-bold text-lg px-6 py-3 rounded-2xl shadow-xl"
                >
                  +10 🪙 Kingdom Coins मिले!
                </motion.div>
                <p className="text-yellow-200 text-sm opacity-80">
                  रात के 12 बजे की सफाई पूरी हुई 🌙
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-2xl shadow-xl mt-1"
                  >
                    ⚡ 1 घंटे के लिए 2x Coins! Tasks u0026 Games पर डबल कमाई!
                  </motion.div>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
