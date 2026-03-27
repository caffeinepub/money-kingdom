import { Button } from "@/components/ui/button";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
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

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    author: "Rahul Sharma",
    authorInitials: "RS",
    timeAgo: "2 घंटे पहले",
    content:
      "आज Bitcoin ने फिर से 60,000 डॉलर का आंकड़ा पार किया! क्या आप भी क्रिप्टो में निवेश कर रहे हैं? अपनी राय बताएं।",
    hashtags: ["#Bitcoin", "#Crypto", "#निवेश"],
    likes: 142,
    comments: 0,
    liked: false,
  },
  {
    id: "2",
    author: "Priya Patel",
    authorInitials: "PP",
    timeAgo: "4 घंटे पहले",
    content:
      "रियल एस्टेट में निवेश करने का सबसे अच्छा समय अभी है। मैंने पिछले साल एक फ्लैट खरीदा और अब उसकी कीमत 20% बढ़ गई है! 🏠💰",
    hashtags: ["#RealEstate", "#Property", "#Investment"],
    likes: 89,
    comments: 0,
    liked: false,
  },
  {
    id: "3",
    author: "Amit Verma",
    authorInitials: "AV",
    timeAgo: "6 घंटे पहले",
    content:
      "म्यूचुअल फंड में SIP शुरू करने के लिए 5 बेहतरीन टिप्स:\n1. जल्दी शुरू करें\n2. नियमित रहें\n3. लंबे समय के लिए निवेश करें\n4. Diversify करें\n5. Market गिरने पर घबराएं नहीं",
    hashtags: ["#MutualFunds", "#SIP", "#वित्त"],
    likes: 234,
    comments: 0,
    liked: false,
  },
  {
    id: "4",
    author: "Sunita Gupta",
    authorInitials: "SG",
    timeAgo: "1 दिन पहले",
    content:
      "Gold vs Stock Market - किसमें निवेश करना बेहतर है? मेरे अनुभव से दोनों में 50-50 रखना सबसे safe strategy है। आपकी क्या राय है? 📊",
    hashtags: ["#Gold", "#Stocks", "#Finance"],
    likes: 178,
    comments: 0,
    liked: false,
  },
];

export default function CenterFeed() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);

  const handleNewPost = (content: string, videoUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: "आप",
      authorInitials: "AB",
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

  return (
    <div className="flex flex-col gap-3">
      {/* Feed header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">मुख्य फ़ीड</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1 text-xs h-7 px-2.5"
          data-ocid="feed.button"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          फ़िल्टर
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      <CreatePost onPost={handleNewPost} />

      <AnimatePresence initial={false}>
        {posts.map((post, idx) => (
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
        ))}
      </AnimatePresence>
    </div>
  );
}
