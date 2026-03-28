import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useNotifications } from "../hooks/useNotifications";

interface HeaderProps {
  onOpenChat?: () => void;
  onOpenNotifications?: () => void;
}

export default function Header({ onOpenNotifications }: HeaderProps) {
  const { identity } = useInternetIdentity();
  const { unreadCount } = useNotifications();
  const [search, setSearch] = useState("");
  const principal = identity?.getPrincipal().toString();
  const shortName = principal ? principal.slice(0, 8) : "PPK";

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-[1280px] mx-auto w-full px-3 flex items-center gap-4 h-28">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/uploads/1774687973872-019d33a6-946f-737e-8d66-ae825605513d-1.png"
            alt="Crown"
            className="w-20 h-20"
          />
          <span className="font-black text-3xl text-foreground hidden sm:block">
            Money Kingdom
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <Input
            className="pl-12 bg-muted border-none rounded-full text-xl h-16"
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
          className="shrink-0 w-16 h-16 rounded-full bg-muted hover:bg-accent transition-colors flex items-center justify-center relative"
          data-ocid="header.notifications.button"
          aria-label="नोटिफ़िकेशन"
        >
          <Bell className="w-9 h-9 text-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-6 h-6 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground border-none">
              {unreadCount}
            </Badge>
          )}
        </button>

        {/* User avatar */}
        <div className="shrink-0">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-base font-semibold">
              {identity ? shortName.slice(0, 2).toUpperCase() : "PP"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
