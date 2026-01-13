# Ppopgi (뽑기) — Overview

Ppopgi is an on-chain raffle platform deployed on **Etherlink Mainnet (Tezos L2, EVM)**.

The system is designed to be:
- **Transparent:** on-chain truth only (no synthetic winners, no fake activity)
- **Permissionless:** anyone can participate and anyone can finalize when eligible
- **Non-custodial:** user funds remain in smart contracts and are withdrawn via pull-based claims
- **Verifiable:** randomness comes from **Pyth Entropy** and outcomes are verifiable on-chain

## What Ppopgi is (v1)
A single-winner raffle:
- players buy USDC tickets
- when the raffle ends (deadline or sold-out), randomness is requested
- one ticket wins
- prize, creator revenue, and protocol fees become **claimable balances**
- users withdraw their own funds (no push payouts)

## Components
- **LotteryRegistry (forever contract):** permanent index of raffles
- **SingleWinnerDeployer (factory):** deploys and registers raffle instances
- **LotterySingleWinner (instance):** one raffle = one contract
- **Frontend:** a UI that maps 1:1 to on-chain state
- **Finalizer bot (optional):** improves UX by finalizing/canceling eligible raffles

## Trust boundary
The protocol remains usable even if:
- the frontend disappears
- the finalizer bot stops
- the team stops maintaining servers

Users can interact directly with contracts using any EVM tool.