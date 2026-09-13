import React, { useState, useEffect } from 'react';
import { Shield, Award, CheckCircle2, Search, RefreshCw, AlertCircle, Copy, Check, Link, Globe2 } from 'lucide-react';
import type { PatrataScoreData } from '../services/web3Service';
import { calculatePatrataCreditScore } from '../services/web3Service';
import { SAMPLE_WALLETS, NETWORKS } from '../contracts/config';

interface PatrataScoreEngineProps {
  connectedAddress: string | null;
}

export const PatrataScoreEngine: React.FC<PatrataScoreEngineProps> = ({ connectedAddress }) => {
  const [targetAddress, setTargetAddress] = useState<string>(
    connectedAddress || SAMPLE_WALLETS[0].address
  );
  const [scoreData, setScoreData] = useState<PatrataScoreData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Auto-update if connected address changes
  useEffect(() => {
    if (connectedAddress) {
      setTargetAddress(connectedAddress);
      runEvaluation(connectedAddress);
    } else {
      runEvaluation(SAMPLE_WALLETS[0].address);
    }
  }, [connectedAddress]);

  const runEvaluation = async (addressToEval: string) => {
    const cleanAddr = addressToEval.trim();
    if (!cleanAddr || !cleanAddr.startsWith('0x') || cleanAddr.length !== 42) {
      setErrorMessage('Please enter a valid 42-character EVM address (e.g. 0x...)');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = await calculatePatrataCreditScore(cleanAddr);
      setScoreData(result);
    } catch (e: any) {
      console.error('Failed to calculate live Pātratā score', e);
      setErrorMessage(e.message || 'Unable to scan address across RPC networks.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDigest = (digest: string) => {
    navigator.clipboard.writeText(digest);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="patrata-score" className="section-padding">
      <div className="container">
        
        {/* Header Block */}
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
              <Award size={13} />
              Pātratā (पात्रता) Live Underwriting Engine
            </div>
            <h2>Sovereign On-Chain Credit Scoring</h2>
            <p>
              In Sanskrit, <em style={{ color: 'var(--lime-primary)' }}>Pātratā</em> signifies proven merit and creditworthiness. 
              PatraFi executes direct, zero-mock on-chain scanning across Creditcoin CC3 and Ethereum Sepolia to underwrite decentralized borrowing lines.
            </p>
          </div>

          {/* Quick Wallets Selector with score preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified Testnet Wallets:</span>
            {SAMPLE_WALLETS.map((wallet, idx) => {
              const isSelected = targetAddress.toLowerCase() === wallet.address.toLowerCase();
              return (
                <button
                  key={wallet.address}
                  onClick={() => {
                    setTargetAddress(wallet.address);
                    runEvaluation(wallet.address);
                  }}
                  className="badge-pill"
                  style={{
                    background: isSelected ? 'var(--lime-primary)' : 'rgba(18, 24, 36, 0.85)',
                    color: isSelected ? 'var(--lime-dark)' : 'var(--text-secondary)',
                    border: `1px solid ${isSelected ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    padding: '6px 14px',
                  }}
                  title={wallet.history}
                >
                  <span style={{ fontWeight: 700 }}>{wallet.tier.split(' ')[0]}</span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.8 }} className="font-mono">#{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Address Search Bar Card */}
        <div className="card-glass" style={{ padding: '20px 24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-dark"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runEvaluation(targetAddress);
                }}
                placeholder="Enter any EVM Wallet Address (0x...)"
                style={{ paddingLeft: '44px', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <button
              onClick={() => runEvaluation(targetAddress)}
              disabled={isLoading}
              className="btn-lime"
              style={{ minWidth: '190px', padding: '12px 24px' }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin-slow" />
                  <span>Scanning Blockchains...</span>
                </>
              ) : (
                <>
                  <Shield size={15} />
                  <span>Scan Live On-Chain</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              color: '#ef4444',
              fontSize: '0.82rem',
            }}>
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Scan Results & Audit Header */}
        {scoreData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Live On-Chain Audit Strip */}
            <div className="card-glass" style={{
              padding: '16px 22px',
              background: 'rgba(7, 24, 16, 0.85)',
              border: '1px solid rgba(187, 251, 59, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--lime-primary)',
                  boxShadow: '0 0 8px var(--lime-primary)',
                  display: 'inline-block',
                }} />
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Blockchain Attestation Verified
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }} className="font-mono">
                    Scanned at Creditcoin CC3 Block #{scoreData.scannedAtCcBlock.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>CC3 Balance: </span>
                  <strong style={{ color: 'var(--lime-primary)' }} className="font-mono">{scoreData.creditcoinBalanceFormatted} tCTC</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({scoreData.creditcoinTxCount} txs)</span>
                </div>
                <div style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sepolia Balance: </span>
                  <strong style={{ color: '#38bdf8' }} className="font-mono">{scoreData.sepoliaBalanceFormatted} ETH</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({scoreData.sepoliaTxCount} txs)</span>
                </div>
                <span className="badge-pill badge-emerald" style={{ padding: '3px 10px', fontSize: '0.72rem' }}>
                  <CheckCircle2 size={12} />
                  {scoreData.isContract ? 'Smart Contract Verified' : 'EOA Sovereign Verified'}
                </span>
              </div>
            </div>

            {/* Main Evaluation Output Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 1.35fr',
              gap: '24px',
              alignItems: 'stretch',
            }} className="score-engine-grid">
              
              {/* Left: Calibrated Score Gauge Card */}
              <div className="card-glass" style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                
                {/* Circular SVG Calibrated Meter */}
                <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '18px' }}>
                  <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="110" cy="110" r="90" fill="none" stroke="#0a150f" strokeWidth="18" />
                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke="var(--lime-primary)"
                      strokeWidth="18"
                      strokeDasharray="565.5"
                      strokeDashoffset={565.5 - (565.5 * (scoreData.score - 300)) / 600}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </svg>

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Pātratā Score
                    </span>
                    <span style={{ fontSize: '3.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', lineHeight: 1 }} className="font-mono">
                      {scoreData.score}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Range: 300 – 900
                    </span>
                  </div>
                </div>

                {/* Tier Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  background: scoreData.score >= 780 ? 'rgba(187, 251, 59, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                  color: scoreData.score >= 780 ? 'var(--lime-primary)' : 'var(--emerald-verified)',
                  border: '1px solid currentColor',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}>
                  <Award size={15} />
                  {scoreData.tier}
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.55 }}>
                  {scoreData.tierDescription}
                </p>

                {/* Quick Metrics Bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  width: '100%',
                  marginTop: '26px',
                  paddingTop: '18px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max LTV</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-primary)' }} className="font-mono">{scoreData.maxLtvPercent}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Borrow APR</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }} className="font-mono">{scoreData.borrowAprPercent}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Credit Line</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-verified)' }} className="font-mono">${scoreData.maxCreditLineUsd.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Right: Factor Weights & Cryptographic Digest */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Factor Breakdown Bars */}
                <div className="card-glass" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                      Authentic Quantitative Scoring Weights
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--lime-primary)' }}>100% On-Chain Verified</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Factor 1 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>
                          Repayment &amp; Settlement Depth (40%)
                        </span>
                        <span style={{ fontSize: '0.84rem', color: 'var(--lime-primary)', fontWeight: 700 }} className="font-mono">
                          {scoreData.repaymentScore} / 100
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#0a150f', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${scoreData.repaymentScore}%`, height: '100%', background: 'var(--lime-primary)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        Derived from {scoreData.verifiedRepaymentsCount} verified transactions across Creditcoin CC3 and Sepolia.
                      </span>
                    </div>

                    {/* Factor 2 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>
                          Collateral Efficiency &amp; Capitalization (25%)
                        </span>
                        <span style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 700 }} className="font-mono">
                          {scoreData.collateralEfficiency} / 100
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#0a150f', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${scoreData.collateralEfficiency}%`, height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        Evaluated from live liquid balances: {scoreData.creditcoinBalanceFormatted} tCTC and {scoreData.sepoliaBalanceFormatted} ETH.
                      </span>
                    </div>

                    {/* Factor 3 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>
                          Account Longevity &amp; Non-Ephemeral Integrity (20%)
                        </span>
                        <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 700 }} className="font-mono">
                          {scoreData.accountLongevityScore} / 100
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#0a150f', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${scoreData.accountLongevityScore}%`, height: '100%', background: '#ffffff', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        Non-ephemeral interaction history verified across multiple block heights.
                      </span>
                    </div>

                    {/* Factor 4 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.84rem', color: '#ffffff', fontWeight: 600 }}>
                          Cross-Chain Interoperability (15%)
                        </span>
                        <span style={{ fontSize: '0.84rem', color: 'var(--lime-primary)', fontWeight: 700 }} className="font-mono">
                          {scoreData.crossChainDiversityScore} / 100
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#0a150f', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${scoreData.crossChainDiversityScore}%`, height: '100%', background: 'var(--lime-primary)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        Verified across Creditcoin CC3 (Chain 102031) and Ethereum Sepolia (Chain 11155111).
                      </span>
                    </div>

                  </div>
                </div>

                {/* Attestation Digest Proof Strip */}
                <div className="card-glass" style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Attestcoin Keccak256 Attestation Digest (Bound to CC3 #{scoreData.scannedAtCcBlock})
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--lime-primary)',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      marginTop: '3px',
                    }}>
                      {scoreData.attestationDigest}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyDigest(scoreData.attestationDigest)}
                    className="badge-pill badge-lime"
                    style={{ cursor: 'pointer', flexShrink: 0, padding: '7px 14px' }}
                  >
                    {copiedHash ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedHash ? 'Copied' : 'Copy Proof'}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 960px) {
          .score-engine-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
