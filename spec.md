# Money Kingdom

## Current State
- Finance social media app with posts, stories, bottom nav, profile page
- Travel Chat and Wallet panels added (latest build)
- No followers/following system yet
- Profile shows static "0 मित्र"
- RightSidebar has empty "suggested connections" list

## Requested Changes (Diff)

### Add
- **Followers/Following system** like Facebook:
  - Each user has followers list and following list
  - Follow/Unfollow button on other users' post cards
  - Profile page shows Followers count and Following count
  - "Suggested Connections" in RightSidebar shows users to follow with Follow button
  - When you follow someone, they appear in your "Following" list
  - Notification when someone follows you (added to notifications)
  - Follower/Following counts visible on profile
  - A "Followers" and "Following" tab/section on profile page

### Modify
- **ProfilePage.tsx**: Show Followers count, Following count below profile name. Add a section to view followers list and following list.
- **PostCard.tsx**: Add Follow/Unfollow button on each post (if not own post)
- **RightSidebar.tsx**: Populate suggested connections dynamically based on who user hasn't followed yet
- **LeftSidebar.tsx**: Update "0 मित्र" to show actual following count
- **useNotifications.ts** or notifications: Add follow notification

### Remove
- Static "0 मित्र" text replaced with dynamic count

## Implementation Plan
1. Create `src/frontend/src/hooks/useFollowers.ts` - localStorage-based followers state with follow/unfollow actions, counts, suggested users list
2. Update `ProfilePage.tsx` - show followers/following counts, lists
3. Update `PostCard.tsx` - add Follow button for non-own posts
4. Update `RightSidebar.tsx` - show suggested users dynamically
5. Update `LeftSidebar.tsx` - show dynamic following count
6. Wire follow notifications
