import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useFollowers } from "@/hooks/useFollowers";
import {
  playCommentSound,
  playLikeSound,
  playShareSound,
} from "@/utils/sounds";
import {
  Bookmark,
  Gift,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useLanguage } from "../utils/i18n";
import type { Post } from "./CenterFeed";
import GiftCharacterPanel from "./GiftCharacterPanel";
import LevelBadge from "./LevelBadge";

interface Comment {
  id: string;
  author: string;
  initials: string;
  text: string;
}

const REACTIONS = [
  { emoji: "👍", label: "लाइक", color: "text-blue-500" },
  { emoji: "❤️", label: "प्यार", color: "text-red-500" },
  { emoji: "😄", label: "हाहा", color: "text-yellow-500" },
  { emoji: "😮", label: "वाह", color: "text-yellow-400" },
  { emoji: "😢", label: "दुख", color: "text-blue-400" },
  { emoji: "😠", label: "गुस्सा", color: "text-orange-500" },
  { emoji: "👑", label: "किंगडम", color: "text-yellow-500" },
];

interface PostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
  onDelete?: (id: string) => void;
  markerIndex: number;
}

function renderPostContent(content: string) {
  const lines = content.split("\n");
  const musicLines = lines.filter((l) => l.startsWith("🎵 "));
  const textLines = lines.filter((l) => !l.startsWith("🎵 "));
  const textContent = textLines.join("\n").trim();

  return (
    <>
      {textContent && (
        <p className="text-sm text-foreground leading-normal whitespace-pre-line">
          {textContent}
        </p>
      )}
      {musicLines.map((line) => (
        <div
          key={line}
          className="mt-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-l-2 border-primary bg-primary/10 text-primary"
        >
          {line}
        </div>
      ))}
    </>
  );
}

