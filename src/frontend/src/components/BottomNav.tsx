import { Badge } from "@/components/ui/badge";
import { Home, MessageCircle, ShoppingBag, User, Video } from "lucide-react";

export type View =
  | "home"
  | "reels"
  | "marketplace"
  | "notifications"
  | "profile";

interface BottomNavProps {
  activeTab: View;
  onNavigate: (view: View) => void;
  onOpenChat?: () => void;
}

export default function BottomNav({
  activeTab,
  onNavigate,
  onOpenChat,
}: BottomNavProps) {
  const tabs = [
    { id: "home" as View, icon: Home, label: "होम" },
    { id: "marketplace" as View, icon: ShoppingBag, label: "बाज़ार" },
    { id: "reels" as View, icon: Video, label: "रील्स" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-stretch h-40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-colors relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`bottomnav.${tab.id}.link`}
          >
            {activeTab === tab.id && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
            )}
            <tab.icon
              className="w-14 h-14"
              strokeWidth={activeTab === tab.id ? 2.5 : 1.8}
            />
            <span className="text-2xl font-bold leading-none">{tab.label}</span>
          </button>
        ))}

        {/* Chat button */}
        <button
          type="button"
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center gap-1.5 flex-1 transition-colors text-muted-foreground hover:text-primary"
          data-ocid="bottomnav.chat.button"
        >
          <MessageCircle className="w-14 h-14" strokeWidth={1.8} />
          <span className="text-2xl font-bold leading-none">चैट</span>
        </button>

        {/* Profile button - far right corner */}
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-colors relative ${
            activeTab === "profile"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="bottomnav.profile.link"
        >
          {activeTab === "profile" && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
          )}
          <User
            className="w-14 h-14"
            strokeWidth={activeTab === "profile" ? 2.5 : 1.8}
          />
          <span className="text-2xl font-bold leading-none">प्रोफ़ाइल</span>
        </button>
      </div>
    </nav>
  );
}
