import { useUserLevel } from "../hooks/useUserLevel";

const TIER_STYLES: Record<number, string> = {
  1: "bg-green-100 text-green-700 border border-green-200",
  2: "bg-blue-100 text-blue-700 border border-blue-200",
  3: "bg-amber-100 text-amber-700 border border-amber-300",
  4: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border border-yellow-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.5)] font-extrabold",
};

interface LevelBadgeProps {
  userId: string;
}

export default function LevelBadge({ userId }: LevelBadgeProps) {
  const { title, tier } = useUserLevel(userId);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${TIER_STYLES[tier] ?? TIER_STYLES[1]}`}
    >
      {title}
    </span>
  );
}
