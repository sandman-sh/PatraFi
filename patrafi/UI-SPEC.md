# UI Design Contract: PatraFi Professional Fintech UI (UI-SPEC)

## 1. Design Philosophy & Brand Direction
PatraFi is a high-conviction, sovereign cross-chain credit underwriting and liquidation shield protocol on Creditcoin CC3 and Sepolia.
The UI combines the institutional elegance of **Linear and Stripe Treasury** with the decentralized transparency of **Uniswap and Moody's credit analytics**.

---

## 2. Design Tokens & Color Palette

### Base Surfaces
- `--bg-base`: `#060d09` (Deep obsidian slate)
- `--bg-surface-elevated`: `#0a150f` (Layer 1 elevation)
- `--bg-surface-card`: `rgba(13, 27, 20, 0.72)` (Frost card surface)
- `--bg-surface-glass-hover`: `rgba(18, 38, 28, 0.85)`
- `--bg-glass-panel`: `rgba(7, 20, 14, 0.85)`

### Accents & Semantic Signals
- `--lime-primary`: `#bbfb3b` (Primary data & focus highlight)
- `--lime-hover`: `#c8ff4a`
- `--lime-subtle`: `rgba(187, 251, 59, 0.08)`
- `--lime-border`: `rgba(187, 251, 59, 0.16)`
- `--lime-border-glow`: `rgba(187, 251, 59, 0.38)`
- `--emerald-verified`: `#10b981` (On-chain verified / solvency passed)
- `--amber-warning`: `#f59e0b` (Rescue threshold / health factor warning)
- `--red-alert`: `#ef4444` (Liquidation vulnerability)
- `--blue-shield`: `#38bdf8` (Flash-shield active absorption)

### Typography & Content
- `--text-primary`: `#ffffff` (Headings, primary values)
- `--text-secondary`: `#cbd5e1` (Subtitles, labels, descriptions)
- `--text-muted`: `#94a3b8` (Timestamps, hashes, micro-metadata)
- `--text-accent`: `#bbfb3b` (Metric values, active tabs)

### Borders & Shadows
- `--border-hairline`: `1px solid rgba(255, 255, 255, 0.07)`
- `--border-glass`: `1px solid rgba(187, 251, 59, 0.14)`
- `--border-glass-active`: `1px solid rgba(187, 251, 59, 0.45)`
- `--shadow-card`: `0 12px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)`
- `--shadow-glow-lime`: `0 0 28px rgba(187, 251, 59, 0.15)`

---

## 3. Typography Hierarchy

| Level | Font Family | Size | Weight | Tracking | Purpose |
|---|---|---|---|---|---|
| **Display 1** | Outfit | `clamp(2.5rem, 5vw, 3.8rem)` | 800 | `-0.035em` | Hero heading |
| **Heading 2** | Outfit | `2.2rem` | 700 | `-0.025em` | Section headers |
| **Heading 3** | Outfit | `1.35rem` | 700 | `-0.02em` | Card titles |
| **Heading 4** | Outfit | `1.1rem` | 600 | `-0.01em` | Metric titles |
| **Numeric Large** | Space Grotesk | `2.8rem - 3.6rem` | 800 | `-0.03em` | Pātratā Score, Health Factor |
| **Numeric Metric** | Space Grotesk | `1.25rem - 1.5rem` | 700 | `tabular-nums` | Balances, LTV, APR, Amounts |
| **Body Large** | Plus Jakarta Sans | `1.05rem` | 400/500 | `normal` | Hero subtitles, summaries |
| **Body Regular** | Plus Jakarta Sans | `0.9rem` | 400/500 | `normal` | Descriptions, explanatory text |
| **Caption / Code** | Space Grotesk / Mono | `0.75rem - 0.82rem` | 500/600 | `0.02em` | Hashes, block heights, chips |

---

## 4. Component Design Contracts

### Buttons
- **Primary Pill (`.btn-lime`)**: Height 44px, padding 0 24px, border-radius 9999px. Lime background `#bbfb3b`, text `#071911`, font Outfit 700, icon gap 8px. Hover: subtle scale up (1.02), glow lift.
- **Secondary Dark (`.btn-dark`)**: Height 44px, padding 0 22px, border-radius 9999px. Deep slate background with 1px lime border. Text `#ffffff`. Hover: border brightens to lime, text `#bbfb3b`.
- **Icon Action Circle (`.btn-circle`)**: 40x40px circle, centered icon, smooth hover rotation/scale.

### Glass Cards (`.card-glass`)
- Backdrops with `backdrop-filter: blur(20px)` and `border: 1px solid var(--lime-border)`.
- Replaced the jarring light cream card with **Titanium Glass**: subtle frosted slate with polished silver/lime highlights and high contrast text.

### Interactive Controls
- **Precision Sliders**: 6px track `#0e2a1d`, 20px glowing lime thumb with concentric rings, zero jittering on drag.
- **Tab Selectors (Days / Wallets)**: Pill tabs with active state background and border transition.
- **Code Terminal**: Rich console styling with syntax highlighted events (Source &rarr; Proof &rarr; Precompile &rarr; State).

---

## 5. Copywriting & Communication Contract

| Surface | State | Copy |
|---|---|---|
| Attestation Stream | Active | Live continuous feed of verified foreign repayments |
| Score Engine | Unsearched / Sample | "Analyzing RPC records across Creditcoin CC3 and Sepolia..." |
| Score Engine | Evaluated (Supatra) | "Super-Prime Sovereign Credit Verified (95% Max LTV)" |
| Loan Console | Ready to Sign | "Sign & Register CC3 Loan Order ({amount} tCTC)" |
| Loan Console | Signed | "Loan Order Cryptographically Signed! Ready for funding disbursement" |
| Flash-Shield | Safe | "Invulnerable (Shield Armed & Synchronized)" |
| Flash-Shield | Warning (<1.15x) | "Flash-Shield Intervention Active: Emergency Solvency Dispatched via 0x0FD2" |

---

## 6. UI Considerations & State Coverage

- **Wallet Disconnected**: Navbar shows prominent Connect Wallet button; Loan Console shows Connect Wallet action prompt before signing; Score Engine defaults to high-reputation sample wallet so user experiences the full UI without friction.
- **Wrong Network**: Navbar displays amber "Switch to CC3" button with 1-click network switcher.
- **RPC Polling**: Subtle pulsing green live indicator showing live block heights for Creditcoin CC3 and Sepolia.
- **Interactive Dragging**: Real-time numerical feedback with zero layout shift during slider scrubbing.
