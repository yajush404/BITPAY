# ⚡️ BitPay

[![CI](https://github.com/yajush404/BITPAY/actions/workflows/ci.yml/badge.svg)](https://github.com/yajush404/BITPAY/actions/workflows/ci.yml)

BitPay is a high-performance, decentralized finance (DeFi) platform built on the **Stellar Soroban** smart contract ecosystem. Experience secure, swift, and low-cost payments and asset swaps with a premium, motion-rich interface.

**🌐 Live Demo:** [https://bitpay-demo.vercel.app](https://bitpay-demo.vercel.app)

---

## 🏦 Dashboard Preview

![Dashboard Preview](public/assets/dashboard.png)

---

## ✨ Core Features

### 🔄 Instant Swaps
Swap between XLM and BIT tokens instantly using our automated market maker (AMM) pools. Powered by Soroban's efficient smart contract execution.

### 💧 Liquidity Pools
Provide liquidity to the protocol and earn a share of every swap fee. Our dynamic APY engine ensures competitive rewards for LPs.

### 📊 Portfolio Tracking
Monitor your XLM and BIT balances in real-time with a modern dark-mode dashboard and live on-chain event feed.

### 🔐 Trustline Management
Add and manage Stellar trustlines directly from the app. The on-chain asset code is `AGT` (deployed name); displayed as **BIT** throughout the UI.

---

## 📱 Mobile Responsive View

![Mobile View](public/assets/mobile-view.png)

---

## 📜 Smart Contracts (Stellar Testnet)

| Contract | Address |
| :--- | :--- |
| **Liquidity Pool** | [`CCQZXG3QGFPLRS6LJJ4XALJGUGVNLISYN6BJSVOH57ED6FYJH7KGKXAR`](https://stellar.expert/explorer/testnet/contract/CCQZXG3QGFPLRS6LJJ4XALJGUGVNLISYN6BJSVOH57ED6FYJH7KGKXAR) |
| **Protocol Token (SAC)** | [`CCHLK4RHSS27U4K6VRIP6QW2N5IGBJJES4GA4CI3RRUGP54G4FH5HL7P`](https://stellar.expert/explorer/testnet/contract/CCHLK4RHSS27U4K6VRIP6QW2N5IGBJJES4GA4CI3RRUGP54G4FH5HL7P) |
| **Bridge Contract** | [`CBMGE6BSHIGBXAUMW32D542POCBMI3DHP7ZZGI6RTGPRECJQA3S5ZFDI`](https://stellar.expert/explorer/testnet/contract/CBMGE6BSHIGBXAUMW32D542POCBMI3DHP7ZZGI6RTGPRECJQA3S5ZFDI) |
| **Token Issuer** | [`GBALPCSLWTTOVYUJ35KSDBOQETFDFAGKMQOYN76OWLY7QCIHLQUHINBS`](https://stellar.expert/explorer/testnet/account/GBALPCSLWTTOVYUJ35KSDBOQETFDFAGKMQOYN76OWLY7QCIHLQUHINBS) |

**On-chain Asset:** `AGT:GBALPCSLWTTOVYUJ35KSDBOQETFDFAGKMQOYN76OWLY7QCIHLQUHINBS` (branded as **BIT** in the UI)

**Deployment Transaction Hash:** [`6bf10b777a1fc6c986eb1626f6345ecb72183c220f8ccda04f5e71415df8cd6a`](https://stellar.expert/explorer/testnet/tx/6bf10b777a1fc6c986eb1626f6345ecb72183c220f8ccda04f5e71415df8cd6a)

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript |
| **Styling** | Vanilla CSS, Framer Motion |
| **Blockchain** | Stellar Soroban (Rust Smart Contracts) |
| **Wallet** | Freighter API v6+ |
| **Data Fetching** | SWR (Real-time Polling) |
| **Deployment** | Vercel |

---

## 📦 Project Structure

```bash
├── contracts/
│   ├── protocol-token/   # BIT Token (AGT SAC Wrapper) — Rust
│   ├── liquidity-pool/   # AMM Pool Contract — Rust
│   └── bridge/           # Cross-contract Bridge — Rust
├── frontend/             # Next.js Application
│   ├── app/              # Pages & API Routes
│   ├── components/       # UI Components
│   ├── hooks/            # Blockchain Hooks (SWR + Freighter)
│   └── lib/              # Soroban Client, Design System
├── public/assets/        # Screenshots & Branding
├── scripts/              # Deployment & Trustline Scripts
└── .github/workflows/    # CI/CD Pipeline
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Freighter Wallet](https://freighter.app) browser extension
- Stellar testnet account with XLM (use [Friendbot](https://laboratory.stellar.org/#account-creator?network=test))

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp frontend/.env.example frontend/.env.local
# Fill in your values in .env.local

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Adding a Trustline
To interact with the protocol, add a trustline to the **AGT** asset (`GBALPCSLWTTOVYUJ35KSDBOQETFDFAGKMQOYN76OWLY7QCIHLQUHINBS`) via the Dashboard, or use the in-app button.

---

## 🔐 Security & Reliability

- **SAC Integration**: Uses Stellar Asset Contract wrappers for seamless classic asset integration.
- **Fail-safe Build**: Production-hardened build with fallback contract ID validation.
- **Type-Safe**: Full TypeScript implementation across the entire frontend.
- **Server-side Signing**: Admin mint operations are signed server-side, never exposing secrets to the client.

---

Built with ❤️ for the Stellar Community.
