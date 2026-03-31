# Money Kingdom – v64

## Current State
v63 is a full PWA with Instagram/Facebook-style layout:
- Bottom nav: Home | Bazaar | Reels | Chat | Profile
- CenterFeed with Stories, CreatePost, PostCard (with reactions, comments, bookmark, gift), VideoPostCard
- ProfilePage (Facebook-style with cover photo, round photo, followers, Settings inside)
- SettingsPanel (Language 39 langs + English Guru AI tabs)
- WalletPanel, SpinWheel, GiftCharacterPanel
- Dark Mode (admin-only), Admin Stats (admin-only)
- 39 languages full translation, onboarding (name + mobile)
- Posts/stories persisted to localStorage
- MoneyRain, CoinAnimation, animated header

## Requested Changes (Diff)

### Add
1. **KingdomClockWidget** – A decorative royal clock widget displayed at the TOP of the CenterFeed home screen (above Stories). Clock face shows 4 navigation points:
   - 🕛 12 o'clock = "Profile" label + tap navigates to Profile
   - 🕒 3 o'clock = "Wallet" label + tap opens WalletPanel
   - 🕕 6 o'clock = "Feed" (stays on home)
   - 🕘 9 o'clock = "Settings" label + tap opens SettingsPanel
   The clock also shows the LIVE current time (hours + minutes hands). Animated gold/royal design. Tapping a position triggers a smooth card-flip or slide transition. Has a crown icon at center. Clock is compact (180px diameter) so it doesn't dominate the screen.

2. **BackgroundMusicPlayer** – A floating mini music player anchored to bottom-left (above bottom nav). Uses Web Audio API to generate a gentle looping ambient tone (pentatonic arpeggio, ~60 BPM, soft). Shows 🎵 icon, play/pause toggle, and "Money Kingdom Theme" label. Defaults to PAUSED (user must press play). Stores play preference in localStorage.

3. **HindiQuotesOverlay** – Pre-loaded Hindi inspirational quotes shown as a scrollable quote card in CenterFeed (between Clock widget and Stories). Rotates through 10+ quotes about money/kingdom every 8 seconds with fade animation. Examples:
   - "पैसा बोलता है, मेहनत से सिखो इसे बोलना"
   - "आपका किंगडम आपकी मेहनत से बनेगा"
   - "हर रुपया एक कदम है — मंजिल की तरफ"
   - "जो सपने देखते हैं, वही राजा बनते हैं"
   - "पैसों की बारिश तब होती है जब मेहनत की धूप निकलती है"

4. **ThemeColorPicker** – In SettingsPanel, add a new "🎨 थीम" tab with 3 selectable themes:
   - Royal Gold (current default – warm earthy oklch tones)
   - Night Black (dark mode variant with deep black + gold accents)
   - Diamond Silver (cool silver/white + blue-tinted accents)
   Applies CSS variable overrides stored in localStorage as `mk_theme`.

5. **TaskBoard** – New component shown in CenterFeed below the QuotesCard. "🏆 आज के काम" section with 3-4 daily tasks:
   - "✅ आज लॉगिन किया" (auto-completed, +5 coins)
   - "📸 एक पोस्ट डालो" (+10 coins)
   - "👥 किसी को follow करो" (+5 coins)
   - "🎡 भाग्य चक्र घुमाओ" (+2 coins)
   Shows coin balance earned today. Tasks reset daily. Stored in localStorage. "Kingdom Coins" are separate from wallet balance, displayed as 🪙 X coins.

6. **Following Feed Tab** – In CenterFeed, add two tabs at top: "सभी" (All posts) and "फॉलोइंग" (only posts from followed users). Tabs are small pills.

7. **Crown Reaction** – Add 👑 "किंगडम" as a special 7th reaction in PostCard REACTIONS array. Crown reaction has gold color and shows a small crown animation when selected.

8. **Music Sticker on Post** – In CreatePost, add a "🎵 Music" button that toggles showing a dropdown of 3 Hindi lyric quotes that get appended as a styled banner to the post content. Example options:
   - "🎵 पैसा बोलता है..."
   - "🎵 किंगडम की राह..."
   - "🎵 मेहनत की धूप..."

### Modify
- **CenterFeed**: Accept onNavigate and onOpenWallet and onOpenSettings callbacks from MainLayout so ClockWidget can navigate. Add Following tab toggle. Add KingdomClockWidget, HindiQuotesCard, TaskBoard sections above Stories.
- **MainLayout**: Pass navigation callbacks down to CenterFeed.
- **SettingsPanel**: Add 🎨 थीम tab with ThemeColorPicker.
- **PostCard REACTIONS**: Add 👑 crown reaction as 7th item.
- **CreatePost**: Add music sticker selector button.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `KingdomClockWidget.tsx` – live clock SVG with 4 nav tap zones and golden styling
2. Create `BackgroundMusicPlayer.tsx` – Web Audio API ambient generator, floating UI
3. Create `HindiQuotesCard.tsx` – rotating quote card with fade animation
4. Create `TaskBoard.tsx` – daily tasks with coin rewards, localStorage persistence
5. Modify `CenterFeed.tsx` – add Following tab, integrate new widgets above stories, accept nav callbacks
6. Modify `MainLayout.tsx` – pass wallet/settings/navigate callbacks to CenterFeed
7. Modify `SettingsPanel.tsx` – add Theme tab
8. Modify `PostCard.tsx` – add 👑 crown reaction
9. Modify `CreatePost.tsx` – add music sticker button
10. Create `ThemeColorPicker.tsx` – 3 theme selector inside SettingsPanel
