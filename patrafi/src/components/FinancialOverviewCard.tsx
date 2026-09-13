import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck, DollarSign, Activity, Layers, Wallet, CheckCircle2, TrendingUp } from 'lucide-react';
import type { WalletState } from '../services/web3Service';

interface DonutSegment {
  name: string;
  percent: number;
  color: string;
  amount: string;
  chain: string;
}

interface FinancialOverviewCardProps {
  wallet?: WalletState;
}

export const FinancialOverviewCard: React.FC<FinancialOverviewCardProps> = ({ wallet }) => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);

  const ccBal = wallet?.creditcoinBalance ? parseFloat(wallet.creditcoinBalance) : 99.98;
  const sepBal = wallet?.sepoliaBalance ? parseFloat(wallet.sepoliaBalance) : 0.57;
  const userCapitalUsd = Math.round(sepBal * 2500 + ccBal * 0.5);

  const segments: DonutSegment[] = [
    { name: 'Direct Sovereign Credit', percent: 52, color: 'var(--lime-primary)', amount: `${Math.round(ccBal).toLocaleString()} tCTC`, chain: 'CC3 EVM' },
    { name: 'Invoice Factoring Receivables', percent: 18.9, color: '#38bdf8', amount: '16,065 tCTC', chain: 'Sepolia Verified' },
    { name: 'Flash-Shield Standby Vault', percent: 12.5, color: '#c8ff4a', amount: '10,625 tCTC', chain: 'CC3 Native' },
    { name: 'Ethereum Cross-Collateral', percent: 9.2, color: '#a78bfa', amount: `${sepBal.toFixed(2)} ETH`, chain: 'Sepolia / Mainnet' },
    { name: 'Attestcoin Protocol Reserve', percent: 7.4, color: '#64748b', amount: '6,290 tCTC', chain: '0x0FD2 Backstop' },
  ];

  return (
    <section id="overview" className="section-padding">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill badge-lime" style={{ marginBottom: '12px' }}>
            <Layers size={13} />
            Unified Multi-Chain Ledger
          </div>
          <h2>Financial Solvency &amp; Debt Overview</h2>
          <p>
            Real-time consolidation of multi-chain assets, attested debt obligations, and active credit facilities synchronized to Creditcoin CC3.
          </p>
        </div>

        {/* Top 4 Key Metric Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }} className="grid-4col">
          
          <div className="card-glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Total Credit Facility
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }} className="font-mono">
              $85,000
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.74rem', color: 'var(--lime-primary)' }}>
              <TrendingUp size={13} />
              <span>+14.2% based on CC3 history</span>
            </div>
          </div>

          <div className="card-glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Available Credit Line
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--lime-primary)' }} className="font-mono">
              $27,350
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Ready for instant disbursement
            </div>
          </div>

          <div className="card-glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Attested Active Debt
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }} className="font-mono">
              $7,020
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.74rem', color: 'var(--emerald-verified)' }}>
              <CheckCircle2 size={13} />
              <span>Zero late payments</span>
            </div>
          </div>

          <div className="card-glass" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              Verified Capitalization
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }} className="font-mono">
              ${userCapitalUsd.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              {wallet?.isConnected ? 'Live Connected Wallet' : 'Supatra Prime Testnet Capital'}
            </div>
          </div>

        </div>

        {/* Main 2-Column Balanced Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '24px',
          alignItems: 'stretch',
        }} className="grid-overview-tri">
          
          {/* Left Column: Interactive Allocation Donut & Tranches */}
          <div className="card-glass" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>Credit Allocation &amp; Obligation Tranches</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Cryptographically proven multi-chain distribution</p>
              </div>
              <span className="badge-pill badge-lime" style={{ fontSize: '0.72rem' }}>
                Real-Time Verified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', margin: '14px 0' }}>
              
              {/* Donut Visualizer */}
              <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0, margin: '0 auto' }}>
                <svg width="160" height="160" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="85" cy="85" r="62" fill="none" stroke="#0a150f" strokeWidth="20" />
                  
                  {/* Segment 1: Lime 52% */}
                  <circle
                    cx="85" cy="85" r="62"
                    fill="none"
                    stroke="var(--lime-primary)"
                    strokeWidth={activeSegmentIndex === 0 ? 24 : 19}
                    strokeDasharray="202.5 389.5"
                    strokeDashoffset="0"
                    style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveSegmentIndex(0)}
                  />

                  {/* Segment 2: Cyan 18.9% */}
                  <circle
                    cx="85" cy="85" r="62"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={activeSegmentIndex === 1 ? 24 : 19}
                    strokeDasharray="73.6 389.5"
                    strokeDashoffset="-202.5"
                    style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveSegmentIndex(1)}
                  />

                  {/* Segment 3: Volt 12.5% */}
                  <circle
                    cx="85" cy="85" r="62"
                    fill="none"
                    stroke="#c8ff4a"
                    strokeWidth={activeSegmentIndex === 2 ? 24 : 19}
                    strokeDasharray="48.7 389.5"
                    strokeDashoffset="-276.1"
                    style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveSegmentIndex(2)}
                  />

                  {/* Segment 4: Violet 9.2% */}
                  <circle
                    cx="85" cy="85" r="62"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth={activeSegmentIndex === 3 ? 24 : 19}
                    strokeDasharray="35.8 389.5"
                    strokeDashoffset="-324.8"
                    style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveSegmentIndex(3)}
                  />

                  {/* Segment 5: Slate 7.4% */}
                  <circle
                    cx="85" cy="85" r="62"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth={activeSegmentIndex === 4 ? 24 : 19}
                    strokeDasharray="28.9 389.5"
                    strokeDashoffset="-360.6"
                    style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveSegmentIndex(4)}
                  />
                </svg>

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }} className="font-mono">
                    $85.0K
                  </span>
                  <span style={{ fontSize: '0.64rem', color: 'var(--lime-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Facility
                  </span>
                </div>
              </div>

              {/* Tranche Selector List */}
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {segments.map((seg, idx) => (
                  <div
                    key={seg.name}
                    onClick={() => setActiveSegmentIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: activeSegmentIndex === idx ? 'rgba(187, 251, 59, 0.1)' : 'rgba(12, 30, 20, 0.6)',
                      border: `1px solid ${activeSegmentIndex === idx ? 'rgba(187, 251, 59, 0.35)' : 'rgba(255, 255, 255, 0.05)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color }} />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: activeSegmentIndex === idx ? '#ffffff' : 'var(--text-secondary)' }}>
                          {seg.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{seg.chain}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: seg.color }} className="font-mono">
                        {seg.amount}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }} className="font-mono">
                        {seg.percent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Chain Balance Sheet & Factoring Ledger */}
          <div className="card-glass" style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'rgba(7, 20, 14, 0.85)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="var(--lime-primary)" />
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>Sovereign Solvency Status</h3>
                </div>
                <span className="badge-pill badge-emerald" style={{ fontSize: '0.7rem' }}>
                  Audited 100% On-Chain
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>
                PatraFi tracks repayments, collateral ratios, and active debt obligations across Creditcoin CC3 and Sepolia without relying on centralized custody or oracle manipulation.
              </p>

              {/* Protocol Metrics Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  background: 'rgba(10, 25, 17, 0.75)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--lime-border)',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Synchronized Settlement Layer:</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>Creditcoin CC3 Testnet (102031)</span>
                </div>

                <div style={{
                  background: 'rgba(10, 25, 17, 0.75)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--lime-border)',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cryptographic Prover Precompile:</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lime-primary)' }} className="font-mono">0x0000...0FD2</span>
                </div>

                <div style={{
                  background: 'rgba(10, 25, 17, 0.75)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid var(--lime-border)',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capital Efficiency Rating:</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--lime-primary)' }}>95.0% LTV Max</span>
                </div>
              </div>
            </div>

            {/* Direct Action Button */}
            <a
              href="#protocol-console"
              className="btn-lime"
              style={{ width: '100%', padding: '13px', borderRadius: '12px', textDecoration: 'none' }}
            >
              <span>Manage Lines &amp; Draw Liquidity</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
