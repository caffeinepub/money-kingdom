import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const QUOTES = [
  "पैसा बोलता है, मेहनत से सीखो इसे बोलना",
  "आपका किंगडम आपकी मेहनत से बनेगा",
  "हर रुपया एक कदम है — मंजिल की तरफ",
  "जो सपने देखते हैं, वही राजा बनते हैं",
  "पैसों की बारिश तब होती है जब मेहनत की धूप निकलती है",
  "Money Kingdom में स्वागत है — राजा!",
  "कमाओ, बचाओ, बढ़ाओ — यही है किंगडम का रास्ता",
  "हर दिन एक नया मौका है अमीर बनने का",
  "मेहनत करते रहो — किंगडम आपका इंतज़ार कर रहा है",
  "छोटे-छोटे कदमों से बड़े सपने पूरे होते हैं",
  "अपने खर्च पर राज करो, पैसे तुम्हारे गुलाम हैं",
  "एक दिन पूरी दुनिया तुम्हारे किंगडम को सलाम करेगी",
];

export default function HindiQuotesCard() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-xl p-3 border overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.88 0.06 62), oklch(0.94 0.04 68))",
        borderColor: "oklch(0.72 0.14 58)",
      }}
      data-ocid="quotes.card"
    >
      <div className="relative min-h-[44px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={QUOTES[current]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-center text-xs font-semibold leading-relaxed px-2"
            style={{ color: "oklch(0.28 0.06 45)" }}
          >
            <span
              className="text-sm mr-1"
              style={{ color: "oklch(0.58 0.14 56)" }}
            >
              👑
            </span>
            {QUOTES[current]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1 mt-2">
        {QUOTES.map((quote, i) => (
          <button
            key={quote.slice(0, 8)}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Quote ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 14 : 5,
              height: 5,
              background:
                i === current ? "oklch(0.58 0.16 56)" : "oklch(0.70 0.08 58)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
