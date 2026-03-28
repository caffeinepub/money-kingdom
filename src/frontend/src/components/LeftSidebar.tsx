import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFollowers } from "@/hooks/useFollowers";
import {
  Bell,
  Crown,
  Home,
  MessageCircle,
  Target,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

type View = "home" | "profile";

const navItems = [
  { icon: Home, label: "होम", id: "home" },
  { icon: User, label: "प्रोफ़ाइल", id: "profile" },
  { icon: Users, label: "मित्र", id: "friends" },
  { icon: Target, label: "लक्ष्य", id: "goals" },
  { icon: Bell, label: "सूचनाएं", id: "notifications" },
  { icon: TrendingUp, label: "ट्रेंड्स", id: "trends" },
];

interface LeftSidebarProps {
  onNavigate?: (view: View) => void;
  onOpenChat?: () => void;
}

export default function LeftSidebar({
  onNavigate,
  onOpenChat,
}: LeftSidebarProps) {
  const [active, setActive] = useState("home");
  const { followingCount } = useFollowers("PPK");

  const handleNav = (id: string) => {
    setActive(id);
    if (id === "home" || id === "profile") {
      onNavigate?.(id as View);
    }
  };

  return (
    <div className="sticky top-16 flex flex-col gap-2">
      {/* Nav */}
      <nav className="bg-card rounded-xl shadow-card border border-border p-2 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => handleNav(item.id)}
            data-ocid={`nav.${item.id}.link`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-full text-left ${
              active === item.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Profile summary */}
      <div className="bg-card rounded-xl shadow-card border border-border p-3 flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
            PPK
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-xs text-foreground">प्रिंस पवन कुमार</p>
          <p className="text-[11px] text-muted-foreground">
            {followingCount} फॉलोइंग
          </p>
        </div>
        <Crown className="w-3.5 h-3.5 text-yellow-500 ml-auto" />
      </div>

      {/* Space Station section */}
      <div className="bg-card rounded-xl shadow-card border border-border p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-base">🚀</span>
          <p className="font-bold text-xs text-foreground">स्पेस स्टेशन</p>
        </div>
        <button
          type="button"
          onClick={onOpenChat}
          data-ocid="nav.travel_chat.button"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors w-full text-left"
        >
          <MessageCircle className="w-4 h-4" />
          यात्रा चैट
        </button>
      </div>
    </div>
  );
}
