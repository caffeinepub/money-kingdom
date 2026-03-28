import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useRef, useState } from "react";

export interface VideoMetadata {
  videoUrl: string;
  musicName?: string;
  musicVolume?: number;
  filter?: string;
  textOverlay?: string;
  textColor?: string;
  stickers?: string[];
  trimStart?: number;
  trimEnd?: number;
  location?: string;
  taggedPeople?: string[];
  caption?: string;
}

interface Props {
  videoUrl: string;
  onComplete: (meta: VideoMetadata) => void;
  onCancel: () => void;
}

const FILTERS: { name: string; label: string; css: string }[] = [
  { name: "Normal", label: "Normal", css: "" },
  { name: "Warm", label: "🌅 Warm", css: "sepia(0.4) saturate(1.3)" },
  { name: "Cool", label: "❄️ Cool", css: "hue-rotate(180deg) saturate(0.8)" },
  {
    name: "Vintage",
    label: "📷 Vintage",
    css: "sepia(0.6) contrast(0.9) brightness(0.9)",
  },
  { name: "B&W", label: "⬛ B&W", css: "grayscale(1)" },
  {
    name: "Fade",
    label: "☁️ Fade",
    css: "brightness(1.1) contrast(0.8) saturate(0.7)",
  },
  { name: "Vivid", label: "🌈 Vivid", css: "saturate(2) contrast(1.1)" },
  {
    name: "Rose",
    label: "🌸 Rose",
    css: "sepia(0.3) hue-rotate(300deg) saturate(1.5)",
  },
  {
    name: "Sky",
    label: "🌊 Sky",
    css: "hue-rotate(200deg) saturate(1.2) brightness(1.05)",
  },
  {
    name: "Gold",
    label: "✨ Gold",
    css: "sepia(0.5) saturate(1.8) brightness(1.1)",
  },
  {
    name: "Drama",
    label: "🎭 Drama",
    css: "contrast(1.5) saturate(1.4) brightness(0.9)",
  },
];

const STICKER_OPTIONS = [
  "😍",
  "💰",
  "🔥",
  "⭐",
  "👑",
  "💎",
  "🎉",
  "🙏",
  "😂",
  "❤️",
  "🤑",
  "💯",
  "🎵",
  "🌟",
  "👍",
  "🏆",
  "🚀",
  "💸",
  "✨",
  "🎊",
];
const LOCATION_CHIPS = ["दिल्ली", "मुंबई", "कोलकाता", "चेन्नई", "बैंगलोर"];
const TEXT_COLORS = ["#ffffff", "#ffdf00", "#ff4444", "#44ff88", "#333333"];

type TabId =
  | "music"
  | "filter"
  | "text"
  | "sticker"
  | "trim"
  | "thumbnail"
  | "location"
  | "tag"
  | "caption";

const TABS: { id: TabId; label: string }[] = [
  { id: "music", label: "🎵 संगीत" },
  { id: "filter", label: "🎨 फिल्टर" },
  { id: "text", label: "✍️ टेक्स्ट" },
  { id: "sticker", label: "😄 स्टिकर" },
  { id: "trim", label: "✂️ ट्रिम" },
  { id: "thumbnail", label: "📸 थंबनेल" },
  { id: "location", label: "📍 लोकेशन" },
  { id: "tag", label: "👥 टैग" },
  { id: "caption", label: "💬 कैप्शन" },
];

