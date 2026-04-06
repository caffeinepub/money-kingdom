import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "./CenterFeed";

const POSTS_KEY = "mk_all_posts";

const HINDI_LYRICS = [
  "पैसों की दुनिया में तुम राजा हो 👑",
  "हर सिक्का तुम्हारी ताकत है 💪",
  "Money Kingdom में स्वागत है 🎵",
  "कमाओ, बढ़ो, राज करो! 💰",
];

const GIFT_AMOUNTS = [5, 10, 25, 50];

function getDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

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

function getWallet(): { coins: number; cash: number } {
  try {
    const raw = localStorage.getItem("mk_wallet");
    if (!raw) return { coins: 0, cash: 0 };
    const p = JSON.parse(raw);
    return { coins: p.coins ?? 0, cash: p.cash ?? 0 };
  } catch {
    return { coins: 0, cash: 0 };
  }
}

function setWallet(coins: number) {
  try {
    const w = getWallet();
    w.coins = Math.max(0, coins);
    localStorage.setItem("mk_wallet", JSON.stringify(w));
  } catch {}
}

function getDoubleMultiplier(): number {
  try {
    const until = Number.parseInt(
      localStorage.getItem("mk_double_earn_until") ?? "0",
      10,
    );
    return Date.now() < until ? 2 : 1;
  } catch {
    return 1;
  }
}

function getDailyReelCoins(): number {
  try {
    const key = `mk_daily_reel_coins_${getDateString()}`;
    return Number.parseInt(localStorage.getItem(key) ?? "0", 10);
  } catch {
    return 0;
  }
}

function addDailyReelCoins(amount: number) {
  try {
    const key = `mk_daily_reel_coins_${getDateString()}`;
    const current = getDailyReelCoins();
    localStorage.setItem(key, String(current + amount));
  } catch {}
}

