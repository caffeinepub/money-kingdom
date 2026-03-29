import { Badge } from "@/components/ui/badge";
import { Home, MessageCircle, ShoppingBag, User, Video } from "lucide-react";
import { useLanguage } from "../utils/i18n";

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
  const { t } = useLanguage();
  const tabs = [
    { id: "home" as View, icon: Home, label: t("home") },
    { id: "marketplace" as View, icon: ShoppingBag, label: t("bazaar") },
    { id: "reels" as View, icon: Video, label: t("reels") },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-stretch h-40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-all duration-300 relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`bottomnav.${tab.id}.link`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
              )}
              <span
                className={`transition-transform duration-300 ${
                  isActive ? "tab-active-bounce scale-125" : ""
                }`}
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 8px oklch(0.62 0.09 66 / 0.8))"
                    : undefined,
                }}
              >
                <tab.icon
                  className="w-14 h-14"
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </span>
              {isActive && (
                <span
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full"
                  style={{
                    background: "oklch(0.62 0.09 66 / 0.25)",
                    boxShadow: "0 0 12px 4px oklch(0.62 0.09 66 / 0.4)",
                    filter: "blur(2px)",
                  }}
                />
              )}
              <span className="text-2xl font-bold leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Chat button */}
        <button
          type="button"
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center gap-1.5 flex-1 transition-all duration-300 text-muted-foreground hover:text-primary"
          data-ocid="bottomnav.chat.button"
        >
          <MessageCircle className="w-14 h-14" strokeWidth={1.8} />
          <span className="text-2xl font-bold leading-none">{t("chat")}</span>
        </button>

        {/* Profile button - far right corner */}
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className={`flex flex-col items-center justify-center gap-1.5 flex-1 transition-all duration-300 relative ${
            activeTab === "profile"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="bottomnav.profile.link"
        >
          {activeTab === "profile" && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
          )}
          <span
            className={`transition-transform duration-300 ${
              activeTab === "profile" ? "tab-active-bounce scale-125" : ""
            }`}
            style={{
              filter:
                activeTab === "profile"
                  ? "drop-shadow(0 0 8px oklch(0.62 0.09 66 / 0.8))"
                  : undefined,
            }}
          >
            <User
              className="w-14 h-14"
              strokeWidth={activeTab === "profile" ? 2.5 : 1.8}
            />
          </span>
          {activeTab === "profile" && (
            <span
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full"
              style={{
                background: "oklch(0.62 0.09 66 / 0.25)",
                boxShadow: "0 0 12px 4px oklch(0.62 0.09 66 / 0.4)",
                filter: "blur(2px)",
              }}
            />
          )}
          <span className="text-2xl font-bold leading-none">
            {t("profile")}
          </span>
        </button>
      </div>
    </nav>
  );
}
