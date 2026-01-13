# Frontend

The Ppopgi frontend is a **stateless interface**.

It:
- reads on-chain data
- submits user transactions
- never stores user funds
- never simulates activity

If the frontend goes offline, users can still:
- buy tickets
- finalize raffles
- withdraw funds
using any Ethereum-compatible tool.

### Verified badge
Raffles created via the official deployer are marked as **Verified**.
This means:
- deployed using audited code
- registered in the official registry
- owned by the protocol Safe

Unverified raffles may still be valid but were created externally.