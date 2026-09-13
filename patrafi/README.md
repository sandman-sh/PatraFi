<div align="center">

# PatraFi Web3 DApp

### *High-Conviction Institutional Interface for Creditcoin CC3*

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Ethers](https://img.shields.io/badge/Ethers.js-v6-2535a0?style=flat-square)](https://docs.ethers.org)

</div>

---

## 🌟 Overview

The PatraFi Frontend DApp provides an institutional-grade, high-contrast Web3 interface for sovereign cross-chain credit underwriting and liquidation protection on Creditcoin CC3 EVM (`Chain ID: 102031`) and Ethereum Sepolia.

### Key Capabilities
- **Pātratā Credit Scoring**: Real-time evaluation of wallet transaction volume, asset depth, and repayment history across connected RPCs.
- **Credit Line Origination**: Cryptographically signs EIP-191 loan terms and registers orders directly on `ASCLoanManager.sol`.
- **CC3 Loan Inspector**: Real-time query and status monitor for on-chain loan orders (`Registered`, `Disbursed`, `Repaid`).
- **Precompile Attestation Stream**: Live Substrate consensus feed capturing cross-chain block inclusion proofs verified via native precompile `0x0FD2`.
- **FlashShield Solvency Interceptor**: Real-time health factor monitor and autonomous liquidation protection system.

---

## 🚀 Quickstart

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

The application runs locally on `http://localhost:5173`.

---

## 📐 Design Tokens & Aesthetics

- **Surfaces**: Obsidian Deep Slate (`#060d09`), Frosted Card Surface (`rgba(13, 27, 20, 0.72)`)
- **Accents**: Neon Lime (`#bbfb3b`), Emerald Solvency (`#10b981`), Cyber Cyan (`#38bdf8`)
- **Typography**: Space Grotesk (Numerical metrics & hashes), Outfit (Display & headings), Plus Jakarta Sans (Body)
