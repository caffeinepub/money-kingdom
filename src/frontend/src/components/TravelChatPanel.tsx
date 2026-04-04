import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  user: string;
  initials: string;
  text: string;
  time: string;
  type?: "text" | "voice";
  audioUrl?: string;
}

const STORAGE_KEY = "travelChat_messages";
const CURRENT_USER = "प्रिंस पवन कुमार";
const CURRENT_INITIALS = "PPK";

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(msgs.map((m) => ({ ...m, audioUrl: undefined }))),
  );
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface TravelChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function TravelChatPanel({
  open,
  onClose,
}: TravelChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [text, setText] = useState("");
  const [dragY, setDragY] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [open]);

  const addMessage = (msg: Message) => {
    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(updated);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg: Message = {
      id: Date.now().toString(),
      user: CURRENT_USER,
      initials: CURRENT_INITIALS,
      text: trimmed,
      time: nowTime(),
      type: "text",
    };
    addMessage(msg);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const msg: Message = {
          id: Date.now().toString(),
          user: CURRENT_USER,
          initials: CURRENT_INITIALS,
          text: "🎤 Voice Message",
          time: nowTime(),
          type: "voice",
          audioUrl: url,
        };
        addMessage(msg);
        for (const t of stream.getTracks()) {
          t.stop();
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch {
      toast.error("माइक्रोफ़ोन की permission दें 🎤");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setRecordSeconds(0);
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Full-screen panel */}
          <motion.div
            key="chat-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDrag={(_, info) => setDragY(info.offset.y)}
            onDragEnd={(_, info) => {
              setDragY(0);
              if (info.offset.y > 100) onClose();
            }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-[110] bg-card flex flex-col"
            style={{ height: "100dvh" }}
            data-ocid="travel_chat.panel"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h2 className="font-bold text-base text-foreground">
                  यात्रा चैट
                </h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  सभी यात्री
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-ocid="travel_chat.close_button"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Swipe hint */}
            {dragY > 30 && (
              <div className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground bg-muted/80 px-3 py-1 rounded-full">
                  ↓ नीचे खींचें बंद करने के लिए
                </span>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 py-2">
              {messages.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-40 gap-2"
                  data-ocid="travel_chat.empty_state"
                >
                  <span className="text-4xl">✈️</span>
                  <p className="text-muted-foreground text-sm text-center">
                    यात्रा के बारे में बात करें!
                    <br />
                    <span className="text-xs">पहला संदेश भेजें...</span>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-2">
                  {messages.map((msg, idx) => {
                    const isMine = msg.user === CURRENT_USER;
                    return (
                      <div
                        key={msg.id}
                        data-ocid={`travel_chat.item.${idx + 1}`}
                        className={`flex gap-2 ${
                          isMine ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-primary-foreground">
                            {msg.initials}
                          </span>
                        </div>
                        <div
                          className={`max-w-[75%] flex flex-col gap-0.5 ${
                            isMine ? "items-end" : "items-start"
                          }`}
                        >
                          <span className="text-[10px] text-muted-foreground">
                            {isMine ? "आप" : msg.user} · {msg.time}
                          </span>
                          <div
                            className={`px-3 py-2 rounded-2xl text-sm ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted text-foreground rounded-tl-sm"
                            }`}
                          >
                            {msg.type === "voice" && msg.audioUrl ? (
                              <div className="flex flex-col gap-1 min-w-[140px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">🎤</span>
                                  <span className="text-xs font-semibold opacity-80">
                                    Voice Message
                                  </span>
                                </div>
                                {/* biome-ignore lint/a11y/useMediaCaption: voice message */}
                                <audio
                                  controls
                                  src={msg.audioUrl}
                                  className="w-full h-8"
                                  style={{ minWidth: 140 }}
                                />
                              </div>
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}
            </ScrollArea>

            {/* Recording indicator */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  key="recording-bar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mx-3 mb-1 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center gap-2"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                    }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                  />
                  <span className="text-xs text-red-400 font-bold flex-1">
                    🎤 रिकॉर्डिंग जारी... {formatSeconds(recordSeconds)}
                  </span>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-xs font-bold"
                    data-ocid="travel_chat.stop_record.button"
                  >
                    भेजें ✔
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border flex gap-2 shrink-0">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="संदेश लिखें..."
                className="flex-1 text-sm"
                data-ocid="travel_chat.input"
                disabled={isRecording}
              />
              {/* Voice record button */}
              <button
                type="button"
                onMouseDown={startRecording}
                onTouchStart={startRecording}
                onMouseUp={isRecording ? stopRecording : undefined}
                onTouchEnd={isRecording ? stopRecording : undefined}
                onClick={isRecording ? stopRecording : undefined}
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                data-ocid="travel_chat.voice_button"
                title={isRecording ? "भेजें" : "आवाज़ भेजें"}
              >
                🎤
              </button>
              <Button
                onClick={handleSend}
                disabled={!text.trim() || isRecording}
                size="sm"
                data-ocid="travel_chat.submit_button"
                className="shrink-0"
              >
                भेजें
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
