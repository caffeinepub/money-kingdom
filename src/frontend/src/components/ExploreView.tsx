import { Input } from "@/components/ui/input";
import { Hash, Search } from "lucide-react";
import { useState } from "react";

const TRENDING_TAGS = [
  "#finance",
  "#money",
  "#investment",
  "#SIP",
  "#stocks",
  "#savings",
  "#crypto",
];

export default function ExploreView() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-4" data-ocid="explore.page">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <Input
          placeholder="खोजें…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-14 text-xl h-14 rounded-full"
          data-ocid="explore.search_input"
        />
      </div>

      {/* Trending hashtags */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-6 h-6 text-primary" />
          <span className="text-2xl font-black text-foreground">ट्रेंडिंग</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className="px-5 py-2.5 rounded-full bg-primary/10 text-primary font-bold text-xl hover:bg-primary/20 transition-colors"
              data-ocid="explore.tab"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Empty explore grid */}
      <div
        className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        data-ocid="explore.empty_state"
      >
        <div className="text-7xl">🔍</div>
        <p className="text-2xl font-bold text-foreground">अभी कोई पोस्ट नहीं</p>
        <p className="text-xl text-muted-foreground">पोस्ट होने पर यहाँ दिखेंगी</p>
      </div>
    </div>
  );
}
