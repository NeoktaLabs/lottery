# Security Model

## Threat assumptions
- Frontend can disappear
- Bot can stop
- Admin keys can be compromised

## Protections
- Funds are locked in immutable contracts
- Withdrawals are user-initiated
- Randomness is externally verifiable
- No admin withdrawal functions exist

## Emergency paths
- Raffles can be canceled if randomness callbacks fail
- Refunds are always pull-based