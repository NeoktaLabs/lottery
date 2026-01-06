# Neokta Lottery — Full-Feature Frontend Specification  
**(100% Smart Contract Coverage, UX-First)**

This document defines **all frontend requirements** for the Neokta Lottery platform.  
Every function, view, state, event, and edge case exposed by the smart contracts **must be reflected in the UI**, using **clear and non-technical wording**.

> **Goal:**  
> Deliver a Web2-grade user experience powered by secure, transparent Web3 infrastructure.

---

## Table of Contents

1. [Global App Structure](#1-global-app-structure)  
2. [Registry Features](#2-registry-features-use-them-all)  
3. [Deployer Features](#3-deployer-features-use-them-all)  
4. [Lottery Features](#4-lottery-features-use-them-all)  
5. [Protocol Fee Recipient UX](#5-protocol-fee-recipient-ux)  
6. [Admin Panel (Safe Only)](#6-admin-panel-safe-only--full-feature)  
7. [Events-Driven UX](#7-events-driven-ux-use-all-the-nice-signals)  
8. [My Activity Strategy](#8-my-activity-without-an-indexer)  
9. [Recommended UI Components](#9-recommended-ui-components)  
10. [Developer Checklist](#10-developer-checklist-every-contract-feature-mapped)  
11. [UX Wording, State Mapping & Error Translation](#11-ux-wording-state-mapping--error-translation-mandatory)

---

## 1. Global App Structure

### Global Navigation
- **Explore** — Browse all lotteries  
- **Create** — Create a new lottery  
- **My Activity** — Tickets, winnings, refunds  
- **Claims** — Global withdraw panel  
- **Admin** — Visible only to Safe owner  

### Global Background Jobs (Frontend)
Polling every 10–30 seconds:
- Registry pagination (`LotteryRegistered`)
- Lottery status updates
- User claimable balances

> The app **must work without an indexer**.

---

## 2. Registry Features (Use Them All)

### A. All Lotteries Page

**Reads**
- `getAllLotteriesCount()`
- `getAllLotteries(start, limit)`
- `typeIdOf(lottery)`
- `creatorOf(lottery)`
- `registeredAt(lottery)`

**UI**
- Pagination
- Sort: newest first
- Filters: lottery type, creator
- Verified badge if `typeIdOf != 0`

---

### B. Lotteries by Type

**Reads**
- `getLotteriesByTypeCount(typeId)`
- `getLotteriesByType(typeId, start, limit)`

**UI**
- Tabs (Single Winner = typeId 1)
- Auto-expand for future lottery types

---

## 3. Deployer Features (Use Them All)

### Create Single Winner Lottery

**Writes**
- `createSingleWinnerLottery(...)`

**UX Flow**
1. Check USDC balance & allowance
2. Prompt approval if needed
3. Create lottery
4. Funding confirmed automatically
5. Redirect to lottery page
6. Confirm registry registration

---

## 4. Lottery Features (Use Them ALL)

### A. Core Display

**Reads**
- `name`, `creator`, `feeRecipient`
- `createdAt`, `deadline`
- `status`
- `ticketPrice`, `winningPot`, `ticketRevenue`
- `minTickets`, `maxTickets`, `minPurchaseAmount`
- `winner`, `getSold()`

**UI**
- Countdown timer
- Progress bars (min / max)
- Rule summary cards
- Winner card when completed

---

### B. Buy Tickets

**Reads**
- `getMinTicketsToBuy()`

**Writes**
- `buyTickets(count)`

**UI**
- Quantity selector (default = minimum)
- Cost preview
- Approval flow
- Confirmation toast

---

### C. Finalization (Permissionless)

**Reads**
- `status`, `deadline`, `getSold()`
- `entropy.getFee(entropyProvider)`

**Writes**
- `finalize()`

**UI**
- “Draw winner” button
- Fee buffer (+20%)
- Drawing spinner

---

### D. Claims (Pull-Based)

**Reads**
- `claimableFunds(user)`
- `claimableEth(user)`

**Writes**
- `withdrawFunds()`
- `withdrawEth()`

**UI**
- Global claims banner
- Per-lottery claims
- Success confirmations

---

### E. Cancellation & Refunds

**Writes**
- `cancel()`
- `claimTicketRefund()`

**UI**
- Cancel CTA (when eligible)
- Refund CTA
- Clear explanations

---

### F. Emergency Recovery

**Writes**
- `forceCancelStuck()`

**UI**
- Countdown timers
- Clear “Recover funds” CTA
- Trust-focused messaging

---

## 5. Protocol Fee Recipient UX

- Display protocol fee recipient address
- If connected wallet == feeRecipient:
  - Show withdraw option
- Fee recipient is:
  - Set at deployment
  - Changeable via Safe approval
  - **Not hardcoded**

---

## 6. Admin Panel (Safe Only — Full Feature)

### Registry Admin
- `setRegistrar()`

### Deployer Admin
- `setConfig(usdc, entropy, provider, feeRecipient)`

### Lottery Admin
- `pause / unpause`
- `setProtocolFee`
- `setEntropyProvider`
- `setEntropyContract`

All admin actions:
- Hidden from non-Safe wallets
- Display clear warnings

---

## 7. Events-Driven UX

| Event | UX Reaction |
|------|------------|
| `LotteryRegistered` | Update lists |
| `TicketsPurchased` | Update stats |
| `LotteryFinalized` | Show drawing |
| `WinnerPicked` | Show winner |
| `PrizeAllocated` | Notify user |
| `FundsClaimed` | Success toast |
| `LotteryCanceled` | Refund notice |

---

## 8. My Activity (Without Indexer)

- **Created lotteries**
  - Filter registry by `creatorOf == user`
- **Participations**
  - Scan recent lotteries
  - Check `ticketsOwned(user)`

Cache results locally.

---

## 9. Recommended UI Components

- One-click withdraw
- Safety explainer box
- Verified badge
- “Finalize for me” explanation
- Claim center

---

## 10. Developer Checklist

✅ Registry  
✅ Deployer  
✅ Lottery  
✅ Claims  
✅ Admin  
✅ Events  

---

## 11. UX Wording, State Mapping & Error Translation (MANDATORY)

### Status → UI Mapping

| Contract Status | UI Label |
|-----------------|----------|
| FundingPending | Preparing lottery |
| Open | Tickets available |
| Drawing | Picking a winner… |
| Completed | Winner announced |
| Canceled | Lottery canceled |

---

### Error → Friendly Message

| Contract Error | UI Message |
|---------------|------------|
| LotteryNotOpen | Tickets are closed |
| LotteryExpired | Lottery ended |
| BatchTooCheap | Minimum purchase is $1 |
| TicketLimitReached | Sold out |
| NotReadyToFinalize | Still running |
| NothingToClaim | No funds available |
| EmergencyHatchLocked | Recovery not available yet |

---

### UX Rules

- Never show raw contract errors
- Disabled buttons must explain why
- Always reassure users their funds are safe
- Avoid blockchain terminology

---

### Copy Examples

- “Your funds are safely held until you withdraw.”
- “Anyone can draw the winner to keep things fair.”
- “Refunds are available if the lottery is canceled.”

---

## Final Note for Developer

> If a user needs blockchain knowledge to use this app, the UX has failed.

This specification maps **1:1 with the smart contracts**, including:
- Funding flow
- Pull payments
- Emergency recovery
- Registry verification
- External protocol fee recipient

---
