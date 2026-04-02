import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  user: string;
  initials: string;
  text: string;
  time: string;
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [open]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg: Message = {
      id: Date.now().toString(),
      user: CURRENT_USER,
      initials: CURRENT_INITIALS,
      text: trimmed,
      time: nowTime(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(updated);
    setText("");
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border flex gap-2 shrink-0">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="संदेश लिखें..."
                className="flex-1 text-sm"
                data-ocid="travel_chat.input"
              />
              <Button
                onClick={handleSend}
                disabled={!text.trim()}
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
