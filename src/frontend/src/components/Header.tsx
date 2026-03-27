import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { identity } = useInternetIdentity();
  const [search, setSearch] = useState("");
  const principal = identity?.getPrincipal().toString();
  const shortName = principal ? principal.slice(0, 8) : "PPK";

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-[1280px] mx-auto w-full px-3 flex items-center gap-3 h-12">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/crown-logo-transparent.dim_120x120.png"
            alt="Crown"
            className="w-8 h-8"
          />
          <span className="font-bold text-sm text-foreground hidden sm:block">
            Money Kingdom
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            className="pl-8 bg-muted border-none rounded-full text-xs h-8"
            placeholder="खोजें…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="header.search_input"
          />
        </div>

        {/* User avatar */}
        <div className="shrink-0">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
              {identity ? shortName.slice(0, 2).toUpperCase() : "PP"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
