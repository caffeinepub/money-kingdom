import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const QUIZ_QUESTIONS = [
  {
    q: "भारत की राजधानी क्या है?",
    opts: ["मुंबई", "दिल्ली", "कोलकाता", "चेन्नई"],
    ans: 1,
  },
  {
    q: "1 Dollar = कितने Rupee? (approx)",
    opts: ["50", "83", "100", "120"],
    ans: 1,
  },
  {
    q: "किंगडम में King बनने के लिए कितने coins चाहिए?",
    opts: ["100", "500", "1000", "2000"],
    ans: 3,
  },
  {
    q: "India का national bird कौन है?",
    opts: ["कौआ", "मोर", "तोता", "कबूतर"],
    ans: 1,
  },
  { q: "1 + 1 = ?", opts: ["1", "2", "3", "4"], ans: 1 },
  { q: "सोने का रंग क्या होता है?", opts: ["नीला", "हरा", "पीला", "लाल"], ans: 2 },
  {
    q: "Money Kingdom किसने बनाया?",
    opts: ["Google", "Prince Pawan Kumar", "Facebook", "Amazon"],
    ans: 1,
  },
  {
    q: "Midnight Cleaner कब आता है?",
    opts: ["सुबह 6 बजे", "रात 8 बजे", "रात 12 बजे", "दोपहर 12 बजे"],
    ans: 2,
  },
  { q: "Kingdom का symbol क्या है?", opts: ["⚔️", "👑", "🏰", "💎"], ans: 1 },
  {
    q: "1 Kingdom Coin की value क्या है?",
    opts: ["₹1", "₹2", "₹5", "virtual"],
    ans: 3,
  },
];

function getWallet() {
  try {
    const raw = localStorage.getItem("mk_wallet");
    if (!raw) return { coins: 0, cash: 0 };
    const p = JSON.parse(raw);
    return { coins: p.coins ?? 0, cash: p.cash ?? 0 };
  } catch {
    return { coins: 0, cash: 0 };
  }
}

function updateCoins(delta: number) {
  const w = getWallet();
  const newCoins = Math.max(0, w.coins + delta);
  localStorage.setItem("mk_wallet", JSON.stringify({ ...w, coins: newCoins }));
  try {
    const txRaw = localStorage.getItem("mk_transactions");
    const txList = txRaw ? JSON.parse(txRaw) : [];
    txList.unshift({
      id: Date.now().toString(),
      type: delta > 0 ? "credit" : "debit",
      amount: Math.abs(delta),
      desc: "🎮 Games Reward",
      time: new Date().toLocaleString("hi-IN"),
    });
    localStorage.setItem(
      "mk_transactions",
      JSON.stringify(txList.slice(0, 50)),
    );
  } catch {}
  return newCoins;
}

function getMultiplier() {
  try {
    const until = Number.parseInt(
      localStorage.getItem("mk_double_earn_until") ?? "0",
      10,
    );
    return Date.now() < until ? 2 : 1;
  } catch {
    return 1;
  }
}

function isAdmin() {
  return localStorage.getItem("mk_is_admin") === "true";
}

