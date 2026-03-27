import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Paperclip, Send, Smile, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CreatePostProps {
  onPost: (content: string, videoUrl?: string) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setVideoUrl(ev.target?.result as string);
      setVideoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!content.trim() && !videoUrl) return;
    onPost(content.trim(), videoUrl ?? undefined);
    setContent("");
    setVideoUrl(null);
    setVideoName("");
    setIsExpanded(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
    toast.success("पोस्ट शेयर हो गई!");
  };

  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-3">
        <div className="flex gap-2">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
              AB
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              placeholder="क्या सोच रहे हैं? 💰"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="resize-none border-none bg-muted rounded-xl px-3 py-2 text-xs min-h-[36px] focus-visible:ring-1 focus-visible:ring-primary"
              rows={isExpanded ? 3 : 1}
              data-ocid="post.textarea"
            />

            {/* Video preview */}
            {videoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-border">
                {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video, captions not available */}
                <video
                  src={videoUrl}
                  controls
                  preload="metadata"
                  className="w-full aspect-video object-contain bg-black"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoUrl(null);
                    setVideoName("");
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"
                  data-ocid="post.close_button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-muted-foreground px-2 py-1 truncate">
                  {videoName}
                </p>
              </div>
            )}

            {isExpanded && (
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    data-ocid="post.button"
                  >
                    <Smile className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    data-ocid="post.upload_button"
                  >
                    <Image className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    data-ocid="post.upload_button"
                  >
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    onClick={() => videoInputRef.current?.click()}
                    title="वीडियो जोड़ें"
                    data-ocid="post.upload_button"
                  >
                    <Video className="w-4 h-4 text-primary" />
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoSelect}
                  />
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full gap-1 text-xs h-7 px-3"
                  onClick={handleSubmit}
                  disabled={!content.trim() && !videoUrl}
                  data-ocid="post.submit_button"
                >
                  <Send className="w-3 h-3" />
                  पोस्ट करें
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
