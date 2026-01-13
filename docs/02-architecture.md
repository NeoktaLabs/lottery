# Ppopgi (뽑기) — Architecture

This document describes **how all parts of Ppopgi fit together**, both on-chain and off-chain.

The architecture is intentionally:
- simple
- modular
- verifiable
- resistant to central points of failure

---

## High-level architecture

```mermaid
flowchart LR
  subgraph Users
    U[Players / Creators]
    S[Safe Admin]
  end

  subgraph Frontend
    FE[Ppopgi Web UI]
  end

  subgraph OnChain[Etherlink Mainnet]
    R[LotteryRegistry]
    D[SingleWinnerDeployer]
    L[LotterySingleWinner<br/>(many instances)]
    USDC[(USDC ERC20)]
    E[Pyth Entropy]
  end

  subgraph OffChain[Optional Off-chain]
    BOT[Finalizer Bot]
    IDX[Indexing Layer<br/>(optional)]
  end

  U --> FE
  S --> FE

  FE --> R
  FE --> D
  FE --> L

  D --> L
  D --> R

  L --> USDC
  L --> E
  E --> L

  BOT --> R
  BOT --> L

  IDX --> R
  IDX --> D
  IDX --> L