import { useEffect, useState } from "react";

const LAST_VISIT_KEY = "mk_last_visit";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export function useReminderNotification() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const lastVisitTime = lastVisit ? Number.parseInt(lastVisit, 10) : null;

    // Check if 3 days have passed
    const shouldRemind =
      lastVisitTime !== null && now - lastVisitTime >= THREE_DAYS_MS;

    if (shouldRemind) {
      setShowBanner(true);

      // Try browser notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Money Kingdom 💰", {
            body: "आपका भाग्य चक्र इंतज़ार कर रहा है! आज spin करें और किस्मत आज़माएं 🎡",
            icon: "/icons/icon-192x192.png",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Money Kingdom 💰", {
                body: "आपका भाग्य चक्र इंतज़ार कर रहा है! आज spin करें और किस्मत आज़माएं 🎡",
                icon: "/icons/icon-192x192.png",
              });
            }
          });
        }
      }
    }

    // Update last visit timestamp
    localStorage.setItem(LAST_VISIT_KEY, now.toString());
  }, []);

  const dismissBanner = () => setShowBanner(false);

  return { showBanner, dismissBanner };
}