export default function PostCard({
  post,
  onToggleLike,
  onDelete,
  markerIndex,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<
    (typeof REACTIONS)[0] | null
  >(null);
  const [saved, setSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showCrownAnim, setShowCrownAnim] = useState(false);
  const { t } = useLanguage();
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef(0);

  const { isFollowing, toggleFollow } = useFollowers("PPK");

  const isOwnPost =
    post.author === "Prince Pawan Kumar" || post.authorInitials === "PPK";

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "Prince Pawan Kumar",
        initials: "PPK",
        text: newComment.trim(),
      },
    ]);
    setNewComment("");
    playCommentSound();
  };

  const handleReactionSelect = (reaction: (typeof REACTIONS)[0]) => {
    setSelectedReaction(reaction);
    setShowReactions(false);
    playLikeSound();
    if (!post.liked) onToggleLike(post.id);
    // Crown animation
    if (reaction.emoji === "👑") {
      setShowCrownAnim(true);
      setTimeout(() => setShowCrownAnim(false), 900);
    }
  };

  const handleLikePress = () => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setShowReactions(true), 500);
  };

  const handleLikeRelease = () => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
  };

  const handleLikeClick = () => {
    if (!showReactions) {
      playLikeSound();
      onToggleLike(post.id);
      if (!post.liked) setSelectedReaction(REACTIONS[0]);
      else setSelectedReaction(null);
    }
    setShowReactions(false);
  };

  const handleImageDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      if (!post.liked) {
        onToggleLike(post.id);
        setSelectedReaction(REACTIONS[0]);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1000);
    } else {
      tapTimerRef.current = setTimeout(() => {}, 350);
    }
    lastTapRef.current = now;
  };

  const colorClasses = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
  ];

  const authorId = post.authorInitials?.toUpperCase() ?? "";
  const following = isFollowing(authorId);
  const activeReaction = selectedReaction ?? (post.liked ? REACTIONS[0] : null);

  return (
    <>
      <Card
        className="shadow-card border-border"
        data-ocid={`post.item.${markerIndex}`}
      >
        <CardContent className="p-3 flex flex-col gap-2.5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {post.authorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-sm text-foreground">
                    {post.author}
                  </p>
                  <LevelBadge
                    userId={post.authorInitials?.toUpperCase() ?? ""}
                  />
                  {!isOwnPost && (
                    <button
                      type="button"
                      onClick={() => toggleFollow(authorId, post.author)}
                      className={`flex items-center gap-0.5 text-xs font-semibold py-0.5 px-2.5 rounded-full border transition-colors ${
                        following
                          ? "border-border text-muted-foreground bg-muted hover:bg-destructive/10 hover:text-destructive"
                          : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                      data-ocid={`post.toggle.${markerIndex}`}
                    >
                      {following ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          {t("following")}
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          {t("follow")}
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setSaved((s) => !s)}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                data-ocid={`post.toggle.${markerIndex}`}
                aria-label="सेव करें"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    saved
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    data-ocid={`post.dropdown_menu.${markerIndex}`}
                  >
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>सेव करें</DropdownMenuItem>
                  <DropdownMenuItem>{t("share")}</DropdownMenuItem>
                  {isOwnPost && onDelete && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(post.id)}
                      data-ocid={`post.delete_button.${markerIndex}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      🗑️ डिलीट करें
                    </DropdownMenuItem>
                  )}
                  {!isOwnPost && (
                    <DropdownMenuItem className="text-destructive">
                      रिपोर्ट करें
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content — double-tap area */}
          <button
            type="button"
            className="text-left relative"
            onClick={handleImageDoubleTap}
          >
            {renderPostContent(post.content)}

            {/* Heart double-tap animation */}
            <AnimatePresence>
              {showHeartAnim && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-5xl">❤️</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Crown reaction animation */}
            <AnimatePresence>
              {showCrownAnim && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 1.6, 1.0], opacity: [1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, times: [0, 0.5, 1] }}
                >
                  <span className="text-5xl">👑</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((tag, i) => (
                <span
                  key={tag}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClasses[i % colorClasses.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement counts */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
            <span className="flex items-center gap-1">
              {activeReaction ? (
                <span className="text-base">{activeReaction.emoji}</span>
              ) : (
                <ThumbsUp className="w-3.5 h-3.5 text-primary" />
              )}
              <span className="text-xs font-semibold">{post.likes}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="text-xs hover:text-foreground transition-colors"
              data-ocid={`post.button.${markerIndex}`}
            >
              {comments.length} टिप्पणियां
            </button>
          </div>

          {/* Reactions popup */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                className="flex items-center gap-1.5 bg-card border border-border shadow-xl rounded-full px-3 py-2 w-fit"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {REACTIONS.map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => handleReactionSelect(r)}
                    className="flex flex-col items-center gap-0.5 hover:scale-125 transition-transform"
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-[9px] text-muted-foreground">
                      {r.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-0.5 border-t border-border pt-1.5">
            <Button
              variant={post.liked ? "default" : "ghost"}
              size="sm"
              className={`flex-1 gap-1 rounded-md text-xs h-8 font-semibold ${
                post.liked
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={handleLikeClick}
              onMouseDown={handleLikePress}
              onMouseUp={handleLikeRelease}
              onTouchStart={handleLikePress}
              onTouchEnd={handleLikeRelease}
              data-ocid={`post.toggle.${markerIndex}`}
            >
              {activeReaction ? (
                <span className="text-sm">{activeReaction.emoji}</span>
              ) : (
                <ThumbsUp className="w-3.5 h-3.5" />
              )}
              {activeReaction ? activeReaction.label : "लाइक"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1 rounded-md text-xs h-8 font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => setShowComments(!showComments)}
              data-ocid={`post.button.${markerIndex}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              टिप्पणी
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1 rounded-md text-xs h-8 font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => playShareSound()}
              data-ocid={`post.button.${markerIndex}`}
            >
              <Share2 className="w-3.5 h-3.5" />
              शेयर
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1 rounded-md text-xs h-8 font-semibold text-amber-500 hover:text-amber-600 hover:bg-amber-50"
              onClick={() => setShowGiftPanel(true)}
              data-ocid={`post.open_modal_button.${markerIndex}`}
            >
              <Gift className="w-3.5 h-3.5" />
              गिफ्ट
            </Button>
          </div>

          {/* Comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                          {c.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-xl px-2.5 py-1.5 text-xs flex-1">
                        <span className="font-semibold text-foreground">
                          {c.author}:{" "}
                        </span>
                        <span className="text-foreground">{c.text}</span>
                      </div>
                    </div>
                  ))}

                  {/* Add comment */}
                  <div className="flex gap-2 mt-0.5">
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                        PPK
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-1.5">
                      <Input
                        className="rounded-xl bg-muted border-none text-xs h-8"
                        placeholder={`${t("comment")}…`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddComment()
                        }
                        data-ocid={`post.input.${markerIndex}`}
                      />
                      <Button
                        size="icon"
                        className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 w-8 h-8"
                        onClick={handleAddComment}
                        data-ocid={`post.submit_button.${markerIndex}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Gift Character Panel */}
      <GiftCharacterPanel
        open={showGiftPanel}
        onClose={() => setShowGiftPanel(false)}
        creatorId={authorId || "unknown"}
        creatorName={post.author}
      />
    </>
  );
}
