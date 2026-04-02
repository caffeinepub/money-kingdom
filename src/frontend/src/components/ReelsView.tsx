import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Post } from "./CenterFeed";

const POSTS_KEY = "mk_all_posts";

function loadVideoPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    const all: Post[] = raw ? JSON.parse(raw) : [];
    return all.filter((p) => !!p.videoUrl);
  } catch {
    return [];
  }
}

function buildLikesMap(posts: Post[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const p of posts) {
    map[p.id] = p.likes;
  }
  return map;
}

interface ReelsViewProps {
  onBack: () => void;
}

export default function ReelsView({ onBack }: ReelsViewProps) {
  const [reels, setReels] = useState<Post[]>(() => loadVideoPosts());
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() =>
    buildLikesMap(loadVideoPosts()),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Reload posts when component mounts
  useEffect(() => {
    const posts = loadVideoPosts();
    setReels(posts);
    setLikesMap(buildLikesMap(posts));
  }, []);

  // Intersection observer to auto-play visible video
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        }
      },
      { threshold: 0.7 },
    );
    const vids = Object.values(videoRefs.current).filter(Boolean);
    for (const v of vids) {
      if (v) observer.observe(v);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = (id: string) => {
    const wasLiked = likedMap[id] ?? false;
    setLikedMap((prev) => ({ ...prev, [id]: !wasLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: wasLiked ? (prev[id] ?? 0) - 1 : (prev[id] ?? 0) + 1,
    }));
  };

  const handleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (post: Post) => {
    const text = `Money Kingdom पर देखें: ${post.author} की वीडियो! 👑\n${post.content}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (reels.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col"
        data-ocid="reels.page"
      >
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
            <p className="text-white/60 text-xl">वीडियो पोस्ट करें, यहाँ दिखेंगी</p>
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      style={{ overscrollBehavior: "contain" }}
      data-ocid="reels.page"
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 pt-4 pointer-events-none">
        <button
          type="button"
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white pointer-events-auto"
          data-ocid="reels.close_button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white text-2xl font-black">रील्स</span>
        <div className="w-12" />
      </div>

      {/* Snap scroll container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative w-full flex items-center justify-center bg-black"
            style={{ height: "100dvh", scrollSnapAlign: "start" }}
          >
            {/* Video */}
            <video
              ref={(el) => {
                videoRefs.current[reel.id] = el;
              }}
              src={reel.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-16 pb-6 px-4 z-10">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-10 h-10 border-2 border-white shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                    {reel.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <p className="text-white font-black text-base">{reel.author}</p>
              </div>
              {reel.content && (
                <p className="text-white/90 text-sm mb-2 line-clamp-2">
                  {reel.content}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center"
                >
                  <Music2 className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white/70 text-xs">
                  Money Kingdom Theme 🎵
                </span>
              </div>
            </div>

            {/* Right action buttons */}
            <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5 z-10">
              {/* Like */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(reel.id);
                }}
                className="flex flex-col items-center gap-0.5"
                data-ocid="reels.toggle"
              >
                <motion.div whileTap={{ scale: 1.3 }}>
                  <Heart
                    className={`w-8 h-8 ${
                      likedMap[reel.id]
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }`}
                  />
                </motion.div>
                <span className="text-white text-xs font-bold">
                  {likesMap[reel.id] ?? 0}
                </span>
              </button>

              {/* Comment */}
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center gap-0.5"
                data-ocid="reels.button"
              >
                <MessageCircle className="w-8 h-8 text-white" />
                <span className="text-white text-xs font-bold">
                  {reel.comments}
                </span>
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(reel);
                }}
                className="flex flex-col items-center gap-0.5"
                data-ocid="reels.button"
              >
                <Send className="w-8 h-8 text-white" />
                <span className="text-white text-xs font-bold">शेयर</span>
              </button>

              {/* Save */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(reel.id);
                }}
                className="flex flex-col items-center gap-0.5"
                data-ocid="reels.toggle"
              >
                <Bookmark
                  className={`w-8 h-8 ${
                    savedMap[reel.id] ? "fill-white text-white" : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
