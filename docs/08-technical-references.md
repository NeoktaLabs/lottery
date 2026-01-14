# Ppopgi (뽑기) — Technical References & Addresses

## 1. Purpose

This document acts as the **single source of truth** for all technical references used in the Ppopgi project.

It centralizes:
- wallet addresses
- smart contract addresses
- network configuration
- external dependencies
- infrastructure endpoints

This file is meant to be:
- transparent
- easy to audit
- easy to update
- human-readable

When an address is not yet finalized, it is explicitly marked as **TBD**.

> This document is factual and referential.  
> Security properties, invariants, and trust assumptions are described in  
> `06-security-model.md`.

---

## 2. Network Information

| Item | Value |
|----|------|
| Network | Etherlink Mainnet |
| Chain ID | `42793` |
| Native Token | XTZ |
| Execution Model | EVM-compatible |
| Block Explorer | https://explorer.etherlink.com |

---

## 3. Ownership & Governance

### 3.1 Safe (Protocol Owner)

| Role | Address | Notes |
|----|-------|------|
| Safe Owner (Multisig) | `0xe47fF5713ea90805B75bcDD93b888e076AeD9B2B` | Currently single signer |
| Additional Signers | TBD | To be added if project grows |

> The Safe owns the Registry, Deployer, and all deployed raffles.

---

### 3.2 Fee Recipient

| Item | Address | Notes |
|----|--------|------|
| Protocol Fee Recipient | TBD | External treasury wallet |

> Fee recipient is **immutable per raffle instance**.

---

## 4. Smart Contract Addresses

### 4.1 Core Contracts

| Contract | Address | Status |
|--------|---------|--------|
| LotteryRegistry | `0xE26d8B29d116540C7B181389D8e5a4990E41BcB5` | Deployed |
| SingleWinnerDeployer | `0x6ce44c2c89779F8f20deB1435B99a96d29Cd21C3` | Deployed |

---

### 4.2 Raffle Contracts

| Item | Address | Notes |
|----|--------|------|
| LotterySingleWinner (Template) | Embedded in Deployer | EVM bytecode |
| Deployed Raffles | Dynamic | One contract per raffle |

> Raffle instances are deployed dynamically and listed via the registry.

Each raffle contract:
- holds its own funds
- enforces its own rules
- maintains independent accounting
- may sweep **surplus funds only** when allowed by on-chain accounting invariants

---

## 5. Token & Oracle Addresses

### 5.1 Tokens

| Token | Address | Decimals |
|-----|--------|----------|
| USDC (Bridged) | `0x796Ea11Fa2dD751eD01b53C372fFDB4AAa8f00F9` | 6 |
| XTZ (Native) | Native | 18 |

---

### 5.2 Randomness (Pyth Entropy)

| Item | Address | Notes |
|----|--------|------|
| Entropy Contract | `0x2880aB155794e7179c9eE2e38200202908C17B43` | Verify before deployment |
| Entropy Provider | `0x52DeaA1c84233F7bb8C8A45baeDE41091c616506` | Default provider |

---

## 6. Frontend Configuration

### 6.1 Hosting

| Item | Value |
|----|------|
| Hosting Provider | Cloudflare Pages |
| Framework | React + Vite |
| Backend | None |

---

### 6.2 Frontend Environment Variables

| Variable | Purpose | Value |
|--------|--------|------|
| `VITE_CHAIN_ID` | Network enforcement | `42793` |
| `VITE_REGISTRY_ADDRESS` | Registry contract | See section 4 |
| `VITE_DEPLOYER_ADDRESS` | Factory contract | See section 4 |
| `VITE_WC_PROJECT_ID` | WalletConnect | TBD |

---

## 7. Finalizer Bot Configuration

### 7.1 Hosting

| Item | Value |
|----|------|
| Platform | Cloudflare Workers |
| Trigger | Cron (`* * * * *`) |
| State Storage | Cloudflare KV |

---

### 7.2 Bot Wallet

| Item | Address | Notes |
|----|--------|------|
| Bot Hot Wallet | TBD | Holds minimal XTZ |
| Private Key Storage | Cloudflare Secret | Never committed |

---

### 7.3 Bot Environment Variables

| Variable | Purpose | Value |
|--------|--------|------|
| `BOT_PRIVATE_KEY` | Bot signing key | Secret |
| `REGISTRY_ADDRESS` | Registry | See section 4 |
| `RPC_URL` | Etherlink RPC | `https://node.mainnet.etherlink.com` |
| `HOT_SIZE` | Hot scan window | `100` |
| `COLD_SIZE` | Cold scan window | `50` |
| `MAX_TX` | Max tx per run | `5–10` |
| `ATTEMPT_TTL_SEC` | Idempotency TTL | `600` |

---

## 8. Infrastructure & External Services

| Service | Provider | Notes |
|------|----------|------|
| RPC | Etherlink | Public RPC |
| Hosting | Cloudflare | Pages + Workers |
| Wallet Connect | WalletConnect | Project ID TBD |
| Oracle | Pyth Network | Entropy randomness |

---

## 9. Known TBD Items

The following items are intentionally left blank and must be filled manually:

- Protocol fee recipient address
- Bot wallet address
- WalletConnect Project ID
- Additional Safe signers
- Future raffle type deployers

---

## 10. Change Log

| Date | Change |
|----|-------|
| TBD | Initial creation |

---

## 11. Final Notes

This document is expected to evolve over time.

All updates should:
- be committed publicly
- reference deployment transactions when applicable
- preserve historical accuracy

Transparency is a core goal of the project.