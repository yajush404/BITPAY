# Contributing to BitPay

We welcome contributions! Please follow these steps:

1.  **Create a feature branch** for your changes.
2.  **Ensure you have Soroban CLI** installed.
3.  **Run tests** before finalizing: `make test`.
4.  **Format your code**: Use `cargo fmt` for Rust and `npm run format` for the frontend.
5.  **Review your changes** and merge them into the local main branch.

## Development Setup

-   `make build-contracts`: Compiles the Soroban contracts.
-   `cd frontend && npm run dev`: Starts the Next.js development server.
-   `scripts/deploy.js`: Deploys the protocol to Testnet.
