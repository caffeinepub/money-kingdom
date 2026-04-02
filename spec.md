# Money Kingdom

## Current State
v67 with Kingdom Rank, weather background, dust & cleaning gamification, full-screen immersive UI, settings panel, profile system, reels, stories, and admin panel.

Onboarding currently asks only for name and mobile number. Admin bypass exists via password but all users go through same flow.

## Requested Changes (Diff)

### Add
- 4-step onboarding for new users: Step 1 (name + mobile), Step 2 (@username), Step 3 (profile photo - skippable), Step 4 (bio with Hindi lyrics suggestions)
- After onboarding, request location/weather permission from new users
- Admin login screen with password field (password: `princepawankumar`) that bypasses ALL onboarding steps and location permission - shown before the normal onboarding
- Entry screen with two options: "नया खाता बनाएं" (new user) and a subtle admin icon/button for admin login

### Modify
- Onboarding flow expanded from 1 step to 4 steps for regular users
- Location permission request moved to after onboarding completion (not at app start)
- Admin enters via password, skips directly to app home with admin privileges

### Remove
- Nothing removed

## Implementation Plan
1. Create entry screen with two paths: new user onboarding vs admin login
2. Admin login: password input, on correct password skip to app as admin
3. New user 4-step onboarding wizard with progress indicator
4. Step 4 completion triggers location/weather permission request
5. Store user type (admin vs regular) in localStorage
6. Admin user: no onboarding shown on return visits, no location permission popup
