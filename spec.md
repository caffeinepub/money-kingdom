# Money Kingdom

## Current State
Users onboard via LoginPage (name + mobile stored in localStorage as mk_user_profile). ProfilePage only shows admin user Prince Pawan Kumar data. Posts are created with hardcoded author. Video posts are split from text posts into separate arrays causing videos to not appear in main feed.

## Requested Changes (Diff)

### Add
- Each user has their own profile: profile photo, cover photo, bio stored in localStorage
- Profile edit mode: tap to change profile photo, cover photo, bio

### Modify
- CenterFeed handleNewPost: use logged-in user name from mk_user_profile localStorage as post author
- ProfilePage: show current logged-in user profile data (name, photo, bio) not just hardcoded admin data
- Unify the feed: all posts (video + text) appear in ONE feed in order. Do not split into videoPosts and textPosts sections.

### Remove
- The videoPosts/textPosts split logic for display

## Implementation Plan
1. Create useUserProfile hook reading/writing profile data to localStorage
2. Update ProfilePage to use logged-in user data with edit capability
3. Update CenterFeed to use real user name for new posts
4. Unify feed rendering -- all posts in one array, VideoPostCard for video posts, PostCard for text posts
