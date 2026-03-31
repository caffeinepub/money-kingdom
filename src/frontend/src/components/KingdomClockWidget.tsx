import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface KingdomClockWidgetProps {
  onNavigateProfile: () => void;
  onOpenWallet: () => void;
  onOpenSettings: () => void;
}

const TICK_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);

export default function KingdomClockWidget({
  onNavigateProfile,
  onOpenWallet,
  onOpenSettings,
}: KingdomClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours() % 12;
  const m = time.getMinutes();
  const s = time.getSeconds();

  const secondAngle = s * 6;
  const minuteAngle = m * 6 + s * 0.1;
  const hourAngle = h * 30 + m * 0.5;

  const SIZE = 130;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = SIZE / 2 - 8;

  const handEnd = (angleDeg: number, length: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + length * Math.cos(rad),
      y: cy + length * Math.sin(rad),
    };
  };

  const hourEnd = handEnd(hourAngle, R - 24);
  const minuteEnd = handEnd(minuteAngle, R - 14);
  const secondEnd = handEnd(secondAngle, R - 8);
  const secondTail = handEnd(secondAngle + 180, 12);

  const btnCls =
    "text-[10px] font-extrabold rounded-full px-2.5 py-0.5 leading-tight select-none transition-all";
  const btnStyle = {
    background: "oklch(0.68 0.14 58)",
    color: "oklch(0.15 0.04 40)",
    boxShadow: "0 1px 4px oklch(0.45 0.10 55 / 0.35)",
  };

  return (
    <div className="flex flex-col items-center gap-0 py-2 select-none">
      {/* 12 o'clock — Profile */}
      <motion.button
        type="button"
        onClick={onNavigateProfile}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className={btnCls}
        style={btnStyle}
        data-ocid="clock.profile.button"
      >
        👤 Profile
      </motion.button>

      {/* Middle row: Settings | Clock | Wallet */}
      <div className="flex items-center gap-2 my-1.5">
        {/* 9 o'clock — Settings */}
        <motion.button
          type="button"
          onClick={onOpenSettings}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={btnCls}
          style={btnStyle}
          data-ocid="clock.settings.button"
        >
          ⚙️ Settings
        </motion.button>

        {/* Analog Clock SVG */}
        <div className="relative">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-labelledby="clock-title"
          >
            <title id="clock-title">Money Kingdom Clock</title>
            {/* Outer glow ring */}
            <circle
              cx={cx}
              cy={cy}
              r={R + 6}
              fill="oklch(0.20 0.04 48)"
              stroke="oklch(0.66 0.15 58)"
              strokeWidth="2"
            />
            {/* Clock face */}
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="oklch(0.24 0.04 46)"
              stroke="oklch(0.56 0.10 54)"
              strokeWidth="1.5"
            />
            {/* Hour tick marks */}
            {TICK_ANGLES.map((angle) => {
              const a = ((angle - 90) * Math.PI) / 180;
              const isMain = angle % 90 === 0;
              const len = isMain ? 9 : 5;
              const x1 = cx + (R - 3) * Math.cos(a);
              const y1 = cy + (R - 3) * Math.sin(a);
              const x2 = cx + (R - 3 - len) * Math.cos(a);
              const y2 = cy + (R - 3 - len) * Math.sin(a);
              return (
                <line
                  key={`tick-${angle}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    isMain ? "oklch(0.80 0.16 62)" : "oklch(0.50 0.06 52)"
                  }
                  strokeWidth={isMain ? "2" : "1"}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Hour hand */}
            <line
              x1={cx}
              y1={cy}
              x2={hourEnd.x}
              y2={hourEnd.y}
              stroke="oklch(0.84 0.16 62)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Minute hand */}
            <line
              x1={cx}
              y1={cy}
              x2={minuteEnd.x}
              y2={minuteEnd.y}
              stroke="oklch(0.90 0.12 68)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Second hand */}
            <line
              x1={secondTail.x}
              y1={secondTail.y}
              x2={secondEnd.x}
              y2={secondEnd.y}
              stroke="oklch(0.65 0.22 40)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Center dot */}
            <circle cx={cx} cy={cy} r="3.5" fill="oklch(0.76 0.18 60)" />
            {/* Crown above center */}
            <text
              x={cx}
              y={cy - 14}
              textAnchor="middle"
              fontSize="10"
              fill="oklch(0.80 0.14 60)"
            >
              👑
            </text>
          </svg>
        </div>

        {/* 3 o'clock — Wallet */}
        <motion.button
          type="button"
          onClick={onOpenWallet}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={btnCls}
          style={btnStyle}
          data-ocid="clock.wallet.button"
        >
          💰 Wallet
        </motion.button>
      </div>

      {/* 6 o'clock — Home (decorative) */}
      <div
        className="text-[10px] font-bold rounded-full px-2.5 py-0.5 leading-tight"
        style={{
          background: "oklch(0.32 0.04 50)",
          color: "oklch(0.78 0.08 60)",
        }}
      >
        🏠 Home
      </div>

      {/* Gold shimmer title */}
      <p
        className="mt-2 text-[11px] font-black tracking-widest uppercase"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.68 0.16 54), oklch(0.88 0.20 66), oklch(0.68 0.16 54))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Money Kingdom
      </p>
    </div>
  );
}
