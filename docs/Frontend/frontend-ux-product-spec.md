# frontend-ux-product-spec.md

# Neokta — Graphical & UX Specification
**Version:** v1.0  
**Audience:** Product, UX/UI designers, frontend developers  
**Goal:** Build a playful, safe, non-technical, and accessible interface that anyone can understand and enjoy

---

## 0. Core Design Philosophy

### 0.1 Accessibility First
This interface must be usable by:
- Non-technical users
- Older users
- First-time crypto users
- Experienced users (without alienating others)

**Rule:**  
If a term would confuse a non-technical person, it must not appear.

---

### 0.2 Emotional Tone
The experience should feel:
- Friendly
- Calm
- Playful
- Trustworthy
- Slightly exciting

It must **never** feel like:
- A casino
- A betting site
- A crypto dashboard
- A high-pressure environment

---

### 0.3 Inspiration (Abstract)
Inspired by:
- Childlike simplicity
- Colorful, playful visuals
- Clear rules
- Strong contrast between “simple look” and “serious fairness”

Not inspired by:
- Gambling aesthetics
- Dark urgency
- Flashy or noisy UIs

Think:
> “A simple game anyone can understand — designed responsibly.”

---

## 1. Language & Vocabulary (Sticky Language)

### 1.1 Absolute Rule
The UI must **never** use technical wording.

No:
- Blockchain
- Transaction
- Gas
- Approve
- Contract
- Oracle
- Wallet (prefer “account”)

---

### 1.2 Friendly Vocabulary Mapping

| Technical Concept | User-facing Language |
|------------------|----------------------|
| Connect Wallet | **Join** |
| Disconnect | **Leave** |
| Buy Tickets | **Join Game** |
| Pending Tx | **Getting things ready…** |
| Winner | **Winner 🎉** |
| Loser | **Thanks for playing!** |
| Jackpot | **Prize** |
| Dashboard | **Home** |
| Activity Feed | **Live Moments** |

---

## 2. Entry Coins & Energy Coins (XTZ & USDC)

### 2.1 Goal
Explain why users need **XTZ** and **USDC**:
- Clearly
- Honestly
- Without technical explanations

---

### 2.2 Concept: The Helper / Cashier

A friendly helper (visual or UI component) explains:
- What’s needed to play
- Why it’s needed
- How to get it

The helper **never** pushes or pressures.

---

### 2.3 Entry Coins (USDC)

**Primary name shown:**  
**Entry Coins**

**Explanation (simple):**
> “Entry Coins are used to join games.”

**Truth (secondary line):**
> “Entry Coins are **USDC**, a digital dollar.”

**Why they exist:**
> “They’re collected together and fairly distributed when the game ends.”

---

### 2.4 Energy Coins (XTZ)

**Primary name shown:**  
**Energy Coins**

**Explanation:**
> “Energy Coins keep the game running smoothly.”

**Truth (secondary line):**
> “Energy Coins are **XTZ**, used on Etherlink.”

**Why they exist:**
> “Some actions need a small amount of energy to be processed.”

---

### 2.5 Getting Coins (Transak)

When users are missing coins:

**Tone:**
Helpful, not urgent.

**Copy:**
> “You’re almost ready!  
> The helper can guide you to get what you need.”

**CTA:**
> **Get coins**

**Behavior:**
- Opens Transak in a new tab
- Clearly marked as external
- Explains coins will be sent to their account on Etherlink

---

## 3. Mandatory Disclaimer (First Visit)

### 3.1 Purpose
- Transparency
- Legal protection
- Trust

---

### 3.2 Behavior
- Shown on first visit
- Blocking
- Must be explicitly accepted
- Stored locally

---

### 3.3 Copy (Recommended)

**Title:**
> Before you play

**Body:**
> This platform is **experimental**.  
>  
> The rules are enforced by code that has been carefully reviewed and tested, but it has **not been officially audited yet**.  
>  
> This means unexpected things could happen.  
>  
> Please only play with amounts you are comfortable experimenting with.

**CTA:**
> **I understand — continue**

---

## 4. Page Structure Overview

### Pages
- **Home** (Dashboard)
- **All Games**
- **Game Detail**
- **My Activity**
- **Help / Info**

---

## 5. Home (Dashboard)

### 5.1 Purpose
Show what’s interesting *right now*, without overwhelming.

---

### 5.2 Sections

#### A. Happening Now
- 3–5 active games
- Chosen by activity and progress
- No urgency language

#### B. Big Prizes
- 2–3 games
- Largest prizes
- Calm presentation

#### C. Wrapping Up
- Games nearing results
- Soft language
- No aggressive countdowns

---

### 5.3 What NOT to show
- Sorting controls
- Long lists
- Finished games

---

## 6. All Games Page

### 6.1 Purpose
Give users full control and visibility.

---

### 6.2 Tabs
- **Active**
- **Finished**
- Optional: **My Games**

---

### 6.3 Sorting Options
Plain language only:
- Biggest prize
- Ending soon
- Newest
- Oldest

Users control sorting — no pressure.

---

### 6.4 Default Sorting
- Active: most relevant
- Finished: most recent results

---

## 7. Game Detail Page

### 7.1 Clarity First
Immediately answer:
- What is this?
- What can I do?
- What happens next?

---

### 7.2 State-Based Visuals

| State | Visual Feeling |
|------|----------------|
| Setting up | Calm, neutral |
| Active | Bright, inviting |
| Processing | Soft progress indication |
| Finished | Clear result |
| Closed | Clear refund / closure |

Animations must be:
- Short
- Subtle
- Never blocking

---

### 7.3 Joining a Game
- Clear “Join” button
- Shows required Entry Coins
- Shows user balance in friendly terms

---

## 8. Live Moments Feed

### 8.1 Purpose
Create excitement through **real activity**, not pressure.

---

### 8.2 Name
**Live Moments**

---

### 8.3 Events Shown (On-chain only)
- 🎉 A player just won $X
- ✨ A new game just started
- 🔔 A game finished

No purchases, no losses.

---

### 8.4 Privacy
- Partial identifiers only:
  - “Player A…92”
- Never show full addresses

---

### 8.5 Controls
- Hide / Show toggle
- User preference saved locally

---

### 8.6 Performance
- One item at a time
- Gentle fade / slide
- No sound
- No flashing

---

## 9. My Activity

### Purpose
Help users feel oriented and safe.

Shows:
- Games joined
- Games created
- Results
- Pending prizes

Clear, simple history.

---

## 10. Interaction Design

### 10.1 Micro-interactions
- Button press feedback
- Small visual confirmation on actions
- Gentle transitions

---

### 10.2 Animations
- Subtle
- Purposeful
- Never decorative-only

No:
- Heavy animations
- Continuous motion
- Performance-heavy effects

---

## 11. Sound Policy

- No sound by default
- Entire experience must work silently
- Optional sound support can be added later, muted by default

---

## 12. Trust & Safety Cues

- Clear explanations
- Clear outcomes
- Clear refunds
- Clear history

Users should always feel:
> “I understand what’s happening.”

---

## 13. UX Ethics (Hard Rules)

- No fake activity
- No fake urgency
- No deceptive wording
- No manipulation
- No pressure

Playful ≠ predatory.

---

## 14. Final UX Principle

> This platform should feel like a simple game  
> that respects the player’s intelligence, time, and money.

If something feels unclear, rushed, or aggressive — it’s wrong.

---
