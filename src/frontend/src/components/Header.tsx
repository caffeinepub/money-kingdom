import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useLanguage } from "../utils/i18n";

interface HeaderProps {
  onOpenChat?: () => void;
  onOpenNotifications?: () => void;
}

export default function Header({ onOpenNotifications }: HeaderProps) {
  const { unreadCount } = useNotifications();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-border shadow-sm header-shimmer">
      <div className="max-w-[1280px] mx-auto w-full px-3 flex items-center gap-2 h-12">
        {/* Brand */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-block coin-spin text-base" aria-hidden="true">
            💰
          </span>
          <span className="font-black text-base tracking-tight gold-shimmer-text">
            Money Kingdom
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60" />
          <Input
            className="pl-8 bg-white/20 border-none rounded-full text-sm h-8 text-white placeholder:text-white/60 focus-visible:ring-white/50"
            placeholder={`${t("search")}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="header.search_input"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className={`shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center relative${
            unreadCount > 0 ? " bell-glow bell-wiggle" : ""
          }`}
          data-ocid="header.notifications.button"
          aria-label={t("notifications")}
        >
          <Bell className="w-4 h-4 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-none">
              {unreadCount}
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
}
