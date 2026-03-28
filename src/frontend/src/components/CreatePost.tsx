import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Image, MapPin, Smile, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CreatePostProps {
  onPost: (content: string, videoUrl?: string) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
    toast.success("पोस्ट शेयर हो गई!");
  };

  return (
    <Card className="shadow-card border-border">
      <CardContent className="p-5">
        {/* Input row */}
        <div className="flex gap-4 items-start">
          <Avatar className="w-20 h-20 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
              PPK
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="आप क्या सोच रहे हैं? 💰"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none border-none bg-muted rounded-2xl px-5 py-4 text-2xl min-h-[130px] focus-visible:ring-1 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
            rows={3}
            data-ocid="post.textarea"
          />
        </div>

        {/* Video preview */}
        {videoUrl && (
          <div className="relative rounded-xl overflow-hidden border border-border mt-4">
            {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video */}
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
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
              data-ocid="post.close_button"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-base text-muted-foreground px-3 py-1 truncate">
              {videoName}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Action buttons row */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
            data-ocid="post.upload_button"
          >
            <Image className="w-9 h-9 text-green-500" />
            <span className="text-base font-bold text-muted-foreground">
              📷 फ़ोटो
            </span>
          </button>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
            data-ocid="post.upload_button"
          >
            <Video className="w-9 h-9 text-red-500" />
            <span className="text-base font-bold text-muted-foreground">
              🎬 वीडियो
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
            data-ocid="post.button"
          >
            <Smile className="w-9 h-9 text-yellow-500" />
            <span className="text-base font-bold text-muted-foreground">
              😊 भावना
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
            data-ocid="post.button"
          >
            <MapPin className="w-9 h-9 text-blue-500" />
            <span className="text-base font-bold text-muted-foreground">
              📍 चेक-इन
            </span>
          </button>
        </div>

        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-2xl font-black h-16"
          onClick={handleSubmit}
          disabled={!content.trim() && !videoUrl}
          data-ocid="post.submit_button"
        >
          पोस्ट करें
        </Button>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoSelect}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
