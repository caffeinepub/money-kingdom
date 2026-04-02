# Money Kingdom v66

## Current State
v65 has Instagram-style profile, Reels (vertical scroll, double-tap like), and basic Settings panel. Clock widget exists (KingdomClockWidget.tsx), music player (BackgroundMusicPlayer.tsx), wallet, gift system, 39 languages, admin panel, task board, and more are all present.

## Requested Changes (Diff)

### Add
1. **Dust & Midnight Cleaner feature:**
   - CSS overlay on screen corners that increases opacity based on session time (max ~60 min to reach max dust)
   - At exactly midnight (00:00), show animated character overlay saying "रुको! बहुत धूल-मिट्टी हो गई है, मुझे साफ करने दो!"
   - Character animation: sweeping motion across screen, then dust clears, screen "sparkles"
   - After cleaning: reward user with 10 Kingdom Coins
   - Main app content has slight frame/margin so dust on edges is visible
   - New component: DustOverlay.tsx + MidnightCleaner.tsx

2. **Full-Screen Immersive UI:**
   - Chat (TravelChatPanel) opens as full-screen slide-up modal with blur backdrop
   - Settings panel opens as full-screen slide-up modal
   - Profile page opens as full-screen slide-up modal
   - Swipe down to close gesture support
   - Blur background effect when these are open

3. **Settings Panel Upgrade (6 detailed sections):**
   - 👤 Account: profile edit (name, username, bio, photo), email/mobile update, public/private toggle
   - 💰 Wallet: balance display, UPI ID save (text field only), transaction history, withdraw request button (shows "24 घंटे में process होगी" message)
   - 🔒 Privacy: 4-digit PIN change, block list, activity log
   - 🔔 Notifications: push alerts toggle, payment alerts toggle, mute option
   - 🎨 Display: Dark Mode toggle (for ALL users now), theme picker, data saver, autoplay toggle, language
   - ❓ Help: help center text, report problem, delete account
   - 👑 "Verify My Kingdom" section at bottom: "Coming Soon" badge

### Modify
- TravelChatPanel: convert from popup/overlay to full-screen slide-up modal
- SettingsPanel: expand into 6-section accordion/tabs layout, full-screen modal
- ProfilePage: wrap in full-screen modal that slides up
- App.tsx / MainLayout.tsx: add DustOverlay component, add frame margin
- Dark Mode: make available to ALL users (remove admin-only restriction)

### Remove
- Admin-only restriction on Dark Mode toggle

## Implementation Plan
1. Create `DustOverlay.tsx` - canvas or CSS overlay with dust particles at corners, session timer, midnight trigger
2. Create `MidnightCleaner.tsx` - animated character (CSS/emoji-based), speech bubble, sweep animation, sparkle, coin reward
3. Update `TravelChatPanel.tsx` - make it a full-screen modal with slide-up animation
4. Update `SettingsPanel.tsx` - rebuild as 6-section full-screen modal with accordion sections
5. Update `ProfilePage.tsx` - wrap in full-screen slide-up modal container
6. Update `App.tsx` or `MainLayout.tsx` - integrate DustOverlay, add MidnightCleaner, add frame padding
7. Make Dark Mode accessible to all users in Display settings
