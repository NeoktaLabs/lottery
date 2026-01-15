# Ppopgi Frontend — Plain Language & Visual Style Guide (Updated)

This document defines the **non-negotiable frontend language and visual rules** for Ppopgi.

The goals are:
- clarity for non-technical users
- calm, honest presentation
- visual lightness that lets the artwork shine
- consistency even when automation or fallback systems are active

---

## 1) Plain-Language Rule (No Technical Terms)

### 1.1 Core rule

The UI must avoid technical words such as:
- wallet, address, RPC, chain, network, contract, transaction, gas, block, token, EVM, L2, bridge, approve, indexer, bot

If something technical must happen, it must be:
- explained in **human terms**
- short
- non-alarmist
- factual

---

### 1.2 UI wording: approved vocabulary

Use these user-friendly terms instead:

| Technical concept | UI term to use |
|---|---|
| Wallet connect | **Sign in** / **Connect** |
| Wallet address | **Your account** |
| Network / chain | **Where you play** / (usually hidden) |
| Transaction | **Confirm** / **Complete** |
| Gas fee | **Energy cost** |
| Native token (XTZ) | **Energy coins (XTZ)** |
| USDC | **Coins (USDC)** |
| Approve | **Allow** / **Unlock coins for this raffle** |
| Smart contract | (never mention) |
| Bridge | **Move coins to Etherlink** / **Bring coins in** |
| Explorer | (not a user concept) (keep in admin or proof views only) |

---

### 1.3 Microcopy guidelines

- Write at a ~10–12 year old reading level.
- Prefer short sentences.
- Always tell the user what happens next in one line.
- Avoid acronyms unless they’re currency symbols (XTZ, USDC).
- Avoid urgency language unless it is strictly factual.

---

### 1.4 Example copy

**Instead of:** “Insufficient gas.”  
**Use:** “Not enough energy coins (XTZ) to complete this.”

**Instead of:** “Approve USDC spending.”  
**Use:** “Allow Ppopgi to use your coins (USDC) for tickets.”

**Instead of:** “Transaction pending.”  
**Use:** “We’re confirming your entry…”

---

### 1.5 Automated actions (plain-language rule)

Some actions may happen automatically (for example, a raffle being finalized).

The UI must:
- never imply authority or control
- never suggest outcomes are chosen by the app
- never use “we decided” or “we completed” language

Approved phrasing:
- “This raffle was finalized automatically.”
- “This raffle moved to the draw step.”

Avoid:
- “We finalized this raffle”
- “Ppopgi completed the draw”
- “The app picked a winner”

Automation should feel **boring and neutral**, not powerful.

---

### 1.6 Data loading & fallback language

If fast browsing data is temporarily unavailable, the UI should fall back quietly.

Approved wording:
- “Loading directly from the network…”
- “This may take a moment.”
- “Showing live data.”

Avoid:
- “Indexer unavailable”
- “Backend error”
- “Service degraded”
- “RPC fallback”

Fallback should feel **slower, not broken**.

---

## 2) Visual Style Guide (Pastel + Transparent)

### 2.1 Design goals

- Make the UI feel like a **spring festival / raffle booth**.
- Use **pastel pinks, peach, lavender, sky blue**.
- Keep sections **transparent** so the background remains visible.
- Maintain readability using blur + soft borders instead of opaque blocks.

---

### 2.2 Recommended palette (inspired by background art)

Use these as starting points (adjust slightly if needed for contrast):

- **Sakura Pink**: `#F6B6C8`
- **Peach Glow**: `#FAD1B8`
- **Lavender Mist**: `#CBB7F6`
- **Sky Pastel**: `#A9D4FF`
- **Warm Lantern**: `#FFD89A`
- **Soft Cream (text on dark)**: `#FFF6EF`
- **Ink (text)**: `#2B2B33`

---

### 2.3 Transparency system

All containers should use “glass” styling:

