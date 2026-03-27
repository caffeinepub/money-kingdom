import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import MainLayout from "./components/MainLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

const queryClient = new QueryClient();

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const [guestMode, setGuestMode] = useState(false);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/generated/crown-logo-transparent.dim_120x120.png"
            alt="Money Kingdom"
            className="w-12 h-12 animate-pulse"
          />
          <p className="text-muted-foreground text-sm">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!identity && !guestMode) {
    return <LoginPage onGuestMode={() => setGuestMode(true)} />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster />
    </QueryClientProvider>
  );
}
