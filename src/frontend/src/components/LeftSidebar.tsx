import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Crown,
  Home,
  Target,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "होम", id: "home" },
  { icon: User, label: "प्रोफ़ाइल", id: "profile" },
  { icon: Users, label: "मित्र", id: "friends" },
  { icon: Target, label: "लक्ष्य", id: "goals" },
  { icon: Bell, label: "सूचनाएं", id: "notifications" },
  { icon: TrendingUp, label: "ट्रेंड्स", id: "trends" },
];

export default function LeftSidebar() {
  const [active, setActive] = useState("home");

  return (
    <div className="sticky top-16 flex flex-col gap-2">
      {/* Nav */}
      <nav className="bg-card rounded-xl shadow-card border border-border p-2 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActive(item.id)}
            data-ocid={`nav.${item.id === "home" ? "link" : "link"}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-full text-left ${
              active === item.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.id === "notifications" && (
              <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                3
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Profile summary */}
      <div className="bg-card rounded-xl shadow-card border border-border p-3 flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
            AB
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-xs text-foreground">Alex B.</p>
          <p className="text-[11px] text-muted-foreground">523 मित्र</p>
        </div>
        <Crown className="w-3.5 h-3.5 text-yellow-500 ml-auto" />
      </div>
    </div>
  );
}
