import { useEffect, useState } from "react";

const SESSION_START_KEY = "mk_session_start";
const LAST_DURATION_KEY = "mk_last_duration";

export function useSessionTimer() {
  const [showSummary, setShowSummary] = useState(false);
  const [lastDuration, setLastDuration] = useState(0);

  useEffect(() => {
    // Check if there's a duration from last session
    const saved = localStorage.getItem(LAST_DURATION_KEY);
    if (saved) {
      const mins = Math.round(Number.parseInt(saved) / 60000);
      if (mins >= 1) {
        setLastDuration(mins);
        setShowSummary(true);
      }
      localStorage.removeItem(LAST_DURATION_KEY);
    }

    // Start new session
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());

    const saveDuration = () => {
      const start = localStorage.getItem(SESSION_START_KEY);
      if (start) {
        const duration = Date.now() - Number.parseInt(start);
        if (duration > 30000) {
          // at least 30 seconds
          localStorage.setItem(LAST_DURATION_KEY, duration.toString());
        }
        localStorage.removeItem(SESSION_START_KEY);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveDuration();
      } else if (document.visibilityState === "visible") {
        // Resumed — check if we saved a duration
        const saved = localStorage.getItem(LAST_DURATION_KEY);
        if (saved) {
          const mins = Math.round(Number.parseInt(saved) / 60000);
          if (mins >= 1) {
            setLastDuration(mins);
            setShowSummary(true);
          }
          localStorage.removeItem(LAST_DURATION_KEY);
        }
        // Restart session
        localStorage.setItem(SESSION_START_KEY, Date.now().toString());
      }
    };

    const handleBeforeUnload = () => {
      saveDuration();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      saveDuration();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    showSummary,
    lastDuration,
    dismissSummary: () => setShowSummary(false),
  };
}
