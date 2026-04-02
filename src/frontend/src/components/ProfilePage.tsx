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
import { Textarea } from "@/components/ui/textarea";
import { useFollowers } from "@/hooks/useFollowers";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Link,
  Play,
  Settings,
  Share2,
  Tag,
  UserPlus,
  Wallet,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDarkMode } from "../hooks/useDarkMode";
import { type ThemeName, useTheme } from "../hooks/useTheme";
import { setLanguage, useLanguage } from "../utils/i18n";
import type { Post } from "./CenterFeed";
import CoinAnimation from "./CoinAnimation";
import EnglishGuruAI from "./EnglishGuruAI";
import SpinWheel from "./SpinWheel";

function loadUserPosts(mobile: string): Post[] {
  try {
    const raw = localStorage.getItem("mk_all_posts");
    const all: Post[] = raw ? JSON.parse(raw) : [];
    return all.filter((p) => p.authorMobile === mobile);
  } catch {
    return [];
  }
}

function deletePostFromStorage(id: string) {
  try {
    const raw = localStorage.getItem("mk_all_posts");
    const all: Post[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(
      "mk_all_posts",
      JSON.stringify(all.filter((p) => p.id !== id)),
    );
  } catch {}
}

interface ProfilePageProps {
  onBack: () => void;
  isOwnProfile?: boolean;
}

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
  { code: "or", name: "ଓଡ௃ଆ", label: "Odia" },
  { code: "ur", name: "اردو", label: "Urdu" },
  { code: "as", name: "অসমীয়া", label: "Assamese" },
  { code: "ne", name: "नेपाली", label: "Nepali" },
  { code: "sa", name: "संस्कृतम्", label: "Sanskrit" },
  { code: "en", name: "English", label: "English" },
  { code: "ar", name: "العربية", label: "Arabic" },
  { code: "zh", name: "中文", label: "Chinese" },
  { code: "es", name: "Español", label: "Spanish" },
  { code: "fr", name: "Français", label: "French" },
  { code: "pt", name: "Português", label: "Portuguese" },
  { code: "ru", name: "Русский", label: "Russian" },
  { code: "de", name: "Deutsch", label: "German" },
  { code: "ja", name: "日本語", label: "Japanese" },
  { code: "ko", name: "한국어", label: "Korean" },
  { code: "tr", name: "Türkçe", label: "Turkish" },
  { code: "id", name: "Bahasa Indonesia", label: "Indonesian" },
];

const FEE = 5;
const TX_KEY = "wallet_transactions";
const BALANCE_KEY = (user: string) => `wallet_${user}`;
const APP_LOADS_KEY = "mk_app_loads";
const ADMIN_PIN = "princepawankumar";
const ADMIN_NAME = "Prince Pawan Kumar";

const HINDI_LYRICS = [
  "पैसों की बारिश तब होती है जब मेहनत की धूप निकलती है 👑",
  "मैं वो राजा हूँ जिसका किंगडम मेरे सपनों में है 💰",
  "Money Kingdom में स्वागत है, यहाँ सब राजा हैं 🏆",
];

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

