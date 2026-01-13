# Finalizer Bot

The Finalizer Bot ensures raffle liveness.

It runs every minute and:
- scans the registry
- detects eligible raffles
- calls `finalize()` when allowed

### Important notes
- Anyone can finalize raffles manually
- The bot has no special permissions
- It cannot change outcomes
- It only improves user experience

The bot uses:
- strict simulation before sending transactions
- idempotency locks to avoid fee waste
- exact entropy fee payments