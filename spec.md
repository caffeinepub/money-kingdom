# Money Kingdom v69

## Current State
v68 build with: Clock UI (removed per user), Onboarding (4-step), Admin bypass (password), Weather Background (users only), Dust & Midnight Cleaner, Full-screen overlays (Chat/Profile/Settings), Reels (vertical snap scroll, double-tap like, WhatsApp share), Kingdom Rank (Soldier/Knight/Prince/King), Vault animation, Coin sound/haptic, Settings (6 tabs: Account/Wallet/Privacy/Notifications/Display/Help), 39 languages, English Guru AI.

## Requested Changes (Diff)

### Add
**Reels Upgrades:**
- Full-screen immersive view (hide status/nav bars via CSS)
- Double-tap: animated gold coin / crown flies up instead of plain heart
- Haptic feedback (vibrate API) on like and swipe
- Dynamic blur background when video is not 9:16
- Kingdom music marquee text (scrolling) at bottom
- Rotating royal disc icon showing music playing
- Silent autoplay (muted by default, tap anywhere to unmute)
- Music visualizer waves at bottom of video
- Hindi lyrics sync animation overlay
- Gifting vault button on right side panel (send Kingdom Coins)
- Golden rocket / coins rain animation when gift sent
- View & Earn: random lucky coin appears every 30 seconds, tap for 1-3 coins
- Earning counter in corner showing coins earned today from reels
- Sponsored tag on ad-marked videos
- Long-press menu (download, share, not interested)
- WhatsApp direct share button
- Royal comment scroll (slide up from bottom, blur behind)
- Golden progress bar at bottom of video
- Love You exit animation (big animated heart when exiting Reels)

**Settings Upgrades:**
- Display tab: Dust Intensity slider (slow/medium/fast)
- Display tab: Midnight Cleaner character choice (Joker/Soldier/Robot)
- Privacy tab: Ghost Mode toggle (hide online status)
- Privacy tab: Story Privacy selector (All/Friends/None)
- Notifications tab: Quiet Hours toggle with time picker
- Wallet tab: Transaction filter (Today/Yesterday/Last Month)
- Account tab: Account Type selector (Personal/Business/Royal)

**Games Section (new tab in Settings or separate view):**
- Quiz game (pre-filled Hindi/finance questions, earn coins on correct answers)
- Festival Mode (auto triggers on Diwali/Eid/Holi dates with fireworks/lights)
- Coin Toss mini-game
- Lucky Spin wheel
- Treasure Hunt (tap to find hidden coins in feed)
- Gift Box drop (random gift box appears, tap to open)
- Soundboard (royal sound effects)
- Avatar Maker (cartoon face customizer)

**Profile Upgrades:**
- Visitor Tax: fixed system, when someone visits a King/Prince profile, 1 coin auto-deducted and credited to profile owner
- King comments appear at top with golden border (already partly done, strengthen)

### Modify
- ReelsView: complete overhaul with all new features above
- SettingsPanel: add new controls to existing tabs
- MidnightCleaner: support character choice (joker/soldier/robot) from settings
- DustOverlay: support intensity setting from settings

### Remove
- Nothing removed

## Implementation Plan
1. Overhaul ReelsView.tsx with all 20 new Reels features
2. Add Games.tsx component with Quiz, CoinToss, LuckySpin, TreasureHunt, GiftBox, Soundboard, AvatarMaker
3. Update SettingsPanel.tsx with new controls in existing tabs + new Games tab
4. Update MidnightCleaner.tsx to support character selection
5. Update DustOverlay.tsx to support intensity slider
6. Add FestivalMode.tsx that auto-triggers on Indian festival dates
7. Wire everything in MainLayout / App
