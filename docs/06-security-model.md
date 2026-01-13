# Ppopgi (뽑기) — Security & Trust Model

This document explains how **security, trust, and permissions** are handled in Ppopgi (뽑기).

The goal of this project is **trust through design**, not trust through promises.  
All important guarantees are enforced by smart contracts and are verifiable on-chain.

This document is intentionally explicit about:
- what the system guarantees
- what it does not guarantee
- where trust assumptions still exist

---

## Core principle

> **No single person — including the admin — can drain funds, change outcomes, or interfere with a raffle once it is live.**

User funds are protected by:
- immutable contract parameters
- strict state transitions
- permissionless actions
- pull-based withdrawals

Not by operator goodwill.

---

## Threat model (high-level)

Ppopgi assumes:
- adversarial users
- potentially unreliable infrastructure
- honest-but-fallible operators
- public, adversarial mempools

Ppopgi does **not** assume:
- trusted frontends
- trusted bots
- trusted admins
- private execution environments

---

## What the admin / owner can do

The admin (an Etherlink Safe) can:

- deploy new raffle contracts
- configure defaults for **future** raffles
- pause or update off-chain services (frontend, bot)
- recover tokens accidentally sent to the **deployer contract**
- upgrade operational processes off-chain

The admin **cannot**:
- modify live raffles
- interfere with ticket sales
- change prices, deadlines, or caps
- influence randomness
- select or block winners
- withdraw user funds

---

## What the admin / owner cannot do (once a raffle is live)

Once a raffle has opened, the admin cannot:

- ❌ change the prize amount
- ❌ change ticket price
- ❌ change min/max ticket counts
- ❌ extend or shorten deadlines
- ❌ cancel a valid raffle arbitrarily
- ❌ change protocol fees
- ❌ confiscate tickets
- ❌ block refunds
- ❌ move USDC out of the contract

All of these properties are enforced by code.

---

## Randomness model

Ppopgi uses an external on-chain randomness provider (**Entropy**) to select winners.

### How randomness works
- When `finalize()` is called, the raffle requests randomness from Entropy.
- Entropy later calls back with a random value.
- The contract deterministically derives a winning ticket index.
- The ticket ranges map that index to a winning address.

### Trust assumptions
- The unpredictability of outcomes depends on the Entropy provider.
- The provider is assumed to be economically and cryptographically secure.
- The admin cannot influence or replace the randomness provider for an existing raffle.

### What randomness does NOT protect against
- Delayed fulfillment by the provider
- Temporary unavailability of the provider
- Network congestion delaying callbacks

These scenarios delay settlement but do **not** allow fund theft or outcome manipulation.

---

## Finalization & entropy fees

### Who can finalize
- **Anyone** can call `finalize()`
- No special permissions are required
- Bots are purely a convenience

### Why `finalize()` is payable
- Randomness requires paying an Entropy fee in native token.
- The caller must send enough native token to cover this fee.

### Fee handling guarantees
- Overpayment is refunded automatically.
- If an automatic refund fails, the amount becomes withdrawable.
- If the raffle cancels due to insufficient ticket sales, any entropy fee sent is returned.

---

## Cancellation & refunds

A raffle is cancelled if:
- it reaches its expiry
- and the minimum number of tickets was not sold

In this case:
- all ticket purchases become refundable
- no winner is selected
- the prize pot remains untouched
- refunds are claimable on-chain by users

Cancellation is deterministic and cannot be blocked by the admin.

---

## Withdrawal & claim safety

All payouts use a **pull-based** model:
- users must explicitly claim their funds
- the contract never pushes funds automatically

This prevents:
- reentrancy risks
- forced transfers
- dependency on recipient behavior

Claims are:
- idempotent
- non-custodial
- fully enforced on-chain

---

## Frontend & bot trust assumptions

The frontend:
- cannot custody funds
- cannot change outcomes
- cannot block claims

The finalizer bot:
- has no special permissions
- can be replaced by anyone
- does not introduce trust assumptions

If both disappear, the system still functions.

---

## Known limitations & non-goals

Ppopgi does **not** attempt to:
- hide that raffles are games of chance
- guarantee profit or fairness beyond randomness
- eliminate all external dependencies
- optimize for maximal throughput or revenue

Instead, it prioritizes:
- clarity
- auditability
- constrained behavior
- user safety

---

## Final note

Ppopgi’s security model is intentionally conservative.

It does not promise perfection —  
it promises **honest rules, visible risks, and enforceable guarantees**.

Everything else is left to user choice.