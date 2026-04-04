import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Image, MapPin, Music, Smile, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import VideoEditorModal, { type VideoMetadata } from "./VideoEditorModal";

const MUSIC_STICKERS = [
  "🎵 पैसा बोलता है...",
  "🎵 किंगडम की राह...",
  "🎵 मेहनत की धूप...",
];

interface CreatePostProps {
  onPost: (content: string, videoUrl?: string) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [pendingVideoUrl, setPendingVideoUrl] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingVideoUrl(ev.target?.result as string);
      setEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorComplete = (meta: VideoMetadata) => {
    setVideoMeta(meta);
    setEditorOpen(false);
    setPendingVideoUrl(null);
  };

  const handleEditorCancel = () => {
    setEditorOpen(false);
    setPendingVideoUrl(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleMusicSticker = (lyric: string) => {
    setContent((prev) => (prev.trim() ? `${prev}\n${lyric}` : lyric));
    toast.success("🎵 संगीत जुड़ गया!");
  };

  const handleSubmit = () => {
    if (!content.trim() && !videoMeta) return;
    const finalContent = videoMeta?.caption || content.trim();
    const profile = (() => {
      try {
        const raw = localStorage.getItem("mk_user_profile");
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();
    const authorName = profile?.name ?? "Prince Pawan Kumar";
    const authorMobile = profile?.mobile ?? "admin";
    const getInitials = (n: string) =>
      n
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
    const newPost = {
      id: Date.now().toString(),
      author: authorName,
      authorMobile,
      authorInitials: getInitials(authorName),
      timeAgo: "अभी",
      content: finalContent,
      hashtags: [],
      likes: 0,
      comments: 0,
      liked: false,
      videoUrl: videoMeta?.videoUrl ?? undefined,
      createdAt: Date.now(),
    };

    onPost(finalContent, videoMeta?.videoUrl ?? undefined);

    // Dispatch event so Profile and ReelsView can update immediately
    window.dispatchEvent(
      new CustomEvent("mk_new_post", { detail: { post: newPost } }),
    );

    setContent("");
    setVideoMeta(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
    toast.success("पोस्ट शेयर हो गई!");
  };

  const filterCssMap: Record<string, string> = {
    Warm: "sepia(0.4) saturate(1.3)",
    Cool: "hue-rotate(180deg) saturate(0.8)",
    Vintage: "sepia(0.6) contrast(0.9) brightness(0.9)",
    "B&W": "grayscale(1)",
    Fade: "brightness(1.1) contrast(0.8) saturate(0.7)",
    Vivid: "saturate(2) contrast(1.1)",
    Rose: "sepia(0.3) hue-rotate(300deg) saturate(1.5)",
    Sky: "hue-rotate(200deg) saturate(1.2) brightness(1.05)",
    Gold: "sepia(0.5) saturate(1.8) brightness(1.1)",
    Drama: "contrast(1.5) saturate(1.4) brightness(0.9)",
  };

  return (
    <>
      {editorOpen && pendingVideoUrl && (
        <VideoEditorModal
          videoUrl={pendingVideoUrl}
          onComplete={handleEditorComplete}
          onCancel={handleEditorCancel}
        />
      )}

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

          {/* Video preview after editor */}
          {videoMeta && (
            <div className="relative rounded-xl overflow-hidden border border-border mt-4">
              {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video */}
              <video
                src={videoMeta.videoUrl}
                controls
                preload="metadata"
                className="w-full aspect-video object-contain bg-black"
                style={{
                  filter: videoMeta.filter
                    ? (filterCssMap[videoMeta.filter] ?? "")
                    : "",
                }}
              />
              {/* Text overlay */}
              {videoMeta.textOverlay && (
                <div
                  className="absolute bottom-8 left-0 right-0 text-center font-black px-3 drop-shadow-lg text-2xl"
                  style={{ color: videoMeta.textColor ?? "#fff" }}
                >
                  {videoMeta.textOverlay}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setVideoMeta(null);
                  if (videoInputRef.current) videoInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                data-ocid="post.close_button"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Metadata tags */}
              <div className="px-3 py-2 flex flex-wrap gap-2">
                {videoMeta.location && (
                  <span className="text-sm bg-primary/20 text-primary rounded-full px-3 py-1 font-bold">
                    📍 {videoMeta.location}
                  </span>
                )}
                {videoMeta.taggedPeople?.map((p) => (
                  <span
                    key={p}
                    className="text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-bold"
                  >
                    @{p}
                  </span>
                ))}
                {videoMeta.filter && (
                  <span className="text-sm bg-amber-100 text-amber-700 rounded-full px-3 py-1 font-bold">
                    🎨 {videoMeta.filter}
                  </span>
                )}
                {videoMeta.musicName && (
                  <span className="text-sm bg-purple-100 text-purple-700 rounded-full px-3 py-1 font-bold">
                    🎵 {videoMeta.musicName}
                  </span>
                )}
              </div>
              {videoMeta.caption && (
                <p className="text-base text-muted-foreground px-3 pb-2">
                  {videoMeta.caption}
                </p>
              )}
            </div>
          )}

          <Separator className="my-4" />

          {/* Action buttons row — 5 columns */}
          <div className="grid grid-cols-5 gap-1 mb-4">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
              data-ocid="post.upload_button"
            >
              <Image className="w-7 h-7 text-green-500" />
              <span className="text-xs font-bold text-muted-foreground">
                📷 फ़ोटो
              </span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
              data-ocid="post.upload_button"
            >
              <Video className="w-7 h-7 text-red-500" />
              <span className="text-xs font-bold text-muted-foreground">
                🎥 वीडियो
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
              data-ocid="post.button"
            >
              <Smile className="w-7 h-7 text-yellow-500" />
              <span className="text-xs font-bold text-muted-foreground">
                😊 भावना
              </span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
              data-ocid="post.button"
            >
              <MapPin className="w-7 h-7 text-blue-500" />
              <span className="text-xs font-bold text-muted-foreground">
                📍 चेक-इन
              </span>
            </button>

            {/* Music Sticker button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl hover:bg-muted transition-colors"
                  data-ocid="post.button"
                >
                  <Music className="w-7 h-7 text-purple-500" />
                  <span className="text-xs font-bold text-muted-foreground">
                    🎵 संगीत
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {MUSIC_STICKERS.map((lyric) => (
                  <DropdownMenuItem
                    key={lyric}
                    onClick={() => handleMusicSticker(lyric)}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {lyric}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-2xl font-black h-16"
            onClick={handleSubmit}
            disabled={!content.trim() && !videoMeta}
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
    </>
  );
}
