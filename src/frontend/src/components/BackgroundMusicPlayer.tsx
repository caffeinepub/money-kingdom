import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const NOTES = [261.63, 293.66, 329.63, 349.23, 392.0];
const NOTE_DURATION = 0.4;
const VOLUME = 0.15;
const MUSIC_KEY = "mk_music_playing";

function playNote(ctx: AudioContext, freq: number, startTime: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(VOLUME, startTime + 0.05);
  gain.gain.linearRampToValueAtTime(VOLUME, startTime + NOTE_DURATION - 0.06);
  gain.gain.linearRampToValueAtTime(0, startTime + NOTE_DURATION);
  osc.start(startTime);
  osc.stop(startTime + NOTE_DURATION);
}

export default function BackgroundMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(
    () => localStorage.getItem(MUSIC_KEY) === "true",
  );
  const ctxRef = useRef<AudioContext | null>(null);
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);

  const scheduleLoop = (ctx: AudioContext) => {
    if (!playingRef.current) return;
    const now = ctx.currentTime;
    for (let i = 0; i < NOTES.length; i++) {
      playNote(ctx, NOTES[i], now + i * NOTE_DURATION);
    }
    const totalMs = NOTES.length * NOTE_DURATION * 1000;
    scheduleRef.current = setTimeout(() => scheduleLoop(ctx), totalMs);
  };

  const startMusic = () => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    playingRef.current = true;
    scheduleLoop(ctx);
  };

  const stopMusic = () => {
    playingRef.current = false;
    if (scheduleRef.current) {
      clearTimeout(scheduleRef.current);
      scheduleRef.current = null;
    }
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.suspend();
    }
  };

  const toggle = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    localStorage.setItem(MUSIC_KEY, String(next));
    if (next) {
      startMusic();
    } else {
      stopMusic();
    }
  };

  useEffect(() => {
    return () => {
      playingRef.current = false;
      if (scheduleRef.current) {
        clearTimeout(scheduleRef.current);
        scheduleRef.current = null;
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
      }
    };
  }, []);

  return (
    <div
      className="fixed bottom-16 left-3 pointer-events-none"
      style={{ zIndex: 45 }}
      data-ocid="music.panel"
    >
      <div
        className="pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5 shadow-lg border"
        style={{
          background: "oklch(0.22 0.04 50 / 0.92)",
          borderColor: "oklch(0.56 0.12 56)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Animated music icon */}
        <motion.span
          className="text-sm"
          animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={
            isPlaying ? { repeat: Number.POSITIVE_INFINITY, duration: 1.2 } : {}
          }
        >
          🎵
        </motion.span>

        <span
          className="text-[10px] font-semibold truncate max-w-[80px]"
          style={{ color: "oklch(0.82 0.10 64)" }}
        >
          MK Theme
        </span>

        <button
          type="button"
          onClick={toggle}
          className="w-6 h-6 flex items-center justify-center rounded-full transition-all"
          style={{
            background: isPlaying
              ? "oklch(0.68 0.14 58)"
              : "oklch(0.35 0.05 50)",
            color: isPlaying ? "oklch(0.15 0.04 40)" : "oklch(0.75 0.08 60)",
          }}
          aria-label={isPlaying ? "संगीत रोकें" : "संगीत चलाएं"}
          data-ocid="music.toggle"
        >
          <span className="text-[10px] font-black">
            {isPlaying ? "⏸" : "▶"}
          </span>
        </button>
      </div>
    </div>
  );
}
