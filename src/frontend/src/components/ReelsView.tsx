import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  Play,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface Reel {
  id: string;
  user: string;
  initials: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
}

const EMPTY_REELS: Reel[] = [];

interface ReelsViewProps {
  onBack: () => void;
}

export default function ReelsView({ onBack }: ReelsViewProps) {
  const [reels, setReels] = useState<Reel[]>(EMPTY_REELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLike = (id: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              liked: !r.liked,
              likes: r.liked ? r.likes - 1 : r.likes + 1,
            }
          : r,
      ),
    );
  };

  const handleSave = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r)),
    );
  };

  if (reels.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col"
        data-ocid="reels.page"
      >
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-safe pt-4">
          <button
            type="button"
            onClick={onBack}
            className="w-14 h-14 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
            data-ocid="reels.close_button"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <span className="text-white text-3xl font-black">रील्स</span>
          <div className="w-14" />
        </div>

        {/* Empty state */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-6"
          data-ocid="reels.empty_state"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-8xl mb-6">🎬</div>
            <p className="text-white text-3xl font-black mb-3">
              अभी कोई रील नहीं है
            </p>
            <p className="text-white/60 text-xl">रील्स अपलोड होने पर यहाँ दिखेंगी</p>
          </motion.div>
          <button
            type="button"
            onClick={onBack}
            className="bg-white text-black text-xl font-black px-12 py-4 rounded-full"
            data-ocid="reels.primary_button"
          >
            होम पर जाएं
          </button>
        </div>
      </div>
    );
  }

  const reel = reels[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      data-ocid="reels.page"
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-14 h-14 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
          data-ocid="reels.close_button"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <span className="text-white text-3xl font-black">रील्स</span>
        <div className="w-14" />
      </div>

      {/* Reel content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reel.id}
          className="absolute inset-0 flex items-center justify-center bg-zinc-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-24 h-24 text-white/40" />
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 inset-x-0 pb-6 px-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-end gap-3 mb-4">
              <Avatar className="w-14 h-14 border-2 border-white">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {reel.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white text-xl font-black">{reel.user}</p>
                <p className="text-white/80 text-lg">{reel.caption}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Music2 className="w-5 h-5 text-white/60" />
                  <span className="text-white/60 text-base truncate">
                    {reel.song}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right action buttons */}
          <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => handleLike(reel.id)}
              className="flex flex-col items-center gap-1"
              data-ocid="reels.toggle"
            >
              <Heart
                className={`w-10 h-10 ${
                  reel.liked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
              <span className="text-white text-lg font-bold">{reel.likes}</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-1"
              data-ocid="reels.button"
            >
              <MessageCircle className="w-10 h-10 text-white" />
              <span className="text-white text-lg font-bold">
                {reel.comments}
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-1"
              data-ocid="reels.button"
            >
              <Send className="w-10 h-10 text-white" />
              <span className="text-white text-lg font-bold">शेयर</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(reel.id)}
              className="flex flex-col items-center gap-1"
              data-ocid="reels.toggle"
            >
              <Bookmark
                className={`w-10 h-10 ${
                  reel.saved ? "fill-white text-white" : "text-white"
                }`}
              />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="absolute top-1/2 left-4 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 flex items-center justify-center text-white"
          data-ocid="reels.pagination_prev"
        >
          ▲
        </button>
      )}
      {currentIndex < reels.length - 1 && (
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="absolute bottom-32 left-4 w-14 h-14 rounded-full bg-black/40 flex items-center justify-center text-white"
          data-ocid="reels.pagination_next"
        >
          ▼
        </button>
      )}
    </div>
  );
}
