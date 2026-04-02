import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import DustOverlay from "./components/DustOverlay";
import LoginPage from "./components/LoginPage";
import MainLayout from "./components/MainLayout";
import MidnightCleaner from "./components/MidnightCleaner";
import MoneyRain from "./components/MoneyRain";
import { useDarkMode } from "./hooks/useDarkMode";
import { useReminderNotification } from "./hooks/useReminderNotification";
import { useSessionTimer } from "./hooks/useSessionTimer";
import { useTheme } from "./hooks/useTheme";

const queryClient = new QueryClient();

function getStoredProfile(): {
  name: string;
  mobile: string;
  createdAt: string;
} | null {
  try {
    const raw = localStorage.getItem("mk_user_profile");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.name && parsed?.mobile) return parsed;
    return null;
  } catch {
    return null;
  }
}

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
  const hasProfile = Boolean(getStoredProfile());
  const [loggedIn, setLoggedIn] = useState(hasProfile);
  const { showSummary, lastDuration, dismissSummary } = useSessionTimer();
  const { showBanner, dismissBanner } = useReminderNotification();
  // Initialize dark mode on app start
  useDarkMode();
  // Initialize theme on app start (applies saved theme to CSS variables)
  useTheme();

  if (!loggedIn) {
    return (
      <LoginPage
        onGuestMode={() => setLoggedIn(true)}
        onRegistered={() => setLoggedIn(true)}
      />
    );
  }

  return (
    <>
      <MoneyRain />
      <DustOverlay />
      <MidnightCleaner />
      <div className="relative mx-1 my-1 rounded-lg overflow-hidden">
        <MainLayout
          showReminderBanner={showBanner}
          onDismissReminderBanner={dismissBanner}
        />
      </div>
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
