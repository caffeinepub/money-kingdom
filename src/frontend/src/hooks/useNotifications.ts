import { createContext, useContext, useState } from "react";

export type NotificationType = "like" | "comment" | "friend_request";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
  avatar: string;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markOneRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, "id" | "read">) => void;
}

export const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  markOneRead: () => {},
  addNotification: () => {},
});

export function useNotificationsState(): NotificationsContextValue {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markOneRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function addNotification(notification: Omit<Notification, "id" | "read">) {
    const id = Date.now().toString();
    setNotifications((prev) => [{ ...notification, id, read: false }, ...prev]);
  }

  return {
    notifications,
    unreadCount,
    markAllRead,
    markOneRead,
    addNotification,
  };
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
