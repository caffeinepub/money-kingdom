const BALANCE_KEY = (user: string) => `wallet_${user}`;

const TIERS = [
  { min: 0, max: 99, title: "नया सदस्य 🌱", tier: 1 },
  { min: 100, max: 499, title: "व्यापारी 💼", tier: 2 },
  { min: 500, max: 1999, title: "करोड़पति 💰", tier: 3 },
  { min: 2000, max: Number.POSITIVE_INFINITY, title: "वित्त राजा 👑", tier: 4 },
];

export function useUserLevel(userId: string): { title: string; tier: number } {
  const raw = localStorage.getItem(BALANCE_KEY(userId));
  const balance = raw ? Number.parseFloat(raw) : 0;

  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (balance >= TIERS[i].min) {
      return { title: TIERS[i].title, tier: TIERS[i].tier };
    }
  }
  return { title: TIERS[0].title, tier: 1 };
}
