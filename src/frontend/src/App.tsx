import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import MainLayout from "./components/MainLayout";
import MoneyRain from "./components/MoneyRain";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useSessionTimer } from "./hooks/useSessionTimer";

const queryClient = new QueryClient();

function SessionSummaryDialog({
  minutes,
  onClose,
}: { minutes: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full text-center border border-border">
        <div className="text-4xl mb-3">⏱️</div>
        <h2 className="text-lg font-bold text-foreground mb-2">सत्र सारांश</h2>
        <p className="text-muted-foreground text-sm mb-4">
          आपने इस बार{" "}
          <span className="text-primary font-bold text-base">
            {minutes} मिनट
          </span>{" "}
          Money Kingdom पर बिताए!
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold text-sm hover:opacity-90 transition"
        >
          ठीक है
        </button>
      </div>
    </div>
  );
}

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const [guestMode, setGuestMode] = useState(false);
  const { showSummary, lastDuration, dismissSummary } = useSessionTimer();

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-background gap-4"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Faint rain behind */}
        <MoneyRain />
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Spinning coin */}
          <span className="coin-spin text-6xl" aria-hidden="true">
            💰
          </span>
          {/* Brand text */}
          <span className="text-4xl font-black gold-shimmer-text">
            Money Kingdom
          </span>
          {/* Tagline */}
          <p
            className="text-base italic text-muted-foreground"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            आपका वित्तीय साम्राज्य...
          </p>
          {/* Shimmer progress bar */}
          <div
            className="w-48 h-1.5 rounded-full overflow-hidden mt-2"
            style={{ background: "oklch(0.86 0.03 68)" }}
          >
            <div className="h-full loading-shimmer-bar rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!identity && !guestMode) {
    return <LoginPage onGuestMode={() => setGuestMode(true)} />;
  }

  return (
    <>
      <MoneyRain />
      <MainLayout />
      {showSummary && (
        <SessionSummaryDialog minutes={lastDuration} onClose={dismissSummary} />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster />
    </QueryClientProvider>
  );
}