// ── Quiz ──────────────────────────────────────
function QuizGame({ onBack }: { onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const current = QUIZ_QUESTIONS[qIdx];

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const mult = getMultiplier();
    const correct = i === current.ans;
    if (correct) {
      const earned = 5 * mult;
      updateCoins(earned);
      setScore((s) => s + earned);
    }
    setTimeout(() => {
      if (qIdx + 1 >= QUIZ_QUESTIONS.length) {
        setDone(true);
      } else {
        setQIdx((q) => q + 1);
        setSelected(null);
      }
    }, 900);
  };

  const restart = () => {
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="text-6xl">🏆</div>
        <p className="text-foreground text-2xl font-black">Quiz खत्म!</p>
        <p className="text-primary text-xl font-bold">आपने {score} 🪙 कमाए!</p>
        <div className="flex gap-3">
          <Button onClick={restart} data-ocid="games.quiz.restart_button">
            फिर खेलें
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            data-ocid="games.quiz.back_button"
          >
            वापस
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {qIdx + 1}/{QUIZ_QUESTIONS.length}
        </span>
        <span className="text-primary font-bold">Score: {score} 🪙</span>
      </div>
      <div className="p-4 rounded-2xl bg-muted/40 border border-border">
        <p className="text-foreground font-bold text-base">{current.q}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {current.opts.map((opt, i) => {
          let cls =
            "p-3 rounded-xl border text-sm font-medium transition-all text-left ";
          if (selected === null) {
            cls +=
              "border-border hover:border-primary hover:bg-primary/10 text-foreground";
          } else if (i === current.ans) {
            cls += "border-green-500 bg-green-500/20 text-green-600";
          } else if (i === selected) {
            cls += "border-destructive bg-destructive/20 text-destructive";
          } else {
            cls += "border-border text-muted-foreground opacity-50";
          }
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              onClick={() => pick(i)}
              data-ocid={`games.quiz.option.${i + 1}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mt-2"
        data-ocid="games.quiz.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Coin Toss ────────────────────────────────
function CoinTossGame({ onBack }: { onBack: () => void }) {
  const [choice, setChoice] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [message, setMessage] = useState("");

  const toss = () => {
    if (!choice) {
      toast.error("पहले Heads या Tails चुनें!");
      return;
    }
    const w = getWallet();
    if (w.coins < 2) {
      toast.error("कम से कम 2 coins चाहिए!");
      return;
    }
    updateCoins(-2);
    setFlipping(true);
    setResult(null);
    setMessage("");
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      setFlipping(false);
      const mult = getMultiplier();
      if (r === choice) {
        updateCoins(4 * mult);
        setMessage(`🎉 सही! +${4 * mult} 🪙`);
      } else {
        setMessage("😢 गलत! 2 coins खर्च हुए।");
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <p className="text-foreground font-bold text-lg">🪙 सिक्का उछालें</p>
      <p className="text-muted-foreground text-sm">
        2 coins खर्च, जीते तो 4 वापस
      </p>

      <motion.div
        animate={flipping ? { rotateY: [0, 360, 720, 1080] } : {}}
        transition={{ duration: 1.2 }}
        className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-4xl shadow-2xl border-4 border-yellow-600"
      >
        {result === null ? "🪙" : result === "heads" ? "👑" : "🦁"}
      </motion.div>

      <div className="flex gap-3">
        {(["heads", "tails"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChoice(c)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              choice === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground border border-border hover:border-primary"
            }`}
            data-ocid={`games.coin.${c}.button`}
          >
            {c === "heads" ? "👑 Heads" : "🦁 Tails"}
          </button>
        ))}
      </div>

      <Button
        onClick={toss}
        disabled={flipping}
        className="w-full"
        data-ocid="games.coin.toss_button"
      >
        उछालो! 🪙
      </Button>

      {message && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-lg font-black text-primary"
        >
          {message}
        </motion.p>
      )}

      <Button
        variant="ghost"
        onClick={onBack}
        data-ocid="games.coin.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Lucky Spin ───────────────────────────────
function LuckySpinGame({ onBack }: { onBack: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [message, setMessage] = useState("");
  const admin = isAdmin();

  const spin = () => {
    const w = getWallet();
    if (w.coins < 5) {
      toast.error("5 coins चाहिए!");
      return;
    }
    updateCoins(-5);
    // credit to admin
    try {
      const raw = localStorage.getItem("mk_admin_wallet");
      const aw = raw ? JSON.parse(raw) : { coins: 0 };
      aw.coins = (aw.coins ?? 0) + 5;
      localStorage.setItem("mk_admin_wallet", JSON.stringify(aw));
    } catch {}
    setSpinning(true);
    setMessage("");
    const extraDeg = 1800 + Math.floor(Math.random() * 360);
    setSpinDeg((prev) => prev + extraDeg);
    setTimeout(() => {
      setSpinning(false);
      if (admin) {
        const mult = getMultiplier();
        const win = (10 + Math.floor(Math.random() * 40)) * mult;
        updateCoins(win);
        setMessage(`🎉 Admin Bonus! +${win} 🪙`);
      } else {
        setMessage("किस्मत साथ नहीं दी! 😢 Try again");
      }
    }, 2000);
  };

  const segments = ["₹0", "₹0", "₹0", "₹0", "₹0", "₹0", "₹0", "₹0"];
  const colors = [
    "#FFD700",
    "#B8860B",
    "#DAA520",
    "#FFD700",
    "#B8860B",
    "#DAA520",
    "#FFD700",
    "#B8860B",
  ];

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <p className="text-foreground font-bold text-lg">🎡 भाग्य चक्र</p>
      <p className="text-muted-foreground text-sm">
        5 coins खर्च करें — किस्मत आजमाएं!
      </p>

      <div className="relative w-56 h-56">
        <motion.div
          animate={{ rotate: spinDeg }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-56 h-56 rounded-full border-4 border-yellow-400 overflow-hidden"
          style={{ position: "relative" }}
        >
          {segments.map((seg, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static segments
              key={i}
              className="absolute inset-0 flex items-start justify-center pt-4"
              style={{
                transform: `rotate(${i * (360 / segments.length)}deg)`,
                clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((i - 0.5) * 2 * Math.PI) / segments.length)}% ${50 + 50 * Math.sin(((i - 0.5) * 2 * Math.PI) / segments.length)}%, ${50 + 50 * Math.cos(((i + 0.5) * 2 * Math.PI) / segments.length)}% ${50 + 50 * Math.sin(((i + 0.5) * 2 * Math.PI) / segments.length)}%)`,
                background: colors[i],
              }}
            >
              <span className="text-xs font-black text-black rotate-180">
                {seg}
              </span>
            </div>
          ))}
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-400 border-4 border-white z-10 flex items-center justify-center">
          <span className="text-xs">👑</span>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-2xl">
          ▼
        </div>
      </div>

      <Button
        onClick={spin}
        disabled={spinning}
        className="w-full"
        data-ocid="games.spin.button"
      >
        {spinning ? "घूम रहा है..." : "Spin करें! (5 🪙)"}
      </Button>

      {message && (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`text-base font-bold ${
            message.includes("किस्मत") ? "text-muted-foreground" : "text-primary"
          }`}
        >
          {message}
        </motion.p>
      )}

      <Button
        variant="ghost"
        onClick={onBack}
        data-ocid="games.spin.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Treasure Hunt ────────────────────────────
function TreasureHunt({ onBack }: { onBack: () => void }) {
  const [treasureIdx] = useState(() => Math.floor(Math.random() * 9));
  const [revealed, setReveal] = useState<boolean[]>(Array(9).fill(false));
  const [done, setDone] = useState(false);

  const tap = (i: number) => {
    if (revealed[i] || done) return;
    setReveal((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    const mult = getMultiplier();
    if (i === treasureIdx) {
      updateCoins(15 * mult);
      toast.success(`🏆 खज़ाना मिला! +${15 * mult} 🪙`);
      setDone(true);
    } else {
      if (Math.random() < 0.3) {
        updateCoins(-1);
        toast.error("-1 🪙 empty tile");
      }
    }
  };

  const reset = () => {
    setReveal(Array(9).fill(false));
    setDone(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <p className="text-foreground font-bold text-lg">🏺 खज़ाना ढूंढो</p>
      <p className="text-muted-foreground text-sm">
        9 में से एक tile में खज़ाना है! +15 🪙
      </p>
      <div className="grid grid-cols-3 gap-2">
        {["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"].map((id, i) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => tap(i)}
            whileTap={{ scale: 0.9 }}
            disabled={revealed[i] || done}
            className={`w-20 h-20 rounded-2xl text-3xl flex items-center justify-center font-bold transition-all ${
              revealed[i]
                ? i === treasureIdx
                  ? "bg-yellow-400 border-2 border-yellow-600"
                  : "bg-muted text-muted-foreground"
                : "bg-card border-2 border-border hover:border-primary shadow-sm"
            }`}
            data-ocid={`games.treasure.item.${i + 1}`}
          >
            {revealed[i] ? (i === treasureIdx ? "🏆" : "❌") : "❓"}
          </motion.button>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={reset}
        data-ocid="games.treasure.restart_button"
      >
        फिर खेलें 🔄
      </Button>
      <Button
        variant="ghost"
        onClick={onBack}
        data-ocid="games.treasure.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Gift Box ─────────────────────────────────
function GiftBoxGame({ onBack }: { onBack: () => void }) {
  const lastKey = "mk_last_giftbox";
  const [opened, setOpened] = useState(false);
  const [coins, setCoins] = useState(0);
  const [countdown, setCountdown] = useState("");

  const getTimeLeft = useCallback(() => {
    const last = Number.parseInt(localStorage.getItem(lastKey) ?? "0", 10);
    const diff = last + 60 * 60 * 1000 - Date.now();
    if (diff <= 0) return null;
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  const canOpen = !getTimeLeft();

  const open = () => {
    if (!canOpen) return;
    const mult = getMultiplier();
    const earned = (1 + Math.floor(Math.random() * 10)) * mult;
    updateCoins(earned);
    setCoins(earned);
    setOpened(true);
    localStorage.setItem(lastKey, String(Date.now()));
  };

  // Update countdown
  useState(() => {
    const id = setInterval(() => {
      const t = getTimeLeft();
      setCountdown(t ?? "");
    }, 1000);
    return () => clearInterval(id);
  });

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <p className="text-foreground font-bold text-lg">🎁 Gift Box</p>
      <p className="text-muted-foreground text-sm">हर 1 घंटे में एक free gift!</p>

      <motion.div
        animate={opened ? { scale: [1, 1.2, 0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.6 }}
        className="text-8xl cursor-pointer select-none"
        onClick={canOpen ? open : undefined}
      >
        {opened ? "🎉" : canOpen ? "🎁" : "📦"}
      </motion.div>

      {opened ? (
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-primary text-xl font-black"
        >
          +{coins} 🪙 मिले!
        </motion.p>
      ) : canOpen ? (
        <Button
          onClick={open}
          className="w-full"
          data-ocid="games.gift.open_modal_button"
        >
          🎁 खोलो!
        </Button>
      ) : (
        <p className="text-muted-foreground text-sm">
          अगला gift {countdown} मिनट में
        </p>
      )}

      <Button
        variant="ghost"
        onClick={onBack}
        data-ocid="games.gift.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Soundboard ───────────────────────────────
function Soundboard({ onBack }: { onBack: () => void }) {
  const play = (type: string) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      switch (type) {
        case "coin":
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(
            440,
            ctx.currentTime + 0.2,
          );
          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
          break;
        case "royal":
          [523, 659, 784, 1047].forEach((freq, i) => {
            const o2 = ctx.createOscillator();
            o2.frequency.value = freq;
            const g2 = ctx.createGain();
            g2.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
            g2.gain.exponentialRampToValueAtTime(
              0.01,
              ctx.currentTime + i * 0.15 + 0.3,
            );
            o2.connect(g2);
            g2.connect(ctx.destination);
            o2.start(ctx.currentTime + i * 0.15);
            o2.stop(ctx.currentTime + i * 0.15 + 0.3);
          });
          break;
        case "money":
          for (let i = 0; i < 8; i++) {
            const o3 = ctx.createOscillator();
            o3.frequency.value = 660 + Math.random() * 440;
            const g3 = ctx.createGain();
            g3.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.06);
            g3.gain.exponentialRampToValueAtTime(
              0.01,
              ctx.currentTime + i * 0.06 + 0.1,
            );
            o3.connect(g3);
            g3.connect(ctx.destination);
            o3.start(ctx.currentTime + i * 0.06);
            o3.stop(ctx.currentTime + i * 0.06 + 0.1);
          }
          break;
        case "bell":
          osc.type = "sine";
          osc.frequency.setValueAtTime(1046, ctx.currentTime);
          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 1.5);
          break;
        case "drum":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
          gain.gain.setValueAtTime(0.8, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
          break;
        case "power":
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(
            880,
            ctx.currentTime + 0.4,
          );
          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
          break;
        default:
          break;
      }
    } catch {}
  };

  const sounds = [
    { id: "coin", emoji: "🪙", label: "Coin" },
    { id: "royal", emoji: "👑", label: "Royal" },
    { id: "money", emoji: "💰", label: "Money Rain" },
    { id: "bell", emoji: "🔔", label: "Bell" },
    { id: "drum", emoji: "🥁", label: "Drum" },
    { id: "power", emoji: "⚡", label: "Power Up" },
  ];

  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-foreground font-bold text-lg text-center">🔊 आवाज़ें</p>
      <div className="grid grid-cols-3 gap-3">
        {sounds.map((s) => (
          <motion.button
            key={s.id}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => play(s.id)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/40 border border-border hover:border-primary transition-all"
            data-ocid={`games.sound.${s.id}.button`}
          >
            <span className="text-3xl">{s.emoji}</span>
            <span className="text-xs font-bold text-foreground">{s.label}</span>
          </motion.button>
        ))}
      </div>
      <Button
        variant="ghost"
        onClick={onBack}
        data-ocid="games.sound.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Avatar Maker ─────────────────────────────
const FACE_COLORS = ["#FBBF24", "#F59E0B", "#A78BFA", "#60A5FA", "#34D399"];
const HAIR_EMOJIS = ["👱", "👨", "👩", "🧔", "👴"];

function AvatarMaker({ onBack }: { onBack: () => void }) {
  const [faceColor, setFaceColor] = useState(0);
  const [hair, setHair] = useState(0);
  const [crown, setCrown] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const avatar = {
      faceColor: FACE_COLORS[faceColor],
      hair: HAIR_EMOJIS[hair],
      crown,
    };
    localStorage.setItem("mk_avatar", JSON.stringify(avatar));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success("Avatar सेव हो गया! ✅");
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-foreground font-bold text-lg text-center">
        🎭 अवतार बनाओ
      </p>

      {/* Preview */}
      <div className="flex justify-center">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-5xl border-4 border-yellow-400 shadow-lg"
          style={{ background: FACE_COLORS[faceColor] }}
        >
          {crown ? "👑" : HAIR_EMOJIS[hair]}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wide">
          Face Color
        </p>
        <div className="flex gap-2">
          {FACE_COLORS.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => setFaceColor(i)}
              className={`w-10 h-10 rounded-full border-4 transition-all ${
                faceColor === i
                  ? "border-foreground scale-110"
                  : "border-transparent"
              }`}
              style={{ background: c }}
              data-ocid={`games.avatar.face.${i + 1}`}
            />
          ))}
        </div>

        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wide">
          Hair Style
        </p>
        <div className="flex gap-2">
          {HAIR_EMOJIS.map((h, i) => (
            <button
              key={h}
              type="button"
              onClick={() => setHair(i)}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                hair === i
                  ? "bg-primary/20 border-2 border-primary"
                  : "bg-muted border border-border"
              }`}
              data-ocid={`games.avatar.hair.${i + 1}`}
            >
              {h}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
          <span className="font-medium text-foreground">Crown 👑</span>
          <button
            type="button"
            onClick={() => setCrown((v) => !v)}
            className={`w-12 h-6 rounded-full transition-all ${
              crown ? "bg-yellow-400" : "bg-muted"
            }`}
            data-ocid="games.avatar.crown.switch"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                crown ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <Button
        onClick={save}
        disabled={saved}
        data-ocid="games.avatar.save_button"
      >
        {saved ? "✅ सेव हो गया!" : "💾 Save Avatar"}
      </Button>
      <Button
        variant="ghost"
        onClick={onBack}
        data-ocid="games.avatar.back_button"
      >
        ← वापस
      </Button>
    </div>
  );
}

// ── Main Games Panel ──────────────────────────
type GameId =
  | "quiz"
  | "coin"
  | "spin"
  | "treasure"
  | "gift"
  | "sound"
  | "avatar"
  | null;

const GAME_LIST = [
  {
    id: "quiz" as GameId,
    emoji: "❓",
    title: "क्विज़",
    desc: "सवालों का जवाब दो, coins कमाओ",
  },
  {
    id: "coin" as GameId,
    emoji: "🪙",
    title: "सिक्का उछालें",
    desc: "Heads या Tails — 2 coins bet",
  },
  {
    id: "spin" as GameId,
    emoji: "🎡",
    title: "भाग्य चक्र",
    desc: "5 coins में किस्मत आजमाएं",
  },
  {
    id: "treasure" as GameId,
    emoji: "🏺",
    title: "खज़ाना ढूंढो",
    desc: "9 tiles में छुपा है खज़ाना",
  },
  {
    id: "gift" as GameId,
    emoji: "🎁",
    title: "Gift Box",
    desc: "हर घंटे एक free gift!",
  },
  {
    id: "sound" as GameId,
    emoji: "🔊",
    title: "Soundboard",
    desc: "शाही आवाज़ें बजाओ",
  },
  {
    id: "avatar" as GameId,
    emoji: "🎭",
    title: "Avatar Maker",
    desc: "अपना अवतार बनाओ",
  },
];

interface GamesPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function GamesPanel({ open, onClose }: GamesPanelProps) {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const wallet = getWallet();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="games-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="games-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-[110] bg-card flex flex-col"
            style={{ height: "100dvh" }}
            data-ocid="games.panel"
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎮</span>
                <h2 className="font-bold text-base text-foreground">Games</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 font-bold text-sm">
                  {wallet.coins} 🪙
                </span>
                <button
                  type="button"
                  onClick={activeGame ? () => setActiveGame(null) : onClose}
                  data-ocid="games.close_button"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg"
                >
                  {activeGame ? "←" : "✕"}
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-4 py-4">
                <AnimatePresence mode="wait">
                  {!activeGame ? (
                    <motion.div
                      key="game-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      {GAME_LIST.map((g) => (
                        <motion.button
                          key={g.id}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveGame(g.id)}
                          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/40 border border-border hover:border-primary transition-all text-center"
                          data-ocid={`games.${g.id}.button`}
                        >
                          <span className="text-4xl">{g.emoji}</span>
                          <p className="font-bold text-sm text-foreground">
                            {g.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {g.desc}
                          </p>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeGame}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {activeGame === "quiz" && (
                        <QuizGame onBack={() => setActiveGame(null)} />
                      )}
                      {activeGame === "coin" && (
                        <CoinTossGame onBack={() => setActiveGame(null)} />
                      )}
                      {activeGame === "spin" && (
                        <LuckySpinGame onBack={() => setActiveGame(null)} />
                      )}
                      {activeGame === "treasure" && (
                        <TreasureHunt onBack={() => setActiveGame(null)} />
                      )}
                      {activeGame === "gift" && (
                        <GiftBoxGame onBack={() => setActiveGame(null)} />
                      )}
                      {activeGame === "sound" && (
                        <Soundboard onBack={() => setActiveGame(null)} />
                      )}
                      {activeGame === "avatar" && (
                        <AvatarMaker onBack={() => setActiveGame(null)} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
