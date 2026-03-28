# Money Kingdom

## Current State
App has GiftCharacterPanel with single flying character animation when gift is sent. MoneyRain component shows subtle ₹ symbols falling in background. No level/title system exists.

## Requested Changes (Diff)

### Add
- **पैसों की बारिश Animation**: Full-screen dramatic gold coins + currency notes explosion when any gift character is sent. Multiple coins/notes fly in all directions with randomized trajectories, then fade out. Much more dramatic than current single character.
- **वित्त राजा Level System**: Based on total amount transacted (sent+received), users earn titles shown on their profile and posts:
  - ₹0–₹99: नया सदस्य 🌱
  - ₹100–₹499: व्यापारी 💼
  - ₹500–₹1999: करोड़पति 💰
  - ₹2000+: वित्त राजा 👑
  - Title shown as a badge below username on PostCard and in ProfilePage

### Modify
- GiftCharacterPanel: After flying character animation, trigger the full-screen पैसों की बारिश (money rain explosion)
- PostCard: Show level badge below the author name
- ProfilePage: Show level badge/title near the user name area

### Remove
- Nothing

## Implementation Plan
1. Create `MoneyExplosion.tsx` component - full screen overlay with 20-30 animated coins (💰🪙💵💴💶💷) flying in random directions from center, fading out after 2s
2. Add a `useUserLevel` hook that computes level title based on localStorage wallet transactions total
3. Add a `LevelBadge.tsx` component to display the title with appropriate styling
4. Wire MoneyExplosion into GiftCharacterPanel - trigger it after gift is sent
5. Add LevelBadge to PostCard below author name
6. Add LevelBadge to ProfilePage near name
