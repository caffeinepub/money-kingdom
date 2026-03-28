import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, Search, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  seller: string;
  description: string;
}

const CATEGORIES = ["सब", "इलेक्ट्रॉनिक्स", "कपड़े", "फर्नीचर", "गाड़ी", "अन्य"];

export default function MarketplaceView() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState("सब");
  const [search, setSearch] = useState("");
  const [sellOpen, setSellOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newDesc, setNewDesc] = useState("");

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "सब" || item.category === activeCategory;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSell = () => {
    if (!newTitle.trim() || !newPrice.trim()) {
      toast.error("नाम और कीमत भरें");
      return;
    }
    const item: Item = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      price: Number(newPrice),
      location: newLocation.trim() || "भारत",
      category: newCategory,
      seller: "Prince Pawan Kumar",
      description: newDesc.trim(),
    };
    setItems((prev) => [item, ...prev]);
    setNewTitle("");
    setNewPrice("");
    setNewLocation("");
    setNewDesc("");
    setSellOpen(false);
    toast.success("आइटम लिस्ट हो गया!");
  };

  return (
    <div className="flex flex-col gap-4" data-ocid="marketplace.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-foreground">बाज़ार 🛍️</h1>
        <Dialog open={sellOpen} onOpenChange={setSellOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground rounded-full text-xl font-black h-14 px-6 gap-2"
              data-ocid="marketplace.open_modal_button"
            >
              <Plus className="w-7 h-7" />
              बेचें
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="marketplace.dialog">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">आइटम बेचें</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="आइटम का नाम *"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-lg h-14"
                data-ocid="marketplace.input"
              />
              <Input
                placeholder="कीमत (₹) *"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="text-lg h-14"
                data-ocid="marketplace.input"
              />
              <Input
                placeholder="स्थान"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="text-lg h-14"
                data-ocid="marketplace.input"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border border-input rounded-md px-3 h-14 text-lg bg-background text-foreground"
                data-ocid="marketplace.select"
              >
                {CATEGORIES.filter((c) => c !== "सब").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Textarea
                placeholder="विवरण"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="text-lg"
                data-ocid="marketplace.textarea"
              />
              <Button
                onClick={handleSell}
                className="w-full text-xl font-black h-14"
                data-ocid="marketplace.submit_button"
              >
                लिस्ट करें
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
        <Input
          placeholder="बाज़ार में खोजें…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-14 text-xl h-14 rounded-full"
          data-ocid="marketplace.search_input"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-5 py-2 rounded-full text-xl font-bold transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
            data-ocid="marketplace.tab"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-4 text-center"
          data-ocid="marketplace.empty_state"
        >
          <div className="text-7xl">🛒</div>
          <p className="text-2xl font-bold text-foreground">अभी कोई आइटम नहीं</p>
          <p className="text-xl text-muted-foreground">
            "बेचें" बटन दबाकर पहला आइटम जोड़ें!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, idx) => (
            <Card
              key={item.id}
              className="shadow-card border-border overflow-hidden"
              data-ocid={`marketplace.item.${idx + 1}`}
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-muted flex items-center justify-center">
                <Tag className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardContent className="p-3 flex flex-col gap-1">
                <p className="text-lg font-black text-foreground line-clamp-2 leading-tight">
                  {item.title}
                </p>
                <p className="text-2xl font-black text-primary">
                  ₹{item.price}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-base truncate">{item.location}</span>
                </div>
                <Badge variant="secondary" className="w-fit text-sm">
                  {item.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
