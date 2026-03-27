import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { type Notification, useNotifications } from "../hooks/useNotifications";

function NotificationIcon({ type }: { type: Notification["type"] }) {
  if (type === "like") return <span className="text-base">💰</span>;
  if (type === "comment") return <span className="text-base">💬</span>;
  return <span className="text-base">👤</span>;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ open, onClose }: Props) {
  const { notifications, unreadCount, markAllRead, markOneRead } =
    useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-16px)] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          data-ocid="notifications.panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-bold text-foreground text-sm">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-primary hover:underline font-medium"
                data-ocid="notifications.button"
              >
                सभी पढ़े हुए
              </button>
            )}
          </div>

          {/* List */}
          <ScrollArea className="max-h-[360px]">
            {notifications.length === 0 ? (
              <div
                className="py-8 text-center text-muted-foreground text-sm"
                data-ocid="notifications.empty_state"
              >
                कोई notification नहीं
              </div>
            ) : (
              <ul>
                {notifications.map((n, i) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`w-full flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/60 text-left ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => markOneRead(n.id)}
                      data-ocid={`notifications.item.${i + 1}`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {n.avatar}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug line-clamp-2">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <NotificationIcon type={n.type} />
                          <span className="text-xs text-muted-foreground">
                            {n.time}
                          </span>
                        </div>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5">
            <button
              type="button"
              className="w-full text-sm text-primary font-medium hover:underline"
              data-ocid="notifications.link"
            >
              सभी notifications देखें
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
