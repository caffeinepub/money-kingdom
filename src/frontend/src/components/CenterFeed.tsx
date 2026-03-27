import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

const PLACEHOLDER_STORIES = [
  { name: "राहुल", initials: "RK", gradient: "from-orange-400 to-pink-500" },
  { name: "प्रिया", initials: "PS", gradient: "from-blue-400 to-cyan-500" },
  { name: "अमित", initials: "AS", gradient: "from-green-400 to-emerald-500" },
  { name: "नेहा", initials: "NV", gradient: "from-purple-400 to-violet-500" },
];

export default function CenterFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const activeStories = stories.filter(
    (s) => Date.now() - s.createdAt < EXPIRY_MS,
  );

  const handleNewPost = (content: string, videoUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: "आप",
      authorInitials: "PPK",
      timeAgo: "अभी",
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
      {/* Stories Section */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-2 w-max">
          {/* Create Story card */}
          <button
            type="button"
            onClick={() => setCreatorOpen(true)}
            className="relative flex flex-col rounded-2xl overflow-hidden shrink-0 w-24 h-40 shadow border border-border group"
            data-ocid="stories.primary_button"
          >
            <div className="flex-1 bg-gradient-to-b from-card to-muted" />
            <div className="absolute inset-x-0 bottom-0 bg-card px-2 pb-2 pt-5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow border-2 border-card">
                <span className="text-primary-foreground text-lg font-bold leading-none">
                  +
                </span>
              </div>
              <p className="text-[11px] font-semibold text-foreground text-center leading-tight">
                स्टोरी बनाएं
              </p>
            </div>
          </button>

          {/* User-created stories */}
          {activeStories.map((story, idx) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setViewerIndex(idx)}
              className="relative flex flex-col rounded-2xl overflow-hidden shrink-0 w-24 h-40 shadow border-2 border-primary"
              data-ocid="stories.card.button"
            >
              {/* biome-ignore lint/a11y/useMediaCaption: Story thumbnail preview */}
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
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow">
                <span className="text-primary-foreground text-[10px] font-bold">
                  {story.authorInitials}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pt-5 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-[11px] font-semibold text-white truncate">
                  {story.author.split(" ")[0]}
                </p>
              </div>
            </button>
          ))}

          {/* Placeholder stories */}
          {activeStories.length === 0 &&
            PLACEHOLDER_STORIES.map((s) => (
              <div
                key={s.name}
                className="relative flex flex-col rounded-2xl overflow-hidden shrink-0 w-24 h-40 shadow border border-border opacity-50"
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${s.gradient} flex items-end`}
                >
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow">
                    <span className="text-primary-foreground text-[10px] font-bold">
                      {s.initials}
                    </span>
                  </div>
                  <div className="w-full px-2 pb-2 pt-7 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-[11px] font-semibold text-white truncate">
                      {s.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <CreatePost onPost={handleNewPost} />

      <AnimatePresence initial={false}>
        {posts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-3 text-center"
            data-ocid="feed.empty_state"
          >
            <div className="text-4xl">📰</div>
            <div>
              <p className="text-base font-semibold text-foreground">
                अभी कोई पोस्ट नहीं
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                पहली पोस्ट डालें और अपनी बात शेयर करें!
              </p>
            </div>
          </motion.div>
        ) : (
          posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              {post.videoUrl ? (
                <VideoPostCard
                  post={post}
                  onToggleLike={handleToggleLike}
                  markerIndex={idx + 1}
                />
              ) : (
                <PostCard
                  post={post}
                  onToggleLike={handleToggleLike}
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
