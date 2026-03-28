# Money Kingdom

## Current State
CreatePost.tsx has basic video/photo upload with caption. No music, filters, text overlay, stickers, trim, thumbnail, location, or tagging options for video posts.

## Requested Changes (Diff)

### Add
- VideoEditorModal component: opens after video is selected, with full editing options
  - 🎵 Background Music: select audio file from gallery, volume slider
  - 🎨 Color Filters: 11 filters (Normal, Warm, Cool, Vintage, B&W, Fade, Vivid, Rose, Sky, Gold, Drama)
  - ✍️ Text Overlay: type text, pick color, shows over video
  - 😄 Stickers/Emoji: tap to add emoji stickers on video
  - ✂️ Trim: start/end time sliders to trim video
  - 📸 Thumbnail: pick a timestamp for cover frame
  - 📍 Location Tag: text input for location
  - 👥 Tag People: input to mention usernames
  - 💬 Caption: text area for post description
- All options shown as tabs or scrollable sections inside the modal
- "तैयार है" button to proceed to post

### Modify
- CreatePost.tsx: when video is selected, open VideoEditorModal instead of directly previewing
- Post data should carry optional fields: music name, filter, textOverlay, stickers, trimStart, trimEnd, thumbnailTime, location, taggedPeople

### Remove
- Nothing removed

## Implementation Plan
1. Create VideoEditorModal.tsx with all 9 editing tabs/sections
2. Modify CreatePost.tsx to open modal on video select
3. Pass edited video metadata to onPost callback
