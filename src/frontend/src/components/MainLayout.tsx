import { useState } from "react";
import {
  NotificationsContext,
  useNotificationsState,
} from "../hooks/useNotifications";
import type { View } from "./BottomNav";
import BottomNav from "./BottomNav";
import CenterFeed from "./CenterFeed";
import ExploreView from "./ExploreView";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import MarketplaceView from "./MarketplaceView";
import NotificationsPanel from "./NotificationsPanel";
import ProfilePage from "./ProfilePage";
import ReelsView from "./ReelsView";
import RightSidebar from "./RightSidebar";
import TravelChatPanel from "./TravelChatPanel";

interface MainLayoutProps {
  showReminderBanner?: boolean;
  onDismissReminderBanner?: () => void;
}

export default function MainLayout({
  showReminderBanner,
  onDismissReminderBanner,
}: MainLayoutProps) {
  const [currentView, setCurrentView] = useState<View>("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const notificationsValue = useNotificationsState();

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  if (currentView === "reels") {
    return (
      <NotificationsContext.Provider value={notificationsValue}>
        <ReelsView onBack={() => setCurrentView("home")} />
      </NotificationsContext.Provider>
    );
  }

  return (
    <NotificationsContext.Provider value={notificationsValue}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          onOpenChat={() => setChatOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
        />

        <div className="flex-1 max-w-[1280px] mx-auto w-full px-0 sm:px-3 py-2 pb-16 grid grid-cols-1 lg:grid-cols-[200px_1fr_220px] gap-3">
          <aside className="hidden lg:block">
            <LeftSidebar
              onNavigate={(v) => setCurrentView(v as View)}
              onOpenChat={() => setChatOpen(true)}
            />
          </aside>
          <main className="min-w-0">
            {currentView === "profile" && (
              <ProfilePage onBack={() => setCurrentView("home")} />
            )}
            {currentView === "marketplace" && <MarketplaceView />}
            {currentView === "home" && (
              <CenterFeed
                showReminderBanner={showReminderBanner}
                onDismissReminderBanner={onDismissReminderBanner}
              />
            )}
          </main>
          <aside className="hidden lg:block">
            {currentView === "home" && <RightSidebar />}
            {currentView === "marketplace" && <ExploreView />}
          </aside>
        </div>

        <BottomNav
          activeTab={currentView}
          onNavigate={handleNavigate}
          onOpenChat={() => setChatOpen(true)}
        />

        <NotificationsPanel
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
        />

        <TravelChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </NotificationsContext.Provider>
  );
}
