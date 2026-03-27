import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, Bookmark, ChevronDown, Crown, Search } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { clear, identity } = useInternetIdentity();
  const [search, setSearch] = useState("");
  const principal = identity?.getPrincipal().toString();
  const shortName = principal ? principal.slice(0, 8) : "Alex B.";

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs h-16 flex items-center">
      <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/crown-logo-transparent.dim_120x120.png"
            alt="Crown"
            className="w-8 h-8"
          />
          <span className="font-bold text-lg text-foreground hidden sm:block">
            Money Kingdom
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-muted border-none rounded-full text-sm"
            placeholder="मित्र, टिप्स खोजें…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="header.search_input"
          />
        </div>

        <div className="flex-1" />

        {/* Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
            data-ocid="header.button"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-none">
              3
            </Badge>
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            data-ocid="header.button"
          >
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
                data-ocid="header.dropdown_menu"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {shortName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:block max-w-[80px] truncate">
                  {identity ? shortName : "Alex Bennett"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>प्रोफ़ाइल</DropdownMenuItem>
              <DropdownMenuItem>सेटिंग्स</DropdownMenuItem>
              {identity && (
                <DropdownMenuItem onClick={clear} className="text-destructive">
                  लॉगआउट
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
