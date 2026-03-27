import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-md w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="story_creator.dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">स्टोरी बनाएं</h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            data-ocid="story_creator.close_button"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {!videoUrl ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 w-full h-56 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-accent/30 transition-all"
              data-ocid="story_creator.upload_button"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">वीडियो चुनें</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  अपनी gallery से video upload करें
                </p>
              </div>
            </motion.button>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {/* Video Preview */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-64">
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
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded-full">
                    <span className="text-xs text-white font-medium">
                      {selectedFilter.nameHindi}
                    </span>
                  </div>
                </div>

                {/* Filter Picker */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    फ़िल्टर चुनें
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSelectedFilter(filter)}
                        className={`flex flex-col items-center gap-1 shrink-0 w-16 p-1 rounded-lg transition-all ${
                          selectedFilter.id === filter.id
                            ? "ring-2 ring-primary bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                        data-ocid="story_creator.toggle"
                      >
                        <div
                          className="w-10 h-10 rounded-lg shadow-sm border border-border"
                          style={{
                            background: filter.swatch,
                            filter:
                              filter.style === "none"
                                ? undefined
                                : filter.style,
                          }}
                        />
                        <span className="text-[10px] font-medium text-foreground text-center leading-tight">
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

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              data-ocid="story_creator.cancel_button"
            >
              रद्द करें
            </Button>
            <Button
              className="flex-1 font-bold"
              onClick={handlePost}
              disabled={!videoUrl}
              data-ocid="story_creator.submit_button"
            >
              स्टोरी पोस्ट करें
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
