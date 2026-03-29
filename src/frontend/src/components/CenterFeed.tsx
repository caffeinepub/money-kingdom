import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../utils/i18n";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import StoryCreator from "./StoryCreator";
import StoryViewer, { type Story } from "./StoryViewer";
import VideoPostCard from "./VideoPostCard";

export interface Post {
  id: string;
  author: string;
  authorInitials: string;
  timeAgo: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  liked: boolean;
  videoUrl?: string;
}

const EXPIRY_MS = 86400000; // 24 hours

interface CenterFeedProps {
  showReminderBanner?: boolean;
  onDismissReminderBanner?: () => void;
}

export default function CenterFeed({
  showReminderBanner,
  onDismissReminderBanner,
}: CenterFeedProps) {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const activeStories = stories.filter(
    (s) => Date.now() - s.createdAt < EXPIRY_MS,
  );

  const videoPosts = posts.filter((p) => p.videoUrl);
  const textPosts = posts.filter((p) => !p.videoUrl);

  const handleNewPost = (content: string, videoUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: "Prince Pawan Kumar",
      authorInitials: "PPK",
      timeAgo: t("just_now"),
      content,
      hashtags: [],
      likes: 0,
      comments: 0,
      liked: false,
      videoUrl,
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
    const newStory: Story = {
      id: Date.now().toString(),
      author: "प्रिंस पवन कुमार",
      authorInitials: "PPK",
      videoUrl,
      filterStyle,
      filterName,
      createdAt: Date.now(),
    };
    setStories((prev) => [newStory, ...prev]);
  };

  return (
    <div className="flex flex-col gap-3">
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
        <div className="flex gap-3 w-max px-1">
          {/* Create Story button */}
          <button
            type="button"
            onClick={() => setCreatorOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 group"
            data-ocid="stories.primary_button"
          >
            <div className="w-16 h-16 rounded-full p-0.5 shadow-md story-ring-anim">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-2 border-card">
                <span className="text-xl font-black text-primary">+</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-foreground text-center leading-tight max-w-[4rem] truncate">
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
              <div className="w-16 h-16 rounded-full p-0.5 shadow-md story-ring-anim">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-card">
                  {/* biome-ignore lint/a11y/useMediaCaption: Story thumbnail */}
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
              <span className="text-[10px] font-semibold text-foreground text-center leading-tight max-w-[4rem] truncate">
                {story.author.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Section — only shows when videos exist */}
      <AnimatePresence>
        {videoPosts.length > 0 && (
          <motion.div
            key="video-section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-base">🎬</span>
              <h2 className="text-sm font-bold text-foreground">वीडियो</h2>
            </div>
            {videoPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <VideoPostCard
                  post={post}
                  onToggleLike={handleToggleLike}
                  onDelete={handleDeletePost}
                  markerIndex={idx + 1}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CreatePost onPost={handleNewPost} />

      {/* Text Posts */}
      <AnimatePresence initial={false}>
        {textPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 gap-3 text-center"
            data-ocid="feed.empty_state"
          >
            <div className="text-4xl">📰</div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {t("just_now")} {t("post")} नहीं
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                पहली पोस्ट डालें और अपनी बात शेयर करें!
              </p>
            </div>
          </motion.div>
        ) : (
          textPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <PostCard
                post={post}
                onToggleLike={handleToggleLike}
                onDelete={handleDeletePost}
                markerIndex={idx + 1}
              />
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
