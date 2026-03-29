# Money Kingdom

## Current State
Bazaar/Marketplace (MarketplaceView.tsx) allows users to list items for sale with title, price, location, category, description. No buying functionality exists -- users can only browse listings. No commission system exists.

## Requested Changes (Diff)

### Add
- "खरीदें" (Buy) button on each item card in the marketplace
- Purchase flow: buyer pays from their virtual wallet, 50% goes to seller's wallet, 50% goes to admin (Prince Pawan Kumar)
- Item listing should allow photo upload (from gallery)
- Show commission breakdown clearly: "₹X seller को, ₹X Prince Pawan Kumar को"
- After purchase, show success animation (coins/money explosion)
- Seller can see how much they earned from sales in their wallet history
- Items marked as "बिक गया" (Sold) after purchase and removed from listing

### Modify
- MarketplaceView.tsx: add buy button and purchase dialog to each item card
- Item listing form: add photo upload option
- WalletPanel.tsx: show transaction history including marketplace sales/purchases

### Remove
- Nothing removed

## Implementation Plan
1. Add wallet state management for marketplace transactions (buyer deducted full price, seller gets 50%, admin gets 50%)
2. Add "खरीदें" button on each item card showing price breakdown
3. Purchase confirmation dialog with wallet balance check
4. Mark item as sold after purchase, remove from active listings
5. Add photo upload to item listing form
6. Show money explosion animation on successful purchase
7. Update transaction history to include marketplace buy/sell entries
