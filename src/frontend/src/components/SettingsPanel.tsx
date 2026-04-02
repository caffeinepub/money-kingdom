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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useDarkMode } from "../hooks/useDarkMode";
import { type ThemeName, useTheme } from "../hooks/useTheme";
import { setLanguage, useLanguage } from "../utils/i18n";
import EnglishGuruAI from "./EnglishGuruAI";

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
  { code: "mni", name: "মৈতৈলোন্‌", label: "Manipuri" },
  { code: "kok", name: "कोंकणी", label: "Konkani" },
  { code: "mai", name: "मैथिली", label: "Maithili" },
  { code: "doi", name: "डोगरी", label: "Dogri" },
  { code: "ks", name: "كۂشُر", label: "Kashmiri" },
  { code: "sa", name: "संस्कृतम्", label: "Sanskrit" },
  { code: "sd", name: "سنڌي", label: "Sindhi" },
  { code: "bo", name: "བོད་སཀད་", label: "Bodo" },
  { code: "sat", name: "ᱥᱟᱬᱟᱱᱟᱜᱩ", label: "Santali" },
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
    desc: "गर्म earthy tones — डिफ़ॉल्ट",
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

// ──────────────────────────────────────────────
// Sub-sections
// ──────────────────────────────────────────────

function AccountTab() {
  const prof = getProfile();
  const [name, setName] = useState(prof.name ?? "");
  const [username, setUsername] = useState(prof.username ?? "");
  const [bio, setBio] = useState(prof.bio ?? "");
  const [email, setEmail] = useState(prof.email ?? "");
  const [isPublic, setIsPublic] = useState(
    localStorage.getItem("mk_account_type") !== "private",
  );

  const save = () => {
    const updated = { ...prof, name, username, bio, email };
    localStorage.setItem("mk_user_profile", JSON.stringify(updated));
    localStorage.setItem("mk_account_type", isPublic ? "public" : "private");
    toast.success("प्रोफाइल सेव हो गई ✅");
  };

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-4 flex flex-col gap-5">
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

        <SectionTitle icon="🔓" title="अकाउंट टाइप" />
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
    </ScrollArea>
  );
}