- Background: `rgba(255, 255, 255, 0.18)` to `0.28`
- Border: `rgba(255, 255, 255, 0.35)`
- Backdrop blur: `10px–16px` (enough to read text, not enough to hide the background)
- Shadow: very soft (no harsh black)

---

### 2.4 Card style (pink raffle ticket)

Lottery cards should feel like a raffle ticket:
- Rounded corners
- Optional subtle “ticket notch”
- Pink gradient wash
- Faint dashed divider for a “tear line”
- Small **status stamp** badge

**Transparency is mandatory** so the background still shows through.

---

## 3) Layout Behavior: Stay on Home, Use Modals

### 3.1 Navigation rule

- The user should **stay on the homepage** for almost everything.
- The only true page navigation is **Explore**.
- Everything else opens as a modal:
  - Lottery details & entry
  - Create raffle
  - Cashier help
  - Admin panel
  - Share dialogs
  - Success confirmations

---

### 3.2 Modal style

Modals should match the glass style:
- Translucent panel
- Blurred background behind modal
- Large close button
- Strong, friendly headings

---

## 4) Homepage Sections (Transparent Panels)

Homepage has two **transparent sections**:

### 4.1 “Big Prizes” section

- Show **3 biggest active raffles** by prize size
- Title: **“Big prizes right now”**
- Subtitle: “The biggest rewards you can win today.”

---

### 4.2 “Ending Soon” section

- Show **5 raffles ending soon**
- Title: **“Ending soon”**
- Subtitle: “Last chance to join.”

Rules:
- This reflects best-known timing information.
- If a raffle sells out or moves to the draw step, it must update immediately.
- Never imply urgency once a raffle is no longer open.

---

## 5) Top Menu Content (Friendly Labels)

### Left
- Logo

### Center
- **Explore**
- **Create**

### Right
- **Cashier** (opens “How to get energy + coins”)
- **Sign in**

After sign-in:
- “Energy: XTZ …”
- “Coins: USDC …”
- Optional small refresh icon

### Conditional
- **Admin** only if the connected account is the owner

---

## 6) Disclaimer Gate (First Visit)

Before the app shows, display a full-screen modal:

- Title: **“Before you play”**
- Bullets:
  - “This is an experimental app.”
  - “You’re responsible for your choices.”
  - “Only play with money you can afford to lose.”
- Button: **“I understand — let’s go”**

Store acceptance locally so it does not reappear every visit.

---

## 7) Share UX (Everywhere)

### 7.1 Lottery card share button

Each lottery card includes **Share**:
- Copy link
- Share to common platforms

---

### 7.2 Post-create share prompt

After successful creation:
- “Your raffle is live 🎉”
- “Want to share it?”
- Buttons: Copy link / Share

Sharing should always feel optional and pressure-free.

---

## 8) “Extreme Clarity” Lottery Card Content

Lottery cards must be transparent about costs and outcomes.

**Required fields**
- Name
- Prize: “Win: 10,000 USDC”
- Ticket price: “Ticket: 5 USDC”
- Time left: “Ends in 2h 14m”
- Spots: “123 joined” (and “Max: 500” if relevant)

Notes:
- “Joined” always means **tickets sold**, not number of people.
- Never imply odds or chances.

**Fees (simple wording)**
- “Ppopgi fee: 10%”
- “Creator keeps: …”
- “Winner gets: …”

Never use:
- “protocol fee”
- “fee recipient”
- technical labels

---

## 9) Accessibility and readability requirements

Because the background is detailed:
- Always enforce minimum contrast
- Use larger type for headings
- Avoid tiny gray text
- Add subtle blur behind all text areas on the background

Readability always beats decoration.

---

## 10) Summary

The frontend should feel like:
- a spring festival
- friendly and human
- calm and honest
- minimal navigation (modal-first)
- fully transparent about costs
- visually light so the background shines

If something feels gentle instead of thrilling,  
that is intentional.