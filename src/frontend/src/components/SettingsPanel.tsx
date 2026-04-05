import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDarkMode } from "../hooks/useDarkMode";
import { type ThemeName, useTheme } from "../hooks/useTheme";
import { setLanguage, useLanguage } from "../utils/i18n";
import EnglishGuruAI from "./EnglishGuruAI";
import GamesPanel from "./GamesPanel";

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
  { code: "as", name: "অসমীয়া", label: "Assamese" },
  { code: "mni", name: "মৈতৈলোন‌", label: "Manipuri" },
  { code: "kok", name: "कोंकणी", label: "Konkani" },
  { code: "mai", name: "मैथिली", label: "Maithili" },
  { code: "doi", name: "डोगरी", label: "Dogri" },
  { code: "ks", name: "كۂشُر", label: "Kashmiri" },
  { code: "sa", name: "संस्कृतम्", label: "Sanskrit" },
  { code: "sd", name: "سنڈي", label: "Sindhi" },
  { code: "bo", name: "བོད་སཀད་", label: "Bodo" },
  { code: "sat", name: "ṥᨼᨭᨼᨢᨨᨩᨸᨭ", label: "Santali" },
  { code: "ne", name: "नेपाली", label: "Nepali" },
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
  { code: "vi", name: "Tiếng Việt", label: "Vietnamese" },
  { code: "id", name: "Bahasa Indonesia", label: "Indonesian" },
  { code: "ms", name: "Bahasa Melayu", label: "Malay" },
  { code: "th", name: "ภาษาไทย", label: "Thai" },
  { code: "it", name: "Italiano", label: "Italian" },
  { code: "nl", name: "Nederlands", label: "Dutch" },
  { code: "pl", name: "Polski", label: "Polish" },
];

const THEMES: {
  id: ThemeName;
  icon: string;
  name: string;
  desc: string;
  preview: string;
}[] = [
  {
    id: "royal-gold",
    icon: "🌟",
    name: "Royal Gold",
    desc: "गर्म earthy tones — डिफ़ाल्ट",
    preview: "oklch(0.96 0.02 72)",
  },
  {
    id: "night-black",
    icon: "🌙",
    name: "Night Black",
    desc: "गहरा काला और सोना",
    preview: "oklch(0.12 0.02 40)",
  },
  {
    id: "diamond-silver",
    icon: "📎",
    name: "Diamond Silver",
    desc: "ठंडा silver और blue",
    preview: "oklch(0.97 0.005 240)",
  },
];

const ACTIVITY_ITEMS = [
  `आज — Money Kingdom खोला (${new Date().toLocaleDateString("hi-IN")})`,
  "कल — Reels देखीं",
  "2 दिन पहले — Wallet चेक किया",
];

const MOCK_DEVICES = [
  {
    id: "d1",
    device: "Samsung Galaxy S23",
    location: "मुंबई, India",
    time: "आज 10:45 AM",
    current: true,
  },
  {
    id: "d2",
    device: "Chrome Browser — Windows",
    location: "दिल्ली, India",
    time: "कल 8:20 PM",
    current: false,
  },
  {
    id: "d3",
    device: "iPhone 14 — Safari",
    location: "Bangalore, India",
    time: "3 दिन पहले",
    current: false,
  },
];

function getStoredLang() {
  return localStorage.getItem("mk_language") ?? "hi";
}

