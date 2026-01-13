# Smart Contracts (v1.6)

## Network
- Network: Etherlink Mainnet
- Chain ID: 42793
- Native token: XTZ (EVM native, 18 decimals)
- Explorer: https://explorer.etherlink.com

## Owner / Admin
All admin controls are held by an Etherlink Safe multisig:

- **Safe owner address:** `0xe47fF5713ea90805B75bcDD93b888e076AeD9B2B`

> Admin powers are intentionally limited (pause, oracle config gating, surplus sweep only).

---

## Contracts

### LotteryRegistry
A minimal, permanent list of raffles.

State:
- `allLotteries[]` list
- `typeIdOf[lottery]`, `creatorOf[lottery]`, `registeredAt[lottery]`
- `isRegistrar[address]`

Writes:
- `setRegistrar(registrar, bool)` (owner-only)
- `registerLottery(typeId, lottery, creator)` (registrar-only)

Notes:
- `typeId == 0` means “unregistered”.
- Only contracts can be registered (`lottery.code.length > 0`).

---

### SingleWinnerDeployer
Factory for `LotterySingleWinner` instances.

Config (mutable via Safe):
- `usdc`, `entropy`, `entropyProvider`, `feeRecipient`, `protocolFeePercent`

Writes:
- `createSingleWinnerLottery(...)`
- `setConfig(...)` (owner-only)
- `rescueRegistration(lotteryAddr, creator)` (owner-only)
- `transferOwnership(...)` (owner-only)

Creation flow:
1. require deployer is an authorized registrar: `registry.isRegistrar(address(this))`
2. deploy new `LotterySingleWinner(params)`
3. transfer winningPot USDC from creator → lottery
4. call `lottery.confirmFunding()` (only deployer can)
5. transfer lottery ownership to Safe
6. emit `LotteryDeployed(...)`
7. try to register in registry; on failure emit `RegistrationFailed(...)`

---

### LotterySingleWinner
One raffle instance.

#### Status machine
- `FundingPending` → `Open` → `Drawing` → `Completed`
- `Open` → `Canceled`
- `Drawing` → `Canceled` (via `forceCancelStuck()` after delay)

#### Funding
`confirmFunding()`:
- caller must be `deployer`
- requires `usdc.balanceOf(this) >= winningPot` (accepts extra dust)
- sets `totalReservedUSDC = winningPot`
- moves to `Open`

#### Buying tickets
`buyTickets(count)`:
- only `Open` and before `deadline`
- creator cannot buy
- enforces batch caps + minPurchaseAmount + ticket caps
- stores tickets as ranges (`TicketRange{buyer, upperBound}`)

Security:
- state updated before transfer (CEI)
- checks USDC balance delta after `safeTransferFrom` to prevent “ghost tickets”

#### Finalize / Draw
`finalize()` payable:
- allowed if `status == Open` AND (expired OR sold-out) AND no request pending
- if expired and `sold < minTickets`: cancels and refunds msg.value (or allocates claimableNative)
- else requests entropy and enters `Drawing`

Randomness callback:
- verifies entropy contract, request id, provider, and `Drawing` status
- winner = `rand % soldAtDrawing`
- allocates claimables:
  - winner prize = `winningPot - feePot`
  - creator revenue = `ticketRevenue - feeRev`
  - protocol fees = `feePot + feeRev` to `feeRecipient`

#### Refunds
If canceled:
- creator pot refund is allocated once to `claimableFunds[creator]`
- players call `claimTicketRefund()` then `withdrawFunds()`

#### Withdrawals
- `withdrawFunds()` transfers USDC claimable, decrements `totalReservedUSDC`
- `withdrawNative()` / `withdrawNativeTo(to)` transfers native claimable, decrements `totalClaimableNative`

#### Admin controls (Safe)
- pause/unpause
- set entropy provider/contract **only when `activeDrawings == 0`**
- sweep USDC/native surplus (only above liabilities)

---

## Protocol fees
- `protocolFeePercent` is an integer percent (0–20).
- `feeRecipient` is an address.
- Both are **immutable per raffle instance** (set at deployment).
- The deployer’s config only affects **new raffles**.