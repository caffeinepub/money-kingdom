# Money Kingdom

## Current State
v70 build है जिसमें:
- Settings panel 6 sections: Account, Wallet, Privacy, Notifications, Display, Help
- Account में: नाम, username, bio, email, mobile, account type, avatar editor (basic), verification badge, linked accounts
- Wallet में: balance, UPI save, transaction history, withdrawal request, gifting settings, withdrawal limit, admin commission view
- Privacy में: PIN, block list, activity log, ghost mode, story privacy, 2FA
- Notifications में: push, payment, quiet hours, alert style, coin chime
- Display में: dark mode, dust intensity, cleaner character, weather ON/OFF, autoplay, language
- Help में: help center, report problem, delete account, verify my kingdom
- ReelsView.tsx में full-screen reels हैं, double-tap gold coin animation, View & Earn, gifting vault
- CenterFeed.tsx में posts/videos feed है
- CreatePost.tsx में post create होती है
- Profile में post count दिखता है

## Requested Changes (Diff)

### Add
1. **Settings को 10 categories में expand करें** (अभी 6 हैं):
   - **👑 शाही पहचान (Profile & Identity)**: Kingdom Title (महाराजा/सुल्तान/नवाब etc dropdown), Bio font selector, Profile border style (Golden/Diamond/Silver ring), Verification portal (file upload for blue/gold tick), Avatar editor (3D clothes/crown color picker)
   - **💰 खजाना (Wallet & Economy)**: Currency display switch (सिक्के/रुपये), UPI ID save/delete, Withdrawal limit (daily), Gifting toggle (who can gift you: सभी/दोस्त/कोई नहीं), Tax receipt download button, Transaction filter (आज/कल/महीना), Balance visibility toggle
   - **🔒 प्राइवेसी (Privacy & Protection)**: App lock (fingerprint/face - prompt), Ghost/incognito mode, Block list, 2FA toggle, Screenshot block toggle, PIN change, Login activity, Story privacy
   - **🎬 रील & मीडिया (Media & Feed)**: Auto-scroll toggle, Video quality (HD/Data Saver), Music volume slider, Download permission toggle, Lyrics display toggle, Caption font size/color
   - **🌫️ धूल और मौसम (Dust & Weather)**: Dust speed (Low/Medium/High slider), Cleaner schedule (daily/weekly), Cleaner character selector (जोकर/सिपाही/रोबोट), Live weather ON/OFF, Animation speed slider
   - **📱 फुल स्क्रीन (Immersive Display)**: Immersive mode toggle, Frame/margin size slider, Page transition style (Slide/Fade dropdown), Love You animation color picker, App brightness slider, Theme selector
   - **🔔 नोटिफिकेशन (Alerts)**: Alert position (बीच/ऊपर toggle), Coin chime sound selector, DND hours, Priority contacts list, Payment alert toggle, Break reminder interval
   - **💬 चैट (Messaging)**: Chat wallpaper selector (presets + upload), Auto-delete message timer (never/1hr/24hr/7days), Voice message speed (slow/normal/fast), Chat bubble color, Read receipts toggle
   - **🎮 गेम्स & मनोरंजन**: Already exists as GamesPanel - add shortcut link
   - **🆘 मदद (Support & Duty)**: Bug report form (sends to admin), Help tutorial video embed, Break reminder ON/OFF + interval, Account delete, App version info

2. **Voice Message in Chat**: Record button in chat, sends audio message (use MediaRecorder API), playback in chat bubbles

3. **Video post visibility fixes**:
   - जब कोई video post करे, profile का post count तुरंत update हो (real-time)
   - Video post profile grid में सबसे ऊपर-बाएं दिखे (latest first)
   - Video post Reels feed में भी तुरंत दिखे
   - Profile header में "Posts" number prominently दिखे with video count badge

### Modify
- SettingsPanel.tsx: 6 sections → 10 sections, accordion/tabs based navigation
- ReelsView.tsx: नई posts/videos feed से sync हो
- Profile section: post count real-time update
- CenterFeed/CreatePost: post करने पर profile count और reels feed दोनों update हों

### Remove
- Kingdom Land / Real Estate section (नहीं बनाना)

## Implementation Plan
1. SettingsPanel.tsx को पूरी तरह rewrite करें -- 10 accordion sections, हर section में toggles/sliders/dropdowns/inputs
2. Chat में voice message: MediaRecorder API से record, audio blob as base64, playback button
3. CreatePost में post submit होने पर:
   - localStorage/state में posts array update हो
   - Profile post counter तुरंत बढ़े
   - Reels feed में new video automatically appear हो
4. ReelsView में userPosts state को global/shared state से sync करें
5. Profile header में Posts count बड़े और prominent तरीके से दिखे
