import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, MapPin, Plus, Search, Tag } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import MoneyExplosion from "./MoneyExplosion";

interface Item {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  seller: string;
  description: string;
  image?: string;
  sold?: boolean;
}

interface MkWallet {
  balance: number;
  transactions: MkTransaction[];
}

interface MkTransaction {
  id: string;
  type: string;
  item?: string;
  amount: number;
  adminShare?: number;
  sellerShare?: number;
  date: string;
}

const CATEGORIES = ["सब", "इलेक्ट्रॉनिक्स", "कपड़े", "फर्नीचर", "गाड़ी", "अन्य"];
const WALLET_KEY = "mk_wallet";

function getWallet(): MkWallet {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { balance: 0, transactions: [] };
}

function saveWallet(wallet: MkWallet) {
  localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
}

export default function MarketplaceView() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState("सब");
  const [search, setSearch] = useState("");
  const [sellOpen, setSellOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[1]);
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState<string | undefined>(undefined);

  // Buy dialog
  const [buyItem, setBuyItem] = useState<Item | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => getWallet().balance);

  // MoneyExplosion
  const [exploding, setExploding] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "सब" || item.category === activeCategory;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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
      image: newImage,
      sold: false,
    };
    setItems((prev) => [item, ...prev]);
    setNewTitle("");
    setNewPrice("");
    setNewLocation("");
    setNewDesc("");
    setNewImage(undefined);
    setSellOpen(false);
    toast.success("आइटम लिस्ट हो गया!");
  };

  const openBuyDialog = (item: Item) => {
    const w = getWallet();
    setWalletBalance(w.balance);
    setBuyItem(item);
    setBuyOpen(true);
  };

  const handleBuyConfirm = () => {
    if (!buyItem) return;
    const wallet = getWallet();
    if (wallet.balance < buyItem.price) {
      toast.error("पर्याप्त बैलेंस नहीं है");
      setBuyOpen(false);
      return;
    }
    const share = buyItem.price / 2;
    const tx: MkTransaction = {
      id: Date.now().toString(),
      type: "marketplace_buy",
      item: buyItem.title,
      amount: buyItem.price,
      adminShare: share,
      sellerShare: share,
      date: new Date().toISOString(),
    };
    wallet.balance -= buyItem.price;
    wallet.transactions = [tx, ...wallet.transactions];
    saveWallet(wallet);
    setWalletBalance(wallet.balance);

    // Mark item as sold
    setItems((prev) =>
      prev.map((it) => (it.id === buyItem.id ? { ...it, sold: true } : it)),
    );

    setBuyOpen(false);
    setBuyItem(null);

    // Show explosion
    setExploding(true);

    toast.success(
      `खरीदारी सफल! ₹${share} seller को और ₹${share} Prince Pawan Kumar को गए`,
    );
  };

  return (
    <div className="flex flex-col gap-4" data-ocid="marketplace.page">
      <MoneyExplosion active={exploding} onDone={() => setExploding(false)} />

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
              {/* Image picker */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-primary/40 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                data-ocid="marketplace.upload_button"
              >
                {newImage ? (
                  <img
                    src={newImage}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-primary/60" />
                    <span className="text-base text-muted-foreground font-medium">
                      फ़ोटो चुनें
                    </span>
                  </>
                )}
              </button>

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
              className="shadow-card border-border overflow-hidden relative"
              data-ocid={`marketplace.item.${idx + 1}`}
            >
              {/* Sold badge overlay */}
              {item.sold && (
                <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center rounded-lg">
                  <span className="bg-red-600 text-white font-black text-xl px-4 py-2 rounded-full rotate-[-15deg] shadow-lg">
                    बिक गया
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Tag className="w-12 h-12 text-muted-foreground" />
                )}
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

                {/* Buy button */}
                {!item.sold && (
                  <Button
                    onClick={() => openBuyDialog(item)}
                    className="w-full mt-2 text-base font-black h-11 bg-primary text-primary-foreground"
                    data-ocid={`marketplace.primary_button.${idx + 1}`}
                  >
                    खरीदें ₹{item.price}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Buy Confirmation Dialog */}
      <Dialog open={buyOpen} onOpenChange={setBuyOpen}>
        <DialogContent data-ocid="marketplace.modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              खरीदारी की पुष्टि करें
            </DialogTitle>
          </DialogHeader>

          {buyItem && (
            <div className="flex flex-col gap-4">
              {/* Item name */}
              <div className="bg-muted/60 rounded-xl p-4">
                <p className="text-xl font-black text-foreground">
                  {buyItem.title}
                </p>
                <p className="text-2xl font-black text-primary mt-1">
                  ₹{buyItem.price}
                </p>
              </div>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 border border-border rounded-xl p-4">
                <p className="text-base font-bold text-muted-foreground">
                  पैसों का बंटवारा:
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    Seller को मिलेगा:
                  </span>
                  <span className="text-xl font-black text-green-600">
                    ₹{buyItem.price / 2}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    Prince Pawan Kumar को मिलेगा:
                  </span>
                  <span className="text-xl font-black text-amber-600">
                    ₹{buyItem.price / 2}
                  </span>
                </div>
              </div>

              {/* Balance */}
              <div
                className={`flex items-center justify-between rounded-xl p-3 ${
                  walletBalance >= buyItem.price
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                <span className="text-lg font-bold text-foreground">
                  आपका बैलेंस:
                </span>
                <span
                  className={`text-xl font-black ${
                    walletBalance >= buyItem.price
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{walletBalance}
                </span>
              </div>

              {walletBalance < buyItem.price && (
                <p className="text-base font-bold text-red-500 text-center">
                  ⚠️ पर्याप्त बैलेंस नहीं है
                </p>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setBuyOpen(false)}
              className="flex-1 text-xl font-bold h-14"
              data-ocid="marketplace.cancel_button"
            >
              रद्द करें
            </Button>
            <Button
              onClick={handleBuyConfirm}
              disabled={!buyItem || walletBalance < (buyItem?.price ?? 0)}
              className="flex-1 text-xl font-black h-14 bg-primary text-primary-foreground"
              data-ocid="marketplace.confirm_button"
            >
              खरीदें ✅
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
