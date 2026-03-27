import { useState } from "react";
import {
  NotificationsContext,
  useNotificationsState,
} from "../hooks/useNotifications";
import BottomNav from "./BottomNav";
import CenterFeed from "./CenterFeed";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import NotificationsPanel from "./NotificationsPanel";
import ProfilePage from "./ProfilePage";
import RightSidebar from "./RightSidebar";

type View = "home" | "search" | "videos" | "notifications" | "profile";

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const notificationsValue = useNotificationsState();

  const handleNavigate = (view: View) => {
    if (view === "notifications") {
      setNotifOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <NotificationsContext.Provider value={notificationsValue}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-[1280px] mx-auto w-full px-0 sm:px-3 py-3 pb-20 grid grid-cols-1 lg:grid-cols-[240px_1fr_260px] gap-3">
          <aside className="hidden lg:block">
            <LeftSidebar onNavigate={(v) => setCurrentView(v as View)} />
          </aside>
          <main className="min-w-0">
            {currentView === "profile" ? (
              <ProfilePage onBack={() => setCurrentView("home")} />
            ) : (
              <CenterFeed />
            )}
          </main>
          <aside className="hidden lg:block">
            <RightSidebar />
          </aside>
        </div>

        {/* Instagram-style bottom navigation */}
        <BottomNav activeTab={currentView} onNavigate={handleNavigate} />

        {/* Notifications panel */}
        <NotificationsPanel
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        />
      </div>
    </NotificationsContext.Provider>
  );
}