function WalletTab() {
  const wallet = getWallet();
  const txList = getTransactions().slice(0, 10);
  const [upiId, setUpiId] = useState(localStorage.getItem("mk_upi_id") ?? "");

  const saveUpi = () => {
    localStorage.setItem("mk_upi_id", upiId);
    toast.success("UPI ID सेव हो गई ✅");
  };

  const withdraw = () => {
    toast.info("आपकी withdrawal request भेज दी गई है। 24 घंटे में process होगी। 🏦");
  };

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-4 flex flex-col gap-5">
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

        <SectionTitle icon="📜" title="Transaction History" />
        {txList.length === 0 ? (
          <div
            className="text-center text-muted-foreground text-sm py-6"
            data-ocid="settings.wallet.empty_state"
          >
            कोई transaction नहीं हुई अभी तक
          </div>
        ) : (
          <div
            className="flex flex-col gap-2"
            data-ocid="settings.wallet.table"
          >
            {txList.map((tx: any, i: number) => (
              <div
                key={tx.id ?? `tx-${i}`}
                data-ocid={`settings.wallet.item.${i + 1}`}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {tx.desc}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
                <span
                  className={`font-bold text-sm ${
                    tx.type === "credit" ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {tx.amount} 🪙
                </span>
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
    </ScrollArea>
  );
}

function PrivacyTab() {
  const [pinForm, setPinForm] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

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

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-4 flex flex-col gap-5">
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
      </div>
    </ScrollArea>
  );
}

function NotificationsTab() {
  const [push, setPush] = useState(() => getBool("mk_notif_push", true));
  const [payment, setPayment] = useState(() =>
    getBool("mk_notif_payment", true),
  );
  const [mute, setMute] = useState(() => getBool("mk_notif_mute", false));

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-4 flex flex-col gap-4">
        <SectionTitle icon="🔔" title="नोटिफिकेशन" />
        <ToggleRow
          label="Push Notifications"
          desc="नई रील, लाइक, कमेंट पर अलर्ट"
          value={push}
          onChange={(v) => {
            setPush(v);
            setBool("mk_notif_push", v);
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
          }}
          ocid="settings.notif.mute_switch"
        />
      </div>
    </ScrollArea>
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

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-4 flex flex-col gap-5">
        <SectionTitle icon="🌗" title="डिस्प्ले" />
        <ToggleRow
          label="Dark Mode"
          desc="ऐप को dark theme में देखें"
          value={dark}
          onChange={toggleDark}
          ocid="settings.display.dark_switch"
        />
        <ToggleRow
          label="Data Saver"
          desc="कम इंटरनेट में भी videos स्मूथ"
          value={dataSaver}
          onChange={(v) => {
            setDataSaver(v);
            setBool("mk_data_saver", v);
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
          }}
          ocid="settings.display.autoplay_switch"
        />

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
                {isActive && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

function HelpTab() {
  const [report, setReport] = useState("");

  const submitReport = () => {
    if (!report.trim()) return;
    setReport("");
    toast.success("आपकी रिपोर्ट भेजी गई ✅");
  };

  const deleteAccount = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 py-4 flex flex-col gap-5">
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
              Settings → Wallet → UPI ID डालें और Withdraw Request भेजें। Admin 24 घंटे
              में process करेंगे। 💳
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="reel">
            <AccordionTrigger className="text-sm">
              रील कैसे बनाएं?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              नीचे center में Reels button दबाएं → Video select करें →
              Music/filter/text जोड़ें → Publish करें। 🎬
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SectionTitle icon="🐛" title="Problem Report" />
        <Textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="कोई bug या problem बताएं..."
          rows={3}
          data-ocid="settings.help.report_textarea"
        />
        <Button
          onClick={submitReport}
          disabled={!report.trim()}
          data-ocid="settings.help.report_button"
          variant="outline"
          className="w-full"
        >
          📤 रिपोर्ट भेजें
        </Button>

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
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              className="text-2xl"
            >
              ✅
            </motion.span>
            <span className="text-sm font-semibold text-primary">
              Gold Verified Badge
            </span>
          </div>
          <Button
            disabled
            className="w-full opacity-70"
            style={{ background: "oklch(0.72 0.12 66)", color: "white" }}
            data-ocid="settings.help.verify_button"
          >
            जल्द आ रहा है... 🚀
          </Button>
        </div>

        <SectionTitle icon="⚠️" title="खतरनाक zone" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full"
              data-ocid="settings.help.delete_button"
            >
              🗑️ Account Delete करें
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="settings.help.dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Account Delete करें?</AlertDialogTitle>
              <AlertDialogDescription>
                क्या आप सच में account delete करना चाहते हैं? यह action उलटा नहीं हो
                सकता। सारा data मिट जाएगा।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="settings.help.cancel_button">
                रद्द करें
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                className="bg-destructive text-destructive-foreground"
                data-ocid="settings.help.confirm_button"
              >
                हाँ, Delete करें
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ScrollArea>
  );
}

// ──────────────────────────────────────────────
// Shared helper components
// ──────────────────────────────────────────────

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
  const { t } = useLanguage();

  const handleLangSelect = (code: string) => {
    setLangSelected(code);
    setLanguage(code);
  };

  return (
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-[110] bg-card flex flex-col"
            style={{ height: "100dvh" }}
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

            <Tabs
              defaultValue="account"
              className="flex flex-col flex-1 min-h-0"
            >
              <ScrollArea className="shrink-0">
                <TabsList className="mx-4 mt-2 mb-1 w-auto inline-flex h-auto flex-wrap gap-1 bg-transparent p-0">
                  {(
                    [
                      ["account", "👤", "अकाउंट"],
                      ["wallet", "💰", "वॉलेट"],
                      ["privacy", "🔒", "प्राइवेसी"],
                      ["notif", "🔔", "नोटिफिकेशन"],
                      ["display", "🎨", "डिस्प्ले"],
                      ["help", "❓", "हेल्प"],
                      ["guru", "🎓", "Guru"],
                    ] as [string, string, string][]
                  ).map(([val, icon, label]) => (
                    <TabsTrigger
                      key={val}
                      value={val}
                      data-ocid={`settings.${val}.tab`}
                      className="text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {icon} {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              <TabsContent
                value="account"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <AccountTab />
              </TabsContent>
              <TabsContent
                value="wallet"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <WalletTab />
              </TabsContent>
              <TabsContent
                value="privacy"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <PrivacyTab />
              </TabsContent>
              <TabsContent
                value="notif"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <NotificationsTab />
              </TabsContent>
              <TabsContent
                value="display"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <DisplayTab
                  langSelected={langSelected}
                  onLangSelect={handleLangSelect}
                />
              </TabsContent>
              <TabsContent
                value="help"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <HelpTab />
              </TabsContent>
              <TabsContent
                value="guru"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <EnglishGuruAI />
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