export default function VideoEditorModal({
  videoUrl,
  onComplete,
  onCancel,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("filter");

  // Music
  const [musicName, setMusicName] = useState("");
  const [musicVolume, setMusicVolume] = useState(80);
  const musicInputRef = useRef<HTMLInputElement>(null);

  // Filter
  const [selectedFilter, setSelectedFilter] = useState("Normal");

  // Text
  const [textOverlay, setTextOverlay] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState<"small" | "medium" | "large">(
    "medium",
  );

  // Stickers
  const stickerCounter = useRef(0);
  const [stickers, setStickers] = useState<{ id: number; emoji: string }[]>([]);

  // Trim
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);

  // Thumbnail
  const [thumbTime, setThumbTime] = useState(0);

  // Location
  const [location, setLocation] = useState("");

  // Tags
  const [tagInput, setTagInput] = useState("");
  const [taggedPeople, setTaggedPeople] = useState<string[]>([]);

  // Caption
  const [caption, setCaption] = useState("");

  const filterCss = FILTERS.find((f) => f.name === selectedFilter)?.css ?? "";

  const textSizeClass =
    textSize === "small"
      ? "text-base"
      : textSize === "large"
        ? "text-4xl"
        : "text-2xl";

  const addSticker = (s: string) => {
    stickerCounter.current += 1;
    setStickers((prev) => [...prev, { id: stickerCounter.current, emoji: s }]);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !taggedPeople.includes(t)) {
      setTaggedPeople((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  const handleDone = () => {
    onComplete({
      videoUrl,
      musicName: musicName || undefined,
      musicVolume,
      filter: selectedFilter !== "Normal" ? selectedFilter : undefined,
      textOverlay: textOverlay || undefined,
      textColor,
      stickers: stickers.length > 0 ? stickers.map((s) => s.emoji) : undefined,
      trimStart,
      trimEnd,
      location: location || undefined,
      taggedPeople: taggedPeople.length > 0 ? taggedPeople : undefined,
      caption: caption || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      data-ocid="video_editor.modal"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary">
        <button
          type="button"
          onClick={onCancel}
          data-ocid="video_editor.close_button"
        >
          <X className="w-7 h-7 text-primary-foreground" />
        </button>
        <span className="text-primary-foreground font-black text-xl">
          वीडियो एडिटर
        </span>
        <button
          type="button"
          onClick={handleDone}
          className="bg-white text-primary font-black px-4 py-1.5 rounded-full text-base"
          data-ocid="video_editor.save_button"
        >
          तैयार ✅
        </button>
      </div>

      {/* Video Preview */}
      <div className="relative bg-black shrink-0">
        {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video */}
        <video
          src={videoUrl}
          className="w-full aspect-video object-contain"
          style={{ filter: filterCss }}
          muted
          playsInline
          preload="metadata"
          controls
        />
        {/* Text overlay */}
        {textOverlay && (
          <div
            className={`absolute bottom-8 left-0 right-0 text-center font-black px-3 drop-shadow-lg ${textSizeClass}`}
            style={{ color: textColor }}
          >
            {textOverlay}
          </div>
        )}
        {/* Sticker overlays */}
        {stickers.slice(-5).map((s, i) => (
          <span
            key={s.id}
            className="absolute text-4xl pointer-events-none"
            style={{ top: `${20 + i * 15}%`, left: `${10 + i * 15}%` }}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {/* Tab Pills */}
      <div
        className="flex gap-2 overflow-x-auto px-3 py-2 bg-zinc-900 shrink-0 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}
            data-ocid="video_editor.tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-zinc-900 p-4 text-white">
        {/* MUSIC */}
        {activeTab === "music" && (
          <div className="space-y-5">
            <p className="font-black text-xl text-primary">🎵 संगीत चुनें</p>
            <button
              type="button"
              onClick={() => musicInputRef.current?.click()}
              className="w-full bg-primary text-primary-foreground rounded-xl py-4 font-bold text-lg"
              data-ocid="video_editor.upload_button"
            >
              🎶 गैलरी से गाना चुनें
            </button>
            <input
              ref={musicInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setMusicName(f.name);
              }}
            />
            {musicName && (
              <p className="text-green-400 font-bold text-base">
                ✅ चुना गया: {musicName}
              </p>
            )}
            <div className="space-y-2">
              <p className="font-bold text-zinc-300">वॉल्यूम: {musicVolume}%</p>
              <Slider
                value={[musicVolume]}
                onValueChange={([v]) => setMusicVolume(v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
                data-ocid="video_editor.select"
              />
            </div>
          </div>
        )}

        {/* FILTER */}
        {activeTab === "filter" && (
          <div className="space-y-4">
            <p className="font-black text-xl text-primary">🎨 फिल्टर चुनें</p>
            <div className="grid grid-cols-3 gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setSelectedFilter(f.name)}
                  className={`rounded-xl py-3 px-2 font-bold text-sm transition-all ${
                    selectedFilter === f.name
                      ? "ring-4 ring-primary bg-primary/20 text-primary scale-105"
                      : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                  }`}
                  data-ocid="video_editor.toggle"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TEXT */}
        {activeTab === "text" && (
          <div className="space-y-5">
            <p className="font-black text-xl text-primary">✍️ टेक्स्ट जोड़ें</p>
            <Input
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value)}
              placeholder="यहाँ लिखें..."
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 text-lg h-14"
              data-ocid="video_editor.input"
            />
            <div className="space-y-2">
              <p className="font-bold text-zinc-300">रंग चुनें:</p>
              <div className="flex gap-3">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTextColor(c)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      textColor === c
                        ? "border-primary scale-125"
                        : "border-zinc-600"
                    }`}
                    style={{ backgroundColor: c }}
                    data-ocid="video_editor.toggle"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-zinc-300">आकार:</p>
              <div className="flex gap-3">
                {(["small", "medium", "large"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setTextSize(sz)}
                    className={`px-5 py-2 rounded-full font-bold transition-all ${
                      textSize === sz
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-700 text-zinc-200"
                    }`}
                    data-ocid="video_editor.toggle"
                  >
                    {sz === "small" ? "छोटा" : sz === "medium" ? "मध्यम" : "बड़ा"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STICKER */}
        {activeTab === "sticker" && (
          <div className="space-y-4">
            <p className="font-black text-xl text-primary">😄 स्टिकर लगाएं</p>
            <div className="grid grid-cols-5 gap-3">
              {STICKER_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSticker(s)}
                  className="text-4xl py-2 bg-zinc-700 rounded-xl hover:bg-zinc-600 active:scale-110 transition-all"
                  data-ocid="video_editor.button"
                >
                  {s}
                </button>
              ))}
            </div>
            {stickers.length > 0 && (
              <div className="space-y-2">
                <p className="text-zinc-300 font-bold">
                  जोड़े गए ({stickers.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {stickers.map((s) => (
                    <span
                      key={s.id}
                      className="text-2xl bg-zinc-700 rounded-lg px-2 py-1"
                    >
                      {s.emoji}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStickers([])}
                    className="text-sm text-red-400 bg-zinc-700 rounded-lg px-3 py-1 font-bold"
                    data-ocid="video_editor.delete_button"
                  >
                    सब हटाएं
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRIM */}
        {activeTab === "trim" && (
          <div className="space-y-6">
            <p className="font-black text-xl text-primary">✂️ वीडियो ट्रिम करें</p>
            <div className="space-y-3">
              <div className="flex justify-between text-zinc-300 font-bold">
                <span>शुरुआत: {trimStart}s</span>
                <span>अंत: {trimEnd}s</span>
              </div>
              <div className="space-y-2">
                <p className="text-zinc-400">शुरुआत (Start)</p>
                <Slider
                  value={[trimStart]}
                  onValueChange={([v]) =>
                    setTrimStart(Math.min(v, trimEnd - 1))
                  }
                  min={0}
                  max={300}
                  step={1}
                  className="w-full"
                  data-ocid="video_editor.select"
                />
              </div>
              <div className="space-y-2">
                <p className="text-zinc-400">अंत (End)</p>
                <Slider
                  value={[trimEnd]}
                  onValueChange={([v]) =>
                    setTrimEnd(Math.max(v, trimStart + 1))
                  }
                  min={1}
                  max={300}
                  step={1}
                  className="w-full"
                  data-ocid="video_editor.select"
                />
              </div>
              <div className="bg-zinc-700 rounded-xl p-4 text-center">
                <p className="text-primary font-black text-lg">
                  ⏱ कुल समय: {trimEnd - trimStart} सेकंड
                </p>
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL */}
        {activeTab === "thumbnail" && (
          <div className="space-y-5">
            <p className="font-black text-xl text-primary">📸 कवर फ्रेम चुनें</p>
            <div className="space-y-3">
              <p className="text-zinc-300">समय चुनें: {thumbTime}s</p>
              <Slider
                value={[thumbTime]}
                onValueChange={([v]) => setThumbTime(v)}
                min={0}
                max={300}
                step={1}
                className="w-full"
                data-ocid="video_editor.select"
              />
              <div className="bg-zinc-700 rounded-xl p-8 text-center">
                <p className="text-4xl">🎬</p>
                <p className="text-zinc-300 font-bold mt-2">
                  {thumbTime}s पर फ्रेम
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LOCATION */}
        {activeTab === "location" && (
          <div className="space-y-5">
            <p className="font-black text-xl text-primary">📍 लोकेशन जोड़ें</p>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="अपना शहर/जगह लिखें..."
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 text-lg h-14"
              data-ocid="video_editor.input"
            />
            <div className="space-y-2">
              <p className="text-zinc-300 font-bold">जल्दी चुनें:</p>
              <div className="flex flex-wrap gap-2">
                {LOCATION_CHIPS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`px-4 py-2 rounded-full font-bold text-base transition-all ${
                      location === loc
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                    }`}
                    data-ocid="video_editor.toggle"
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAG */}
        {activeTab === "tag" && (
          <div className="space-y-5">
            <p className="font-black text-xl text-primary">👥 लोगों को टैग करें</p>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="@username"
                className="flex-1 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 text-lg h-14"
                data-ocid="video_editor.input"
              />
              <Button
                type="button"
                onClick={addTag}
                className="bg-primary text-primary-foreground h-14 px-5 text-lg font-bold"
                data-ocid="video_editor.primary_button"
              >
                जोड़ें
              </Button>
            </div>
            {taggedPeople.length > 0 && (
              <div className="space-y-2">
                <p className="text-zinc-300 font-bold">टैग किए गए:</p>
                <div className="flex flex-wrap gap-2">
                  {taggedPeople.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-1 bg-zinc-700 rounded-full px-3 py-2"
                    >
                      <span className="text-white font-bold">@{p}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setTaggedPeople((prev) => prev.filter((x) => x !== p))
                        }
                        className="text-red-400 ml-1"
                        data-ocid="video_editor.delete_button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CAPTION */}
        {activeTab === "caption" && (
          <div className="space-y-4">
            <p className="font-black text-xl text-primary">💬 कैप्शन लिखें</p>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="अपनी वीडियो के बारे में लिखें..."
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 text-lg min-h-[200px] resize-none"
              rows={6}
              data-ocid="video_editor.textarea"
            />
            <p className="text-zinc-400 text-sm">{caption.length} अक्षर</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4 bg-zinc-900 border-t border-zinc-700 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-zinc-600 text-zinc-200 bg-zinc-800 hover:bg-zinc-700 h-14 text-lg font-bold rounded-xl"
          data-ocid="video_editor.cancel_button"
        >
          ❌ रद्द करें
        </Button>
        <Button
          type="button"
          onClick={handleDone}
          className="bg-primary text-primary-foreground h-14 text-lg font-black rounded-xl"
          data-ocid="video_editor.confirm_button"
        >
          ✅ पोस्ट करें
        </Button>
      </div>
    </div>
  );
}
