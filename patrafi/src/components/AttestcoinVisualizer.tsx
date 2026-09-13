import React, { useState } from 'react';
import { Cpu, Play, RefreshCw, Database, Binary, Shield, ExternalLink, Terminal, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { PROTOCOL_CONTRACTS, NETWORKS } from '../contracts/config';
import { executeLivePrecompileProof, type PrecompileExecutionResult } from '../services/web3Service';

export const AttestcoinVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [customTxHash, setCustomTxHash] = useState<string>('');
  const [lastResult, setLastResult] = useState<PrecompileExecutionResult | null>(null);

  const sampleTxs = [
    { label: 'Loan Registered Tx (CC3 #5,482,929)', hash: '0x395ed02d8ee98551e6caa9e75a634abcc9ad0df2d29f70884cf4c9c104fc72b8' },
    { label: 'Loan Repaid Tx (CC3 #5,482,928)', hash: '0x4f6419741a09e4c35e5fcf97bf3089190c2d001a079be19d2f8fa154b23e3c96' },
  ];

  const runProofPipeline = async (txHash?: string) => {
    setIsExecuting(true);
    setTerminalLogs([]);
    setActiveStep(1);

    const hashToUse = txHash !== undefined ? txHash : customTxHash;

    try {
      setTerminalLogs(['[Init] Connecting to Ethereum Sepolia & Creditcoin CC3 RPC nodes...']);
      setActiveStep(1);

      const result = await executeLivePrecompileProof(hashToUse);
      setLastResult(result);

      // Stream logs with slight visual staggering for clear reading
      for (let i = 0; i < result.logs.length; i++) {
        const log = result.logs[i];
        if (log.includes('[Phase 01]')) setActiveStep(1);
        if (log.includes('[Phase 02]')) setActiveStep(2);
        if (log.includes('[Phase 03]')) setActiveStep(3);
        if (log.includes('[Phase 04]')) setActiveStep(4);

        setTerminalLogs((prev) => [...prev, log]);
        await new Promise((r) => setTimeout(r, 180));
      }
    } catch (err: any) {
      setTerminalLogs((prev) => [
        ...prev,
        `❌ Execution Error: ${err.message || 'Verification pipeline encountered an RPC exception'}`,
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const pipelineSteps = [
    {
      num: 1,
      title: 'Source Chain Event',
      chain: 'Sepolia (11155111)',
      desc: 'Queries real Sepolia RPC for transaction receipt, block height, and gas consumption.',
      icon: Database,
    },
    {
      num: 2,
      title: 'Attestcoin ProofBuilder',
      chain: 'Cryptographic Merkle Tree',
      desc: 'Constructs Merkle inclusion proof and continuity header digests.',
      icon: Binary,
    },
    {
      num: 3,
      title: 'CC3 Precompile 0x0FD2',
      chain: 'Creditcoin CC3 EVM',
      desc: 'Native EVM precompile executes cryptographic validation synchronously.',
      icon: Cpu,
    },
    {
      num: 4,
      title: 'State Transition',
      chain: 'PatraFi ASCLoanManager',
      desc: 'Marks debt settled and expands credit line with zero centralized oracle reliance.',
      icon: Shield,
    },
  ];

  return (
    <section id="architecture" className="section-padding">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill badge-lime" style={{ marginBottom: '12px' }}>
            <Cpu size={13} />
            Attestcoin Native Protocol Execution
          </div>
          <h2>Live Precompile 0x0FD2 Verification Pipeline</h2>
          <p>
            Unlike vulnerable multisig bridges and centralized oracles, PatraFi proves foreign transactions directly to Creditcoin’s 
            native cryptographic precompile <code style={{ color: 'var(--lime-primary)' }}>0x0FD2</code>. Test live RPC verification below.
          </p>
        </div>

        {/* 4-Phase Connected Pipeline Flow */}
        <div className="grid-4col" style={{ marginBottom: '28px' }}>
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className="card-glass"
                style={{
                  padding: '22px',
                  border: isActive ? '1.5px solid var(--lime-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(187, 251, 59, 0.08)' : 'var(--bg-surface-card)',
                  boxShadow: isActive ? '0 0 24px rgba(187, 251, 59, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}>
                  <span className="badge-pill" style={{
                    background: isActive ? 'var(--lime-primary)' : 'rgba(18, 24, 36, 0.8)',
                    color: isActive ? '#071911' : 'var(--text-muted)',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    padding: '3px 9px',
                  }}>
                    Phase 0{step.num}
                  </span>
                  <Icon size={16} color={isActive ? 'var(--lime-primary)' : 'var(--text-muted)'} />
                </div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '4px' }}>
                  {step.title}
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--lime-primary)', marginBottom: '8px' }} className="font-mono">
                  {step.chain}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Execution Terminal Console */}
        <div className="card-glass" style={{ padding: '26px' }}>
          
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Terminal size={18} color="var(--lime-primary)" />
                <h4 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                  Creditcoin CC3 Precompile 0x0FD2 Interactive Terminal
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Live Target Precompile: <code style={{ color: 'var(--lime-primary)' }}>{PROTOCOL_CONTRACTS.PRECOMPILE_BLOCK_PROVER}</code> on Creditcoin CC3 Testnet
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {sampleTxs.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomTxHash(sample.hash);
                    runProofPipeline(sample.hash);
                  }}
                  disabled={isExecuting}
                  className="badge-pill"
                  style={{
                    background: 'rgba(18, 38, 28, 0.8)',
                    color: 'var(--lime-primary)',
                    border: '1px solid var(--lime-border)',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    padding: '6px 12px',
                  }}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tx Hash Input Strip */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-dark"
                value={customTxHash}
                onChange={(e) => setCustomTxHash(e.target.value)}
                placeholder="Paste Sepolia Tx Hash (or leave blank to fetch latest mined tx)..."
                style={{ paddingLeft: '40px', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <button
              onClick={() => runProofPipeline()}
              disabled={isExecuting}
              className="btn-lime"
              style={{ padding: '10px 22px', fontSize: '0.88rem', minWidth: '180px' }}
            >
              {isExecuting ? (
                <>
                  <RefreshCw size={14} className="animate-spin-slow" />
                  <span>Interrogating CC3...</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Execute Proof Pipeline</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Terminal Display */}
          <div style={{
            background: '#04060a',
            borderRadius: '12px',
            padding: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: '#cbd5e1',
            minHeight: '180px',
            maxHeight: '360px',
            overflowY: 'auto',
            border: '1px solid rgba(187, 251, 59, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {terminalLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 'auto 0' }}>
                &gt; Click &quot;Execute Proof Pipeline&quot; above to perform live transaction receipt extraction on Sepolia and submit real cryptographic inclusion proof verification to Creditcoin CC3 native precompile 0x0FD2.
              </div>
            ) : (
              terminalLogs.map((log, index) => (
                <div key={index} style={{
                  color: log.includes('✓') ? 'var(--lime-primary)' : log.includes('❌') ? '#ef4444' : log.includes('[Phase') ? '#38bdf8' : '#ffffff',
                  lineHeight: 1.5,
                }}>
                  {log}
                </div>
              ))
            )}
          </div>

          {/* Technical Verified Digest Strip */}
          {lastResult && (
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: 'rgba(7, 20, 14, 0.85)',
              borderRadius: '10px',
              border: '1px solid rgba(187, 251, 59, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Verified Sepolia Source Tx:</span>
                <a
                  href={`${NETWORKS.SEPOLIA.blockExplorerUrl}/tx/${lastResult.sourceTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--lime-primary)', textDecoration: 'none' }}
                >
                  {lastResult.sourceTxHash.slice(0, 24)}... ↗
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Merkle Receipt Root:</span>
                <span style={{ color: '#ffffff' }}>{lastResult.merkleReceiptRoot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Continuity Lower Endpoint Digest:</span>
                <span style={{ color: '#38bdf8' }}>{lastResult.continuityDigest}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Precompile Opcode Execution:</span>
                <span style={{ color: 'var(--emerald-verified)', fontWeight: 700 }}>
                  Active &amp; Responding (0x0FD2 on Creditcoin CC3)
                </span>
              </div>
            </div>
          )}

          {/* Technical Spec Strip */}
          <div style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <span>Interface: <code>execute(uint8,uint64,uint64,bytes,bytes32,tuple[],bytes32,bytes32[])</code></span>
            <a
              href="https://docs.creditcoin.org/"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--lime-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Read Attestcoin CC3 Precompile Specification</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
