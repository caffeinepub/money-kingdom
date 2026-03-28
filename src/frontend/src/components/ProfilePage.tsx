import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFollowers } from "@/hooks/useFollowers";
import { Camera, Check, Grid3X3, List, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CoinAnimation from "./CoinAnimation";
import EnglishGuruAI from "./EnglishGuruAI";

interface ProfilePageProps {
  onBack: () => void;
}

const FRIENDS = [
  { id: "f1", name: "Rahul Sharma", initials: "RS", mutual: "15 साझा मित्र" },
  { id: "f2", name: "Priya Patel", initials: "PP", mutual: "8 साझा मित्र" },
  { id: "f3", name: "Amit Verma", initials: "AV", mutual: "23 साझा मित्र" },
  { id: "f4", name: "Sunita Gupta", initials: "SG", mutual: "5 साझा मित्र" },
  { id: "f5", name: "Vikram Singh", initials: "VS", mutual: "11 साझा मित्र" },
  { id: "f6", name: "Kavita Nair", initials: "KN", mutual: "7 साझा मित्र" },
];

const LANGUAGES = [
  { code: "hi", name: "हिन्दी", label: "Hindi" },
  { code: "ta", name: "தமிழ்", label: "Tamil" },
  { code: "te", name: "తెలుగు", label: "Telugu" },
  { code: "kn", name: "ಕನ್ನಡ", label: "Kannada" },
  { code: "ml", name: "മലയാളം", label: "Malayalam" },
  { code: "bn", name: "বাংলা", label: "Bengali" },
  { code: "mr", name: "मराठी", label: "Marathi" },
  { code: "gu", name: "ગુજરાતી", label: "Gujarati" },
  { code: "pa", name: "ਪੰਜਾਬੀ", label: "Punjabi" },
  { code: "or", name: "ଓଡ଼ିଆ", label: "Odia" },
  { code: "ur", name: "اردو", label: "Urdu" },
];

const ADMIN_USER = "प्रिंस पवन कुमार";
const CURRENT_USER = "PPK";
const FEE = 5;
const TX_KEY = "wallet_transactions";
const BALANCE_KEY = (user: string) => `wallet_${user}`;
const APP_LOADS_KEY = "mk_app_loads";
const ADMIN_PIN = "princepawankumar";

function getBalance(user: string): number {
  return Number.parseFloat(localStorage.getItem(BALANCE_KEY(user)) || "0");
}
function setBalanceLS(user: string, amount: number) {
  localStorage.setItem(BALANCE_KEY(user), amount.toFixed(2));
}
function loadTxs() {
  try {
    const raw = localStorage.getItem(TX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveTxs(txs: any[]) {
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
}
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function getStoredLang() {
  return localStorage.getItem("mk_language") ?? "hi";
}

// Track app loads
function trackAppLoad() {
  const count = Number.parseInt(localStorage.getItem(APP_LOADS_KEY) || "0", 10);
  localStorage.setItem(APP_LOADS_KEY, String(count + 1));
}
function getAppLoads(): number {
  return Number.parseInt(localStorage.getItem(APP_LOADS_KEY) || "0", 10);
}
function isAdminVerified(): boolean {
  return sessionStorage.getItem("mk_admin_verified") === "yes";
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>(getStoredLang);
  const [postViewMode, setPostViewMode] = useState<"grid" | "list">("grid");

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(() =>
    getBalance(CURRENT_USER),
  );
  const [adminBalance, setAdminBalance] = useState(() => getBalance("admin"));
  const [transactions, setTransactions] = useState<any[]>(loadTxs);
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [animating, setAnimating] = useState(false);

  // Admin stats state
  const [adminVerified, setAdminVerified] = useState<boolean>(isAdminVerified);
  const [pinInput, setPinInput] = useState("");
  const [appLoads, setAppLoads] = useState<number>(0);
  const [pinError, setPinError] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const {
    followers,
    following,
    followersCount,
    followingCount,
    isFollowing,
    toggleFollow,
  } = useFollowers("PPK");

  useEffect(() => {
    // Track app load every time ProfilePage mounts
    trackAppLoad();
    const savedCover = localStorage.getItem("mk_cover_photo");
    const savedProfile = localStorage.getItem("mk_profile_photo");
    if (savedCover) setCoverPhoto(savedCover);
    if (savedProfile) setProfilePhoto(savedProfile);
  }, []);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCoverPhoto(dataUrl);
      localStorage.setItem("mk_cover_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePhoto(dataUrl);
      localStorage.setItem("mk_profile_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLangSelect = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem("mk_language", code);
  };

  const handleSend = () => {
    const amt = Number.parseFloat(sendAmount);
    if (!recipient.trim()) {
      toast.error("प्राप्तकर्ता का नाम दर्ज करें");
      return;
    }
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("सही राशि दर्ज करें");
      return;
    }
    const total = amt + FEE;
    if (walletBalance < total) {
      toast.error(`अपर्याप्त बैलेंस। कुल ₹${total} चाहिए`);
      return;
    }
    setAnimating(true);
  };

  const handleAnimationComplete = () => {
    const amt = Number.parseFloat(sendAmount);
    const total = amt + FEE;
    const newBal = walletBalance - total;
    const newAdminBal = adminBalance + FEE;
    setBalanceLS(CURRENT_USER, newBal);
    setBalanceLS("admin", newAdminBal);
    setWalletBalance(newBal);
    setAdminBalance(newAdminBal);
    const tx = {
      id: Date.now().toString(),
      sender: ADMIN_USER,
      recipient: recipient.trim(),
      amount: amt,
      time: nowTime(),
    };
    const updated = [tx, ...transactions];
    setTransactions(updated);
    saveTxs(updated);
    setAnimating(false);
    setRecipient("");
    setSendAmount("");
    toast.success(`₹${amt} सफलतापूर्वक ${recipient.trim()} को भेजे गए!`);
  };

  const handleAdminVerify = () => {
    if (pinInput.trim().toLowerCase() === ADMIN_PIN) {
      sessionStorage.setItem("mk_admin_verified", "yes");
      setAdminVerified(true);
      setAppLoads(getAppLoads());
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleShowStats = () => {
    setAppLoads(getAppLoads());
  };

  const ALL_USERS: Record<string, { name: string; initials: string }> = {
    RAJ: { name: "राज शर्मा", initials: "RS" },
    ANI: { name: "अनिता गुप्ता", initials: "AG" },
    VIK: { name: "विकास मेहता", initials: "VM" },
    PRI: { name: "प्रिया सिंह", initials: "PS" },
    SUH: { name: "सुहास जोशी", initials: "SJ" },
  };

  return (
    <div className="flex flex-col gap-0" data-ocid="profile.page">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfileUpload}
      />

      {/* Followers Modal */}
      <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
        <DialogContent data-ocid="profile.followers.dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              फॉलोअर्स ({followersCount})
            </DialogTitle>
          </DialogHeader>
          {followers.length === 0 ? (
            <p
              className="text-lg text-muted-foreground text-center py-4"
              data-ocid="profile.followers.empty_state"
            >
              अभी कोई फॉलोअर्स नहीं है
            </p>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {followers.map((uid, idx) => {
                const user = ALL_USERS[uid];
                return (
                  <div
                    key={uid}
                    className="flex items-center gap-3"
                    data-ocid={`profile.followers.item.${idx + 1}`}
                  >
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.initials ?? uid.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">
                        {user?.name ?? uid}
                      </p>
                    </div>
                    <Button
                      variant={isFollowing(uid) ? "outline" : "default"}
                      size="sm"
                      className="rounded-full text-base h-10 px-5"
                      onClick={() => toggleFollow(uid, user?.name ?? uid)}
                      data-ocid={`profile.followers.toggle.${idx + 1}`}
                    >
                      {isFollowing(uid) ? "फॉलोइंग ✓" : "फॉलो करें"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Following Modal */}
      <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
        <DialogContent data-ocid="profile.following.dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              फॉलोइंग ({followingCount})
            </DialogTitle>
          </DialogHeader>
          {following.length === 0 ? (
            <p
              className="text-lg text-muted-foreground text-center py-4"
              data-ocid="profile.following.empty_state"
            >
              अभी किसी को फॉलो नहीं किया
            </p>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {following.map((uid, idx) => {
                const user = ALL_USERS[uid];
                return (
                  <div
                    key={uid}
                    className="flex items-center gap-3"
                    data-ocid={`profile.following.item.${idx + 1}`}
                  >
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.initials ?? uid.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">
                        {user?.name ?? uid}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-base h-10 px-5"
                      onClick={() => toggleFollow(uid, user?.name ?? uid)}
                      data-ocid={`profile.following.toggle.${idx + 1}`}
                    >
                      अनफॉलो
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Facebook-style Cover Photo */}
      <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(55% 0.12 45), oklch(42% 0.09 30), oklch(35% 0.07 25))",
              }}
            />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, oklch(85% 0.08 50) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(75% 0.10 40) 0%, transparent 40%)",
              }}
            />
          </>
        )}
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/50 text-white text-base px-3 py-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          data-ocid="profile.upload_button"
        >
          <Camera className="w-5 h-5" />
          कवर बदलें
        </button>
      </div>

      {/* Avatar + Info row */}
      <div className="bg-card border border-border rounded-b-xl px-4 pb-4 shadow-card relative">
        <div className="relative -mt-16 mb-3 flex items-end justify-between">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full p-0.5 border-4 border-card shadow-lg"
              style={{
                background:
                  "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              }}
            >
              <Avatar className="w-full h-full">
                {profilePhoto && (
                  <AvatarImage src={profilePhoto} alt="Profile" />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black rounded-full">
                  PPK
                </AvatarFallback>
              </Avatar>
            </div>
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-10 h-10 bg-muted border-2 border-card rounded-full flex items-center justify-center hover:bg-accent transition-colors shadow"
              data-ocid="profile.button"
            >
              <Camera className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-2 pb-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-base h-10 px-4"
              data-ocid="profile.edit_button"
            >
              संपादित करें
            </Button>
            <Button
              size="sm"
              className="rounded-full text-base h-10 px-4 gap-1"
              data-ocid="profile.primary_button"
            >
              <UserPlus className="w-4 h-4" />
              जोड़ें
            </Button>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="mb-3">
          <h1 className="font-black text-3xl text-foreground leading-tight">
            प्रिंस पवन कुमार
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            💰 Finance enthusiast | निवेशक | SIP lover 📈
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 text-center">
          <button
            type="button"
            onClick={() => setShowFollowersModal(true)}
            className="flex flex-col items-center hover:text-primary transition-colors"
            data-ocid="profile.followers.button"
          >
            <span className="font-black text-2xl text-foreground">
              {followersCount}
            </span>
            <span className="text-base text-muted-foreground">फॉलोअर्स</span>
          </button>
          <div className="w-px h-10 bg-border" />
          <button
            type="button"
            onClick={() => setShowFollowingModal(true)}
            className="flex flex-col items-center hover:text-primary transition-colors"
            data-ocid="profile.following.button"
          >
            <span className="font-black text-2xl text-foreground">
              {followingCount}
            </span>
            <span className="text-base text-muted-foreground">फॉलोइंग</span>
          </button>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col items-center">
            <span className="font-black text-2xl text-foreground">0</span>
            <span className="text-base text-muted-foreground">पोस्ट</span>
          </div>
          <Badge variant="secondary" className="text-sm px-2 py-0.5 ml-auto">
            👑 Admin
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <Tabs defaultValue="posts">
          <TabsList
            className="w-full bg-card border border-border rounded-xl shadow-card mb-4 h-14"
            data-ocid="profile.tab"
          >
            <TabsTrigger
              value="posts"
              className="flex-1 text-lg rounded-lg font-bold"
            >
              पोस्ट
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="flex-1 text-lg rounded-lg font-bold"
            >
              मित्र ({FRIENDS.length})
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 text-lg rounded-lg font-bold"
              data-ocid="profile.settings.tab"
            >
              सेटिंग ⚙️
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-0">
            <div className="flex items-center justify-end gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPostViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  postViewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                data-ocid="profile.toggle"
              >
                <Grid3X3 className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => setPostViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  postViewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                data-ocid="profile.toggle"
              >
                <List className="w-6 h-6" />
              </button>
            </div>
            <div
              className="bg-card rounded-xl border border-border shadow-card p-8 text-center"
              data-ocid="profile.posts.empty_state"
            >
              <div className="text-6xl mb-4">📸</div>
              <p className="text-xl font-bold text-foreground">
                अभी कोई पोस्ट नहीं
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                होम फीड से अपनी पहली पोस्ट डालें!
              </p>
            </div>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FRIENDS.map((friend, idx) => (
                <div
                  key={friend.id}
                  className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col items-center gap-3"
                  data-ocid={`profile.friends.item.${idx + 1}`}
                >
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xl">
                      {friend.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-bold text-lg text-foreground leading-tight">
                      {friend.name}
                    </p>
                    <p className="text-base text-muted-foreground mt-0.5">
                      {friend.mutual}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-base h-10"
                    data-ocid={`profile.friends.button.${idx + 1}`}
                  >
                    मित्र
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent
            value="settings"
            className="mt-0"
            data-ocid="profile.settings.panel"
          >
            <Tabs defaultValue="language">
              <TabsList className="w-full grid grid-cols-4 bg-card border border-border rounded-xl shadow-card mb-4 h-14">
                <TabsTrigger
                  value="language"
                  className="text-sm rounded-lg font-bold"
                >
                  🌐 भाषा
                </TabsTrigger>
                <TabsTrigger
                  value="englishguru"
                  className="text-sm rounded-lg font-bold"
                >
                  🎓 English AI
                </TabsTrigger>
                <TabsTrigger
                  value="wallet"
                  className="text-sm rounded-lg font-bold"
                  data-ocid="profile.settings.wallet.tab"
                >
                  💰 वॉलेट
                </TabsTrigger>
                <TabsTrigger
                  value="admin-stats"
                  className="text-sm rounded-lg font-bold"
                  data-ocid="profile.settings.admin_stats.tab"
                  onClick={handleShowStats}
                >
                  📊 Stats
                </TabsTrigger>
              </TabsList>

              {/* Language */}
              <TabsContent value="language" className="mt-0">
                <div className="bg-card rounded-xl border border-border shadow-card p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🌐</span>
                    <h3 className="font-black text-xl text-foreground">
                      भाषा चुनें
                    </h3>
                  </div>
                  <ScrollArea className="h-72">
                    <div className="flex flex-col gap-2 pr-2">
                      {LANGUAGES.map((lang) => {
                        const isActive = selectedLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLangSelect(lang.code)}
                            data-ocid="profile.settings.language.button"
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-left ${
                              isActive
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted border border-transparent"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span
                                className={`text-xl font-bold leading-tight ${isActive ? "text-primary" : "text-foreground"}`}
                              >
                                {lang.name}
                              </span>
                              <span className="text-base text-muted-foreground mt-0.5">
                                {lang.label}
                              </span>
                            </div>
                            {isActive && (
                              <Check className="w-6 h-6 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* English Guru AI */}
              <TabsContent value="englishguru" className="mt-0">
                <div className="bg-card rounded-xl border border-border shadow-card p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎓</span>
                    <h3 className="font-black text-xl text-foreground">
                      English Guru AI
                    </h3>
                  </div>
                  <EnglishGuruAI />
                </div>
              </TabsContent>

              {/* Wallet */}
              <TabsContent
                value="wallet"
                className="mt-0"
                data-ocid="profile.settings.wallet.panel"
              >
                <div className="bg-card rounded-xl border border-border shadow-card p-4 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                      <p className="text-base text-muted-foreground mb-1">
                        मेरा बैलेंस
                      </p>
                      <p className="text-3xl font-black text-primary">
                        ₹{walletBalance.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                      <p className="text-base text-muted-foreground mb-1">
                        Admin फ़ीस
                      </p>
                      <p className="text-3xl font-black text-amber-600">
                        ₹{adminBalance.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col gap-3">
                    <h3 className="font-black text-xl text-foreground">
                      💸 पैसे भेजें
                    </h3>
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="प्राप्तकर्ता का नाम"
                      className="text-lg h-14"
                      data-ocid="profile.wallet.recipient.input"
                    />
                    <Input
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="राशि (₹)"
                      type="number"
                      min="1"
                      className="text-lg h-14"
                      data-ocid="profile.wallet.amount.input"
                    />
                    <p className="text-base text-muted-foreground">
                      ₹5 शुल्क हर लेनदेन पर लगेगा
                    </p>
                    <Button
                      onClick={handleSend}
                      disabled={animating || !recipient.trim() || !sendAmount}
                      className="w-full text-xl font-black h-14"
                      data-ocid="profile.wallet.send.button"
                    >
                      {animating ? "भेज रहा है..." : "भेजें 🚀"}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-black text-xl text-foreground">
                      📜 लेनदेन इतिहास
                    </h3>
                    {transactions.length === 0 ? (
                      <div
                        className="text-center py-8 text-muted-foreground"
                        data-ocid="profile.wallet.empty_state"
                      >
                        <span className="text-4xl block mb-3">🏦</span>
                        <p className="text-xl font-bold">कोई लेनदेन नहीं</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {transactions.map((tx: any, idx: number) => (
                          <div
                            key={tx.id}
                            data-ocid={`profile.wallet.item.${idx + 1}`}
                            className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-base font-bold text-foreground">
                                {tx.sender} → {tx.recipient}
                              </p>
                              <p className="text-base text-muted-foreground">
                                {tx.time}
                              </p>
                            </div>
                            <span className="text-xl font-black text-destructive">
                              -₹{tx.amount + 5}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {animating && (
                  <CoinAnimation onComplete={handleAnimationComplete} />
                )}
              </TabsContent>

              {/* Admin Stats Tab -- सिर्फ Prince Pawan Kumar को दिखेगा */}
              <TabsContent
                value="admin-stats"
                className="mt-0"
                data-ocid="profile.settings.admin_stats.panel"
              >
                <div className="bg-card rounded-xl border border-border shadow-card p-5 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    <div>
                      <h3 className="font-black text-xl text-foreground">
                        Admin Stats
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        सिर्फ Prince Pawan Kumar के लिए
                      </p>
                    </div>
                  </div>

                  {!adminVerified ? (
                    /* PIN verification */
                    <div className="flex flex-col gap-4">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                        <span className="text-4xl block mb-2">🔐</span>
                        <p className="font-bold text-lg text-foreground">
                          Admin पहचान verify करें
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          यह section सिर्फ admin के लिए है
                        </p>
                      </div>
                      <Input
                        type="password"
                        value={pinInput}
                        onChange={(e) => {
                          setPinInput(e.target.value);
                          setPinError(false);
                        }}
                        placeholder="Admin password डालें"
                        className={`text-lg h-14 ${
                          pinError ? "border-destructive" : ""
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAdminVerify();
                        }}
                        data-ocid="profile.settings.admin_stats.pin_input"
                      />
                      {pinError && (
                        <p className="text-destructive text-sm font-semibold text-center">
                          ❌ गलत password। फिर से कोशिश करें।
                        </p>
                      )}
                      <Button
                        onClick={handleAdminVerify}
                        disabled={!pinInput.trim()}
                        className="w-full text-xl font-black h-14"
                        data-ocid="profile.settings.admin_stats.verify_button"
                      >
                        Verify करें 🔓
                      </Button>
                    </div>
                  ) : (
                    /* Stats dashboard */
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center">
                          <p className="text-base text-muted-foreground mb-2 font-semibold">
                            कुल App Loads
                          </p>
                          <p className="text-6xl font-black text-primary">
                            {appLoads}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            बार app खोला गया है
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleShowStats}
                        className="w-full text-base font-bold h-12"
                        data-ocid="profile.settings.admin_stats.refresh_button"
                      >
                        🔄 Refresh करें
                      </Button>

                      <div className="bg-muted/50 rounded-xl p-4 border border-border">
                        <p className="text-sm text-muted-foreground text-center leading-relaxed">
                          यह count हर बार profile खुलने पर बढ़ता है। बाकी कोई भी
                          user यह नहीं देख सकता।
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-base text-muted-foreground hover:text-foreground underline self-start"
        data-ocid="profile.link"
      >
        ← होम पर वापस जाएं
      </button>
    </div>
  );
}
