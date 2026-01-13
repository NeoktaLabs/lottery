# Architecture

Ppopgi is composed of three on-chain/off-chain layers:

## 1. LotteryRegistry (on-chain)
A permanent registry that indexes all lotteries created via approved deployers.
This provides a single source of truth for discovery.

## 2. SingleWinnerDeployer (on-chain)
A factory contract that deploys individual lottery instances.
Each instance is owned by a Safe multisig and contains immutable parameters.

## 3. LotterySingleWinner (on-chain)
A single raffle instance:
- ticket sales
- randomness request
- prize allocation
- refunds if canceled

## 4. Frontend (off-chain)
A read/write interface that mirrors on-chain state exactly.
The frontend does not introduce any extra logic.

## 5. Finalizer Bot (off-chain)
A permissionless automation bot that ensures raffles are finalized or canceled
when eligible, improving UX without changing trust assumptions.