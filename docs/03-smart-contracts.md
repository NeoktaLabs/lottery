# Smart Contracts — Deep Technical Documentation

This document provides a **complete and transparent description** of the Ppopgi (뽑기) smart contracts deployed on **Etherlink (Tezos L2, EVM-compatible)**.

It explains:
- what each contract is responsible for
- how funds are handled
- what each function does
- who can call what
- how state transitions work
- which invariants are enforced
- what limitations and tradeoffs exist

The goal is **verifiability, not obscurity**.

All critical behavior is enforced on-chain and visible in code.

---

## Contract overview

The system consists of three core contracts:

1. `LotteryRegistry`
2. `SingleWinnerDeployer`
3. `LotterySingleWinner`

Each serves a narrowly defined role.

---

## 1. `LotteryRegistry`

A minimal on-chain registry of “approved” raffle contracts.

### Purpose
- Acts as a canonical list of deployed raffle contracts
- Allows the frontend to discover raffles without indexing arbitrary addresses
- Prevents spam by restricting who can register lotteries

### Key state
- `owner`: admin address (owned by an Etherlink Safe)
- `registrars`: mapping of authorized factories/deployers
- `registered`: mapping of lottery address → metadata

### Permissions
- The owner can authorize or revoke registrars
- Authorized registrars can register new lotteries

---

### Functions

#### `setRegistrar(address registrar, bool allowed)` (owner-only)
Authorizes or revokes a deployer’s ability to register lotteries.

Effects:
- Updates `registrars[registrar]`

Emits:
- `RegistrarSet(registrar, allowed)`

---

#### `registerLottery(uint256 typeId, address lottery, address creator)`
Registers a lottery in the registry.

Requirements:
- caller is an authorized registrar **or** explicitly allowed by the owner
- `lottery` is not already registered

Effects:
- Stores lottery metadata
- Emits an event used by the frontend and indexers

Emits:
- `LotteryRegistered(typeId, lottery, creator)`

---

## 2. `SingleWinnerDeployer`

Factory contract responsible for deploying and initializing `LotterySingleWinner` instances.

### Purpose
- Deploys new raffle contracts
- Transfers the prize pot into the raffle
- Calls `confirmFunding()` so the raffle can open
- Optionally registers the raffle in `LotteryRegistry`

### Key state
- `owner`: admin (Etherlink Safe)
- `registry`: `LotteryRegistry` address
- `usdc`: ERC20 USDC token address
- `entropy`: Entropy contract address
- `entropyProvider`: randomness provider address
- `feeRecipient`: protocol fee recipient
- `protocolFeePercent`: **default** protocol fee percentage for newly deployed lotteries

> ⚠️ Note  
> `protocolFeePercent` is mutable **only at the deployer level** and only affects **future lotteries**.  
> Each deployed `LotterySingleWinner` stores its own **immutable copy**.

---

### Functions

#### `createSingleWinnerLottery(...)`

Deploys and activates a new single-winner raffle.

High-level flow:
1. Checks caller is an authorized registrar
2. Deploys a new `LotterySingleWinner`
3. Transfers the prize pot (USDC) from the creator to the raffle
4. Calls `confirmFunding()` on the raffle
5. Transfers ownership of the raffle to the Safe
6. Attempts to register the raffle in `LotteryRegistry`

If registration fails:
- the raffle still exists and functions normally
- a `RegistrationFailed` event is emitted

Emits:
- `LotteryDeployed(lottery, creator)`

---

#### `setConfig(...)` (owner-only)
Updates deployer defaults for **future lotteries only**.

Does NOT affect existing raffles.

---

#### `rescueERC20(address token, address to, uint256 amount)` (owner-only)
Emergency token rescue for the deployer contract itself.

Does NOT affect deployed raffles.

---

## 3. `LotterySingleWinner`

The primary raffle contract.

Each instance represents **one raffle with exactly one winner**.

### Purpose
- Holds the prize pot in USDC
- Sells tickets in USDC
- Enforces caps, deadlines, and validation rules
- Requests randomness via Entropy
- Selects one winning ticket
- Allocates claimable balances
- Supports cancellation and refunds if requirements are not met

---

## Lifecycle

A raffle progresses through the following conceptual states:

1. **FundingPending**
2. **Open**
3. **Drawing**
4. **Settled**
5. **Cancelled**

State transitions are strictly enforced.

---

## Funds model

There are three distinct USDC pools:

1. **Prize pot**
   - Pre-funded by the creator
   - Locked until settlement

2. **Ticket revenue**
   - Paid by entrants
   - Distributed at settlement or refunded on cancellation

3. **Protocol fee**
   - Carved out at settlement
   - Claimable by the protocol fee recipient

USDC **never leaves the contract** except via explicit on-chain claims.

---

## Core invariants

- The prize pot must be funded before the raffle opens
- Ticket price, caps, and deadlines are immutable
- Randomness is requested exactly once
- Ticket count is frozen before randomness
- Refunds are always available if the raffle is cancelled
- Winner selection is deterministic from entropy output and ticket ranges

---

## Key functions

### `confirmFunding()`

Finalizes setup after prize funding.

Requirements:
- USDC balance must be **at least** the prize amount (`balance ≥ winningPot`)

> Extra USDC sent before confirmation does **not** brick the raffle.

Effects:
- Transitions state from `FundingPending` → `Open`

---

### `buyTickets(uint256 count)`

Allows users to purchase tickets.

Requirements:
- raffle is `Open`
- raffle not expired
- caller is not the creator
- `count > 0`
- total tickets sold + `count` ≤ `maxTickets`
- per-wallet cap respected (if configured)

#### Anti-spam rule (important)
If the buyer is **not extending the latest ticket range**,  
the **total purchase cost must be ≥ 1 USDC** (USDC has 6 decimals).

This prevents griefing via tiny fragmented ticket ranges.

Effects:
- ticket ranges are appended or extended
- `totalReservedUSDC` increases

---

### `finalize()` (payable)

Triggers winner selection or cancellation.

#### Entropy fee
- Caller must send enough native token to cover  
  `entropy.getFee(entropyProvider)`
- `msg.value` must be **≥ required fee**
- Overpayment is refunded immediately
- If a refund fails, the amount becomes withdrawable via `withdrawNative()`

#### Behavior
If **expired** and `ticketsSold < minTickets`:
- raffle is cancelled
- ticket refunds are allocated
- any entropy fee sent is returned

Otherwise:
- transitions to `Drawing`
- requests randomness
- freezes ticket count

---

### `entropyCallback(...)`

Receives randomness from Entropy.

Requirements:
- callable only by the Entropy contract
- state must be `Drawing`

Effects:
- derives winning ticket index
- resolves winning address via ticket ranges
- allocates claimable balances
- transitions to `Settled`

---

### `claimUSDC()`

Allows participants to claim their USDC.

Possible claimants:
- winner (prize)
- creator (ticket revenue minus protocol fee)
- protocol (fee)
- entrants (refunds if cancelled)

Claims are pull-based and idempotent.

---

### `withdrawNative()` / `withdrawNativeTo(address to)`

Withdraws refundable native token (typically from entropy overpayment refunds).

---

## Security & transparency notes

- No admin can change outcomes
- No admin can drain funds
- No backend can override results
- All critical logic is enforced by code

Every important action:
- emits events
- leaves an on-chain audit trail
- can be verified independently

---

## Final note

These contracts were designed with:
- clarity over cleverness
- safety over flexibility
- explicit rules over implicit behavior

If something feels unclear,  
it should be documented — not hidden.