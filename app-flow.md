# StarkEarn App Flow

## Main Navigation

The app uses a consistent navigation system that's available on all pages:

### Desktop Navigation

- Logo (StarkEarn) - Returns to home page
- Browse Bounties (/bounties)
- Create Bounty (/create)
- **Swap (/swap)** ← This is the link to the swap page
- Leaderboard (/leaderboard)
- Profile (/profile)
- Connect Wallet button
- Get Started button

### Mobile Navigation

- Same links as desktop in a hamburger menu
- Swap is the third link in the list

## Accessing the Swap Page

1. From any page, you can access the swap page by clicking the "Swap" link in the main navigation
2. The swap page URL is: `/swap`
3. On the swap page, users can:
   - Select tokens to swap (STRK, USDC, ETH, USDT, DAI)
   - Enter amounts
   - View exchange rates and fees
   - See their token balances
   - Execute swaps (requires wallet connection)

## Wallet Connection

- Users can connect their wallet from multiple places:
  - The "Connect Wallet" button in the main navigation
  - The "Connect StarkNet Wallet" button on login/signup pages
  - The swap page will prompt for wallet connection when trying to execute a swap

## User Flow

1. User visits the site
2. Can browse bounties without login
3. To participate, user can:
   - Sign up with email (no wallet required initially)
   - Log in with email
   - Connect wallet at any time
4. Once logged in, user can:
   - Access the swap page
   - View profile
   - Browse/post bounties
   - View leaderboard

# StarkEarn App Flow - Visual Guide

```
Home Page
    |
    ├── Browse Bounties ────► /bounties
    ├── Create Bounty ────────► /create
    ├── Swap ───────────────► /swap  ← (This is what you're looking for)
    ├── Leaderboard ────────► /leaderboard
    ├── Profile ────────────► /profile
    ├── Connect Wallet
    └── Get Started ────────► /signup or /login

Swap Page (/swap)
    |
    ├── Select "From" Token
    ├── Enter Amount
    ├── Select "To" Token
    ├── View Exchange Rate
    ├── View Network Fees
    └── Swap Tokens (requires wallet connection)

Authentication Flow
    |
    ├── Sign Up ────────────► /signup
    │   ├── With Email (no wallet required)
    │   └── Connect Wallet Later
    │
    └── Login ──────────────► /login
        ├── With Email
        └── With Wallet
```

## Key Points:

1. The "Swap" link is in the main navigation bar on all pages
2. Users can access the swap page without being logged in
3. Wallet connection is only required when actually executing a swap
4. All StarkNet brand colors (Orange: EC796B, Pink: E175B1, Blue: 0C0C4F) are used throughout the app
