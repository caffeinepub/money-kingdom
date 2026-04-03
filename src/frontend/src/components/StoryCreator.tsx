import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const FILTERS = [
  { id: "normal", nameHindi: "साधारण", style: "none", swatch: "#c8a87a" },
  {
    id: "warm",
    nameHindi: "गर्म",
    style: "sepia(0.3) saturate(1.4) brightness(1.05)",
    swatch: "#d4944a",
  },
  {
    id: "cool",
    nameHindi: "ठंडा",
    style: "hue-rotate(30deg) saturate(1.2) brightness(1.05)",
    swatch: "#6ab0d4",
  },
  {
    id: "vintage",
    nameHindi: "विंटेज",
    style: "sepia(0.5) contrast(0.85) brightness(0.9) saturate(0.8)",
    swatch: "#b89460",
  },
  { id: "bw", nameHindi: "श्वेत-श्याम", style: "grayscale(1)", swatch: "#888" },
  {
    id: "vivid",
    nameHindi: "चमकीला",
    style: "saturate(2) contrast(1.1)",
    swatch: "#e85d2a",
  },
  {
    id: "fade",
    nameHindi: "फ़ेड",
    style: "opacity(0.85) brightness(1.1) saturate(0.7)",
    swatch: "#d4c4a8",
  },
  {
    id: "sunset",
    nameHindi: "सूर्यास्त",
    style: "sepia(0.4) saturate(1.8) hue-rotate(-20deg)",
    swatch: "#f07a30",
  },
  {
    id: "night",
    nameHindi: "रात",
    style: "brightness(0.7) saturate(1.3) contrast(1.2)",
    swatch: "#334466",
  },
  {
    id: "drama",
    nameHindi: "ड्रामा",
    style: "contrast(1.4) brightness(0.9) saturate(1.2)",
    swatch: "#5a2a2a",
  },
  {
    id: "glow",
    nameHindi: "चमक",
    style: "brightness(1.2) contrast(0.9) saturate(1.5)",
    swatch: "#f0c060",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onPost: (videoUrl: string, filterStyle: string, filterName: string) => void;
}

export default function StoryCreator({ open, onClose, onPost }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const fileRef = useRef<HTMLInputElement>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handlePost = () => {
    if (!videoUrl) return;
    onPost(videoUrl, selectedFilter.style, selectedFilter.nameHindi);
    handleClose();
  };

  const handleClose = () => {
    setVideoUrl(null);
    setSelectedFilter(FILTERS[0]);
    if (fileRef.current) fileRef.current.value = "";
    onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const delta = touchCurrentY.current - touchStartY.current;
    if (delta > 80) handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="story-creator-overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          style={{ height: "100dvh" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-ocid="story_creator.dialog"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <h2 className="text-base font-bold text-white">स्टोरी बनाएं</h2>
            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              data-ocid="story_creator.close_button"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {!videoUrl ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 w-full flex-1 min-h-[60vw] rounded-2xl border-2 border-dashed border-white/20 hover:border-yellow-400/60 hover:bg-white/5 transition-all"
                data-ocid="story_creator.upload_button"
              >
                <div className="w-16 h-16 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center">
                  <Upload size={28} className="text-yellow-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-lg">वीडियो चुनें</p>
                  <p className="text-sm text-white/50 mt-1">
                    Gallery से video upload करें
                  </p>
                </div>
                <p className="text-xs text-white/30 px-8 text-center">
                  नीचे से ऊपर स्वाइप करें → बंद करें
                </p>
              </motion.button>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3 flex-1"
                >
                  {/* Video Preview — full-screen style */}
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] w-full max-h-[55vh] shadow-2xl">
                    <video
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{
                        filter:
                          selectedFilter.style === "none"
                            ? undefined
                            : selectedFilter.style,
                      }}
                    />
                    {/* Filter badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full">
                      <span className="text-xs text-white font-bold">
                        ✨ {selectedFilter.nameHindi}
                      </span>
                    </div>
                    {/* Remove video */}
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>

                  {/* Filter Picker */}
                  <div>
                    <p className="text-xs font-bold text-white/60 mb-2 uppercase tracking-wide">
                      फ़िल्टर चुनें
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {FILTERS.map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setSelectedFilter(filter)}
                          className={`flex flex-col items-center gap-1 shrink-0 w-16 p-1 rounded-xl transition-all ${
                            selectedFilter.id === filter.id
                              ? "ring-2 ring-yellow-400 bg-yellow-400/10"
                              : "hover:bg-white/10"
                          }`}
                          data-ocid="story_creator.toggle"
                        >
                          <div
                            className="w-12 h-12 rounded-lg shadow-sm border border-white/20"
                            style={{
                              background: filter.swatch,
                              filter:
                                filter.style === "none"
                                  ? undefined
                                  : filter.style,
                            }}
                          />
                          <span className="text-[10px] font-medium text-white text-center leading-tight">
                            {filter.nameHindi}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          {/* Action buttons — sticky bottom */}
          <div className="px-4 pb-6 pt-3 flex gap-3 shrink-0 border-t border-white/10 bg-black">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={handleClose}
              data-ocid="story_creator.cancel_button"
            >
              रद्द करें
            </Button>
            <Button
              className="flex-1 font-bold bg-yellow-400 hover:bg-yellow-500 text-black"
              onClick={handlePost}
              disabled={!videoUrl}
              data-ocid="story_creator.submit_button"
            >
              🎬 स्टोरी पोस्ट करें
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
