# Money Kingdom

## Current State
v69 app is live with:
- Settings: 6 sections (Account, Wallet, Privacy, Notifications, Display, Help)
- Full-screen overlays for Chat, Profile, Settings already implemented
- Stories, Reels, Dust, Midnight Cleaner, Weather, Games all working
- Onboarding 4-step for new users, admin bypass with password

## Requested Changes (Diff)

### Add
- **Account Settings:**
  - Nickname (शाही नाम) field -- separate display name from username
  - Avatar Editor -- clothes/crown color picker for profile character
  - Verification apply button (Blue Tick / Gold Tick) -- UI only, cosmetic
  - Account Type selector: Personal / Business / Royal
  - Linked Accounts section (Facebook/Instagram/Google) -- cosmetic display only, no real OAuth

- **Wallet Settings:**
  - Withdrawal Limit -- user sets their own daily withdrawal limit
  - Tax & Commission transparency -- show user how much admin commission was deducted from each transaction
  - Gifting Settings -- toggle: who can send gifts (Everyone / Friends only / Nobody)

- **Privacy Settings:**
  - 2FA toggle (fingerprint/face-id UI, cosmetic)
  - Login Activity -- list of devices/sessions (mock UI)

- **Midnight Cleaner Settings:**
  - Cleaner Sound toggle: झाड़ू sound vs music
  - Auto-Clean toggle: always at midnight OR only when dust > 80%

- **Notifications:**
  - Alert Style: Center screen (big) vs top bar (small)
  - Coin Chime Sound: ON/OFF

- **Display:**
  - Immersive Mode toggle (full-screen overlays ON/OFF)
  - Screen Frame Size slider (app padding/margin adjustment)
  - Dark theme intensity slider

- **Full-Screen Immersive UI everywhere:**
  - Story Creator (StoryCreator.tsx) -- opens full-screen, hides everything behind it
  - Story Viewer (StoryViewer.tsx) -- full-screen, nothing visible behind
  - Every modal/overlay: slide-up animation from bottom, blur backdrop
  - All sections: Reels, Chat, Profile, Settings, Games, Bazaar, Camera -- all open as full-screen overlays with slide-up transition, swipe-down to close

### Modify
- **SettingsPanel.tsx:** Add new sub-sections to existing 6 sections
- **StoryCreator.tsx:** Wrap in full-screen overlay with slide-up animation
- **StoryViewer.tsx:** Ensure full-screen, everything behind hidden
- **MainLayout.tsx / App.tsx:** Ensure all section transitions use full-screen overlay pattern

### Remove
- Real Estate / Land section from Settings (was planned, now removed)

## Implementation Plan
1. Update SettingsPanel.tsx with new fields in each section
2. Wrap StoryCreator and StoryViewer in full-screen overlay containers
3. Audit all panels/modals to ensure slide-up full-screen behavior
4. Add new Account fields: nickname, avatar color picker, account type, linked accounts, verification
5. Add Wallet fields: withdrawal limit input, transaction commission breakdown
6. Add Privacy fields: 2FA toggle, login activity list
7. Add Midnight Cleaner settings: sound choice, auto-clean rule
8. Add Notification settings: alert style, coin chime toggle
9. Add Display settings: immersive mode toggle, frame size slider, theme intensity
