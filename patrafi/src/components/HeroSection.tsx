import React from 'react';
import { ArrowUpRight, ShieldCheck, Zap, Lock, Sparkles, Activity, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section style={{ position: 'relative', paddingTop: '48px', paddingBottom: '56px', overflow: 'hidden' }}>
      {/* Ambient Mesh Glows */}
      <div className="ambient-glow glow-lime" style={{ top: '-10%', left: '15%' }} />
      <div className="ambient-glow glow-emerald" style={{ top: '25%', right: '5%' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Main Hero Responsive Grid */}
        <div className="grid-hero" style={{ marginBottom: '48px' }}>
          
          {/* Left Column: Vision & Action */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <span className="badge-pill badge-lime" style={{ fontSize: '0.82rem' }}>
                <Sparkles size={13} />
                Attestcoin Precompile 0x0FD2 Active
              </span>
              <span className="badge-pill badge-emerald" style={{ fontSize: '0.82rem' }}>
                Creditcoin CC3 Native
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 4.1rem)',
              lineHeight: 1.08,
              marginBottom: '20px',
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}>
              Sovereign cross-chain credit, <br />
              <span style={{
                background: 'linear-gradient(135deg, #ffffff 40%, #00f59b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                underwritten on-chain.
              </span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              marginBottom: '32px',
            }}>
              Unlock sovereign underwriting with <strong style={{ color: '#ffffff' }}>PatraFi</strong>. 
              Cryptographically verify debt repayments on Ethereum &amp; Sepolia, unlock uncollateralized 
              credit lines on Creditcoin CC3, and defend positions with an autonomous <strong style={{ color: 'var(--lime-primary)' }}>Flash-Shield</strong>.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a href="#patrata-score" className="btn-lime">
                <span>Evaluate Pātratā Score</span>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--lime-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lime-primary)',
                }}>
                  <ArrowUpRight size={14} />
                </span>
              </a>

              <a href="#protocol-console" className="btn-dark">
                <span>Explore Borrowing Facility</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: '520px',
            }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lime-primary)' }} className="font-mono">
                  $0
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Oracle Exposure
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }} className="font-mono">
                  95%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Max LTV Unlocked
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-cyan)' }} className="font-mono">
                  0x0FD2
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Native Precompile
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Solvency Cockpit Card (Replacing static photo) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="card-glass" style={{
              width: '100%',
              maxWidth: '460px',
              padding: '28px',
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 245, 155, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}>
              {/* Header inside Cockpit */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--lime-primary)',
                    boxShadow: '0 0 8px var(--lime-primary)',
                    display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>
                    Sovereign Underwriting Cockpit
                  </span>
                </div>
                <span className="badge-pill badge-lime" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  Synced 0x0FD2
                </span>
              </div>

              {/* Main Score Hero Display inside Cockpit */}
              <div style={{
                background: 'rgba(8, 12, 18, 0.85)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(0, 245, 155, 0.2)',
                marginBottom: '18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Attested Pātratā Score
                    </div>
                    <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }} className="font-mono">
                      845 <span style={{ fontSize: '1rem', color: 'var(--lime-primary)', fontWeight: 700 }}>/ 900</span>
                    </div>
                  </div>
                  <div className="badge-pill badge-lime" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <ShieldCheck size={14} />
                    Supatra Tier
                  </div>
                </div>

                <div style={{ width: '100%', height: '6px', background: '#141c28', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #00f59b, #38ef7d)', borderRadius: '3px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Credit Line: <strong style={{ color: '#ffffff' }} className="font-mono">$150,000 tCTC</strong></span>
                  <span>Max LTV: <strong style={{ color: 'var(--lime-primary)' }} className="font-mono">95%</strong></span>
                </div>
              </div>

              {/* Cross-Chain Verification Route */}
              <div style={{
                background: 'rgba(12, 17, 26, 0.7)',
                borderRadius: '14px',
                padding: '14px 16px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '18px',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Synchronous Attestation Route
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#1c2436', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: '#cbd5e1' }}>
                      ETH
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Sepolia</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Event Logged</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--lime-primary)' }} />
                    <span style={{ width: '24px', height: '1px', background: 'var(--lime-primary)' }} />
                    <ArrowRight size={12} color="var(--lime-primary)" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(0, 245, 155, 0.15)', border: '1px solid var(--lime-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: 'var(--lime-primary)' }}>
                      CTC
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>CC3 EVM</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--lime-primary)' }}>0x0FD2 Verified</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solvency Status & Quick Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Liquidation Shield
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--lime-primary)' }} className="font-mono">
                    2.85x Armed
                  </div>
                </div>

                <a href="#patrata-score" className="btn-dark" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                  <span>Verify Wallet</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Cohesive Fintech Teaser Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Card 1: Sovereign Underwriting */}
          <div className="card-glass" style={{
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px',
          }}>
            <div>
              <div className="badge-pill badge-lime" style={{ marginBottom: '12px' }}>
                <Lock size={12} />
                Sovereign Underwriting
              </div>
              <h3 style={{ fontSize: '1.25rem', lineHeight: 1.3, color: '#ffffff', marginBottom: '8px' }}>
                Set credit bounds, track cross-chain obligations with zero centralized bureau trust.
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Your repayment history on foreign protocols is cryptographically proven directly into a portable on-chain credit score on Creditcoin CC3.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}>
              <a href="#patrata-score" className="btn-circle-arrow" title="Explore credit bounds">
                <ArrowUpRight size={17} />
              </a>
              <a href="#patrata-score" style={{ fontSize: '0.82rem', color: 'var(--lime-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Explore Pātratā Scoring &rarr;
              </a>
            </div>
          </div>

          {/* Card 2: Autonomous Solvency Defense */}
          <div className="card-titanium" style={{
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px',
          }}>
            <div>
              <div className="badge-pill badge-emerald" style={{ marginBottom: '12px' }}>
                <Zap size={12} />
                Autonomous Solvency
              </div>
              <h3 style={{ fontSize: '1.25rem', lineHeight: 1.3, color: '#ffffff', marginBottom: '8px' }}>
                Automated liquidation defenses that shield your collateral during flash volatility.
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--card-titanium-muted)', lineHeight: 1.55 }}>
                Deploy autonomous Flash-Shields that detect health-factor decay across connected chains, instantly absorbing debt without predatory liquidator penalties.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}>
              <a href="#flash-shield" className="btn-circle-arrow" title="Configure Flash Shield">
                <ArrowUpRight size={17} />
              </a>
              <a href="#flash-shield" style={{ fontSize: '0.82rem', color: 'var(--lime-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Configure Flash-Shield &rarr;
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
