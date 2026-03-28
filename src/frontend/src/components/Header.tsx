import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

interface HeaderProps {
  onOpenChat?: () => void;
  onOpenNotifications?: () => void;
}

export default function Header({ onOpenNotifications }: HeaderProps) {
  const { unreadCount } = useNotifications();
  const [search, setSearch] = useState("");

  return (
    <header
      className="sticky top-0 z-50 border-b border-border shadow-sm"
      style={{ background: "oklch(0.62 0.09 66)" }}
    >
      <div className="max-w-[1280px] mx-auto w-full px-3 flex items-center gap-3 h-20">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-black text-2xl text-white tracking-tight">
            Money Kingdom
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            className="pl-11 bg-white/20 border-none rounded-full text-lg h-12 text-white placeholder:text-white/60 focus-visible:ring-white/50"
            placeholder="खोजें…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="header.search_input"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="shrink-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center relative"
          data-ocid="header.notifications.button"
          aria-label="नोटिफ़िकेशन"
        >
          <Bell className="w-7 h-7 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-none">
              {unreadCount}
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
}
