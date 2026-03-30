import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import MoneyExplosion from "./MoneyExplosion";

const CURRENT_USER = "PPK";

const BALANCE_KEY = (user: string) => `wallet_${user}`;

function getBalance(user: string): number {
  return Number.parseFloat(localStorage.getItem(BALANCE_KEY(user)) || "0");
}

function setBalance(user: string, amount: number) {
  localStorage.setItem(BALANCE_KEY(user), amount.toFixed(2));
}

const GIFT_CHARACTERS = [
  {
    id: "gift10",
    emoji: "🧑‍💼",
    note: "💵",
    noteValue: 10,
    purchasePrice: 15,
    adminFee: 5,
    label: "₹10 वाला",
    color: "from-green-400 to-emerald-500",
    textColor: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: "gift20",
    emoji: "🧑‍🎤",
    note: "💴",
    noteValue: 20,
    purchasePrice: 25,
    adminFee: 5,
    label: "₹20 वाला",
    color: "from-blue-400 to-indigo-500",
    textColor: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    id: "gift30",
    emoji: "👨‍⚕️",
    note: "💶",
    noteValue: 30,
    purchasePrice: 35,
    adminFee: 5,
    label: "₹30 वाला",
    color: "from-violet-400 to-purple-500",
    textColor: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    id: "gift50",
    emoji: "🧙‍♂️",
    note: "💷",
    noteValue: 50,
    purchasePrice: 55,
    adminFee: 5,
    label: "₹50 वाला",
    color: "from-orange-400 to-amber-500",
    textColor: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    id: "gift100",
    emoji: "🤴",
    note: "💰",
    noteValue: 100,
    purchasePrice: 125,
    adminFee: 25,
    label: "₹100 वाला",
    color: "from-yellow-400 to-yellow-500",
    textColor: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
];

interface FlyingGift {
  id: string;
  emoji: string;
  note: string;
}

interface GiftCharacterPanelProps {
  open: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
}

export default function GiftCharacterPanel({
  open,
  onClose,
  creatorId,
  creatorName,
}: GiftCharacterPanelProps) {
  const [flyingGift, setFlyingGift] = useState<FlyingGift | null>(null);
  const [showExplosion, setShowExplosion] = useState(false);

  const handleGift = (char: (typeof GIFT_CHARACTERS)[0]) => {
    const balance = getBalance(CURRENT_USER);
    if (balance < char.purchasePrice) {
      toast.error("पर्याप्त बैलेंस नहीं है। पहले वॉलेट में पैसे डालें", { duration: 3000 });
      return;
    }

    // Deduct from sender
    setBalance(CURRENT_USER, balance - char.purchasePrice);
    // Add gift value to creator
    const creatorBal = getBalance(creatorId);
    setBalance(creatorId, creatorBal + char.noteValue);
    // Add admin fee
    const adminBal = getBalance("admin");
    setBalance("admin", adminBal + char.adminFee);

    // Trigger flying animation
    setShowExplosion(true);
    setFlyingGift({ id: char.id, emoji: char.emoji, note: char.note });

    // Show toast after animation starts
    setTimeout(() => {
      toast.success(`₹${char.noteValue} ${creatorName} को भेज दिया! 🎉`);
    }, 1200);

    // Clear flying after animation
    setTimeout(() => {
      setFlyingGift(null);
    }, 1800);
  };

  return (
    <>
      <MoneyExplosion
        active={showExplosion}
        onDone={() => setShowExplosion(false)}
      />
      {/* Flying character animation - full screen overlay */}
      <AnimatePresence>
        {flyingGift && (
          <motion.div
            key={flyingGift.id}
            className="fixed inset-0 z-[300] pointer-events-none flex items-end justify-center pb-32"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <motion.div
              initial={{ y: 0, scale: 1 }}
              animate={{ y: "-70vh", scale: 1.5 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1"
            >
              <span className="text-6xl drop-shadow-lg">
                {flyingGift.emoji}
              </span>
              <span className="text-5xl drop-shadow-lg">{flyingGift.note}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom sheet panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="gift-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/50"
              onClick={onClose}
            />

            <motion.div
              key="gift-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 inset-x-0 z-[210] bg-card border border-border rounded-t-3xl shadow-2xl flex flex-col"
              style={{ maxHeight: "75vh" }}
              data-ocid="gift.panel"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <div>
                  <h2 className="font-bold text-lg text-foreground">
                    🎁 गिफ्ट भेजें
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {creatorName} को गिफ्ट करें
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  data-ocid="gift.close_button"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xl"
                >
                  ✕
                </button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-4 text-center">
                    💡 खरीदें और creator को सीधे भेजें! हर बार भेजने पर ₹5 Admin fee
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {GIFT_CHARACTERS.map((char, idx) => (
                      <div
                        key={char.id}
                        data-ocid={`gift.item.${idx + 1}`}
                        className={`${char.bg} ${char.border} border-2 rounded-2xl p-4 flex items-center justify-between`}
                      >
                        {/* Character display */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <motion.span
                              className="text-5xl block"
                              animate={{
                                y: [0, -6, 0],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: idx * 0.3,
                                ease: "easeInOut",
                              }}
                            >
                              {char.emoji}
                            </motion.span>
                            <motion.span
                              className="text-3xl absolute -bottom-1 -right-2 block"
                              animate={{ rotate: [-10, 10, -10] }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: idx * 0.2,
                                ease: "easeInOut",
                              }}
                            >
                              {char.note}
                            </motion.span>
                          </div>
                          <div className="pl-3">
                            <p
                              className={`font-black text-xl ${char.textColor}`}
                            >
                              {char.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Creator को मिलेगा:{" "}
                              <span className="font-bold text-foreground">
                                ₹{char.noteValue}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Admin fee: ₹{char.adminFee}
                            </p>
                          </div>
                        </div>

                        {/* Buy & send button */}
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground mb-1.5">
                            आपसे कटेगा
                          </p>
                          <Button
                            size="sm"
                            className={`bg-gradient-to-r ${char.color} text-white font-bold text-base px-5 py-2 rounded-xl shadow-md hover:opacity-90 border-0`}
                            onClick={() => handleGift(char)}
                            data-ocid={`gift.send_button.${idx + 1}`}
                          >
                            ₹{char.purchasePrice} भेजें
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      आपका बैलेंस:{" "}
                      <span className="font-bold text-foreground">
                        ₹{getBalance(CURRENT_USER).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
