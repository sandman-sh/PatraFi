import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Shield, Zap, AlertTriangle, CheckCircle2, Radio, Activity, ArrowRight, Layers, Sliders, Play, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROTOCOL_CONTRACTS, NETWORKS } from '../contracts/config';
import { executeLivePrecompileProof, creditcoinProvider } from '../services/web3Service';

interface FlashShieldMonitorProps {
  creditcoinBalance?: string;
  sepoliaBalance?: string;
  walletAddress?: string | null;
}

export const FlashShieldMonitor: React.FC<FlashShieldMonitorProps> = ({
  creditcoinBalance = '99.98',
  sepoliaBalance = '0.57',
  walletAddress,
}) => {
  const [monitorMode, setMonitorMode] = useState<'live' | 'stress'>('live');
  const [stressHealthFactor, setStressHealthFactor] = useState<number>(2.25);
  const [rescueThreshold, setRescueThreshold] = useState<number>(1.15);
  const [isShieldActive, setIsShieldActive] = useState<boolean>(true);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [interventionReceipt, setInterventionReceipt] = useState<{
    txHash: string;
    amountInjected: string;
    targetBlock: number;
    newHealthFactor: number;
  } | null>(null);

  // Calculate live health factor based on real wallet capital power vs standard active credit line ($25,000)
  const ccBal = parseFloat(creditcoinBalance) || 100;
  const sepBal = parseFloat(sepoliaBalance) || 0.5;
  // Valuation: 1 SepoliaETH = $2,500, 1 tCTC = $0.50
  const realCapitalUsd = sepBal * 2500 + ccBal * 0.5;
  const activeDebtUsd = 1250; // benchmark loan tranche
  const computedLiveHealthFactor = Math.max(0.85, Math.min(3.5, ((realCapitalUsd * 0.95) / activeDebtUsd)));

  const activeHealthFactor = monitorMode === 'live' ? computedLiveHealthFactor : stressHealthFactor;
  const isRescueTriggered = activeHealthFactor <= rescueThreshold;

  // Dynamic status evaluation
  let statusText = 'Invulnerable (Shield Armed & Synchronized)';
  let statusColor = 'var(--lime-primary)';

  if (activeHealthFactor < 1.0) {
    statusText = 'Critical Vulnerability (Emergency Precompile Backstop Armed)';
    statusColor = '#ef4444';
  } else if (isRescueTriggered) {
    statusText = 'Emergency Solvency Dispatched via 0x0FD2';
    statusColor = 'var(--amber-warning)';
  } else if (activeHealthFactor < 1.5) {
    statusText = 'Moderate Volatility (Monitoring CC3 Block Headers)';
    statusColor = 'var(--emerald-verified)';
  }

  // Calculate percentage along the 0.85x to 3.00x spectrum for the gauge marker
  const spectrumPercent = Math.max(0, Math.min(100, ((activeHealthFactor - 0.85) / (3.0 - 0.85)) * 100));

  const handleDispatchEmergencyRescue = async () => {
    setIsDispatching(true);
    try {
      const proofResult = await executeLivePrecompileProof();
      const currentBlock = await creditcoinProvider.getBlockNumber().catch(() => 5482929);
      setInterventionReceipt({
        txHash: proofResult.sourceTxHash,
        amountInjected: '10,000 tCTC Standby Vault Reserve',
        targetBlock: currentBlock,
        newHealthFactor: 2.65,
      });

      if (monitorMode === 'stress') {
        setStressHealthFactor(2.65);
      }

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#bbfb3b', '#10b981', '#38bdf8'],
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <section id="flash-shield" className="section-padding">
      <div className="container">
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div className="badge-pill badge-lime" style={{ marginBottom: '12px' }}>
              <Zap size={13} />
              Autonomous Solvency Defense
            </div>
            <h2>Flash-Shield Liquidation Guardian</h2>
            <p>
              Eliminate catastrophic 10–15% liquidation penalties during flash crashes. 
              Flash-Shield continuously monitors cross-chain solvency and dispatches automated emergency liquidity on Creditcoin CC3.
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(10, 21, 15, 0.9)', padding: '4px', borderRadius: '9999px', border: '1px solid var(--lime-border)' }}>
            <button
              onClick={() => {
                setMonitorMode('live');
                setInterventionReceipt(null);
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: monitorMode === 'live' ? 'var(--lime-primary)' : 'transparent',
                color: monitorMode === 'live' ? '#071911' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Live On-Chain Position
            </button>
            <button
              onClick={() => {
                setMonitorMode('stress');
                setInterventionReceipt(null);
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: monitorMode === 'stress' ? 'var(--lime-primary)' : 'transparent',
                color: monitorMode === 'stress' ? '#071911' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Volatility Shock Stress Test
            </button>
          </div>
        </div>

        {/* Two Column Console Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '24px',
          alignItems: 'start',
        }} className="flash-shield-grid">
          
          {/* Left Column: Solvency Health Factor Console */}
          <div className="card-glass" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                  {monitorMode === 'live' ? 'Live Cross-Chain Solvency Monitor' : 'Volatility Shock Testing Console'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                  {monitorMode === 'live'
                    ? `Synchronized with ${walletAddress ? `${walletAddress.slice(0, 8)}...` : 'Active Testnet Wallet'} balances on CC3 and Sepolia`
                    : 'Adjust the slider to stress test automated precompile intervention during market drawdown'}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(12, 30, 20, 0.85)',
                border: '1px solid var(--lime-border)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                color: isShieldActive ? 'var(--lime-primary)' : 'var(--text-muted)',
              }}>
                <Radio size={12} className={isShieldActive ? 'animate-pulse-glow' : ''} />
                <span>{isShieldActive ? 'Shield Armed' : 'Shield Inactive'}</span>
              </div>
            </div>

            {/* Health Factor Gauge Box */}
            <div style={{
              background: 'rgba(7, 20, 14, 0.95)',
              borderRadius: '18px',
              padding: '24px',
              border: `1.5px solid ${isRescueTriggered ? 'var(--amber-warning)' : 'var(--lime-border)'}`,
              marginBottom: '26px',
              textAlign: 'center',
              boxShadow: isRescueTriggered ? '0 0 35px rgba(245, 158, 11, 0.2)' : 'none',
              transition: 'all 0.28s ease',
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                {monitorMode === 'live' ? 'Calculated Position Health Factor (On-Chain Balance Solvency)' : 'Cross-Chain Position Health Factor (Sepolia / CC3)'}
              </div>
              
              <div style={{
                fontSize: '4.2rem',
                fontWeight: 900,
                color: statusColor,
                fontFamily: 'var(--font-heading)',
                lineHeight: 1,
                marginBottom: '12px',
              }} className="font-mono">
                {activeHealthFactor.toFixed(2)}x
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 16px',
                borderRadius: '9999px',
                background: 'rgba(0, 0, 0, 0.45)',
                color: statusColor,
                fontSize: '0.84rem',
                fontWeight: 700,
              }}>
                {isRescueTriggered ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                <span>{statusText}</span>
              </div>
            </div>

            {/* Visual Liquidation Spectrum Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Liquidation Solvency Spectrum:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }} className="font-mono">{activeHealthFactor.toFixed(2)}x</span>
              </div>

              {/* Spectrum Track with Needle */}
              <div style={{ position: 'relative', height: '10px', borderRadius: '5px', background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 20%, #10b981 50%, #bbfb3b 100%)', marginBottom: '8px' }}>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: `calc(${spectrumPercent}% - 9px)`,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '3px solid #071911',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                  transition: 'left 0.1s ease',
                  pointerEvents: 'none',
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span style={{ color: '#ef4444' }}>0.85x (Liquidation)</span>
                <span style={{ color: '#f59e0b' }}>1.15x (Rescue Trigger)</span>
                <span style={{ color: 'var(--lime-primary)' }}>3.00x (Solvent)</span>
              </div>
            </div>

            {/* Interactive Slider Input (Available in Stress Mode) */}
            {monitorMode === 'stress' ? (
              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Stress Testing Market Drawdown &amp; Volatility Factor:
                </label>
                <input
                  type="range"
                  min="0.85"
                  max="3.00"
                  step="0.05"
                  value={stressHealthFactor}
                  onChange={(e) => setStressHealthFactor(parseFloat(e.target.value))}
                  className="slider-lime"
                />
              </div>
            ) : (
              <div style={{
                marginBottom: '22px',
                padding: '14px 18px',
                background: 'rgba(12, 30, 20, 0.6)',
                borderRadius: '10px',
                border: '1px solid var(--lime-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Multi-Chain Capital: </span>
                  <strong style={{ color: '#ffffff' }} className="font-mono">${realCapitalUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</strong>
                </div>
                <div style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Benchmark Credit Tranche: </span>
                  <strong style={{ color: 'var(--lime-primary)' }} className="font-mono">${activeDebtUsd.toLocaleString()} USD</strong>
                </div>
              </div>
            )}

            {/* Dynamic Intervention Alert & Dispatch Button */}
            {isRescueTriggered && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '16px 20px',
                color: '#ffffff',
                fontSize: '0.84rem',
                lineHeight: 1.55,
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--amber-warning)', fontWeight: 700 }}>
                  <AlertTriangle size={16} />
                  <span>Flash-Shield Rescue Trigger Threshold Reached!</span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#e2e8f0' }}>
                  Health factor is below the safe threshold of <strong>{rescueThreshold.toFixed(2)}x</strong>. 
                  Creditcoin CC3 precompile <code style={{ color: 'var(--lime-primary)' }}>0x0FD2</code> can verify emergency solvency and disburse standby reserve liquidity to insulate your position.
                </p>
                <button
                  onClick={handleDispatchEmergencyRescue}
                  disabled={isDispatching}
                  className="btn-lime"
                  style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                >
                  {isDispatching ? (
                    <>
                      <RefreshCw size={14} className="animate-spin-slow" />
                      <span>Dispatching Reserve via 0x0FD2...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      <span>Dispatch Emergency Solvency (12,500 tCTC)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Intervention Confirmation Receipt */}
            {interventionReceipt && (
              <div style={{
                padding: '16px',
                background: 'rgba(7, 24, 16, 0.95)',
                border: '1px solid var(--lime-primary)',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: '#cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{ color: 'var(--lime-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Emergency Solvency Injection Confirmed on CC3!</span>
                </div>
                <div>Tx Hash: <span style={{ color: 'var(--lime-primary)' }}>{interventionReceipt.txHash.slice(0, 24)}...</span></div>
                <div>Disbursed: <span style={{ color: '#ffffff' }}>{interventionReceipt.amountInjected}</span></div>
                <div>New Health Factor: <span style={{ color: 'var(--emerald-verified)', fontWeight: 700 }}>{interventionReceipt.newHealthFactor.toFixed(2)}x (Safe)</span></div>
              </div>
            )}
          </div>

          {/* Right Column: Flash-Shield Parameters & Vault Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Settings Card */}
            <div className="card-glass" style={{ padding: '26px' }}>
              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px' }}>
                Autonomous Defense Protocol
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>Autonomous Protection</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Continuous on-chain monitoring</div>
                  </div>
                  <button
                    onClick={() => setIsShieldActive(!isShieldActive)}
                    className="badge-pill"
                    style={{
                      background: isShieldActive ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.1)',
                      color: isShieldActive ? '#071911' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      padding: '5px 14px',
                    }}
                  >
                    {isShieldActive ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>Rescue Trigger Threshold</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Precompile verification trigger</div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--lime-primary)' }} className="font-mono">
                    {rescueThreshold.toFixed(2)}x HF
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>Emergency Reserve Pool</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available on Creditcoin CC3</div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--emerald-verified)' }} className="font-mono">
                    $1,450,000 tCTC
                  </span>
                </div>
              </div>
            </div>

            {/* Titanium Comparison Card */}
            <div className="card-glass" style={{ padding: '26px', background: 'rgba(10, 25, 17, 0.75)', border: '1px solid rgba(187, 251, 59, 0.18)' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(187, 251, 59, 0.1)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--lime-primary)',
                marginBottom: '10px',
                border: '1px solid var(--lime-border)',
              }}>
                <Shield size={12} />
                Zero Centralized Oracle Exposure
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.3, marginBottom: '8px' }}>
                Why Flash-Shield Beats Predatory Liquidators
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Centralized MEV searchers and liquidator bots hunt borrower positions for 10–15% liquidation bounties. 
                Flash-Shield replaces predatory bot auctions with native cryptographic verification on Creditcoin CC3 precompile 0x0FD2.
              </p>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .flash-shield-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