function getProfile() {
  try {
    const raw = localStorage.getItem("mk_user_profile");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getWallet() {
  try {
    const raw = localStorage.getItem("mk_wallet");
    if (!raw) return { coins: 0, cash: 0 };
    const p = JSON.parse(raw);
    return { coins: p.coins ?? 0, cash: p.cash ?? 0 };
  } catch {
    return { coins: 0, cash: 0 };
  }
}

function getTransactions() {
  try {
    const raw = localStorage.getItem("mk_transactions");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getBool(key: string, def: boolean): boolean {
  const v = localStorage.getItem(key);
  if (v === null) return def;
  return v === "true";
}

function setBool(key: string, v: boolean) {
  localStorage.setItem(key, String(v));
}

function saveUserSettings(patch: Record<string, string | boolean | number>) {
  try {
    const raw = localStorage.getItem("mk_user_settings");
    const existing = raw ? JSON.parse(raw) : {};
    const updated = { ...existing, ...patch };
    localStorage.setItem("mk_user_settings", JSON.stringify(updated));
  } catch {}
}

type TxFilter = "all" | "today" | "yesterday" | "month";

function filterTx(txList: any[], filter: TxFilter) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return txList.filter((tx) => {
    if (filter === "all") return true;
    try {
      const d = new Date(tx.time);
      if (filter === "today") return d >= today;
      if (filter === "yesterday") return d >= yesterday && d < today;
      if (filter === "month") return d >= monthStart;
    } catch {}
    return true;
  });
}

// ──────────────────────────────────────────────
function AccountTab() {
  const prof = getProfile();
  const [name, setName] = useState(prof.name ?? "");
  const [username, setUsername] = useState(prof.username ?? "");
  const [nickname, setNickname] = useState(
    localStorage.getItem("mk_nickname") ?? "",
  );
  const [bio, setBio] = useState(prof.bio ?? "");
  const [email, setEmail] = useState(prof.email ?? "");
  const [isPublic, setIsPublic] = useState(
    localStorage.getItem("mk_account_type") !== "private",
  );
  const [accountType, setAccountType] = useState(
    localStorage.getItem("mk_account_type_v2") ?? "personal",
  );
  // Avatar colors
  const [crownColor, setCrownColor] = useState(
    localStorage.getItem("mk_avatar_crown") ?? "#FFD700",
  );
  const [clothesColor, setClothesColor] = useState(
    localStorage.getItem("mk_avatar_clothes") ?? "#1a1a2e",
  );
  const [skinTone, setSkinTone] = useState(
    localStorage.getItem("mk_avatar_skin") ?? "#d4a76a",
  );
  const [verifySubmitted, setVerifySubmitted] = useState(
    localStorage.getItem("mk_verify_requested") === "true",
  );

  const save = () => {
    const updated = { ...prof, name, username, bio, email };
    localStorage.setItem("mk_user_profile", JSON.stringify(updated));
    localStorage.setItem("mk_account_type", isPublic ? "public" : "private");
    localStorage.setItem("mk_nickname", nickname);
    saveUserSettings({
      nickname,
      accountType,
      crownColor,
      clothesColor,
      skinTone,
    });
    toast.success("प्रोफाइल सेव हो गई ✅");
  };

  const setAccType = (t: string) => {
    setAccountType(t);
    localStorage.setItem("mk_account_type_v2", t);
  };

  const handleVerify = (type: "gold" | "blue") => {
    localStorage.setItem("mk_verify_requested", "true");
    setVerifySubmitted(true);
    toast.success(
      type === "gold"
        ? "Gold Tick के लिए request submit हो गई! 👑"
        : "Blue Tick के लिए request submit हो गई! ✅",
    );
  };

  const CROWN_COLORS = ["#FFD700", "#C0C0C0", "#b5651d", "#e74c3c", "#8e44ad"];
  const CLOTHES_COLORS = [
    "#1a1a2e",
    "#2c3e50",
    "#e74c3c",
    "#27ae60",
    "#2980b9",
  ];
  const SKIN_TONES = ["#d4a76a", "#c68642", "#8d5524", "#f1c27d", "#e0ac69"];

  const ACC_TYPES = [
    { id: "personal", emoji: "👤", label: "Personal" },
    { id: "business", emoji: "💼", label: "Business" },
    { id: "royal", emoji: "👑", label: "Royal" },
  ];

  const LINKED_ACCOUNTS = [
    { id: "facebook", emoji: "📘", label: "Facebook" },
    { id: "instagram", emoji: "📸", label: "Instagram" },
    { id: "google", emoji: "🔵", label: "Google" },
  ];

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="👤" title="प्रोफाइल एडिट" />
      <div className="flex flex-col gap-3">
        <Field label="नाम">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="आपका पूरा नाम"
            data-ocid="settings.account.name_input"
          />
        </Field>
        <Field label="यूजरनेम (@handle)">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@your_kingdom"
            data-ocid="settings.account.username_input"
          />
        </Field>
        <Field label="शाही नाम (Nickname)">
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="जैसे: महाराज पवन, KingPawan..."
            data-ocid="settings.account.nickname_input"
          />
          <p className="text-xs text-muted-foreground mt-1">
            यह नाम आपके username के नीचे display होगा
          </p>
        </Field>
        <Field label="बायो">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="अपने बारे में लिखें..."
            rows={3}
            data-ocid="settings.account.bio_textarea"
          />
        </Field>
      </div>

      <SectionTitle icon="📋" title="पर्सनल जानकारी" />
      <div className="flex flex-col gap-3">
        <Field label="ईमेल">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            type="email"
            data-ocid="settings.account.email_input"
          />
        </Field>
        <Field label="मोबाइल नंबर">
          <div className="px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm">
            {prof.mobile ?? "—"}
          </div>
        </Field>
      </div>

      {/* Avatar Editor */}
      <SectionTitle icon="🎭" title="Avatar Editor" />
      <div className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col gap-4">
        {/* Avatar preview */}
        <div className="flex items-center justify-center">
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4"
            style={{ background: skinTone, borderColor: crownColor }}
          >
            <span className="text-3xl">😊</span>
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
              👑
            </span>
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{ background: clothesColor }}
            />
          </div>
        </div>
        <ColorPicker
          label="मुकुट का रंग (Crown)"
          colors={CROWN_COLORS}
          value={crownColor}
          onChange={(c) => {
            setCrownColor(c);
            localStorage.setItem("mk_avatar_crown", c);
          }}
        />
        <ColorPicker
          label="कपड़ों का रंग (Clothes)"
          colors={CLOTHES_COLORS}
          value={clothesColor}
          onChange={(c) => {
            setClothesColor(c);
            localStorage.setItem("mk_avatar_clothes", c);
          }}
        />
        <ColorPicker
          label="त्वचा का रंग (Skin Tone)"
          colors={SKIN_TONES}
          value={skinTone}
          onChange={(c) => {
            setSkinTone(c);
            localStorage.setItem("mk_avatar_skin", c);
          }}
        />
      </div>

      {/* Verification */}
      <SectionTitle icon="✅" title="Kingdom Verification" />
      <div
        className="rounded-2xl border-2 p-4 flex flex-col gap-3"
        style={{ borderColor: "#FFD700", background: "rgba(255,215,0,0.05)" }}
      >
        <p className="text-sm text-muted-foreground">
          Verified Badge लगाएं और Kingdom में अपनी पहचान बनाएं!
        </p>
        {verifySubmitted ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <span className="text-2xl">✅</span>
            <p className="text-sm font-semibold text-green-400">
              Request submit हो गई! Admin review करेंगे।
            </p>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => handleVerify("gold")}
              className="flex-1 text-xs font-bold"
              style={{ background: "#FFD700", color: "#000" }}
              data-ocid="settings.account.gold_verify_button"
            >
              👑 Gold Tick
            </Button>
            <Button
              onClick={() => handleVerify("blue")}
              variant="outline"
              className="flex-1 text-xs font-bold border-blue-500 text-blue-400 hover:bg-blue-500/10"
              data-ocid="settings.account.blue_verify_button"
            >
              ✅ Blue Tick
            </Button>
          </div>
        )}
      </div>

      {/* Account Type */}
      <SectionTitle icon="👑" title="अकाउंट टाइप" />
      <div className="flex gap-2">
        {ACC_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAccType(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
              accountType === t.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/40"
            }`}
            data-ocid={`settings.account.${t.id}.button`}
          >
            <span className="text-xl">{t.emoji}</span>
            <span
              className={`text-xs font-bold ${
                accountType === t.id ? "text-primary" : "text-foreground"
              }`}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Linked Accounts */}
      <SectionTitle icon="🔗" title="Linked Accounts" />
      <div className="flex flex-col gap-2">
        {LINKED_ACCOUNTS.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{acc.emoji}</span>
              <span className="text-sm font-semibold text-foreground">
                {acc.label}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-primary text-primary"
              onClick={() => toast.info(`${acc.label} — जल्द आ रहा है! 🚀`)}
              data-ocid={`settings.account.${acc.id}.button`}
            >
              जोड़ें
            </Button>
          </div>
        ))}
      </div>

      <SectionTitle icon="👑" title="Kingdom Title" />
      <KingdomTitleSelector />

      <SectionTitle icon="⚪" title="Profile Border Style" />
      <ProfileBorderSelector />

      <SectionTitle icon="✍️" title="Bio Font Style" />
      <BioFontSelector />

      <SectionTitle icon="🔓" title="अकाउंट विजिबिलिटी" />
      <ToggleRow
        label={isPublic ? "Public" : "Private"}
        desc={
          isPublic
            ? "सभी लोग आपकी प्रोफाइल देख सकते हैं"
            : "सिर्फ आपके followers देख सकते हैं"
        }
        value={isPublic}
        onChange={(v) => setIsPublic(v)}
        ocid="settings.account.public_switch"
      />

      <Button
        onClick={save}
        data-ocid="settings.account.save_button"
        className="w-full"
      >
        💾 सेव करें
      </Button>
    </div>
  );
}

function WalletTab() {
  const wallet = getWallet();
  const [txFilter, setTxFilter] = useState<TxFilter>("all");
  const allTx = getTransactions();
  const txList = filterTx(allTx, txFilter).slice(0, 20);
  const [upiId, setUpiId] = useState(localStorage.getItem("mk_upi_id") ?? "");
  const [withdrawLimit, setWithdrawLimit] = useState(
    localStorage.getItem("mk_withdraw_limit") ?? "500",
  );
  const [giftingPref, setGiftingPref] = useState(
    localStorage.getItem("mk_gifting_pref") ?? "all",
  );

  const saveUpi = () => {
    localStorage.setItem("mk_upi_id", upiId);
    toast.success("UPI ID सेव हो गई ✅");
  };

  const saveWithdrawLimit = () => {
    localStorage.setItem("mk_withdraw_limit", withdrawLimit);
    saveUserSettings({ withdrawLimit });
    toast.success(`Daily withdrawal limit: ${withdrawLimit} coins ✅`);
  };

  const withdraw = () => {
    toast.info("आपकी withdrawal request भेज दी गई है। 24 घंटे में process होगी। 🏦");
  };

  const FILTER_BTNS: { key: TxFilter; label: string }[] = [
    { key: "all", label: "सभी" },
    { key: "today", label: "आज" },
    { key: "yesterday", label: "कल" },
    { key: "month", label: "पिछला महीना" },
  ];

  const GIFTING_OPTIONS = [
    { value: "all", label: "सभी" },
    { value: "friends", label: "सिर्फ दोस्त" },
    { value: "none", label: "कोई नहीं" },
  ];

  const ADMIN_COMMISSION_RATE = 0.05; // 5%

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="💰" title="बैलेंस" />
      <div className="rounded-2xl border border-border bg-muted/40 p-5 text-center">
        <p className="text-5xl font-bold text-primary">{wallet.coins}</p>
        <p className="text-muted-foreground text-sm mt-1">🪙 Kingdom Coins</p>
        {wallet.cash > 0 && (
          <p className="text-foreground text-lg font-semibold mt-2">
            ₹{wallet.cash} Cash
          </p>
        )}
      </div>

      <SectionTitle icon="💱" title="Currency Display" />
      <CurrencyDisplaySwitch />

      <SectionTitle icon="💳" title="पेमेंट मेथड" />
      <div className="flex gap-2 items-center">
        <span className="text-2xl">📱</span>
        <span className="text-sm text-muted-foreground">GPay / PhonePe</span>
      </div>
      <Field label="UPI ID">
        <div className="flex gap-2">
          <Input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            data-ocid="settings.wallet.upi_input"
          />
          <Button
            onClick={saveUpi}
            size="sm"
            data-ocid="settings.wallet.save_upi_button"
          >
            सेव
          </Button>
        </div>
      </Field>

      {/* Withdrawal Limit */}
      <SectionTitle icon="🏦" title="Withdrawal Limit (Daily)" />
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          एक दिन में अधिकतम कितने coins निकाले जा सकते हैं
        </p>
        <div className="flex gap-2">
          <Input
            type="number"
            value={withdrawLimit}
            onChange={(e) => setWithdrawLimit(e.target.value)}
            placeholder="500"
            min="0"
            className="flex-1"
            data-ocid="settings.wallet.withdraw_limit_input"
          />
          <Button
            onClick={saveWithdrawLimit}
            size="sm"
            data-ocid="settings.wallet.save_limit_button"
          >
            सेट करें
          </Button>
        </div>
      </div>

      {/* Gifting Settings */}
      <SectionTitle icon="🎁" title="Gifting Settings" />
      <p className="text-xs text-muted-foreground -mt-3">
        कौन आपको gift भेज सकता है?
      </p>
      <div className="flex gap-2">
        {GIFTING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setGiftingPref(opt.value);
              localStorage.setItem("mk_gifting_pref", opt.value);
              saveUserSettings({ giftingPref: opt.value });
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
              giftingPref === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.wallet.gifting.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="📜" title="Transaction History" />
      {/* Filter buttons */}
      <div className="flex gap-2">
        {FILTER_BTNS.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setTxFilter(btn.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              txFilter === btn.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid={`settings.wallet.filter.${btn.key}.button`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Tax & Commission info box */}
      <div className="rounded-xl border border-border bg-amber-500/5 p-3 flex items-start gap-2">
        <span className="text-lg mt-0.5">📊</span>
        <div className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">Tax & Commission:</span>{" "}
          हर transaction पर Admin का{" "}
          <span className="text-primary font-bold">
            {(ADMIN_COMMISSION_RATE * 100).toFixed(0)}%
          </span>{" "}
          हिस्सा कटता है। यह राशि Prince Pawan Kumar के Kingdom Fund में जाती है।
        </div>
      </div>

      {txList.length === 0 ? (
        <div
          className="text-center text-muted-foreground text-sm py-6"
          data-ocid="settings.wallet.empty_state"
        >
          इस समयावधि में कोई transaction नहीं हुई
        </div>
      ) : (
        <div className="flex flex-col gap-2" data-ocid="settings.wallet.table">
          {txList.map((tx: any, i: number) => (
            <div
              key={tx.id ?? `tx-${i}`}
              data-ocid={`settings.wallet.item.${i + 1}`}
              className="flex flex-col p-3 rounded-xl bg-muted/40 border border-border gap-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{tx.desc}</p>
                <span
                  className={`font-bold text-sm ${
                    tx.type === "credit" ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {tx.amount} 🪙
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{tx.time}</p>
                {tx.type === "debit" && (
                  <span className="text-xs text-amber-400">
                    Admin Commission: ₹
                    {(Number(tx.amount) * ADMIN_COMMISSION_RATE).toFixed(2)} कटा
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={withdraw}
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary/10"
        data-ocid="settings.wallet.withdraw_button"
      >
        🏦 Withdraw Request भेजें
      </Button>
    </div>
  );
}

function PrivacyTab() {
  const [pinForm, setPinForm] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [ghostMode, setGhostMode] = useState(() =>
    getBool("mk_ghost_mode", false),
  );
  const [storyPrivacy, setStoryPrivacy] = useState(
    localStorage.getItem("mk_story_privacy") ?? "all",
  );
  const [loggedOutDevices, setLoggedOutDevices] = useState<string[]>([]);

  const changePin = () => {
    const stored = localStorage.getItem("mk_pin") ?? "";
    if (stored && currentPin !== stored) {
      toast.error("गलत PIN");
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast.error("4 अंकों का PIN दर्ज करें");
      return;
    }
    localStorage.setItem("mk_pin", newPin);
    setCurrentPin("");
    setNewPin("");
    setPinForm(false);
    toast.success("PIN बदल गया ✅");
  };

  const STORY_OPTIONS = [
    { value: "all", label: "सभी" },
    { value: "friends", label: "सिर्फ दोस्त" },
    { value: "none", label: "कोई नहीं" },
  ];

  const logoutDevice = (id: string) => {
    setLoggedOutDevices((prev) => [...prev, id]);
    toast.success("डिवाइस से Logout कर दिया गया ✅");
  };

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="🔐" title="PIN बदलें" />
      {!pinForm ? (
        <Button
          variant="outline"
          onClick={() => setPinForm(true)}
          data-ocid="settings.privacy.pin_button"
        >
          🔑 PIN बदलें
        </Button>
      ) : (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-muted/30">
          <Field label="मौजूदा PIN">
            <Input
              type="password"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••"
              data-ocid="settings.privacy.current_pin_input"
            />
          </Field>
          <Field label="नया PIN (4 अंक)">
            <Input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••"
              data-ocid="settings.privacy.new_pin_input"
            />
          </Field>
          <div className="flex gap-2">
            <Button
              onClick={changePin}
              data-ocid="settings.privacy.save_pin_button"
              className="flex-1"
            >
              सेव करें
            </Button>
            <Button
              variant="outline"
              onClick={() => setPinForm(false)}
              data-ocid="settings.privacy.cancel_button"
              className="flex-1"
            >
              रद्द करें
            </Button>
          </div>
        </div>
      )}

      {/* 2FA */}
      <SectionTitle icon="🛡️" title="Two-Factor Authentication (2FA)" />
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/30 border border-border cursor-pointer text-left hover:bg-muted/50 transition-colors"
        onClick={() =>
          toast.info("Fingerprint / Face ID Login — जल्द आ रहा है! 🔐")
        }
        data-ocid="settings.privacy.twofa_toggle"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            Fingerprint / Face ID Login
          </span>
          <span className="text-xs text-muted-foreground">
            Biometric से secure login (जल्द आ रहा है)
          </span>
        </div>
        <div className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
          जल्द
        </div>
      </button>

      {/* Ghost Mode */}
      <SectionTitle icon="👻" title="Ghost Mode" />
      <ToggleRow
        label="ऑनलाइन स्टेटस छुपाएं"
        desc="कोई नहीं जान पाएगा कि आप ऑनलाइन हैं"
        value={ghostMode}
        onChange={(v) => {
          setGhostMode(v);
          setBool("mk_ghost_mode", v);
          saveUserSettings({ ghostMode: v });
        }}
        ocid="settings.privacy.ghost_switch"
      />

      {/* Story Privacy */}
      <SectionTitle icon="📸" title="Story Privacy" />
      <div className="flex gap-2">
        {STORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setStoryPrivacy(opt.value);
              localStorage.setItem("mk_story_privacy", opt.value);
              saveUserSettings({ storyPrivacy: opt.value });
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
              storyPrivacy === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.privacy.story.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ScreenshotBlockToggle />

      <SectionTitle icon="🚫" title="Block List" />
      <div
        className="text-center text-muted-foreground text-sm py-4"
        data-ocid="settings.privacy.empty_state"
      >
        😊 कोई blocked user नहीं
      </div>

      <SectionTitle icon="📋" title="Activity Log" />
      <div className="flex flex-col gap-2">
        {ACTIVITY_ITEMS.map((a) => (
          <div
            key={a}
            className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border text-sm text-foreground"
          >
            <span>🟢</span>
            <span>{a}</span>
          </div>
        ))}
      </div>

      {/* Login Activity */}
      <SectionTitle icon="📱" title="Login Activity" />
      <p className="text-xs text-muted-foreground -mt-3">
        इन devices पर आपका account खुला है
      </p>
      <div className="flex flex-col gap-2">
        {MOCK_DEVICES.map((device, i) => (
          <div
            key={device.id}
            data-ocid={`settings.privacy.device.item.${i + 1}`}
            className={`p-3 rounded-xl border flex flex-col gap-2 ${
              device.current
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-muted/20"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">📱</span>
                  <span className="text-sm font-semibold text-foreground">
                    {device.device}
                  </span>
                  {device.current && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                      यह Device
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  📍 {device.location} · 🕐 {device.time}
                </p>
              </div>
              {!device.current && !loggedOutDevices.includes(device.id) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-destructive text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => logoutDevice(device.id)}
                  data-ocid="settings.privacy.logout.button"
                >
                  Logout
                </Button>
              )}
              {loggedOutDevices.includes(device.id) && (
                <span className="text-xs text-muted-foreground">
                  Logged out
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [push, setPush] = useState(() => getBool("mk_notif_push", true));
  const [payment, setPayment] = useState(() =>
    getBool("mk_notif_payment", true),
  );
  const [mute, setMute] = useState(() => getBool("mk_notif_mute", false));
  const [quietHours, setQuietHours] = useState(() =>
    getBool("mk_quiet_hours", false),
  );
  const [quietFrom, setQuietFrom] = useState(
    localStorage.getItem("mk_quiet_from") ?? "22:00",
  );
  const [quietTo, setQuietTo] = useState(
    localStorage.getItem("mk_quiet_to") ?? "07:00",
  );
  const [alertStyle, setAlertStyle] = useState(
    localStorage.getItem("mk_alert_style") ?? "center",
  );
  const [coinChime, setCoinChime] = useState(() =>
    getBool("mk_coin_chime", true),
  );

  return (
    <div className="px-4 py-4 flex flex-col gap-4 border-b border-border/40">
      <SectionTitle icon="🔔" title="नोटिफिकेशन" />
      <ToggleRow
        label="Push Notifications"
        desc="नई रील, लाइक, कमेंट पर अलर्ट"
        value={push}
        onChange={(v) => {
          setPush(v);
          setBool("mk_notif_push", v);
          saveUserSettings({ pushNotifications: v });
        }}
        ocid="settings.notif.push_switch"
      />
      <ToggleRow
        label="Payment Alerts"
        desc="जब भी coins मिलें या जाएं"
        value={payment}
        onChange={(v) => {
          setPayment(v);
          setBool("mk_notif_payment", v);
          saveUserSettings({ paymentAlerts: v });
        }}
        ocid="settings.notif.payment_switch"
      />
      <ToggleRow
        label="सब Mute"
        desc="सभी नोटिफिकेशन बंद करें"
        value={mute}
        onChange={(v) => {
          setMute(v);
          setBool("mk_notif_mute", v);
          saveUserSettings({ muteAll: v });
        }}
        ocid="settings.notif.mute_switch"
      />

      {/* Alert Style */}
      <SectionTitle icon="📢" title="Alert Style" />
      <p className="text-xs text-muted-foreground -mt-3">Alerts कहाँ दिखें?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setAlertStyle("center");
            localStorage.setItem("mk_alert_style", "center");
            saveUserSettings({ alertStyle: "center" });
          }}
          className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
            alertStyle === "center"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/40"
          }`}
          data-ocid="settings.notif.alert.center.button"
        >
          <div className="w-12 h-16 rounded-lg border-2 border-muted bg-muted/30 flex items-center justify-center relative">
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-4 bg-primary/60 rounded" />
          </div>
          <span
            className={`text-xs font-bold ${alertStyle === "center" ? "text-primary" : "text-foreground"}`}
          >
            बीच में (Center)
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAlertStyle("top");
            localStorage.setItem("mk_alert_style", "top");
            saveUserSettings({ alertStyle: "top" });
          }}
          className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
            alertStyle === "top"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/40"
          }`}
          data-ocid="settings.notif.alert.top.button"
        >
          <div className="w-12 h-16 rounded-lg border-2 border-muted bg-muted/30 flex items-center justify-center relative">
            <div className="absolute inset-x-2 top-1 h-4 bg-primary/60 rounded" />
          </div>
          <span
            className={`text-xs font-bold ${alertStyle === "top" ? "text-primary" : "text-foreground"}`}
          >
            ऊपर (Top)
          </span>
        </button>
      </div>

      {/* Coin Chime */}
      <ToggleRow
        label="Coin Chime Sound 🪙"
        desc="सिक्के मिलने पर खनक की आवाज़"
        value={coinChime}
        onChange={(v) => {
          setCoinChime(v);
          setBool("mk_coin_chime", v);
          saveUserSettings({ coinChime: v });
        }}
        ocid="settings.notif.chime_switch"
      />

      <SectionTitle icon="🎵" title="Coin Chime Sound" />
      <CoinChimeSelector />

      <SectionTitle icon="⭐" title="Priority Contact" />
      <PriorityContactNotif />

      <SectionTitle icon="🌙" title="Quiet Hours" />
      <ToggleRow
        label="Quiet Hours"
        desc="रात में नोटिफिकेशन बंद"
        value={quietHours}
        onChange={(v) => {
          setQuietHours(v);
          setBool("mk_quiet_hours", v);
          saveUserSettings({ quietHours: v });
        }}
        ocid="settings.notif.quiet_switch"
      />
      {quietHours && (
        <div className="flex gap-3">
          <Field label="शुरु (रात)">
            <input
              type="time"
              value={quietFrom}
              onChange={(e) => {
                setQuietFrom(e.target.value);
                localStorage.setItem("mk_quiet_from", e.target.value);
              }}
              className="w-full px-3 py-2 rounded-md bg-muted border border-border text-foreground text-sm"
              data-ocid="settings.notif.quiet_from_input"
            />
          </Field>
          <Field label="खत्म (सुबह)">
            <input
              type="time"
              value={quietTo}
              onChange={(e) => {
                setQuietTo(e.target.value);
                localStorage.setItem("mk_quiet_to", e.target.value);
              }}
              className="w-full px-3 py-2 rounded-md bg-muted border border-border text-foreground text-sm"
              data-ocid="settings.notif.quiet_to_input"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function DisplayTab({
  langSelected,
  onLangSelect,
}: {
  langSelected: string;
  onLangSelect: (code: string) => void;
}) {
  const { dark, toggle: toggleDark } = useDarkMode();
  const { theme, setTheme } = useTheme();
  const [dataSaver, setDataSaver] = useState(() =>
    getBool("mk_data_saver", false),
  );
  const [autoplay, setAutoplay] = useState(() => getBool("mk_autoplay", true));
  const [dustIntensity, setDustIntensity] = useState(
    localStorage.getItem("mk_dust_intensity") ?? "medium",
  );
  const [cleanerChar, setCleanerChar] = useState(
    localStorage.getItem("mk_cleaner_character") ?? "soldier",
  );
  const [cleanerSound, setCleanerSound] = useState(
    localStorage.getItem("mk_cleaner_sound") ?? "music",
  );
  const [autoCleanRule, setAutoCleanRule] = useState(
    localStorage.getItem("mk_auto_clean_rule") ?? "midnight",
  );
  const [immersiveMode, setImmersiveMode] = useState(() =>
    getBool("mk_immersive_mode", true),
  );
  const [frameSize, setFrameSize] = useState(() =>
    Number(localStorage.getItem("mk_frame_size") ?? "1"),
  );
  const [darkIntensity, setDarkIntensity] = useState(() =>
    Number(localStorage.getItem("mk_dark_intensity") ?? "1"),
  );

  const DUST_OPTIONS = [
    { value: "slow", label: "धीरा" },
    { value: "medium", label: "मध्यम" },
    { value: "fast", label: "तेज" },
  ];

  const CLEANER_CHARS = [
    { value: "joker", emoji: "🤡", label: "जोकर" },
    { value: "soldier", emoji: "💂", label: "सिपाही" },
    { value: "robot", emoji: "🤖", label: "रोबोट" },
  ];

  const FRAME_LABELS = ["छोटा", "मध्यम", "बड़ा"];
  const DARK_LABELS = ["हल्का", "मध्यम", "गहरा"];

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="🌗" title="डिस्प्ले" />

      {/* Immersive Mode */}
      <ToggleRow
        label="पूरी स्क्रीन अनुभव (Immersive Mode)"
        desc="सेक्शन खुलने पर पीछे का सब हट जाए"
        value={immersiveMode}
        onChange={(v) => {
          setImmersiveMode(v);
          setBool("mk_immersive_mode", v);
          saveUserSettings({ immersiveMode: v });
        }}
        ocid="settings.display.immersive_switch"
      />

      <ToggleRow
        label="Dark Mode"
        desc="एप को dark theme में देखें"
        value={dark}
        onChange={toggleDark}
        ocid="settings.display.dark_switch"
      />

      {/* Dark Theme Intensity */}
      {dark && (
        <div className="flex flex-col gap-2 px-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground font-medium">
              Dark Theme Intensity:{" "}
              <span className="text-primary font-bold">
                {DARK_LABELS[darkIntensity]}
              </span>
            </Label>
          </div>
          <Slider
            min={0}
            max={2}
            step={1}
            value={[darkIntensity]}
            onValueChange={(v) => {
              setDarkIntensity(v[0]);
              localStorage.setItem("mk_dark_intensity", String(v[0]));
              saveUserSettings({ darkIntensity: v[0] });
            }}
            className="w-full"
            data-ocid="settings.display.dark_intensity.slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {DARK_LABELS.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Screen Frame Size */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground font-medium">
            Screen Frame Size:{" "}
            <span className="text-primary font-bold">
              {FRAME_LABELS[frameSize]}
            </span>
          </Label>
        </div>
        <Slider
          min={0}
          max={2}
          step={1}
          value={[frameSize]}
          onValueChange={(v) => {
            setFrameSize(v[0]);
            localStorage.setItem("mk_frame_size", String(v[0]));
            saveUserSettings({ frameSize: v[0] });
          }}
          className="w-full"
          data-ocid="settings.display.frame_size.slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {FRAME_LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <ToggleRow
        label="Data Saver"
        desc="कम इंटरनेट में भी videos स्मूथ"
        value={dataSaver}
        onChange={(v) => {
          setDataSaver(v);
          setBool("mk_data_saver", v);
          saveUserSettings({ dataSaver: v });
        }}
        ocid="settings.display.data_saver_switch"
      />
      <ToggleRow
        label="Autoplay"
        desc="रील खुद-ब-खुद चलें"
        value={autoplay}
        onChange={(v) => {
          setAutoplay(v);
          setBool("mk_autoplay", v);
          saveUserSettings({ autoplay: v });
        }}
        ocid="settings.display.autoplay_switch"
      />

      {/* Dust Intensity */}
      <SectionTitle icon="🌫️" title="धूल की रफ़्ता" />
      <div className="flex gap-2">
        {DUST_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setDustIntensity(opt.value);
              localStorage.setItem("mk_dust_intensity", opt.value);
              saveUserSettings({ dustIntensity: opt.value });
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
              dustIntensity === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.display.dust.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Midnight Cleaner character */}
      <SectionTitle icon="🧹" title="Midnight Cleaner Character" />
      <div className="flex gap-2">
        {CLEANER_CHARS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              setCleanerChar(c.value);
              localStorage.setItem("mk_cleaner_character", c.value);
              saveUserSettings({ cleanerCharacter: c.value });
            }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
              cleanerChar === c.value
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/40"
            }`}
            data-ocid={`settings.display.cleaner.${c.value}.button`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <span
              className={`text-xs font-bold ${
                cleanerChar === c.value ? "text-primary" : "text-foreground"
              }`}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      {/* Cleaner Sound */}
      <SectionTitle icon="🔊" title="Cleaner की आवाज़" />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setCleanerSound("broom");
            localStorage.setItem("mk_cleaner_sound", "broom");
            saveUserSettings({ cleanerSound: "broom" });
          }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
            cleanerSound === "broom"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid="settings.display.cleaner_sound.broom.button"
        >
          🧹 झाड़ू की आवाज़
        </button>
        <button
          type="button"
          onClick={() => {
            setCleanerSound("music");
            localStorage.setItem("mk_cleaner_sound", "music");
            saveUserSettings({ cleanerSound: "music" });
          }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
            cleanerSound === "music"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid="settings.display.cleaner_sound.music.button"
        >
          🎵 म्यूजिक
        </button>
      </div>

      {/* Auto-Clean Rule */}
      <SectionTitle icon="⏰" title="Auto-Clean नियम" />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setAutoCleanRule("midnight");
            localStorage.setItem("mk_auto_clean_rule", "midnight");
            saveUserSettings({ autoCleanRule: "midnight" });
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
            autoCleanRule === "midnight"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid="settings.display.auto_clean.midnight.button"
        >
          🌙 हर रात 12 बजे
        </button>
        <button
          type="button"
          onClick={() => {
            setAutoCleanRule("dust80");
            localStorage.setItem("mk_auto_clean_rule", "dust80");
            saveUserSettings({ autoCleanRule: "dust80" });
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
            autoCleanRule === "dust80"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid="settings.display.auto_clean.dust80.button"
        >
          🌫️ 80% धूल होने पर
        </button>
      </div>

      <SectionTitle icon="🎨" title="थीम" />
      {THEMES.map((t_item) => {
        const isActive = theme === t_item.id;
        return (
          <button
            key={t_item.id}
            type="button"
            onClick={() => setTheme(t_item.id)}
            data-ocid={`settings.display.${t_item.id}.button`}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
              isActive
                ? "border-primary shadow-md"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl shrink-0 border border-border shadow-sm flex items-center justify-center text-lg"
              style={{ background: t_item.preview }}
            >
              {t_item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-bold text-sm ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {t_item.name}
              </p>
              <p className="text-xs text-muted-foreground">{t_item.desc}</p>
            </div>
            {isActive && <Check className="w-5 h-5 text-primary shrink-0" />}
          </button>
        );
      })}

      <SectionTitle icon="🌐" title="भाषा" />
      <p className="text-xs text-muted-foreground -mt-3">
        कुल {LANGUAGES.length} भाषाएं उपलब्ध
      </p>
      <div className="flex flex-col gap-1">
        {LANGUAGES.map((lang) => {
          const isActive = langSelected === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLangSelect(lang.code)}
              data-ocid="settings.language.button"
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-left ${
                isActive
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted border border-transparent"
              }`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-base font-semibold leading-tight ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {lang.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {lang.label}
                </span>
              </div>
              {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
function MediaReelsTab() {
  const [autoScroll, setAutoScroll] = useState(() =>
    getBool("mk_media_autoscroll", false),
  );
  const [quality, setQuality] = useState(
    localStorage.getItem("mk_media_quality") ?? "auto",
  );
  const [musicVol, setMusicVol] = useState(() =>
    Number(localStorage.getItem("mk_music_volume") ?? "70"),
  );
  const [downloadPerm, setDownloadPerm] = useState(() =>
    getBool("mk_media_download_perm", true),
  );
  const [lyricsDisplay, setLyricsDisplay] = useState(() =>
    getBool("mk_media_lyrics", true),
  );
  const [captionSize, setCaptionSize] = useState(() =>
    Number(localStorage.getItem("mk_caption_font_size") ?? "14"),
  );

  const QUALITY_OPTS = [
    { value: "hd", label: "HD" },
    { value: "datasaver", label: "Data Saver" },
    { value: "auto", label: "Auto" },
  ];

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="🎬" title="रील & मीडिया कंट्रोल" />

      <ToggleRow
        label="Auto-Scroll"
        desc="रील अपने आप बदलती रहे"
        value={autoScroll}
        onChange={(v) => {
          setAutoScroll(v);
          setBool("mk_media_autoscroll", v);
        }}
        ocid="settings.media.autoscroll_switch"
      />

      <SectionTitle icon="📹" title="वीडियो क्वालिटी" />
      <div className="flex gap-2">
        {QUALITY_OPTS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setQuality(opt.value);
              localStorage.setItem("mk_media_quality", opt.value);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
              quality === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.media.quality.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="🎵" title="म्यूजिक वॉल्यूम" />
      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground font-medium">
            Volume: <span className="text-primary font-bold">{musicVol}%</span>
          </Label>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[musicVol]}
          onValueChange={(v) => {
            setMusicVol(v[0]);
            localStorage.setItem("mk_music_volume", String(v[0]));
          }}
          className="w-full"
          data-ocid="settings.media.music_vol.slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>🔇 बंद</span>
          <span>🔊 पूरा</span>
        </div>
      </div>

      <ToggleRow
        label="Download Permission"
        desc="दूसरे आपकी रील गैलरी में save कर सकते हैं?"
        value={downloadPerm}
        onChange={(v) => {
          setDownloadPerm(v);
          setBool("mk_media_download_perm", v);
        }}
        ocid="settings.media.download_switch"
      />

      <ToggleRow
        label="Lyrics Display"
        desc="वीडियो पर Hindi lyrics दिखाएं"
        value={lyricsDisplay}
        onChange={(v) => {
          setLyricsDisplay(v);
          setBool("mk_media_lyrics", v);
        }}
        ocid="settings.media.lyrics_switch"
      />

      <SectionTitle icon="🔤" title="Caption Font Size" />
      <div className="flex flex-col gap-2 px-1">
        <Label className="text-xs text-muted-foreground font-medium">
          Size: <span className="text-primary font-bold">{captionSize}px</span>
        </Label>
        <Slider
          min={12}
          max={24}
          step={1}
          value={[captionSize]}
          onValueChange={(v) => {
            setCaptionSize(v[0]);
            localStorage.setItem("mk_caption_font_size", String(v[0]));
          }}
          className="w-full"
          data-ocid="settings.media.caption_size.slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>छोटा (12px)</span>
          <span>बड़ा (24px)</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
function DustWeatherTab() {
  const [dustSpeed, setDustSpeed] = useState(
    localStorage.getItem("mk_dust_speed") ?? "medium",
  );
  const [cleanerSchedule, setCleanerSchedule] = useState(
    localStorage.getItem("mk_cleaner_schedule") ?? "daily",
  );
  const [cleanerChar, setCleanerChar] = useState(
    localStorage.getItem("mk_cleaner_character") ?? "soldier",
  );
  const [liveWeather, setLiveWeather] = useState(() =>
    getBool("mk_weather_live", true),
  );
  const [animSpeed, setAnimSpeed] = useState(() =>
    Number(localStorage.getItem("mk_anim_speed") ?? "1"),
  );
  const [cleanerSound, setCleanerSound] = useState(
    localStorage.getItem("mk_cleaner_sound") ?? "music",
  );

  const DUST_OPTS = [
    { value: "slow", label: "धीरा 🌫" },
    { value: "medium", label: "मध्यम 🌪" },
    { value: "fast", label: "तेज ⚡" },
  ];
  const CLEANER_CHARS = [
    { value: "joker", emoji: "🤡", label: "जोकर" },
    { value: "soldier", emoji: "💂", label: "सिपाही" },
    { value: "robot", emoji: "🤖", label: "रोबोट" },
  ];
  const ANIM_LABELS = ["0.5x धीरा", "1x Normal", "1.5x तेज़", "2x बहुत तेज़"];

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="🌫️" title="धूल की रफ़्तार" />
      <div className="flex gap-2">
        {DUST_OPTS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setDustSpeed(opt.value);
              localStorage.setItem("mk_dust_speed", opt.value);
              localStorage.setItem("mk_dust_intensity", opt.value);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              dustSpeed === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.dust.speed.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="🗓️" title="Cleaner का Schedule" />
      <div className="flex gap-2">
        {[
          { value: "daily", label: "🌙 रोज़ 12 बजे" },
          { value: "weekly", label: "📅 हफ्ते में एक बार" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setCleanerSchedule(opt.value);
              localStorage.setItem("mk_cleaner_schedule", opt.value);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              cleanerSchedule === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.dust.schedule.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="🧹" title="Cleaner Character चुनें" />
      <div className="flex gap-2">
        {CLEANER_CHARS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              setCleanerChar(c.value);
              localStorage.setItem("mk_cleaner_character", c.value);
            }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
              cleanerChar === c.value
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/40"
            }`}
            data-ocid={`settings.dust.cleaner.${c.value}.button`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <span
              className={`text-xs font-bold ${cleanerChar === c.value ? "text-primary" : "text-foreground"}`}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      <SectionTitle icon="🔊" title="Cleaner की आवाज़" />
      <div className="flex gap-2">
        {[
          { value: "broom", label: "🧹 झाड़ू की आवाज़" },
          { value: "music", label: "🎵 म्यूजिक" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setCleanerSound(opt.value);
              localStorage.setItem("mk_cleaner_sound", opt.value);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              cleanerSound === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.dust.sound.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ToggleRow
        label="Live Weather Background"
        desc="शहर के मौसम के हिसाब से background बदले"
        value={liveWeather}
        onChange={(v) => {
          setLiveWeather(v);
          setBool("mk_weather_live", v);
        }}
        ocid="settings.dust.weather_switch"
      />

      <SectionTitle icon="⚡" title="Animation Speed" />
      <div className="flex flex-col gap-2 px-1">
        <Label className="text-xs text-muted-foreground font-medium">
          Speed:{" "}
          <span className="text-primary font-bold">
            {ANIM_LABELS[animSpeed] ?? "1x Normal"}
          </span>
        </Label>
        <Slider
          min={0}
          max={3}
          step={1}
          value={[animSpeed]}
          onValueChange={(v) => {
            setAnimSpeed(v[0]);
            localStorage.setItem("mk_anim_speed", String(v[0]));
          }}
          className="w-full"
          data-ocid="settings.dust.anim_speed.slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {ANIM_LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
function MessagingTab() {
  const WALLPAPERS = [
    {
      id: "royal",
      label: "Royal Gold",
      bg: "linear-gradient(135deg, #1a1a2e, #FFD700)",
    },
    {
      id: "night",
      label: "Night Sky",
      bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    },
    {
      id: "rose",
      label: "Rose Garden",
      bg: "linear-gradient(135deg, #f953c6, #b91d73)",
    },
    {
      id: "ocean",
      label: "Ocean",
      bg: "linear-gradient(135deg, #1cb5e0, #000851)",
    },
    {
      id: "forest",
      label: "Forest",
      bg: "linear-gradient(135deg, #1a472a, #52b788)",
    },
    {
      id: "minimal",
      label: "Minimal",
      bg: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
    },
  ];
  const BUBBLE_COLORS = [
    "#FFD700",
    "#2196F3",
    "#E91E63",
    "#4CAF50",
    "#9C27B0",
    "#FF5722",
  ];
  const AUTO_DELETE_OPTS = [
    { value: "never", label: "कभी नहीं" },
    { value: "1h", label: "1 घंटा" },
    { value: "24h", label: "24 घंटे" },
    { value: "7d", label: "7 दिन" },
  ];
  const VOICE_SPEED_OPTS = [
    { value: "slow", label: "🐢 धीरा" },
    { value: "normal", label: "▶️ Normal" },
    { value: "fast", label: "⚡ तेज़" },
  ];

  const [wallpaper, setWallpaper] = useState(
    localStorage.getItem("mk_chat_wallpaper") ?? "royal",
  );
  const [autoDelete, setAutoDelete] = useState(
    localStorage.getItem("mk_chat_auto_delete") ?? "never",
  );
  const [voiceSpeed, setVoiceSpeed] = useState(
    localStorage.getItem("mk_chat_voice_speed") ?? "normal",
  );
  const [bubbleColor, setBubbleColor] = useState(
    localStorage.getItem("mk_chat_bubble_color") ?? "#FFD700",
  );
  const [readReceipts, setReadReceipts] = useState(() =>
    getBool("mk_chat_read_receipts", true),
  );
  const [priorityContact, setPriorityContact] = useState(
    localStorage.getItem("mk_chat_priority") ?? "",
  );

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="💬" title="चैट & बातचीत" />

      <SectionTitle icon="🖼️" title="Chat Wallpaper" />
      <div className="grid grid-cols-3 gap-2">
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => {
              setWallpaper(w.id);
              localStorage.setItem("mk_chat_wallpaper", w.id);
            }}
            className={`h-16 rounded-xl border-2 transition-all relative overflow-hidden ${
              wallpaper === w.id
                ? "border-primary ring-2 ring-primary"
                : "border-border"
            }`}
            style={{ background: w.bg }}
            data-ocid={`settings.chat.wallpaper.${w.id}.button`}
          >
            <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-bold text-white drop-shadow">
              {w.label}
            </span>
          </button>
        ))}
      </div>

      <SectionTitle icon="🗑️" title="Auto-Delete Messages" />
      <div className="grid grid-cols-2 gap-2">
        {AUTO_DELETE_OPTS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setAutoDelete(opt.value);
              localStorage.setItem("mk_chat_auto_delete", opt.value);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              autoDelete === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.chat.autodelete.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="🎙️" title="Voice Message Speed" />
      <div className="flex gap-2">
        {VOICE_SPEED_OPTS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              setVoiceSpeed(opt.value);
              localStorage.setItem("mk_chat_voice_speed", opt.value);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              voiceSpeed === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.chat.voice_speed.${opt.value}.button`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="🫧" title="Chat Bubble Color" />
      <ColorPicker
        label="अपना bubble color चुनें"
        colors={BUBBLE_COLORS}
        value={bubbleColor}
        onChange={(c) => {
          setBubbleColor(c);
          localStorage.setItem("mk_chat_bubble_color", c);
        }}
      />

      <ToggleRow
        label="Read Receipts (टिक ✓✓)"
        desc="मैसेज पढ़ा गया या नहीं — दिखाएं"
        value={readReceipts}
        onChange={(v) => {
          setReadReceipts(v);
          setBool("mk_chat_read_receipts", v);
        }}
        ocid="settings.chat.read_receipts_switch"
      />

      <SectionTitle icon="⭐" title="Priority Contact" />
      <Field label="प्राथमिकता वाला contact (नाम)">
        <div className="flex gap-2">
          <Input
            value={priorityContact}
            onChange={(e) => setPriorityContact(e.target.value)}
            placeholder="जैसे: Prince Pawan..."
            data-ocid="settings.chat.priority_input"
          />
          <Button
            size="sm"
            onClick={() => {
              localStorage.setItem("mk_chat_priority", priorityContact);
              toast.success("Priority contact सेट हो गया! ⭐");
            }}
            data-ocid="settings.chat.priority.save_button"
          >
            सेव
          </Button>
        </div>
      </Field>
    </div>
  );
}

// ──────────────────────────────────────────────
function SupportTab() {
  const [report, setReport] = useState("");
  const [breakReminder, setBreakReminder] = useState(() =>
    getBool("mk_break_reminder", false),
  );
  const [breakInterval, setBreakInterval] = useState(() =>
    Number(localStorage.getItem("mk_break_interval") ?? "1"),
  );

  const BREAK_LABELS = ["30 मिनट", "1 घंटा", "2 घंटे", "4 घंटे"];

  const submitReport = () => {
    if (!report.trim()) return;
    setReport("");
    toast.success("रिपोर्ट भेज दी गई! Admin को मिली। 🙏");
  };

  const deleteAccount = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <SectionTitle icon="🐛" title="Bug Report" />
      <Textarea
        value={report}
        onChange={(e) => setReport(e.target.value)}
        placeholder="कोई bug या problem बताएं... जैसे: Login नहीं हो रहा, Wallet काम नहीं कर रहा..."
        rows={4}
        data-ocid="settings.support.report_textarea"
      />
      <Button
        onClick={submitReport}
        disabled={!report.trim()}
        data-ocid="settings.support.report_button"
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary/10"
      >
        📤 Admin को भेजें
      </Button>

      <SectionTitle icon="📖" title="Help Tutorial" />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => toast.info("Tutorial जल्द आ रहा है! 🎬")}
        data-ocid="settings.support.tutorial_button"
      >
        🎥 ट्यूटोरियल देखें
      </Button>

      <SectionTitle icon="⏰" title="Break Reminder" />
      <ToggleRow
        label="Break Reminder"
        desc={'"आराम करो" का message समय-समय पर आए'}
        value={breakReminder}
        onChange={(v) => {
          setBreakReminder(v);
          setBool("mk_break_reminder", v);
        }}
        ocid="settings.support.break_switch"
      />
      {breakReminder && (
        <div className="flex flex-col gap-2 px-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Interval:{" "}
            <span className="text-primary font-bold">
              {BREAK_LABELS[breakInterval]}
            </span>
          </Label>
          <Slider
            min={0}
            max={3}
            step={1}
            value={[breakInterval]}
            onValueChange={(v) => {
              setBreakInterval(v[0]);
              localStorage.setItem("mk_break_interval", String(v[0]));
            }}
            className="w-full"
            data-ocid="settings.support.break_interval.slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {BREAK_LABELS.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      )}

      <SectionTitle icon="ℹ️" title="App Info" />
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center gap-3">
        <span className="text-3xl">👑</span>
        <div>
          <p className="font-bold text-sm text-foreground">Money Kingdom</p>
          <p className="text-xs text-muted-foreground">
            v71 — Built with ❤️ for Prince Pawan Kumar
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            PWA App · caffeine.ai
          </p>
        </div>
      </div>

      <SectionTitle icon="❓" title="Help Center" />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="earn">
          <AccordionTrigger className="text-sm">
            Kingdom Coins कैसे कमाएं?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Daily tasks पूरे करें, videos देखें, दूसरों को gift भेजें और रात के 12 बजे app
            open रखें — Midnight Cleaner 10 coins देता है! 🧹
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="wallet">
          <AccordionTrigger className="text-sm">
            Wallet में पैसे कैसे डालें?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Settings → Wallet → UPI ID डालें और Withdraw Request भेजें। Admin 24 घंटे में
            process करेंगे। 💳
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="reel">
          <AccordionTrigger className="text-sm">रील कैसे बनाएं?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            नीचे center में Reels button दबाएं → Video select करें → Music/filter/text
            जोड़ें → Publish करें। 🎬
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Verify My Kingdom */}
      <div
        className="rounded-2xl border-2 p-4 flex flex-col gap-3 mt-2"
        style={{
          borderColor: "oklch(0.72 0.12 66)",
          background: "oklch(0.96 0.02 72 / 0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <p className="font-bold text-foreground">Verify My Kingdom</p>
        </div>
        <p className="text-sm text-muted-foreground">
          अपना Verified Badge पाएं और Kingdom में अपनी पहचान बनाएं!
        </p>
        <Button
          disabled
          className="w-full opacity-70"
          style={{ background: "oklch(0.72 0.12 66)", color: "white" }}
          data-ocid="settings.support.verify_button"
        >
          जल्द आ रहा है... 🚀
        </Button>
      </div>

      {/* Delete Account */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            data-ocid="settings.support.delete_button"
          >
            🗑️ अकाउंट डिलीट करें
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>क्या आप sure हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह action पूरी तरह permanent है। आपका सारा data, coins और posts हमेशा
              के लिए हट जाएंगे।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.support.cancel_button">
              रद्द करें
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAccount}
              className="bg-destructive hover:bg-destructive/90"
              data-ocid="settings.support.confirm_button"
            >
              हाँ, डिलीट करें
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// Small reusable sub-components used by multiple tabs
// ──────────────────────────────────────────────

function KingdomTitleSelector() {
  const TITLES = ["महाराजा", "सुल्तान", "नवाब", "रजवाड़ा", "युवराज", "सेनापति"];
  const [selected, setSelected] = useState(
    localStorage.getItem("mk_kingdom_title") ?? "",
  );
  return (
    <div className="flex flex-wrap gap-2">
      {TITLES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => {
            setSelected(t);
            localStorage.setItem("mk_kingdom_title", t);
            saveUserSettings({ kingdomTitle: t });
            toast.success(`Kingdom Title: ${t} 👑`);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
            selected === t
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid="settings.account.title.button"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function ProfileBorderSelector() {
  const BORDERS = [
    { value: "golden", label: "🌟 Golden Ring" },
    { value: "diamond", label: "💎 Diamond Ring" },
    { value: "silver", label: "⚪ Silver Ring" },
    { value: "none", label: "❌ No Border" },
  ];
  const [selected, setSelected] = useState(
    localStorage.getItem("mk_profile_border") ?? "golden",
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      {BORDERS.map((b) => (
        <button
          key={b.value}
          type="button"
          onClick={() => {
            setSelected(b.value);
            localStorage.setItem("mk_profile_border", b.value);
            saveUserSettings({ profileBorder: b.value });
          }}
          className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
            selected === b.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid="settings.account.border.button"
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

function BioFontSelector() {
  const FONTS = [
    { value: "normal", label: "Normal" },
    {
      value: "italic",
      label: "Italic",
      style: "italic" as React.CSSProperties["fontStyle"],
    },
    { value: "bold", label: "Bold", style: undefined, weight: "bold" },
    { value: "royal", label: "👑 Royal", special: true },
  ];
  const [selected, setSelected] = useState(
    localStorage.getItem("mk_bio_font") ?? "normal",
  );
  return (
    <div className="flex gap-2">
      {FONTS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => {
            setSelected(f.value);
            localStorage.setItem("mk_bio_font", f.value);
            saveUserSettings({ bioFont: f.value });
          }}
          className={`flex-1 py-2 rounded-xl text-xs border-2 transition-all ${
            selected === f.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          style={{ fontStyle: f.style, fontWeight: f.weight }}
          data-ocid="settings.account.bio_font.button"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function CurrencyDisplaySwitch() {
  const [showCoins, setShowCoins] = useState(
    () => (localStorage.getItem("mk_currency_display") ?? "coins") === "coins",
  );
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-semibold text-foreground">
          {showCoins ? "🪙 Coins में दिखाएं" : "₹ Rupees में दिखाएं"}
        </span>
        <span className="text-xs text-muted-foreground">
          Balance display format बदलें
        </span>
      </div>
      <Switch
        checked={showCoins}
        onCheckedChange={(v) => {
          setShowCoins(v);
          localStorage.setItem("mk_currency_display", v ? "coins" : "rupees");
          saveUserSettings({ currencyDisplay: v ? "coins" : "rupees" });
        }}
        data-ocid="settings.wallet.currency_switch"
      />
    </div>
  );
}

function ScreenshotBlockToggle() {
  const [blocked, setBlocked] = useState(() =>
    getBool("mk_screenshot_block", false),
  );
  return (
    <div className="flex flex-col gap-2">
      <ToggleRow
        label="Screenshot Block"
        desc="दूसरे आपकी profile का screenshot न ले सकें"
        value={blocked}
        onChange={(v) => {
          setBlocked(v);
          setBool("mk_screenshot_block", v);
          saveUserSettings({ screenshotBlock: v });
          if (v)
            toast.info("⚠️ Browser में पूरी तरह block संभव नहीं, लेकिन warning दिखेगी");
        }}
        ocid="settings.privacy.screenshot_switch"
      />
      {blocked && (
        <p className="text-xs text-amber-400 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          ⚠️ Browser में पूरी तरह block संभव नहीं, लेकिन screenshot लेने पर warning जरूर
          दिखेगी।
        </p>
      )}
    </div>
  );
}

function CoinChimeSelector() {
  const CHIMES = [
    { value: "khanak", label: "🪙 खनक" },
    { value: "ting", label: "🔔 टिंग" },
    { value: "ding", label: "✨ डिंग" },
  ];
  const [selected, setSelected] = useState(
    localStorage.getItem("mk_coin_chime_type") ?? "khanak",
  );
  return (
    <div className="flex gap-2">
      {CHIMES.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => {
            setSelected(c.value);
            localStorage.setItem("mk_coin_chime_type", c.value);
            toast.success(`${c.label} sound selected!`);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
            selected === c.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:border-primary/40"
          }`}
          data-ocid={`settings.notif.chime.${c.value}.button`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function PriorityContactNotif() {
  const [name, setName] = useState(
    localStorage.getItem("mk_notif_priority") ?? "",
  );
  return (
    <Field label="किसके notifications सबसे पहले दिखें?">
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="दोस्त का नाम..."
          data-ocid="settings.notif.priority_input"
        />
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem("mk_notif_priority", name);
            toast.success("Priority contact सेट! ⭐");
          }}
          data-ocid="settings.notif.priority.save_button"
        >
          सेव
        </Button>
      </div>
    </Field>
  );
}

function ColorPicker({
  label,
  colors,
  value,
  onChange,
}: {
  label: string;
  colors: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground font-medium">
        {label}
      </Label>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === c
                ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                : "border-transparent hover:border-border"
            }`}
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}

// ── Big section header divider ──────────────────
function SectionHeader({
  icon,
  title,
  id,
}: { icon: string; title: string; id?: string }) {
  return (
    <div
      id={id}
      className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10 border-b-2"
      style={{
        background: "var(--card, #fff)",
        borderColor: "oklch(0.72 0.12 66 / 0.4)",
      }}
    >
      <span className="text-2xl">{icon}</span>
      <p className="font-black text-base text-foreground tracking-wide">
        {title}
      </p>
    </div>
  );
}

// ── Immersive Display Tab ──────────────────────
function ImmersiveDisplayTab() {
  const [immersiveMode, setImmersiveMode] = useState(() =>
    getBool("mk_immersive_mode", true),
  );
  const [frameSize, setFrameSize] = useState(() =>
    Number(localStorage.getItem("mk_frame_size") ?? "0"),
  );
  const [transition, setTransition] = useState(
    () => localStorage.getItem("mk_transition_style") ?? "slide",
  );
  const [loveColor, setLoveColor] = useState(
    () => localStorage.getItem("mk_love_color") ?? "#e74c3c",
  );
  const [loveSize, setLoveSize] = useState(() =>
    Number(localStorage.getItem("mk_love_size") ?? "2"),
  );
  const TRANSITIONS = [
    { value: "slide", label: "↑ Slide" },
    { value: "fade", label: "◎ Fade" },
    { value: "zoom", label: "⊕ Zoom" },
  ];
  const LOVE_COLORS = ["#e74c3c", "#e91e63", "#ff5722", "#9c27b0", "#FFD700"];
  const SIZE_LABELS = ["छोटा", "मध्यम", "बड़ा", "बहुत बड़ा"];

  return (
    <div className="px-4 py-4 flex flex-col gap-5 border-b border-border/40">
      <ToggleRow
        label="इमर्सिव मोड (Immersive Mode)"
        desc="Chat/Settings खोलते ही पीछे का सब छुप जाए"
        value={immersiveMode}
        onChange={(v) => {
          setImmersiveMode(v);
          setBool("mk_immersive_mode", v);
        }}
        ocid="settings.immersive.mode_switch"
      />

      <SectionTitle icon="🖼️" title="Screen Frame Size (Margin)" />
      <div className="flex flex-col gap-2 px-1">
        <Label className="text-xs text-muted-foreground font-medium">
          Frame: <span className="text-primary font-bold">{frameSize}px</span>
        </Label>
        <Slider
          min={0}
          max={20}
          step={2}
          value={[frameSize]}
          onValueChange={(v) => {
            setFrameSize(v[0]);
            localStorage.setItem("mk_frame_size", String(v[0]));
          }}
          className="w-full"
          data-ocid="settings.immersive.frame_slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0px (Full)</span>
          <span>10px</span>
          <span>20px</span>
        </div>
      </div>

      <SectionTitle icon="✨" title="Page Transition Style" />
      <div className="flex gap-2">
        {TRANSITIONS.map((tr) => (
          <button
            key={tr.value}
            type="button"
            onClick={() => {
              setTransition(tr.value);
              localStorage.setItem("mk_transition_style", tr.value);
              toast.success(`Transition: ${tr.label} सेट हो गया!`);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              transition === tr.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/40"
            }`}
            data-ocid={`settings.immersive.transition.${tr.value}.button`}
          >
            {tr.label}
          </button>
        ))}
      </div>

      <SectionTitle icon="❤️" title="Love You Animation Color" />
      <ColorPicker
        label="Exit animation का दिल का रंग"
        colors={LOVE_COLORS}
        value={loveColor}
        onChange={(c) => {
          setLoveColor(c);
          localStorage.setItem("mk_love_color", c);
        }}
      />

      <SectionTitle icon="📏" title="Love You Animation Size" />
      <div className="flex flex-col gap-2 px-1">
        <Label className="text-xs text-muted-foreground font-medium">
          Size:{" "}
          <span className="text-primary font-bold">
            {SIZE_LABELS[loveSize]}
          </span>
        </Label>
        <Slider
          min={0}
          max={3}
          step={1}
          value={[loveSize]}
          onValueChange={(v) => {
            setLoveSize(v[0]);
            localStorage.setItem("mk_love_size", String(v[0]));
          }}
          className="w-full"
          data-ocid="settings.immersive.love_size.slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {SIZE_LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <SectionTitle icon="💡" title="App Brightness" />
      <p className="text-xs text-muted-foreground">
        App की brightness फोन से अलग रखें (फोन settings में जाकर बदलें)
      </p>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => toast.info("फोन की Settings → Display → Brightness 📱")}
        data-ocid="settings.immersive.brightness_button"
      >
        📱 Display Settings खोलें
      </Button>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <p className="text-sm font-bold text-foreground">{title}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
  ocid,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  ocid: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/30 border border-border">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        data-ocid={ocid}
        className="shrink-0"
      />
    </div>
  );
}

// ──────────────────────────────────────────────
// Main SettingsPanel
// ──────────────────────────────────────────────

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [langSelected, setLangSelected] = useState<string>(getStoredLang);
  const [gamesOpen, setGamesOpen] = useState(false);
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const delta = touchCurrentY.current - touchStartY.current;
    if (delta > 80) onClose();
  };

  const handleLangSelect = (code: string) => {
    setLangSelected(code);
    setLanguage(code);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="settings-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              key="settings-panel"
              ref={panelRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-0 z-[110] bg-card flex flex-col"
              style={{ height: "100dvh" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-ocid="settings.panel"
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚙️</span>
                  <h2 className="font-bold text-base text-foreground">
                    {t("settings")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  data-ocid="settings.close_button"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg"
                >
                  ✕
                </button>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="flex flex-col pb-10">
                  {/* ── Quick Navigation Bar ── */}
                  <div className="sticky top-0 z-20 bg-card border-b border-border/40 shrink-0">
                    <div
                      className="flex gap-2 px-3 py-2.5 overflow-x-auto"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {[
                        { id: "section-account", icon: "👤", label: "पहचान" },
                        { id: "section-wallet", icon: "💰", label: "खजाना" },
                        { id: "section-privacy", icon: "🔒", label: "प्राइवेसी" },
                        { id: "section-notif", icon: "🔔", label: "नोटिफिकेशन" },
                        { id: "section-display", icon: "🎨", label: "डिस्प्ले" },
                        { id: "section-dust", icon: "🌫️", label: "धूल & मौसम" },
                        { id: "section-media", icon: "🎬", label: "मीडिया" },
                        {
                          id: "section-immersive",
                          icon: "📱",
                          label: "फुल स्क्रीन",
                        },
                        { id: "section-chat", icon: "💬", label: "चैट" },
                        { id: "section-support", icon: "🆘", label: "सपोर्ट" },
                        { id: "section-games", icon: "🎮", label: "गेम्स" },
                        {
                          id: "section-english",
                          icon: "🎓",
                          label: "English AI",
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(item.id);
                            if (el)
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-primary/20 text-foreground text-xs font-bold whitespace-nowrap transition-colors shrink-0"
                          data-ocid={`settings.nav.${item.id.replace("section-", "")}_button`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── 1. शाही पहचान ── */}
                  <SectionHeader
                    id="section-account"
                    icon="👤"
                    title="शाही पहचान (Account)"
                  />
                  <AccountTab />

                  {/* ── 2. खजाना & वॉलेट ── */}
                  <SectionHeader
                    id="section-wallet"
                    icon="💰"
                    title="खजाना & वॉलेट (Wallet)"
                  />
                  <WalletTab />

                  {/* ── 3. प्राइवेसी & सुरक्षा ── */}
                  <SectionHeader
                    id="section-privacy"
                    icon="🔒"
                    title="प्राइवेसी & सुरक्षा (Privacy)"
                  />
                  <PrivacyTab />

                  {/* ── 4. नोटिफिकेशन ── */}
                  <SectionHeader
                    id="section-notif"
                    icon="🔔"
                    title="नोटिफिकेशन & फरमान (Alerts)"
                  />
                  <NotificationsTab />

                  {/* ── 5. डिस्प्ले & धूल ── */}
                  <SectionHeader
                    id="section-display"
                    icon="🎨"
                    title="डिस्प्ले & धूल (Display)"
                  />
                  <DisplayTab
                    langSelected={langSelected}
                    onLangSelect={handleLangSelect}
                  />

                  {/* ── 6. धूल & मौसम ── */}
                  <SectionHeader
                    id="section-dust"
                    icon="🌫️"
                    title="धूल & मौसम (Dust & Weather)"
                  />
                  <DustWeatherTab />

                  {/* ── 7. रील & मीडिया ── */}
                  <SectionHeader
                    id="section-media"
                    icon="🎬"
                    title="रील & मीडिया (Media)"
                  />
                  <MediaReelsTab />

                  {/* ── 8. फुल स्क्रीन & इमर्सिव ── */}
                  <SectionHeader
                    id="section-immersive"
                    icon="📱"
                    title="फुल स्क्रीन & इमर्सिव (Display Magic)"
                  />
                  <ImmersiveDisplayTab />

                  {/* ── 9. चैट & बातचीत ── */}
                  <SectionHeader
                    id="section-chat"
                    icon="💬"
                    title="चैट & बातचीत (Messaging)"
                  />
                  <MessagingTab />

                  {/* ── 10. मदद & सपोर्ट ── */}
                  <SectionHeader
                    id="section-support"
                    icon="🆘"
                    title="मदद & सपोर्ट (Support)"
                  />
                  <SupportTab />

                  {/* ── Games ── */}
                  <SectionHeader
                    id="section-games"
                    icon="🎮"
                    title="खेलो और कमाओ (Games)"
                  />
                  <div className="px-4 py-4 flex flex-col items-center gap-4 border-b border-border/40">
                    <span className="text-5xl">🎮</span>
                    <p className="text-foreground font-bold text-base">
                      खेलो और कमाओ!
                    </p>
                    <p className="text-muted-foreground text-sm text-center">
                      Quiz, Coin Toss, Lucky Spin, Treasure Hunt और और गेम्स
                    </p>
                    <button
                      type="button"
                      onClick={() => setGamesOpen(true)}
                      className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl text-base hover:opacity-90 transition"
                      data-ocid="settings.games.open_modal_button"
                    >
                      🎮 Games खोलें
                    </button>
                  </div>

                  {/* ── English Guru AI ── */}
                  <SectionHeader
                    id="section-english"
                    icon="🎓"
                    title="English Guru AI"
                  />
                  <div className="min-h-[400px]">
                    <EnglishGuruAI />
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Games Panel launched from Settings */}
      <GamesPanel open={gamesOpen} onClose={() => setGamesOpen(false)} />
    </>
  );
}
