import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Home,
  MessageCircle,
  Search,
  User,
  Video,
  Wallet,
} from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

type View = "home" | "search" | "videos" | "notifications" | "profile";

interface BottomNavProps {
  activeTab: View;
  onNavigate: (view: View) => void;
  onOpenChat?: () => void;
  onOpenWallet?: () => void;
}

export default function BottomNav({
  activeTab,
  onNavigate,
  onOpenChat,
  onOpenWallet,
}: BottomNavProps) {
  const { unreadCount } = useNotifications();

  const tabs = [
    { id: "home" as View, icon: Home, label: "होम" },
    { id: "search" as View, icon: Search, label: "खोजें" },
    { id: "videos" as View, icon: Video, label: "वीडियो" },
    {
      id: "notifications" as View,
      icon: Bell,
      label: "नोटिफ़",
      badge: unreadCount,
    },
    { id: "profile" as View, icon: User, label: "प्रोफ़ाइल" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-stretch h-14">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`bottomnav.${tab.id}`}
          >
            <div className="relative">
              <tab.icon
                className="w-5 h-5"
                strokeWidth={activeTab === tab.id ? 2.5 : 1.8}
              />
              {tab.badge != null && tab.badge > 0 && (
                <Badge className="absolute -top-1.5 -right-2 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground border-none">
                  {tab.badge}
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none">
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}

        {/* Chat button */}
        <button
          type="button"
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors text-muted-foreground hover:text-primary"
          data-ocid="bottomnav.travel_chat.button"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium leading-none">चैट</span>
        </button>

        {/* Wallet button */}
        <button
          type="button"
          onClick={onOpenWallet}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors text-muted-foreground hover:text-amber-600"
          data-ocid="bottomnav.wallet.button"
        >
          <Wallet className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium leading-none">वॉलेट</span>
        </button>
      </div>
    </nav>
  );
}
