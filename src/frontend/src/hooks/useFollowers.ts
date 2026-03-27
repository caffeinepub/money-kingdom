import { playFollowSound } from "@/utils/sounds";
import { useCallback, useEffect, useState } from "react";

export interface SuggestedUser {
  id: string;
  name: string;
  initials: string;
  bio: string;
}

const ALL_SUGGESTED_USERS: SuggestedUser[] = [
  { id: "RAJ", name: "राज शर्मा", initials: "RS", bio: "शेयर बाजार विशेषज्ञ" },
  { id: "ANI", name: "अनिता गुप्ता", initials: "AG", bio: "म्यूचुअल फंड सलाहकार" },
  { id: "VIK", name: "विकास मेहता", initials: "VM", bio: "रियल एस्टेट निवेशक" },
  { id: "PRI", name: "प्रिया सिंह", initials: "PS", bio: "क्रिप्टो ट्रेडर" },
  { id: "SUH", name: "सुहास जोशी", initials: "SJ", bio: "वित्तीय योजनाकार" },
];

const FOLLOWERS_KEY = "mk_followers";
const FOLLOWING_KEY = "mk_following";

function loadMap(key: string): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMap(key: string, map: Record<string, string[]>) {
  localStorage.setItem(key, JSON.stringify(map));
}

export function useFollowers(currentUserId: string) {
  const [followersMap, setFollowersMap] = useState<Record<string, string[]>>(
    () => loadMap(FOLLOWERS_KEY),
  );
  const [followingMap, setFollowingMap] = useState<Record<string, string[]>>(
    () => loadMap(FOLLOWING_KEY),
  );

  // Sync to localStorage
  useEffect(() => {
    saveMap(FOLLOWERS_KEY, followersMap);
  }, [followersMap]);
  useEffect(() => {
    saveMap(FOLLOWING_KEY, followingMap);
  }, [followingMap]);

  const followers = followersMap[currentUserId] ?? [];
  const following = followingMap[currentUserId] ?? [];

  const isFollowing = useCallback(
    (userId: string) => following.includes(userId),
    [following],
  );

  const toggleFollow = useCallback(
    (userId: string, userName: string) => {
      const alreadyFollowing = (followingMap[currentUserId] ?? []).includes(
        userId,
      );

      setFollowingMap((prev) => {
        const list = prev[currentUserId] ?? [];
        const updated = alreadyFollowing
          ? list.filter((id) => id !== userId)
          : [...list, userId];
        return { ...prev, [currentUserId]: updated };
      });

      setFollowersMap((prev) => {
        const list = prev[userId] ?? [];
        const updated = alreadyFollowing
          ? list.filter((id) => id !== currentUserId)
          : [...list, currentUserId];
        return { ...prev, [userId]: updated };
      });

      if (!alreadyFollowing) {
        playFollowSound();
        // Add notification
        try {
          const notifs = JSON.parse(
            localStorage.getItem("mk_notifications") ?? "[]",
          );
          notifs.unshift({
            id: Date.now().toString(),
            type: "follow",
            text: `आपने ${userName} को फॉलो किया`,
            time: new Date().toISOString(),
          });
          localStorage.setItem("mk_notifications", JSON.stringify(notifs));
        } catch {
          // ignore
        }
      }
    },
    [followingMap, currentUserId],
  );

  const suggestedUsers = ALL_SUGGESTED_USERS.filter(
    (u) => !following.includes(u.id),
  );

  return {
    followers,
    following,
    followersCount: followers.length,
    followingCount: following.length,
    isFollowing,
    toggleFollow,
    suggestedUsers,
  };
}