function getUserProfile() {
  try {
    const raw = localStorage.getItem("mk_user_profile");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getRank(coins: number): {
  label: string;
  emoji: string;
  color: string;
} {
  if (coins >= 2000)
    return { label: "King", emoji: "👑", color: "text-yellow-400" };
  if (coins >= 500)
    return { label: "Prince", emoji: "💎", color: "text-purple-400" };
  if (coins >= 100)
    return { label: "Knight", emoji: "⚔️", color: "text-blue-400" };
  return { label: "Soldier", emoji: "🛡️", color: "text-gray-400" };
}

interface Comment {
  id: string;
  author: string;
  text: string;
  coins: number;
}

function getComments(postId: string): Comment[] {
  try {
    const raw = localStorage.getItem(`mk_comments_${postId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface ReelsViewProps {
  onBack: () => void;
}

interface GiftModalProps {
  postId: string;
  author: string;
  onClose: () => void;
  onGiftSent: () => void;
}

function GiftModal({
  postId: _postId,
  author,
  onClose,
  onGiftSent,
}: GiftModalProps) {
  const wallet = getWallet();
  const [sending, setSending] = useState(false);

  const sendGift = (amount: number) => {
    const mult = getDoubleMultiplier();
    const actual = Math.min(amount, wallet.coins);
    if (actual <= 0) return;
    setSending(true);
    setWallet(wallet.coins - actual);
    // Credits go to admin
    try {
      const raw = localStorage.getItem("mk_admin_wallet");
      const aw = raw ? JSON.parse(raw) : { coins: 0 };
      aw.coins = (aw.coins ?? 0) + actual * mult;
      localStorage.setItem("mk_admin_wallet", JSON.stringify(aw));
    } catch {}
    setTimeout(() => {
      onGiftSent();
      setSending(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        exit={{ y: 200 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-sm bg-zinc-900 rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-bold text-lg">🏛️ Gift Coins</p>
            <p className="text-white/60 text-sm">{author} को gift भेजें</p>
          </div>
          <p className="text-yellow-400 font-bold">{wallet.coins} 🪙</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {GIFT_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={wallet.coins < amt || sending}
              onClick={() => sendGift(amt)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-yellow-400/20 border border-yellow-400/40 disabled:opacity-40 hover:bg-yellow-400/30 transition-all"
              data-ocid="reels.gift.button"
            >
              <span className="text-xl">🪙</span>
              <span className="text-yellow-400 font-bold text-sm">{amt}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2 text-white/60 text-sm"
          data-ocid="reels.gift.cancel_button"
        >
          रद्द करें
        </button>
      </motion.div>
    </motion.div>
  );
}

interface CommentSheetProps {
  postId: string;
  onClose: () => void;
}

function CommentSheet({ postId, onClose }: CommentSheetProps) {
  const comments = getComments(postId);
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    try {
      const profile = getUserProfile();
      const w = getWallet();
      const newComment: Comment = {
        id: Date.now().toString(),
        author: profile.username ?? profile.name ?? "User",
        text: text.trim(),
        coins: w.coins,
      };
      const existing = getComments(postId);
      localStorage.setItem(
        `mk_comments_${postId}`,
        JSON.stringify([newComment, ...existing]),
      );
      setText("");
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200]"
      style={{ backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="absolute bottom-0 inset-x-0 bg-zinc-900 rounded-t-3xl flex flex-col"
        style={{ maxHeight: "70vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="text-white font-bold">💬 कमेंट</p>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 text-sm"
            data-ocid="reels.comment_sheet.close_button"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {comments.length === 0 ? (
            <p className="text-white/40 text-center py-8">पहला कमेंट करें!</p>
          ) : (
            comments.map((c) => {
              const rank = getRank(c.coins);
              const isKing = c.coins >= 2000;
              return (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl ${
                    isKing
                      ? "border border-yellow-400 bg-yellow-400/10"
                      : "bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{rank.emoji}</span>
                    <span
                      className={`text-xs font-bold ${isKing ? "text-yellow-400" : "text-white/80"}`}
                    >
                      {c.author}
                    </span>
                    {isKing && (
                      <span className="text-xs text-yellow-400 font-bold">
                        👑 KING
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm">{c.text}</p>
                </div>
              );
            })
          )}
        </div>
        <div className="px-4 pb-6 pt-2 flex gap-2 border-t border-white/10">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="कमेंट लिखें..."
            className="flex-1 bg-white/10 text-white placeholder:text-white/40 rounded-full px-4 py-2 text-sm outline-none"
            data-ocid="reels.comment.input"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim()}
            className="bg-yellow-400 text-black font-bold text-sm px-4 py-2 rounded-full disabled:opacity-40"
            data-ocid="reels.comment.submit_button"
          >
            भेजें
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface LongPressMenuProps {
  onClose: () => void;
  onShare: () => void;
}

function LongPressMenu({ onClose, onShare }: LongPressMenuProps) {
  const items = [
    {
      icon: "📥",
      label: "डाउनलोड",
      action: () => {
        onClose();
      },
    },
    {
      icon: "📤",
      label: "शेयर",
      action: () => {
        onShare();
        onClose();
      },
    },
    {
      icon: "🚨",
      label: "रिपोर्ट",
      action: () => {
        onClose();
      },
    },
    {
      icon: "🚫",
      label: "Not Interested",
      action: () => {
        onClose();
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-sm bg-zinc-900 rounded-t-3xl pb-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className="w-full flex items-center gap-4 px-6 py-4 text-white hover:bg-white/10 transition-colors text-left"
            onClick={item.action}
            data-ocid="reels.menu.button"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function ReelsView({ onBack }: ReelsViewProps) {
  const [reels, setReels] = useState<Post[]>(() => loadVideoPosts());
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() =>
    buildLikesMap(loadVideoPosts()),
  );
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [doubleTapMap, setDoubleTapMap] = useState<Record<string, boolean>>({});
  const [commentPost, setCommentPost] = useState<string | null>(null);
  const [giftPost, setGiftPost] = useState<Post | null>(null);
  const [showGiftAnim, setShowGiftAnim] = useState(false);
  const [longPressPost, setLongPressPost] = useState<Post | null>(null);
  const [lyricsIndex, setLyricsIndex] = useState(0);
  const [showLovYouExit, setShowLoveYouExit] = useState(false);
  const [luckyCoins, setLuckyCoins] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [dailyCoins, setDailyCoins] = useState(() => getDailyReelCoins());
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const luckyTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lyricsTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const posts = loadVideoPosts();
    setReels(posts);
    setLikesMap(buildLikesMap(posts));
  }, []);

  // Listen for new post events to prepend new videos instantly
  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent;
      const newPost = evt.detail?.post;
      if (newPost?.videoUrl) {
        // Always use the event detail post directly for video posts
        setReels((prev) => {
          // Avoid duplicates
          if (prev.some((r) => r.id === newPost.id)) return prev;
          return [newPost, ...prev];
        });
        setLikesMap((prev) => ({ ...prev, [newPost.id]: 0 }));
      } else {
        // For non-video posts, just reload from storage
        setReels(loadVideoPosts());
      }
    };
    window.addEventListener("mk_new_post", handler);
    return () => window.removeEventListener("mk_new_post", handler);
  }, []);

  // Intersection observer for auto-play
  // biome-ignore lint/correctness/useExhaustiveDependencies: observer setup only needs to run on reel list change
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
  }, [reels]);

  // Lyrics rotation
  useEffect(() => {
    lyricsTimer.current = setInterval(() => {
      setLyricsIndex((i) => (i + 1) % HINDI_LYRICS.length);
    }, 4000);
    return () => {
      if (lyricsTimer.current) clearInterval(lyricsTimer.current);
    };
  }, []);

  // Lucky coin drops every 30 seconds
  useEffect(() => {
    luckyTimer.current = setInterval(() => {
      const id = `coin-${Date.now()}`;
      const x = 10 + Math.random() * 70;
      const y = 20 + Math.random() * 50;
      setLuckyCoins((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setLuckyCoins((prev) => prev.filter((c) => c.id !== id));
      }, 5000);
    }, 30000);
    return () => {
      if (luckyTimer.current) clearInterval(luckyTimer.current);
    };
  }, []);

  const handleBack = () => {
    setShowLoveYouExit(true);
    setTimeout(() => {
      setShowLoveYouExit(false);
      onBack();
    }, 1200);
  };

  const handleLike = useCallback(
    (id: string) => {
      const wasLiked = likedMap[id] ?? false;
      setLikedMap((prev) => ({ ...prev, [id]: !wasLiked }));
      setLikesMap((prev) => ({
        ...prev,
        [id]: wasLiked ? (prev[id] ?? 0) - 1 : (prev[id] ?? 0) + 1,
      }));
      if (!wasLiked && window.navigator.vibrate) {
        window.navigator.vibrate([30]);
      }
    },
    [likedMap],
  );

  const handleDoubleTap = useCallback(
    (id: string) => {
      if (!likedMap[id]) {
        handleLike(id);
      }
      setDoubleTapMap((prev) => ({ ...prev, [id]: true }));
      if (window.navigator.vibrate) window.navigator.vibrate([30]);
      setTimeout(() => {
        setDoubleTapMap((prev) => ({ ...prev, [id]: false }));
      }, 900);
    },
    [handleLike, likedMap],
  );

  const handleShare = useCallback((post: Post) => {
    const text = `Money Kingdom पर देखें: ${post.author} की वीडियो! 👑\n${post.content}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }, []);

  const handleLuckyTap = useCallback((coinId: string) => {
    const mult = getDoubleMultiplier();
    const earned = (1 + Math.floor(Math.random() * 3)) * mult;
    const w = getWallet();
    setWallet(w.coins + earned);
    addDailyReelCoins(earned);
    setDailyCoins((prev) => prev + earned);
    setLuckyCoins((prev) => prev.filter((c) => c.id !== coinId));
    if (window.navigator.vibrate) window.navigator.vibrate([50]);
  }, []);

  const handleGiftSent = useCallback(() => {
    setGiftPost(null);
    setShowGiftAnim(true);
    setTimeout(() => setShowGiftAnim(false), 2500);
  }, []);

  const handleLongPressStart = useCallback((post: Post) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressPost(post);
      setShowLongPressMenu(true);
      if (window.navigator.vibrate) window.navigator.vibrate([50, 30]);
    }, 500);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleVideoTimeUpdate = useCallback(
    (id: string, vid: HTMLVideoElement) => {
      if (vid.duration > 0) {
        setProgress((prev) => ({
          ...prev,
          [id]: vid.currentTime / vid.duration,
        }));
      }
    },
    [],
  );

  const handleToggleMute = useCallback((id: string) => {
    setMutedMap((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
    const vid = videoRefs.current[id];
    if (vid) vid.muted = !vid.muted;
  }, []);

  if (reels.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col"
        data-ocid="reels.page"
      >
        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-4">
          <button
            type="button"
            onClick={handleBack}
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
            onClick={handleBack}
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
      {/* Earning counter top-right */}
      <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1">
        <span className="text-yellow-400 font-bold text-xs">
          आज: {dailyCoins} 🪙
        </span>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 pt-4 pointer-events-none">
        <button
          type="button"
          onClick={handleBack}
          className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white pointer-events-auto"
          data-ocid="reels.close_button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white text-2xl font-black">रील्स</span>
        <div className="w-12" />
      </div>

      {/* Lucky coins floating */}
      <AnimatePresence>
        {luckyCoins.map((coin) => (
          <motion.button
            key={coin.id}
            type="button"
            className="fixed z-40 text-3xl cursor-pointer select-none"
            style={{ left: `${coin.x}%`, top: `${coin.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => handleLuckyTap(coin.id)}
            aria-label="Lucky coin"
            data-ocid="reels.canvas_target"
          >
            🪙
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Gift rockets animation */}
      <AnimatePresence>
        {showGiftAnim && (
          <div className="fixed inset-0 z-[180] pointer-events-none overflow-hidden">
            {["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7"].map((id, i) => (
              <motion.div
                key={id}
                className="absolute text-3xl"
                style={{ left: `${10 + i * 11}%`, bottom: 0 }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: "-110vh", opacity: 0 }}
                transition={{ duration: 1.8, delay: i * 0.1, ease: "easeOut" }}
              >
                🚀
              </motion.div>
            ))}
            {[
              "c0",
              "c1",
              "c2",
              "c3",
              "c4",
              "c5",
              "c6",
              "c7",
              "c8",
              "c9",
              "c10",
              "c11",
            ].map((id, i) => (
              <motion.div
                key={id}
                className="absolute text-2xl"
                style={{ left: `${5 + i * 8}%`, top: "-5%" }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: "120vh", opacity: 0, rotate: 360 }}
                transition={{ duration: 2, delay: i * 0.08 }}
              >
                🪙
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Love You exit animation */}
      <AnimatePresence>
        {showLovYouExit && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1.2] }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-9xl select-none"
            >
              ❤️
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snap scroll container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((reel) => {
          const uploaderCoins = (() => {
            try {
              return (
                JSON.parse(localStorage.getItem("mk_wallet") ?? "{}").coins ?? 0
              );
            } catch {
              return 0;
            }
          })();
          const rank = getRank(uploaderCoins);
          const isMuted = mutedMap[reel.id] ?? true;
          const vidProgress = progress[reel.id] ?? 0;

          return (
            <div
              key={reel.id}
              className="relative w-full flex items-center justify-center bg-black"
              style={{ height: "100dvh", scrollSnapAlign: "start" }}
              onTouchStart={() => handleLongPressStart(reel)}
              onTouchEnd={handleLongPressEnd}
              onMouseDown={() => handleLongPressStart(reel)}
              onMouseUp={handleLongPressEnd}
            >
              {/* Blurred background */}
              {reel.videoUrl && (
                <video
                  src={reel.videoUrl}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ filter: "blur(20px) scale(1.1)", opacity: 0.5 }}
                  tabIndex={-1}
                />
              )}

              {/* Main video */}
              <video
                ref={(el) => {
                  videoRefs.current[reel.id] = el;
                }}
                src={reel.videoUrl}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-contain cursor-pointer"
                onTimeUpdate={(e) =>
                  handleVideoTimeUpdate(reel.id, e.currentTarget)
                }
                onClick={() => handleToggleMute(reel.id)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter")
                    handleToggleMute(reel.id);
                }}
                onDoubleClick={() => handleDoubleTap(reel.id)}
                data-ocid="reels.canvas_target"
              />

              {/* Mute hint */}
              {isMuted && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 pointer-events-none">
                  <span className="text-white text-xs">🔇 tap to unmute</span>
                </div>
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Double tap animation */}
              <AnimatePresence>
                {doubleTapMap[reel.id] && (
                  <motion.div
                    key="double-tap"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 0, y: -60 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-6xl">🪙</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hindi Lyrics overlay */}
              <div className="absolute bottom-40 left-4 right-20 z-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={lyricsIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.85, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-white text-sm font-medium drop-shadow-lg"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                  >
                    {HINDI_LYRICS[lyricsIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-16 left-0 right-16 pb-2 px-4 z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar className="w-10 h-10 border-2 border-white shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                      {reel.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-white font-black text-sm">
                        {reel.author}
                      </p>
                      {/* Permanent rank badge */}
                      <span
                        className={`text-xs font-bold ${rank.color} bg-black/50 px-1.5 py-0.5 rounded-full`}
                      >
                        {rank.emoji} {rank.label}
                      </span>
                    </div>
                  </div>
                </div>
                {reel.content && (
                  <p className="text-white/90 text-xs mb-2 line-clamp-2">
                    {reel.content}
                  </p>
                )}
                {/* Music track marquee */}
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-8 h-8 rounded-full bg-white/20 border border-yellow-400/60 flex items-center justify-center shrink-0"
                  >
                    <span className="text-sm">🎵</span>
                  </motion.div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white/80 text-xs marquee-text">
                      Money Kingdom Theme 🎵 — Prince Pawan Kumar
                      &nbsp;&nbsp;&nbsp; Money Kingdom Theme 🎵 — Prince Pawan
                      Kumar
                    </p>
                  </div>
                </div>
              </div>

              {/* Music Visualizer */}
              <div className="absolute bottom-4 left-4 z-10 flex items-end gap-0.5 pointer-events-none">
                {(
                  [
                    ["b0", 0.4],
                    ["b1", 0.7],
                    ["b2", 1],
                    ["b3", 0.6],
                    ["b4", 0.8],
                  ] as [string, number][]
                ).map(([id, h], i) => (
                  <motion.div
                    key={id}
                    className="w-1 bg-yellow-400/70 rounded-full"
                    animate={{
                      height: [h * 12, h * 20, h * 8, h * 18, h * 12],
                    }}
                    transition={{
                      duration: 0.8 + i * 0.1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    style={{ minHeight: 4 }}
                  />
                ))}
              </div>

              {/* Right action buttons */}
              <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-10">
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
                    <span
                      className={`text-3xl ${likedMap[reel.id] ? "" : "grayscale"}`}
                    >
                      🪙
                    </span>
                  </motion.div>
                  <span className="text-white text-xs font-bold">
                    {likesMap[reel.id] ?? 0}
                  </span>
                </button>

                {/* Comment */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentPost(reel.id);
                  }}
                  className="flex flex-col items-center gap-0.5"
                  data-ocid="reels.button"
                >
                  <MessageCircle className="w-8 h-8 text-white" />
                  <span className="text-white text-xs font-bold">
                    {reel.comments}
                  </span>
                </button>

                {/* Share (WhatsApp) */}
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

                {/* Gift vault */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGiftPost(reel);
                  }}
                  className="flex flex-col items-center gap-0.5"
                  data-ocid="reels.gift.open_modal_button"
                >
                  <span className="text-3xl">🏛️</span>
                  <span className="text-white text-xs font-bold">Gift</span>
                </button>
              </div>

              {/* Gold progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20 pointer-events-none">
                <div
                  className="h-full bg-yellow-400 transition-all duration-200"
                  style={{ width: `${vidProgress * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comment Sheet */}
      <AnimatePresence>
        {commentPost && (
          <CommentSheet
            key="comment-sheet"
            postId={commentPost}
            onClose={() => setCommentPost(null)}
          />
        )}
      </AnimatePresence>

      {/* Gift Modal */}
      <AnimatePresence>
        {giftPost && (
          <GiftModal
            key="gift-modal"
            postId={giftPost.id}
            author={giftPost.author}
            onClose={() => setGiftPost(null)}
            onGiftSent={handleGiftSent}
          />
        )}
      </AnimatePresence>

      {/* Long Press Menu */}
      <AnimatePresence>
        {showLongPressMenu && longPressPost && (
          <LongPressMenu
            key="longpress-menu"
            onClose={() => {
              setShowLongPressMenu(false);
              setLongPressPost(null);
            }}
            onShare={() => longPressPost && handleShare(longPressPost)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
