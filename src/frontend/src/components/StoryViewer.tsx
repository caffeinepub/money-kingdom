import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface Story {
  id: string;
  author: string;
  authorInitials: string;
  videoUrl: string;
  filterStyle: string;
  filterName: string;
  createdAt: number;
}

interface Props {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

function timeAgoHindi(createdAt: number): string {
  const diff = Date.now() - createdAt;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "अभी";
  if (mins < 60) return `${mins} मिनट पहले`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} घंटे पहले`;
  return "1 दिन पहले";
}

export default function StoryViewer({ stories, startIndex, onClose }: Props) {
  const [current, setCurrent] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  const story = stories[current];

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setCurrent(startIndex);
  }, [startIndex]);

  useEffect(() => {
    setProgress(0);
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
      animFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    const handleEnded = () => {
      if (current < stories.length - 1) setCurrent((c) => c + 1);
      else onClose();
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [current, stories.length, onClose]);

  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const goNext = () => {
    if (current < stories.length - 1) setCurrent((c) => c + 1);
    else onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const delta = touchCurrentY.current - touchStartY.current;
    if (delta > 80) onClose();
  };

  if (!story) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="story-viewer-overlay"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        style={{ height: "100dvh" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-ocid="story_viewer.modal"
      >
        {/* Video */}
        <div className="relative w-full h-full max-w-sm mx-auto">
          {/* biome-ignore lint/a11y/useMediaCaption: Story videos are user-generated content without captions */}
          <video
            ref={videoRef}
            key={story.id + current}
            src={story.videoUrl}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter:
                story.filterStyle === "none" ? undefined : story.filterStyle,
            }}
          />

          {/* Swipe hint */}
          <div className="absolute top-1 inset-x-0 flex justify-center pointer-events-none">
            <div className="w-8 h-1 rounded-full bg-white/30" />
          </div>

          {/* Top overlay */}
          <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
            {/* Progress bar */}
            <div className="flex gap-1 mb-3">
              {stories.map((s, i) => (
                <div
                  key={s.id}
                  className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden"
                >
                  <div
                    className="h-full bg-white rounded-full transition-none"
                    style={{
                      width:
                        i < current
                          ? "100%"
                          : i === current
                            ? `${progress}%`
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Author info */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center border-2 border-white shadow">
                <span className="text-black text-xs font-bold">
                  {story.authorInitials}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  {story.author}
                </p>
                <p className="text-white/70 text-xs">
                  {timeAgoHindi(story.createdAt)}
                </p>
              </div>
              <div className="ml-auto bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                {story.filterName}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-14 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center z-10"
            data-ocid="story_viewer.close_button"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Tap zones */}
          <button
            type="button"
            className="absolute left-0 top-0 h-full w-1/3"
            onClick={goPrev}
            aria-label="पिछली स्टोरी"
            data-ocid="story_viewer.pagination_prev"
          />
          <button
            type="button"
            className="absolute right-0 top-0 h-full w-1/3"
            onClick={goNext}
            aria-label="अगली स्टोरी"
            data-ocid="story_viewer.pagination_next"
          />

          {/* Arrow hints */}
          {current > 0 && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronLeft size={28} className="text-white/70" />
            </div>
          )}
          {current < stories.length - 1 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight size={28} className="text-white/70" />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
