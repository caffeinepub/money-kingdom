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
import {
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Post } from "./CenterFeed";

interface Comment {
  id: string;
  author: string;
  initials: string;
  text: string;
}

interface VideoPostCardProps {
  post: Post;
  onToggleLike: (id: string) => void;
  markerIndex: number;
}

export default function VideoPostCard({
  post,
  onToggleLike,
  markerIndex,
}: VideoPostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "आप",
        initials: "AB",
        text: newComment.trim(),
      },
    ]);
    setNewComment("");
  };

  return (
    <Card
      className="shadow-card border-border overflow-hidden"
      data-ocid={`post.item.${markerIndex}`}
    >
      <CardContent className="p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {post.authorInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-xs text-foreground">
                {post.author}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {post.timeAgo}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-0.5 rounded-full hover:bg-muted transition-colors"
                data-ocid={`post.dropdown_menu.${markerIndex}`}
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>सेव करें</DropdownMenuItem>
              <DropdownMenuItem>शेयर करें</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                रिपोर्ट करें
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Caption text — premium serif styling above video */}
        {post.content && (
          <div className="px-3 pb-2">
            <p className="video-caption">{post.content}</p>
          </div>
        )}

        {/* Video — full-width, large, Facebook-style */}
        <div className="aspect-video w-full bg-black">
          {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video, captions not available */}
          <video
            src={post.videoUrl}
            controls
            preload="metadata"
            className="w-full h-full object-contain"
            data-ocid={`post.canvas_target.${markerIndex}`}
          />
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pt-2">
            {post.hashtags.map((tag, i) => {
              const colors = [
                "bg-violet-100 text-violet-700",
                "bg-blue-100 text-blue-700",
                "bg-green-100 text-green-700",
                "bg-amber-100 text-amber-700",
                "bg-pink-100 text-pink-700",
              ];
              return (
                <span
                  key={tag}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colors[i % colors.length]}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Engagement counts */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-3 pt-2 pb-1 border-t border-border mt-2">
          <span>{post.likes} लाइक्स</span>
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="hover:text-foreground transition-colors"
            data-ocid={`post.button.${markerIndex}`}
          >
            {comments.length} टिप्पणियां
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 px-3 pb-3">
          <Button
            variant={post.liked ? "default" : "outline"}
            size="sm"
            className={`flex-1 gap-1 rounded-md text-[11px] h-7 px-2 ${
              post.liked
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }`}
            onClick={() => onToggleLike(post.id)}
            data-ocid={`post.toggle.${markerIndex}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {post.liked ? "लाइक किया" : "लाइक"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 rounded-md text-[11px] h-7 px-2"
            onClick={() => setShowComments(!showComments)}
            data-ocid={`post.button.${markerIndex}`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            टिप्पणी
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 rounded-md text-[11px] h-7 px-2"
            data-ocid={`post.button.${markerIndex}`}
          >
            <Share2 className="w-3.5 h-3.5" />
            शेयर
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
              <div className="flex flex-col gap-2 px-3 pb-3 border-t border-border pt-2">
                {comments.length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center py-1">
                    अभी कोई टिप्पणी नहीं। पहले टिप्पणी करें!
                  </p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-xl px-2.5 py-1.5 text-xs flex-1">
                      <span className="font-semibold text-foreground text-[11px]">
                        {c.author}:{" "}
                      </span>
                      <span className="text-foreground">{c.text}</span>
                    </div>
                  </div>
                ))}
                <div className="flex gap-1.5">
                  <Avatar className="w-6 h-6 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                      AB
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-1.5">
                    <Input
                      className="rounded-xl bg-muted border-none text-xs h-7"
                      placeholder="टिप्पणी लिखें…"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      data-ocid={`post.input.${markerIndex}`}
                    />
                    <Button
                      size="icon"
                      className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 w-7 h-7"
                      onClick={handleAddComment}
                      data-ocid={`post.submit_button.${markerIndex}`}
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
