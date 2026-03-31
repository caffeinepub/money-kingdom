import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type ThemeName, useTheme } from "../hooks/useTheme";
import { setLanguage, useLanguage } from "../utils/i18n";
import EnglishGuruAI from "./EnglishGuruAI";

const LANGUAGES = [
  // भारतीय भाषाएं
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
  // विश्व की प्रमुख भाषाएं
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

function getStoredLang() {
  return localStorage.getItem("mk_language") ?? "hi";
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [selected, setSelected] = useState<string>(getStoredLang);
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleSelect = (code: string) => {
    setSelected(code);
    setLanguage(code);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50"
            onClick={onClose}
          />

          {/* Panel slides from bottom */}
          <motion.div
            key="settings-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 inset-x-0 z-[110] sm:inset-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: "90vh" }}
            data-ocid="settings.panel"
          >
            {/* Header */}
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
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="language"
              className="flex flex-col flex-1 min-h-0"
            >
              <TabsList className="mx-4 mt-3 shrink-0 grid grid-cols-3">
                <TabsTrigger value="language" data-ocid="settings.language.tab">
                  🌐 {t("select_language")}
                </TabsTrigger>
                <TabsTrigger
                  value="english-guru"
                  data-ocid="settings.english_guru.tab"
                >
                  🎓 English Guru
                </TabsTrigger>
                <TabsTrigger value="theme" data-ocid="settings.theme.tab">
                  🎨 थीम
                </TabsTrigger>
              </TabsList>

              {/* Language Tab */}
              <TabsContent
                value="language"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <ScrollArea className="flex-1">
                  <div className="px-4 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {t("select_language")}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      कुल {LANGUAGES.length} भाषाएं उपलब्ध हैं
                    </p>
                    <div className="flex flex-col gap-1">
                      {LANGUAGES.map((lang) => {
                        const isActive = selected === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelect(lang.code)}
                            data-ocid="settings.language.button"
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-left ${
                              isActive
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted border border-transparent"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span
                                className={`text-lg font-semibold leading-tight ${
                                  isActive ? "text-primary" : "text-foreground"
                                }`}
                              >
                                {lang.name}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                {lang.label}
                              </span>
                            </div>
                            {isActive && (
                              <Check className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
                      यह सेटिंग सिर्फ आपके लिए है। एप्प की भाषा बदलेगी।
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* English Guru AI Tab */}
              <TabsContent
                value="english-guru"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <EnglishGuruAI />
              </TabsContent>

              {/* Theme Tab */}
              <TabsContent
                value="theme"
                className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                <ScrollArea className="flex-1">
                  <div className="px-4 py-4 flex flex-col gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      थीम चुनें
                    </p>
                    <p className="text-xs text-muted-foreground -mt-1">
                      अपने Money Kingdom का रंग बदलें
                    </p>
                    {THEMES.map((t_item) => {
                      const isActive = theme === t_item.id;
                      return (
                        <button
                          key={t_item.id}
                          type="button"
                          onClick={() => setTheme(t_item.id)}
                          data-ocid={`settings.theme.${t_item.id}.button`}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                            isActive
                              ? "border-primary shadow-md"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {/* Color preview swatch */}
                          <div
                            className="w-12 h-12 rounded-xl shrink-0 border border-border shadow-sm flex items-center justify-center text-xl"
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
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t_item.desc}
                            </p>
                          </div>
                          {isActive && (
                            <Check className="w-5 h-5 text-primary shrink-0" />
                          )}
                        </button>
                      );
                    })}
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      थीम चुनने से आपका पूरा app तुरंत बदलेगा
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
