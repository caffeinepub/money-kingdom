import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "mk_dust_session_start";
export const LAST_CLEAN_KEY = "mk_last_midnight_clean";

function getMaxDustMinutes(): number {
  const intensity = localStorage.getItem("mk_dust_intensity") ?? "medium";
  if (intensity === "slow") return 120;
  if (intensity === "fast") return 20;
  return 60; // medium default
}

function getSessionStart(): number {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) return Number.parseInt(stored, 10);
  const now = Date.now();
  localStorage.setItem(SESSION_KEY, String(now));
  return now;
}

export function resetDust() {
  localStorage.setItem(SESSION_KEY, String(Date.now()));
}

export default function DustOverlay() {
  const sessionStartRef = useRef<number>(getSessionStart());
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    function update() {
      const maxDust = getMaxDustMinutes();
      const elapsedMs = Date.now() - sessionStartRef.current;
      const elapsedMin = elapsedMs / 60000;
      const ratio = Math.min(elapsedMin / maxDust, 1);
      setOpacity(ratio * 0.72);
    }
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onReset() {
      sessionStartRef.current = Date.now();
      setOpacity(0);
    }
    window.addEventListener("mk_dust_reset", onReset);
    return () => window.removeEventListener("mk_dust_reset", onReset);
  }, []);

  if (opacity <= 0.01) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[90] pointer-events-none"
      style={{ opacity }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-16"
        style={{
          background:
            "linear-gradient(to bottom, rgba(101,67,33,0.85) 0%, transparent 100%)",
          filter: "url(#dust-noise)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background:
            "linear-gradient(to top, rgba(80,55,20,0.85) 0%, transparent 100%)",
          filter: "url(#dust-noise)",
        }}
      />
      <div
        className="absolute top-0 left-0 bottom-0 w-10"
        style={{
          background:
            "linear-gradient(to right, rgba(90,60,25,0.75) 0%, transparent 100%)",
          filter: "url(#dust-noise)",
        }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-10"
        style={{
          background:
            "linear-gradient(to left, rgba(90,60,25,0.75) 0%, transparent 100%)",
          filter: "url(#dust-noise)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-20 h-20"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(101,67,33,0.9) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-20 h-20"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(101,67,33,0.9) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-20 h-20"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(80,55,20,0.9) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-20 h-20"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(80,55,20,0.9) 0%, transparent 70%)",
        }}
      />
      {/* SVG noise filter */}
      <svg
        width="0"
        height="0"
        className="absolute"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <filter id="dust-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grey"
            />
            <feComposite in="SourceGraphic" in2="grey" operator="multiply" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
