import { useFollowers } from "@/hooks/useFollowers";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../utils/i18n";
import BackgroundMusicPlayer from "./BackgroundMusicPlayer";
import CreatePost from "./CreatePost";
import HindiQuotesCard from "./HindiQuotesCard";
import PostCard from "./PostCard";
import StoryCreator from "./StoryCreator";
import StoryViewer, { type Story } from "./StoryViewer";
import TaskBoard from "./TaskBoard";
import VideoPostCard from "./VideoPostCard";

export interface Post {
  id: string;
  author: string;
  authorMobile: string;
  authorInitials: string;
  timeAgo: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  liked: boolean;
  videoUrl?: string;
  createdAt: number;
}

const EXPIRY_MS = 86400000; // 24 hours
const POSTS_KEY = "mk_all_posts";
const STORIES_KEY = "mk_all_stories";

function getUserProfile(): { name: string; mobile: string } | null {
  try {
    const raw = localStorage.getItem("mk_user_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function loadPostsFromStorage(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePostsToStorage(posts: Post[]) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // storage full
  }
}

function loadStoriesFromStorage(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoriesToStorage(stories: Story[]) {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch {
    // storage full
  }
}

interface CenterFeedProps {
  showReminderBanner?: boolean;
  onDismissReminderBanner?: () => void;
  onNavigateProfile?: () => void;
  onOpenWallet?: () => void;
  onOpenSettings?: () => void;
}

export default function CenterFeed({
  showReminderBanner,
  onDismissReminderBanner,
}: CenterFeedProps) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>(() => loadPostsFromStorage());
  const [stories, setStories] = useState<Story[]>(() =>
    loadStoriesFromStorage(),
  );
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [feedFilter, setFeedFilter] = useState<"all" | "following">("all");

  const userProfile = getUserProfile();
  const { following } = useFollowers("PPK");

  // Persist posts to localStorage whenever they change
  useEffect(() => {
    savePostsToStorage(posts);
  }, [posts]);

  // Persist stories to localStorage whenever they change
  useEffect(() => {
    saveStoriesToStorage(stories);
  }, [stories]);

  const activeStories = stories.filter(
    (s) => Date.now() - s.createdAt < EXPIRY_MS,
  );

  const filteredPosts =
    feedFilter === "all"
      ? posts
      : posts.filter(
          (p) =>
            following.includes(p.authorInitials?.toUpperCase() ?? "") ||
            p.authorMobile === userProfile?.mobile,
        );

  const handleNewPost = (content: string, videoUrl?: string) => {
    const profile = getUserProfile();
    const authorName = profile?.name ?? "Prince Pawan Kumar";
    const authorMobile = profile?.mobile ?? "admin";
    const newPost: Post = {
      id: Date.now().toString(),
      author: authorName,
      authorMobile,
      authorInitials: getInitials(authorName),
      timeAgo: t("just_now"),
      content,
      hashtags: [],
      likes: 0,
      comments: 0,
      liked: false,
      videoUrl,
      createdAt: Date.now(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStoryPost = (
    videoUrl: string,
    filterStyle: string,
    filterName: string,
  ) => {
    const profile = getUserProfile();
    const authorName = profile?.name ?? "Prince Pawan Kumar";
    const newStory: Story = {
      id: Date.now().toString(),
      author: authorName,
      authorInitials: getInitials(authorName),
      videoUrl,
      filterStyle,
      filterName,
      createdAt: Date.now(),
    };
    setStories((prev) => [newStory, ...prev]);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Background Music Player (fixed positioned) */}
      <BackgroundMusicPlayer />

      {/* Hindi Quotes Card */}
      <HindiQuotesCard />

      {/* Task Board */}
      <TaskBoard />

      {/* Reminder Banner */}
      <AnimatePresence>
        {showReminderBanner && (
          <motion.div
            key="reminder-banner"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-xl px-3 py-2 flex items-center gap-2 shadow-md border"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.06 55), oklch(0.88 0.04 60))",
              borderColor: "oklch(0.72 0.08 50)",
            }}
            data-ocid="reminder.panel"
          >
            <span className="text-xl shrink-0">🎡</span>
            <p
              className="flex-1 text-xs font-semibold leading-snug"
              style={{ color: "oklch(0.28 0.05 40)" }}
            >
              आपका भाग्य चक्र इंतज़ार कर रहा है!{" "}
              <span className="font-normal opacity-80">
                Profile → सेटिंग में जाएं
              </span>
            </p>
            <button
              type="button"
              onClick={onDismissReminderBanner}
              className="shrink-0 rounded-full w-6 h-6 flex items-center justify-center font-bold text-base transition hover:opacity-60"
              style={{ color: "oklch(0.35 0.05 40)" }}
              aria-label="बंद करें"
              data-ocid="reminder.close_button"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories Section */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-2 w-max px-1">
          {/* Create Story button */}
          <button
            type="button"
            onClick={() => setCreatorOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 group"
            data-ocid="stories.primary_button"
          >
            <div className="w-14 h-14 rounded-full p-0.5 shadow-md story-ring-anim">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-card">
                <span className="text-lg font-black text-primary">+</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-foreground text-center leading-tight max-w-[3.5rem] truncate">
              {t("story")}
            </span>
          </button>

          {/* User-created stories */}
          {activeStories.map((story, idx) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setViewerIndex(idx)}
              className="flex flex-col items-center gap-1 shrink-0"
              data-ocid="stories.card.button"
            >
              <div className="w-14 h-14 rounded-full p-0.5 shadow-md story-ring-anim">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-card">
                  <video
                    src={story.videoUrl}
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                      filter:
                        story.filterStyle === "none"
                          ? undefined
                          : story.filterStyle,
                    }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-foreground text-center leading-tight max-w-[3.5rem] truncate">
                {story.author.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <CreatePost onPost={handleNewPost} />

      {/* Feed filter tabs */}
      <div className="flex gap-2 px-1" data-ocid="feed.filter.tab">
        <button
          type="button"
          onClick={() => setFeedFilter("all")}
          className="flex-1 py-1.5 rounded-full text-xs font-bold transition-all"
          style={{
            background:
              feedFilter === "all"
                ? "oklch(0.62 0.09 66)"
                : "oklch(0.92 0.02 70)",
            color:
              feedFilter === "all"
                ? "oklch(0.98 0.01 72)"
                : "oklch(0.45 0.05 58)",
          }}
          data-ocid="feed.all.tab"
        >
          सभी
        </button>
        <button
          type="button"
          onClick={() => setFeedFilter("following")}
          className="flex-1 py-1.5 rounded-full text-xs font-bold transition-all"
          style={{
            background:
              feedFilter === "following"
                ? "oklch(0.62 0.09 66)"
                : "oklch(0.92 0.02 70)",
            color:
              feedFilter === "following"
                ? "oklch(0.98 0.01 72)"
                : "oklch(0.45 0.05 58)",
          }}
          data-ocid="feed.following.tab"
        >
          फ़ॉलोइंग
        </button>
      </div>

      {/* Unified Feed */}
      <AnimatePresence initial={false}>
        {filteredPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 gap-3 text-center"
            data-ocid="feed.empty_state"
          >
            <div className="text-4xl">📰</div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {feedFilter === "following"
                  ? "फ़ॉलोइंग में कोई पोस्ट नहीं"
                  : "अभी कोई पोस्ट नहीं"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {feedFilter === "following"
                  ? "किसी को follow करें या 'सभी' tab देखें"
                  : "पहली पोस्ट डालें और अपनी बात शेयर करें!"}
              </p>
            </div>
          </motion.div>
        ) : (
          filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              {post.videoUrl ? (
                <VideoPostCard
                  post={post}
                  onToggleLike={handleToggleLike}
                  onDelete={handleDeletePost}
                  markerIndex={idx + 1}
                />
              ) : (
                <PostCard
                  post={post}
                  onToggleLike={handleToggleLike}
                  onDelete={handleDeletePost}
                  markerIndex={idx + 1}
                />
              )}
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Story Creator Modal */}
      <StoryCreator
        open={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        onPost={handleStoryPost}
      />

      {/* Story Viewer */}
      {viewerIndex !== null && activeStories.length > 0 && (
        <StoryViewer
          stories={activeStories}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}