function getUserProfile(): { name: string; mobile: string } | null {
  try {
    const raw = localStorage.getItem("mk_user_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getUserExtras(mobile: string): {
  profilePhoto: string | null;
  coverPhoto: string | null;
  bio: string;
} {
  try {
    const raw = localStorage.getItem(`mk_profile_${mobile}`);
    return raw
      ? JSON.parse(raw)
      : { profilePhoto: null, coverPhoto: null, bio: "" };
  } catch {
    return { profilePhoto: null, coverPhoto: null, bio: "" };
  }
}
function saveUserExtras(
  mobile: string,
  data: { profilePhoto: string | null; coverPhoto: string | null; bio: string },
) {
  localStorage.setItem(`mk_profile_${mobile}`, JSON.stringify(data));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function deriveUsername(name: string): string {
  return `@${name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20)}`;
}

function getStoredUsername(mobile: string): string {
  return localStorage.getItem(`mk_username_${mobile}`) || "";
}
function saveUsername(mobile: string, uname: string) {
  localStorage.setItem(`mk_username_${mobile}`, uname);
}
function getStoredBio(mobile: string): string {
  return localStorage.getItem(`mk_user_bio_${mobile}`) || "";
}
function saveBioLS(mobile: string, bio: string) {
  localStorage.setItem(`mk_user_bio_${mobile}`, bio);
}
function getStoredWebsite(mobile: string): string {
  return localStorage.getItem(`mk_user_website_${mobile}`) || "";
}
function saveWebsiteLS(mobile: string, website: string) {
  localStorage.setItem(`mk_user_website_${mobile}`, website);
}

const ALL_USERS: Record<string, { name: string; initials: string }> = {
  RAJ: { name: "राज शर्मा", initials: "RS" },
  ANI: { name: "अनिता गुप्ता", initials: "AG" },
  VIK: { name: "विकास मेहता", initials: "VM" },
  PRI: { name: "प्रिया सिंह", initials: "PS" },
  SUH: { name: "सुहास जोशी", initials: "SJ" },
};

// ── Helper: Collapsible Settings Section ──────────────────────────────────
interface SettingsSectionProps {
  icon: string;
  title: string;
  sectionKey: string;
  openSections: Set<string>;
  toggleSection: (key: string) => void;
  ocid?: string;
  children: ReactNode;
}
function SettingsSection({
  icon,
  title,
  sectionKey,
  openSections,
  toggleSection,
  ocid,
  children,
}: SettingsSectionProps) {
  const isOpen = openSections.has(sectionKey);
  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
      data-ocid={ocid}
    >
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-3 pt-0 flex flex-col gap-0 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Helper: Toggle Row ─────────────────────────────────────────────────────
function ToggleRow({
  label,
  desc,
  value,
  onToggle,
  ocid,
}: {
  label: string;
  desc: string;
  value: boolean;
  onToggle: () => void;
  ocid?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value ? "bg-primary" : "bg-muted"}`}
        data-ocid={ocid}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? "left-6" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export default function ProfilePage({
  onBack,
  isOwnProfile = true,
}: ProfilePageProps) {
  const { t } = useLanguage();

  const userProfile = getUserProfile();
  const displayName = userProfile?.name ?? ADMIN_NAME;
  const userMobile = userProfile?.mobile ?? "admin";
  const isAdmin = displayName === ADMIN_NAME;

  // Profile extras
  const [coverPhoto, setCoverPhoto] = useState<string | null>(
    () => getUserExtras(userMobile).coverPhoto,
  );
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    () => getUserExtras(userMobile).profilePhoto,
  );

  // @username
  const [username, setUsername] = useState<string>(() => {
    const stored = getStoredUsername(userMobile);
    if (stored) return stored;
    const derived = deriveUsername(displayName);
    saveUsername(userMobile, derived);
    return derived;
  });

  // Bio & website
  const [bio, setBio] = useState<string>(() => {
    const stored = getStoredBio(userMobile);
    if (stored) return stored;
    return getUserExtras(userMobile).bio || "";
  });
  const [website, setWebsite] = useState<string>(() =>
    getStoredWebsite(userMobile),
  );

  // Edit profile modal
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editUsername, setEditUsername] = useState(username);
  const [editBio, setEditBio] = useState(bio);
  const [editWebsite, setEditWebsite] = useState(website);

  // Posts
  const [userPosts, setUserPosts] = useState<Post[]>(() =>
    loadUserPosts(userMobile),
  );

  // Refresh posts when profile mounts
  useEffect(() => {
    setUserPosts(loadUserPosts(userMobile));
  }, [userMobile]);

  const videoPosts = userPosts.filter((p) => !!p.videoUrl);

  // Followers/following
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const {
    followers,
    following,
    followersCount,
    followingCount,
    isFollowing,
    toggleFollow,
  } = useFollowers(userMobile);

  // Language
  const [selectedLang, setSelectedLang] = useState<string>(getStoredLang);

  // Dark mode — available to ALL users
  const { dark, toggle: toggleDark } = useDarkMode();
  // Theme
  const { theme: appTheme, setTheme } = useTheme();

  // Wallet
  const [walletBalance, setWalletBalance] = useState(() =>
    getBalance(userMobile),
  );
  const [adminBalance, setAdminBalance] = useState(() => getBalance("admin"));
  const [transactions, setTransactions] = useState<any[]>(loadTxs);
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [animating, setAnimating] = useState(false);

  // Admin stats — still password-protected
  const [adminVerified, setAdminVerified] = useState<boolean>(isAdminVerified);
  const [pinInput, setPinInput] = useState("");
  const [appLoads, setAppLoads] = useState<number>(0);
  const [pinError, setPinError] = useState(false);

  // Settings accordion open sections
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["account"]),
  );
  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // New settings state
  const [accountType, setAccountType] = useState<string>(
    () => localStorage.getItem("mk_account_type") || "public",
  );
  const [pinChangeMode, setPinChangeMode] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [notifPush, setNotifPush] = useState(
    () => localStorage.getItem("mk_notif_push") !== "false",
  );
  const [notifPayment, setNotifPayment] = useState(
    () => localStorage.getItem("mk_notif_payment") !== "false",
  );
  const [notifMute, setNotifMute] = useState(
    () => localStorage.getItem("mk_notif_mute") === "true",
  );
  const [dataSaver, setDataSaver] = useState(
    () => localStorage.getItem("mk_data_saver") === "true",
  );
  const [autoPlay, setAutoPlay] = useState(
    () => localStorage.getItem("mk_autoplay") !== "false",
  );
  const [reportText, setReportText] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackAppLoad();
  }, []);

  const persistExtras = (
    updates: Partial<{
      profilePhoto: string | null;
      coverPhoto: string | null;
      bio: string;
    }>,
  ) => {
    const current = getUserExtras(userMobile);
    const updated = { ...current, ...updates };
    saveUserExtras(userMobile, updated);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCoverPhoto(dataUrl);
      persistExtras({ coverPhoto: dataUrl });
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
      persistExtras({ profilePhoto: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEditProfile = () => {
    const trimmedUsername = editUsername.startsWith("@")
      ? editUsername
      : `@${editUsername}`;
    setUsername(trimmedUsername);
    saveUsername(userMobile, trimmedUsername);
    setBio(editBio);
    saveBioLS(userMobile, editBio);
    persistExtras({ bio: editBio });
    setWebsite(editWebsite);
    saveWebsiteLS(userMobile, editWebsite);
    setEditOpen(false);
    toast.success("प्रोफाइल अपडेट हो गया!");
  };

  const handleShareProfile = () => {
    const text = `Money Kingdom पर ${displayName} (${username}) की प्रोफाइल देखें! 👑\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: displayName, text });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast.success("लिंक कॉपी हो गया!");
      });
    }
  };

  const handleLangSelect = (code: string) => {
    setSelectedLang(code);
    setLanguage(code);
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
    setBalanceLS(userMobile, newBal);
    setBalanceLS("admin", newAdminBal);
    setWalletBalance(newBal);
    setAdminBalance(newAdminBal);
    const tx = {
      id: Date.now().toString(),
      sender: displayName,
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

      {/* Edit Profile Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-ocid="profile.edit.dialog">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              ✉️ प्रोफाइल संपादित करें
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                नाम
              </p>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="आपका नाम"
                className="h-11"
                data-ocid="profile.edit.name.input"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                @यूजरनेम
              </p>
              <Input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="@your_username"
                className="h-11"
                data-ocid="profile.edit.username.input"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Bio
              </p>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="अपने बारे में लिखें..."
                rows={3}
                data-ocid="profile.edit.bio.textarea"
              />
              {/* Hindi lyric suggestions */}
              <div className="flex flex-col gap-1 mt-2">
                {HINDI_LYRICS.map((lyric) => (
                  <button
                    key={lyric}
                    type="button"
                    onClick={() => setEditBio(lyric)}
                    className="text-left text-xs text-primary/80 hover:text-primary px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    {lyric}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                वेबसाइट लिंक
              </p>
              <Input
                value={editWebsite}
                onChange={(e) => setEditWebsite(e.target.value)}
                placeholder="https://..."
                className="h-11"
                data-ocid="profile.edit.website.input"
              />
            </div>
            <Button
              onClick={handleSaveEditProfile}
              className="w-full font-black h-12"
              data-ocid="profile.edit.save_button"
            >
              सहेजें ✓
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Followers Modal */}
      <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
        <DialogContent data-ocid="profile.followers.dialog">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {t("followers")} ({followersCount})
            </DialogTitle>
          </DialogHeader>
          {followers.length === 0 ? (
            <p
              className="text-base text-muted-foreground text-center py-4"
              data-ocid="profile.followers.empty_state"
            >
              अभी कोई फोल्लोअर नहीं
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
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.initials ?? uid.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">
                        {user?.name ?? uid}
                      </p>
                    </div>
                    <Button
                      variant={isFollowing(uid) ? "outline" : "default"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => toggleFollow(uid, user?.name ?? uid)}
                      data-ocid={`profile.followers.toggle.${idx + 1}`}
                    >
                      {isFollowing(uid) ? `${t("following")} ✓` : t("follow")}
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
            <DialogTitle className="text-xl font-black">
              फ़ॉलोइंग ({followingCount})
            </DialogTitle>
          </DialogHeader>
          {following.length === 0 ? (
            <p
              className="text-base text-muted-foreground text-center py-4"
              data-ocid="profile.following.empty_state"
            >
              अभी किसी को फ़ॉलो नहीं किया
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
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.initials ?? uid.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">
                        {user?.name ?? uid}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => toggleFollow(uid, user?.name ?? uid)}
                      data-ocid={`profile.following.toggle.${idx + 1}`}
                    >
                      अनफ़ॉलो
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cover Photo */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(55% 0.12 45), oklch(42% 0.09 30), oklch(35% 0.07 25))",
            }}
          />
        )}
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full backdrop-blur-sm"
            data-ocid="profile.upload_button"
          >
            <Camera className="w-3.5 h-3.5" />
            कवर बदलें
          </button>
        )}
      </div>

      {/* Profile header card */}
      <div className="bg-card border border-border rounded-b-xl px-4 pb-4 shadow-card">
        {/* Avatar + Action buttons row */}
        <div className="flex items-end justify-between -mt-10 mb-3">
          {/* Profile photo with gold ring */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full p-0.5 shadow-lg"
              style={{
                background:
                  "linear-gradient(45deg, #f5c518, #e6983c, #f5c518, #ffd700)",
              }}
            >
              <Avatar className="w-full h-full">
                {profilePhoto && (
                  <AvatarImage src={profilePhoto} alt="Profile" />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-black rounded-full">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
            </div>
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-muted border-2 border-card rounded-full flex items-center justify-center shadow"
                data-ocid="profile.button"
              >
                <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          {isOwnProfile && (
            <div className="flex gap-1.5 pb-1">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs h-8 px-2.5 gap-1"
                onClick={() => {
                  setEditName(displayName);
                  setEditUsername(username);
                  setEditBio(bio);
                  setEditWebsite(website);
                  setEditOpen(true);
                }}
                data-ocid="profile.edit_button"
              >
                ✏️ संपादित
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs h-8 px-2.5 gap-1"
                onClick={handleShareProfile}
                data-ocid="profile.share_button"
              >
                <Share2 className="w-3 h-3" />
                शेयर
              </Button>
            </div>
          )}
          {!isOwnProfile && (
            <Button
              size="sm"
              className="rounded-full text-xs h-8 px-3 gap-1"
              data-ocid="profile.primary_button"
            >
              <UserPlus className="w-3.5 h-3.5" />
              फ़ॉलो करें
            </Button>
          )}
        </div>

        {/* Name & username */}
        <div className="mb-2">
          <h1 className="font-black text-xl text-foreground leading-tight">
            {displayName}
          </h1>
          <p className="text-sm text-muted-foreground">{username}</p>
        </div>

        {/* Stats row: Posts | Followers | Following */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex flex-col items-center">
            <span className="font-black text-lg text-foreground">
              {userPosts.length}
            </span>
            <span className="text-xs text-muted-foreground">पोस्ट</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <button
            type="button"
            onClick={() => setShowFollowersModal(true)}
            className="flex flex-col items-center hover:text-primary transition-colors"
            data-ocid="profile.followers.button"
          >
            <span className="font-black text-lg text-foreground">
              {followersCount}
            </span>
            <span className="text-xs text-muted-foreground">फ़ॉलोअर्स</span>
          </button>
          <div className="w-px h-8 bg-border" />
          <button
            type="button"
            onClick={() => setShowFollowingModal(true)}
            className="flex flex-col items-center hover:text-primary transition-colors"
            data-ocid="profile.following.button"
          >
            <span className="font-black text-lg text-foreground">
              {followingCount}
            </span>
            <span className="text-xs text-muted-foreground">फ़ॉलोइंग</span>
          </button>
          {isAdmin && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 ml-auto">
              👑 Admin
            </Badge>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-foreground mb-1 leading-snug">{bio}</p>
        )}
        {!bio && (
          <p className="text-sm text-muted-foreground mb-1">
            💰 Finance enthusiast | निवेशक | SIP lover 📈
          </p>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Link className="w-3 h-3" />
            {website.replace(/https?:\/\//i, "")}
          </a>
        )}

        {/* Wallet quick button */}
        {isOwnProfile && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg text-sm h-9 gap-2 font-semibold"
              onClick={() => {}}
              data-ocid="profile.wallet.button"
            >
              <Wallet className="w-4 h-4" />
              बैलेंस: ₹{walletBalance.toFixed(2)}
            </Button>
          </div>
        )}
      </div>

      {/* Story Highlights */}
      <div className="bg-card border border-border rounded-xl px-4 py-3 mt-2">
        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Add highlight */}
          <button
            type="button"
            className="flex flex-col items-center gap-1 shrink-0"
            data-ocid="profile.button"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center">
              <span className="text-xl text-muted-foreground">+</span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              Highlights
            </span>
          </button>
        </div>
      </div>

      {/* Main content tabs: Grid | Reels | Tagged | Settings */}
      <div className="mt-2">
        <Tabs defaultValue="grid">
          <TabsList
            className="w-full bg-card border border-border rounded-xl shadow-card mb-3 h-12"
            data-ocid="profile.tab"
          >
            <TabsTrigger
              value="grid"
              className="flex-1 rounded-lg"
              data-ocid="profile.grid.tab"
            >
              <Grid3X3 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="reels"
              className="flex-1 rounded-lg"
              data-ocid="profile.reels.tab"
            >
              <Play className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="tagged"
              className="flex-1 rounded-lg"
              data-ocid="profile.tagged.tab"
            >
              <Tag className="w-4 h-4" />
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger
                value="settings"
                className="flex-1 rounded-lg"
                data-ocid="profile.settings.tab"
              >
                <Settings className="w-4 h-4" />
              </TabsTrigger>
            )}
          </TabsList>

          {/* Grid Tab */}
          <TabsContent value="grid" className="mt-0">
            {userPosts.length === 0 ? (
              <div
                className="bg-card rounded-xl border border-border p-8 text-center"
                data-ocid="profile.posts.empty_state"
              >
                <div className="text-4xl mb-3">📸</div>
                <p className="text-sm font-bold text-foreground">
                  अभी कोई पोस्ट नहीं
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  होम फीड से अपनी पहली पोस्ट डालें!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {userPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="relative aspect-square bg-muted overflow-hidden"
                    data-ocid={`profile.posts.item.${idx + 1}`}
                  >
                    {post.videoUrl ? (
                      <div className="relative w-full h-full">
                        <video
                          src={post.videoUrl}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 rounded-sm p-0.5">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2 bg-muted">
                        <p className="text-[9px] text-foreground text-center line-clamp-4 leading-tight">
                          {post.content}
                        </p>
                      </div>
                    )}
                    {isOwnProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          deletePostFromStorage(post.id);
                          setUserPosts((prev) =>
                            prev.filter((p) => p.id !== post.id),
                          );
                        }}
                        className="absolute bottom-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                        aria-label="डिलीट करें"
                        data-ocid={`profile.posts.delete_button.${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reels Tab */}
          <TabsContent value="reels" className="mt-0">
            {videoPosts.length === 0 ? (
              <div
                className="bg-card rounded-xl border border-border p-8 text-center"
                data-ocid="profile.reels.empty_state"
              >
                <div className="text-4xl mb-3">🎬</div>
                <p className="text-sm font-bold text-foreground">
                  अभी कोई रील नहीं
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  वीडियो पोस्ट करें और यहाँ दिखेंगी
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {videoPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="relative aspect-[9/16] bg-black overflow-hidden"
                    data-ocid={`profile.reels.item.${idx + 1}`}
                  >
                    <video
                      src={post.videoUrl}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-black/60 rounded-sm p-0.5">
                      <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                    {post.content && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                        <p className="text-white text-[9px] line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tagged Tab */}
          <TabsContent value="tagged" className="mt-0">
            <div
              className="bg-card rounded-xl border border-border p-8 text-center"
              data-ocid="profile.tagged.empty_state"
            >
              <div className="text-4xl mb-3">🏷️</div>
              <p className="text-sm font-bold text-foreground">
                अभी कोई टैग नहीं
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                जब कोई आपको टैग करेगा, यहाँ दिखेगा
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab — 6 Accordion Sections */}
          {isOwnProfile && (
            <TabsContent
              value="settings"
              className="mt-0"
              data-ocid="profile.settings.panel"
            >
              <div className="flex flex-col gap-2 pb-4">
                {/* Section 1: Account Settings */}
                <SettingsSection
                  icon="👤"
                  title="अकाउंट सेटिंग्स"
                  sectionKey="account"
                  openSections={openSections}
                  toggleSection={toggleSection}
                  ocid="profile.settings.account.panel"
                >
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        प्रोफाइल एडिट करें
                      </p>
                      <p className="text-xs text-muted-foreground">
                        नाम, bio, फोटो बदलें
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditOpen(true)}
                      data-ocid="profile.settings.account.edit_button"
                    >
                      ✏️ एडिट
                    </Button>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        अकाउंट टाइप {accountType === "public" ? "🌍" : "🔒"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {accountType === "public"
                          ? "पब्लिक — सब देख सकते हैं"
                          : "प्राइवेट — सिर्फ फॉलोअर्स"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next =
                          accountType === "public" ? "private" : "public";
                        setAccountType(next);
                        localStorage.setItem("mk_account_type", next);
                      }}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${accountType === "public" ? "bg-primary" : "bg-muted"}`}
                      data-ocid="profile.settings.account.toggle"
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${accountType === "public" ? "left-6" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        मोबाइल नंबर
                      </p>
                      <p className="text-xs text-muted-foreground">
                        रजिस्टर्ड नंबर
                      </p>
                    </div>
                    <span className="text-sm font-mono font-bold text-foreground bg-muted px-3 py-1 rounded-lg">
                      {userMobile === "admin" ? "—" : userMobile}
                    </span>
                  </div>
                </SettingsSection>

                {/* Section 2: Wallet */}
                <SettingsSection
                  icon="💰"
                  title="मनी किंगडम वॉलेट"
                  sectionKey="wallet"
                  openSections={openSections}
                  toggleSection={toggleSection}
                  ocid="profile.settings.wallet.panel"
                >
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center mb-2">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      मेरा बैलेंस
                    </p>
                    <p className="text-3xl font-black text-primary">
                      ₹{walletBalance.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="प्राप्तकर्ता का नाम"
                      className="text-sm h-10"
                      data-ocid="profile.wallet.recipient.input"
                    />
                    <Input
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="राशि (₹)"
                      type="number"
                      min="1"
                      className="text-sm h-10"
                      data-ocid="profile.wallet.amount.input"
                    />
                    <p className="text-xs text-muted-foreground">
                      ₹5 शुल्क हर लेनदेन पर
                    </p>
                    <Button
                      onClick={handleSend}
                      disabled={animating || !recipient.trim() || !sendAmount}
                      className="w-full font-bold h-10"
                      data-ocid="profile.wallet.send.button"
                    >
                      {animating ? "भेज रहा है..." : "भेजें 🚀"}
                    </Button>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        विथड्रॉल
                      </p>
                      <p className="text-xs text-muted-foreground">
                        वर्चुअल वॉलेट
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info("विथड्रॉल के लिए admin से संपर्क करें")
                      }
                      data-ocid="profile.settings.wallet.withdraw_button"
                    >
                      निकालें
                    </Button>
                  </div>
                  <div className="border-t border-border my-2" />
                  <p className="text-sm font-semibold text-foreground mb-2">
                    📜 ट्रांजेक्शन हिस्ट्री
                  </p>
                  {transactions.length === 0 ? (
                    <div
                      className="text-center py-4 text-muted-foreground"
                      data-ocid="profile.wallet.empty_state"
                    >
                      <span className="text-2xl block mb-1">🏦</span>
                      <p className="text-sm font-bold">कोई लेनदेन नहीं</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {transactions.map((tx: any, idx: number) => (
                        <div
                          key={tx.id}
                          data-ocid={`profile.wallet.item.${idx + 1}`}
                          className="bg-muted/50 border border-border rounded-lg px-3 py-2 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {tx.sender} → {tx.recipient}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tx.time}
                            </p>
                          </div>
                          <span className="text-sm font-black text-destructive">
                            -₹{tx.amount + 5}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {animating && (
                    <CoinAnimation onComplete={handleAnimationComplete} />
                  )}
                </SettingsSection>

                {/* Section 3: Privacy & Security */}
                <SettingsSection
                  icon="🔒"
                  title="प्राइवेसी और सुरक्षा"
                  sectionKey="privacy"
                  openSections={openSections}
                  toggleSection={toggleSection}
                  ocid="profile.settings.privacy.panel"
                >
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      पिन बदलें
                    </p>
                    {pinChangeMode ? (
                      <div className="flex flex-col gap-2">
                        <Input
                          type="password"
                          maxLength={4}
                          value={newPin}
                          onChange={(e) =>
                            setNewPin(
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          placeholder="नया 4-अंक पिन"
                          className="text-sm h-10"
                          data-ocid="profile.settings.privacy.pin.input"
                        />
                        <Input
                          type="password"
                          maxLength={4}
                          value={confirmPin}
                          onChange={(e) =>
                            setConfirmPin(
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          placeholder="पिन दोबारा डालें"
                          className="text-sm h-10"
                          data-ocid="profile.settings.privacy.confirm_pin.input"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              if (
                                newPin.length === 4 &&
                                newPin === confirmPin
                              ) {
                                localStorage.setItem("mk_user_pin", newPin);
                                setPinChangeMode(false);
                                setNewPin("");
                                setConfirmPin("");
                                toast.success("पिन बदल गया! ✅");
                              } else {
                                toast.error("4-अंक पिन डालें और दोनों एक जैसे हों");
                              }
                            }}
                            data-ocid="profile.settings.privacy.pin.save_button"
                          >
                            सेव करें
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setPinChangeMode(false);
                              setNewPin("");
                              setConfirmPin("");
                            }}
                            data-ocid="profile.settings.privacy.pin.cancel_button"
                          >
                            रद्द
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={() => setPinChangeMode(true)}
                        data-ocid="profile.settings.privacy.change_pin.button"
                      >
                        🔑 पिन बदलें
                      </Button>
                    )}
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      ब्लॉक लिस्ट
                    </p>
                    <div
                      className="bg-muted/40 rounded-lg p-3 text-center text-muted-foreground text-xs"
                      data-ocid="profile.settings.privacy.blocklist.empty_state"
                    >
                      🚫 कोई ब्लॉक नहीं किया गया
                    </div>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      एक्टिविटी लॉग
                    </p>
                    <p className="text-xs text-muted-foreground">
                      आखिरी लॉगिन:{" "}
                      {localStorage.getItem("mk_last_login") || "उपलब्ध नहीं"}
                    </p>
                  </div>
                </SettingsSection>

                {/* Section 4: Notification Settings */}
                <SettingsSection
                  icon="🔔"
                  title="नोटिफिकेशन सेटिंग्स"
                  sectionKey="notifications"
                  openSections={openSections}
                  toggleSection={toggleSection}
                  ocid="profile.settings.notifications.panel"
                >
                  <ToggleRow
                    label="पुश नोटिफिकेशन"
                    desc="सभी नोटिफिकेशन"
                    value={notifPush}
                    onToggle={() => {
                      const n = !notifPush;
                      setNotifPush(n);
                      localStorage.setItem("mk_notif_push", String(n));
                    }}
                    ocid="profile.settings.notifications.push.toggle"
                  />
                  <div className="border-t border-border" />
                  <ToggleRow
                    label="पेमेंट अलर्ट"
                    desc="लेनदेन की सूचना"
                    value={notifPayment}
                    onToggle={() => {
                      const n = !notifPayment;
                      setNotifPayment(n);
                      localStorage.setItem("mk_notif_payment", String(n));
                    }}
                    ocid="profile.settings.notifications.payment.toggle"
                  />
                  <div className="border-t border-border" />
                  <ToggleRow
                    label="म्यूट करें"
                    desc={
                      notifMute ? "🔕 नोटिफिकेशन बंद है" : "सब नोटिफिकेशन म्यूट करें"
                    }
                    value={notifMute}
                    onToggle={() => {
                      const n = !notifMute;
                      setNotifMute(n);
                      localStorage.setItem("mk_notif_mute", String(n));
                    }}
                    ocid="profile.settings.notifications.mute.toggle"
                  />
                </SettingsSection>

                {/* Section 5: Display & Media */}
                <SettingsSection
                  icon="🎨"
                  title="डिस्प्ले और मीडिया"
                  sectionKey="display"
                  openSections={openSections}
                  toggleSection={toggleSection}
                  ocid="profile.settings.display.panel"
                >
                  <ToggleRow
                    label={dark ? "🌙 डार्क मोड" : "☀️ लाइट मोड"}
                    desc={dark ? "रात की तरह काला थीम" : "उज्जवल और साफ थीम"}
                    value={dark}
                    onToggle={toggleDark}
                    ocid="profile.darkmode.toggle"
                  />
                  <div className="border-t border-border" />
                  <div className="py-2">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      थीम चुनें
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {(
                        [
                          {
                            id: "royal-gold" as ThemeName,
                            icon: "🌟",
                            name: "Royal Gold",
                            preview: "oklch(0.86 0.08 72)",
                          },
                          {
                            id: "night-black" as ThemeName,
                            icon: "🌙",
                            name: "Night Black",
                            preview: "oklch(0.12 0.02 40)",
                          },
                          {
                            id: "diamond-silver" as ThemeName,
                            icon: "💎",
                            name: "Diamond Silver",
                            preview: "oklch(0.97 0.005 240)",
                          },
                        ] as const
                      ).map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setTheme(th.id)}
                          data-ocid={`profile.settings.display.${th.id}.button`}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 transition-all text-left ${appTheme === th.id ? "border-primary" : "border-border hover:border-primary/40"}`}
                        >
                          <div
                            className="w-7 h-7 rounded-lg shrink-0 border border-border flex items-center justify-center text-sm"
                            style={{ background: th.preview }}
                          >
                            {th.icon}
                          </div>
                          <span
                            className={`text-sm font-semibold ${appTheme === th.id ? "text-primary" : "text-foreground"}`}
                          >
                            {th.name}
                          </span>
                          {appTheme === th.id && (
                            <span className="ml-auto text-primary text-xs">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border" />
                  <ToggleRow
                    label="डाटा सेवर"
                    desc={
                      dataSaver ? "वीडियो कम क्वालिटी में चलेंगे" : "सामान्य क्वालिटी"
                    }
                    value={dataSaver}
                    onToggle={() => {
                      const n = !dataSaver;
                      setDataSaver(n);
                      localStorage.setItem("mk_data_saver", String(n));
                    }}
                    ocid="profile.settings.display.datasaver.toggle"
                  />
                  <div className="border-t border-border" />
                  <ToggleRow
                    label="ऑटो-प्ले"
                    desc="वीडियो अपने आप चलें"
                    value={autoPlay}
                    onToggle={() => {
                      const n = !autoPlay;
                      setAutoPlay(n);
                      localStorage.setItem("mk_autoplay", String(n));
                    }}
                    ocid="profile.settings.display.autoplay.toggle"
                  />
                  <div className="border-t border-border" />
                  <div className="py-2">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      🌐 भाषा चुनें
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleLangSelect(lang.code)}
                          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-all ${selectedLang === lang.code ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border hover:bg-accent"}`}
                          data-ocid="profile.settings.language.button"
                        >
                          <span>{lang.name}</span>
                          {selectedLang === lang.code && (
                            <span className="ml-auto">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </SettingsSection>

                {/* Section 6: Help & Support */}
                <SettingsSection
                  icon="❓"
                  title="सपोर्ट और हेल्प"
                  sectionKey="help"
                  openSections={openSections}
                  toggleSection={toggleSection}
                  ocid="profile.settings.help.panel"
                >
                  {/* Help Center */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => setHelpExpanded(!helpExpanded)}
                      className="flex items-center justify-between w-full py-1"
                      data-ocid="profile.settings.help.helpcenter.button"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        📚 हेल्प सेंटर
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {helpExpanded ? "▲" : "▼"}
                      </span>
                    </button>
                    {helpExpanded && (
                      <div className="mt-2 flex flex-col gap-1 pl-2">
                        {[
                          "🪙 किंगडम कॉइन्स कैसे कमाएं?",
                          "🎥 वीडियो कैसे डालें?",
                          "🎁 गिफ्ट कैसे भेजें?",
                          "👥 फॉलो कैसे करें?",
                          "🔒 अकाउंट सुरक्षित कैसे रखें?",
                          "🛒 बाज़ार में कैसे खरीदें?",
                        ].map((tip) => (
                          <p
                            key={tip}
                            className="text-xs text-muted-foreground py-1 border-b border-border/40 last:border-0"
                          >
                            {tip}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border my-2" />
                  {/* Report Issue */}
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      🚨 समस्या रिपोर्ट करें
                    </p>
                    {reportSent ? (
                      <div
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center"
                        data-ocid="profile.settings.help.report.success_state"
                      >
                        <p className="text-sm font-bold text-green-600">
                          ✅ रिपोर्ट मिल गई!
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          जल्द जवाब मिलेगा
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Textarea
                          value={reportText}
                          onChange={(e) => setReportText(e.target.value)}
                          placeholder="अपनी समस्या लिखें..."
                          className="text-sm min-h-[70px]"
                          data-ocid="profile.settings.help.report.textarea"
                        />
                        <Button
                          size="sm"
                          disabled={!reportText.trim()}
                          onClick={() => {
                            const reports = JSON.parse(
                              localStorage.getItem("mk_reports") || "[]",
                            );
                            reports.push({
                              text: reportText,
                              time: new Date().toLocaleString("hi-IN"),
                              user: displayName,
                            });
                            localStorage.setItem(
                              "mk_reports",
                              JSON.stringify(reports),
                            );
                            setReportText("");
                            setReportSent(true);
                            setTimeout(() => setReportSent(false), 4000);
                          }}
                          data-ocid="profile.settings.help.report.submit_button"
                        >
                          📤 भेजें
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border my-2" />
                  {/* Delete Account */}
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      अकाउंट डिलीट करें
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      यह action पूर्ववत नहीं हो सकता
                    </p>
                    {deleteConfirmOpen ? (
                      <div
                        className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex flex-col gap-2"
                        data-ocid="profile.settings.help.delete.dialog"
                      >
                        <p className="text-sm font-bold text-destructive text-center">
                          ⚠️ क्या आप सच में अकाउंट डिलीट करना चाहते हैं?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => {
                              localStorage.clear();
                              window.location.reload();
                            }}
                            data-ocid="profile.settings.help.delete.confirm_button"
                          >
                            हाँ, डिलीट करें
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDeleteConfirmOpen(false)}
                            data-ocid="profile.settings.help.delete.cancel_button"
                          >
                            रद्द करें
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-fit"
                        onClick={() => setDeleteConfirmOpen(true)}
                        data-ocid="profile.settings.help.delete_button"
                      >
                        🗑️ अकाउंट डिलीट करें
                      </Button>
                    )}
                  </div>
                  <div className="border-t border-border my-2" />
                  {/* English Guru AI */}
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      🎓 English Guru AI
                    </p>
                    <EnglishGuruAI />
                  </div>
                  <div className="border-t border-border my-2" />
                  {/* Spin Wheel */}
                  <div className="py-1">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      🎡 भाग्य चक्र
                    </p>
                    <SpinWheel />
                  </div>
                </SettingsSection>

                {/* Admin Stats (password-protected) */}
                {isAdmin && (
                  <SettingsSection
                    icon="📊"
                    title="Admin Stats"
                    sectionKey="admin-stats"
                    openSections={openSections}
                    toggleSection={toggleSection}
                    ocid="profile.settings.admin_stats.panel"
                  >
                    {!adminVerified ? (
                      <div className="flex flex-col gap-3 py-2">
                        <div className="text-center">
                          <span className="text-3xl block mb-2">🔐</span>
                          <p className="font-bold text-foreground">
                            Admin पहचान verify करें
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
                          className={`text-sm h-10 ${pinError ? "border-destructive" : ""}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdminVerify();
                          }}
                          data-ocid="profile.settings.admin_stats.input"
                        />
                        {pinError && (
                          <p className="text-destructive text-xs font-semibold text-center">
                            ❌ गलत password
                          </p>
                        )}
                        <Button
                          onClick={handleAdminVerify}
                          disabled={!pinInput.trim()}
                          className="w-full font-bold h-10"
                          data-ocid="profile.settings.admin_stats.verify_button"
                        >
                          Verify करें 🔓
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 py-2">
                        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 text-center">
                          <p className="text-xs text-muted-foreground mb-1 font-semibold">
                            कुल App Loads
                          </p>
                          <p className="text-4xl font-black text-primary">
                            {appLoads}
                          </p>
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Admin फ़ीस
                          </p>
                          <p className="text-2xl font-black text-amber-600">
                            ₹{adminBalance.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleShowStats}
                          className="w-full font-bold h-10"
                          data-ocid="profile.settings.admin_stats.refresh_button"
                        >
                          🔄 Refresh
                        </Button>
                      </div>
                    )}
                  </SettingsSection>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground underline self-start"
        data-ocid="profile.link"
      >
        ← होम पर वापस जाएं
      </button>
    </div>
  );
}
