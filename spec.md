# Money Kingdom

## Current State
Settings panel has 10 sections: Profile, Wallet, Privacy, Notifications, Display, Dust & Weather, Media & Reels, Immersive Display, Messaging, Support + Games + English Guru AI. All rendered as a single scrollable page (v73).

## Requested Changes (Diff)

### Add
- **🦁 Anti-Ganda Aadmi Mode** — New section in Settings after Support:
  - Intruder Selfie: after 3 wrong password attempts, front camera captures selfie and triggers download to phone gallery, then app closes
  - Fake Crash Screen: shows scary "Phone is Hacked" screen after 3 wrong attempts before closing
  - Emergency Shake trigger: phone shake activates fake crash screen + locks app
  - UI: red-bordered card with lion icon (🦁), matching user-provided HTML/CSS design (dark bg, red border-left, gold border container)
  - Toggle to enable/disable the mode

- **⚖️ Law Warrior (IPC/BNS धाराएं)** — New section in Settings:
  - Pre-filled common situations with relevant IPC/BNS sections:
    - पुलिस ने रोका (Article 22, IPC 341, BNS 126)
    - FIR नहीं लिख रहे (Section 154 CrPC, SC guidelines)
    - घरेलू हिंसा (PWDVA 2005, IPC 498A, BNS 84)
    - Traffic rules (MV Act 184/185, BNS equivalent)
    - गिरफ्तारी के अधिकार (Article 21, 22, D.K. Basu guidelines)
  - Baba Saheb Ambedkar quotes (20+ pre-filled)
  - UI: gold-bordered card with scales icon (⚖️), matching user-provided design
  - Expandable accordion per situation

- **🔥 महा-शक्ति फीचर्स** header section grouping both features with the exact styling from user-provided HTML (black bg, gold border, red accent for anti-ganda)

### Modify
- SettingsPanel.tsx: add two new Tab components (AntiGandaTab, LawWarriorTab) and their SectionHeaders after the Support section
- Quick nav bar at top of settings: add 🦁 and ⚖️ buttons

### Remove
- Nothing removed

## Implementation Plan
1. Create AntiGandaTab component inside SettingsPanel.tsx:
   - Toggle to enable/disable mode (stored in localStorage)
   - Password attempt counter logic (stored in localStorage)
   - Camera capture using getUserMedia (front camera)
   - Download trigger via canvas + blob URL
   - Fake crash overlay component (full-screen scary red screen)
   - Device motion shake detection using DeviceMotionEvent
2. Create LawWarriorTab component:
   - Accordion list of 5 common situations with IPC/BNS sections
   - Baba Saheb quotes carousel/list (20+ quotes)
   - All data pre-filled as static arrays
3. Add महा-शक्ति section header (styled per user HTML)
4. Add both tabs to the main scrollable settings page
5. Add nav shortcuts in quick nav bar
