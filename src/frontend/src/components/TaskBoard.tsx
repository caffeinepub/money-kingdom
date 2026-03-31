import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

const TASKS_KEY = () => `mk_daily_tasks_${todayKey()}`;
const COINS_KEY = "mk_daily_coins";

interface DailyCoins {
  date: string;
  total: number;
}

function loadCompletedTasks(): string[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCompletedTasks(tasks: string[]) {
  try {
    localStorage.setItem(TASKS_KEY(), JSON.stringify(tasks));
  } catch {}
}

function loadCoins(): number {
  try {
    const raw = localStorage.getItem(COINS_KEY);
    if (!raw) return 0;
    const parsed: DailyCoins = JSON.parse(raw);
    return parsed.date === todayKey() ? parsed.total : 0;
  } catch {
    return 0;
  }
}

function saveCoins(total: number) {
  try {
    localStorage.setItem(
      COINS_KEY,
      JSON.stringify({ date: todayKey(), total }),
    );
  } catch {}
}

function hasTodayPost(): boolean {
  try {
    const raw = localStorage.getItem("mk_all_posts");
    if (!raw) return false;
    const posts: Array<{ createdAt: number }> = JSON.parse(raw);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return posts.some((p) => p.createdAt >= todayStart.getTime());
  } catch {
    return false;
  }
}

const TASK_DEFS = [
  { id: "login", label: "आज लॉगिन किया", coins: 5, icon: "✅", auto: true },
  { id: "post", label: "एक पोस्ट डालो", coins: 10, icon: "📸", auto: false },
  {
    id: "follow",
    label: "किसी को follow करो",
    coins: 5,
    icon: "👥",
    auto: false,
  },
  { id: "spin", label: "भाग्य चक्र घुमाओ", coins: 2, icon: "🎡", auto: false },
];

export default function TaskBoard() {
  const [completed, setCompleted] = useState<string[]>(loadCompletedTasks);
  const [coins, setCoins] = useState(loadCoins);

  // Auto-complete login task on mount — runs once, uses functional updates
  useEffect(() => {
    setCompleted((prev) => {
      if (prev.includes("login")) return prev;
      const next = [...prev, "login"];
      saveCompletedTasks(next);
      setCoins((c) => {
        const newCoins = c + 5;
        saveCoins(newCoins);
        return newCoins;
      });
      return next;
    });
  }, []);

  // Auto-complete post task if there's a post today
  useEffect(() => {
    if (!hasTodayPost()) return;
    setCompleted((prev) => {
      if (prev.includes("post")) return prev;
      const next = [...prev, "post"];
      saveCompletedTasks(next);
      setCoins((c) => {
        const newCoins = c + 10;
        saveCoins(newCoins);
        return newCoins;
      });
      return next;
    });
  }, []);

  const claimTask = (taskId: string, taskCoins: number) => {
    if (completed.includes(taskId)) return;
    const newCompleted = [...completed, taskId];
    setCompleted(newCompleted);
    saveCompletedTasks(newCompleted);
    const newCoins = coins + taskCoins;
    setCoins(newCoins);
    saveCoins(newCoins);
    toast.success(`+${taskCoins} 🪙 कमाए!`);
  };

  return (
    <div
      className="rounded-xl p-3 border"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.90 0.05 60), oklch(0.96 0.03 66))",
        borderColor: "oklch(0.74 0.12 60)",
      }}
      data-ocid="taskboard.card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-black"
          style={{ color: "oklch(0.30 0.06 44)" }}
        >
          🏆 आज के काम
        </span>
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{
            background: "oklch(0.68 0.14 58)",
            color: "oklch(0.15 0.04 40)",
          }}
        >
          <span className="text-[11px] font-black">🪙 {coins}</span>
        </div>
      </div>

      {/* Tasks list */}
      <div className="flex flex-col gap-1.5">
        {TASK_DEFS.map((task) => {
          const done = completed.includes(task.id);
          return (
            <motion.div
              key={task.id}
              layout
              className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5"
              style={{
                background: done
                  ? "oklch(0.78 0.08 60 / 0.4)"
                  : "oklch(1 0 0 / 0.6)",
                opacity: done ? 0.75 : 1,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm shrink-0">
                  {done ? "✅" : task.icon}
                </span>
                <span
                  className="text-xs font-semibold truncate"
                  style={{
                    color: done ? "oklch(0.45 0.06 52)" : "oklch(0.28 0.05 44)",
                    textDecoration: done ? "line-through" : "none",
                  }}
                >
                  {task.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "oklch(0.52 0.14 56)" }}
                >
                  +{task.coins} 🪙
                </span>
                {!done && !task.auto && (
                  <Button
                    size="sm"
                    className="h-6 text-[10px] px-2 rounded-full font-bold"
                    style={{
                      background: "oklch(0.64 0.14 56)",
                      color: "oklch(0.98 0.01 72)",
                    }}
                    onClick={() => claimTask(task.id, task.coins)}
                    data-ocid={`taskboard.${task.id}.button`}
                  >
                    दावा करें
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
