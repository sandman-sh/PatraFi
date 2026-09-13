import React, { useState } from 'react';
import { Landmark, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Clock, Percent, DollarSign, FileSignature, Search, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { WalletState } from '../services/web3Service';
import {
  signLoanAuthorization,
  inspectLoanOrderOnChain,
  fundLoanOrder,
  repayLoanOrder,
  getAllRegisteredOrders,
  type LoanOrderInspection,
} from '../services/web3Service';
import { NETWORKS, PROTOCOL_CONTRACTS } from '../contracts/config';

interface LiveProtocolConsoleProps {
  wallet: WalletState;
  onConnectWallet: () => void;
}

export const LiveProtocolConsole: React.FC<LiveProtocolConsoleProps> = ({ wallet, onConnectWallet }) => {
  const [activeTab, setActiveTab] = useState<'originate' | 'inspect'>('originate');
  const [borrowAmount, setBorrowAmount] = useState<number>(25000);
  const [loanDurationDays, setLoanDurationDays] = useState<number>(60);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signedOrder, setSignedOrder] = useState<{
    loanId: number;
    signature: string;
    messageHash: string;
    amount: number;
    interest: number;
    dueDate: string;
  } | null>(null);

  // Inspector state
  const [inspectLoanId, setInspectLoanId] = useState<string>('1');
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<LoanOrderInspection | null>(null);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [isRepaying, setIsRepaying] = useState<boolean>(false);
  const [recentOrders, setRecentOrders] = useState<LoanOrderInspection[]>([]);

  // Load real registered orders on-chain on initial mount
  React.useEffect(() => {
    getAllRegisteredOrders().then((orders) => {
      setRecentOrders(orders);
      if (orders.length > 0) {
        setInspectLoanId(orders[0].loanId.toString());
        inspectLoanOrderOnChain(orders[0].loanId).then((res) => setInspectionResult(res));
      }
    });
  }, []);

  // Dynamic calculations based on Super-Prime Supatra tier defaults
  const interestBps = 380; // 3.80% APR
  const interestAmount = (borrowAmount * interestBps) / 10000;
  const totalRepayment = borrowAmount + interestAmount;
  // With 95% LTV, collateral is only ~5.26%
  const collateralRequired = Math.round(borrowAmount * 0.0526);
  const standardDefiCollateral = Math.round(borrowAmount * 1.5); // 150% overcollateralization
  const capitalSaved = standardDefiCollateral - collateralRequired;

  const handleQuickAdd = (add: number) => {
    setBorrowAmount((prev) => Math.min(150000, Math.max(2000, prev + add)));
  };

  const handleSignOrder = async () => {
    if (!wallet.isConnected || !wallet.address) {
      onConnectWallet();
      return;
    }

    setIsSigning(true);
    try {
      const res = await signLoanAuthorization(
        wallet.address,
        borrowAmount.toString(),
        interestBps,
        loanDurationDays
      );

      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + loanDurationDays);

      setSignedOrder({
        loanId: res.loanId,
        signature: res.signature,
        messageHash: res.messageHash,
        amount: borrowAmount,
        interest: interestAmount,
        dueDate: dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });

      const updated = await getAllRegisteredOrders();
      setRecentOrders(updated);

      // Trigger Confetti effect
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#bbfb3b', '#10b981', '#38bdf8', '#ffffff'],
      });
    } catch (err: any) {
      console.error('Failed to sign loan authorization', err);
      alert(err.message || 'Signature request rejected.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleInspectLoan = async (idNum: number) => {
    if (isNaN(idNum) || idNum < 0) return;
    setIsInspecting(true);
    try {
      const res = await inspectLoanOrderOnChain(idNum);
      setInspectionResult(res);
    } catch (e: any) {
      console.error('Inspection error:', e);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleFundLoan = async (id: number) => {
    setIsFunding(true);
    try {
      const res = await fundLoanOrder(id);
      setInspectionResult(res);
      const updated = await getAllRegisteredOrders();
      setRecentOrders(updated);
      confetti({
        particleCount: 65,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#10b981', '#ffffff'],
      });
    } catch (err: any) {
      alert(err.message || 'Funding disbursement failed');
    } finally {
      setIsFunding(false);
    }
  };

  const handleRepayLoan = async (id: number) => {
    setIsRepaying(true);
    try {
      const { inspection } = await repayLoanOrder(id);
      setInspectionResult(inspection);
      const updated = await getAllRegisteredOrders();
      setRecentOrders(updated);
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#bbfb3b', '#10b981', '#ffffff'],
      });
    } catch (err: any) {
      alert(err.message || 'Repayment & proof verification failed');
    } finally {
      setIsRepaying(false);
    }
  };

  const handleViewInInspector = (id: number) => {
    setInspectLoanId(id.toString());
    setActiveTab('inspect');
    handleInspectLoan(id);
  };


  return (
    <section id="protocol-console" className="section-padding">
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
              <Landmark size={13} />
              Creditcoin CC3 Liquidity Facility
            </div>
            <h2>Undercollateralized Borrowing Terminal</h2>
            <p>
              Access decentralized borrowing on Creditcoin CC3 underwritten by your portable Pātratā credit score. 
              Enjoy up to 95% LTV, 3.80% fixed APR, and cryptographically verified on-chain loan orders.
            </p>
          </div>

          {/* Action Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(10, 21, 15, 0.9)', padding: '4px', borderRadius: '9999px', border: '1px solid var(--lime-border)' }}>
            <button
              onClick={() => setActiveTab('originate')}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: activeTab === 'originate' ? 'var(--lime-primary)' : 'transparent',
                color: activeTab === 'originate' ? '#071911' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Originate Credit Line
            </button>
            <button
              onClick={() => {
                setActiveTab('inspect');
                if (!inspectionResult) handleInspectLoan(Number(inspectLoanId) || 7);
              }}
              style={{
                padding: '7px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: activeTab === 'inspect' ? 'var(--lime-primary)' : 'transparent',
                color: activeTab === 'inspect' ? '#071911' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              CC3 Loan Inspector
            </button>
          </div>
        </div>

        {/* Console Mode 1: Originate Loan Order */}
        {activeTab === 'originate' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '24px',
            alignItems: 'start',
          }} className="console-grid">
            
            {/* Left Column: Loan Configuration & Sliders */}
            <div className="card-glass" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>Originate Credit Line</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                    Creditcoin CC3 EVM ASCLoanManager
                  </p>
                </div>
                <span className="badge-pill badge-emerald">
                  <Sparkles size={13} />
                  Supatra Active (95% LTV)
                </span>
              </div>

              {/* Slider 1: Borrow Amount with Quick Chips */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Credit Principal (tCTC)
                  </label>
                  <div style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--lime-primary)',
                    fontFamily: 'var(--font-heading)',
                  }} className="font-mono">
                    {borrowAmount.toLocaleString()} tCTC
                  </div>
                </div>

                <input
                  type="range"
                  min="2000"
                  max="150000"
                  step="1000"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(Number(e.target.value))}
                  className="slider-lime"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Min: 2,000 tCTC | Max: 150,000 tCTC
                  </div>

                  {/* Quick Add Chips */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleQuickAdd(5000)}
                      className="badge-pill"
                      style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
                    >
                      +5k
                    </button>
                    <button
                      onClick={() => handleQuickAdd(25000)}
                      className="badge-pill"
                      style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
                    >
                      +25k
                    </button>
                    <button
                      onClick={() => setBorrowAmount(150000)}
                      className="badge-pill"
                      style={{ background: 'rgba(187, 251, 59, 0.1)', color: 'var(--lime-primary)', border: '1px solid var(--lime-primary)', cursor: 'pointer', fontWeight: 700 }}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider 2: Duration Horizon */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Repayment Horizon
                  </label>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#ffffff',
                  }} className="font-mono">
                    {loanDurationDays} Days
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[30, 60, 90, 180].map((days) => (
                    <button
                      key={days}
                      onClick={() => setLoanDurationDays(days)}
                      style={{
                        padding: '9px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: loanDurationDays === days ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.08)',
                        background: loanDurationDays === days ? 'rgba(187, 251, 59, 0.12)' : 'rgba(10, 21, 15, 0.7)',
                        color: loanDurationDays === days ? 'var(--lime-primary)' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Capital Efficiency Comparison Box */}
              <div style={{
                background: 'rgba(7, 20, 14, 0.85)',
                border: '1px solid rgba(187, 251, 59, 0.2)',
                borderRadius: '14px',
                padding: '18px 20px',
                marginBottom: '24px',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--lime-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Capital Efficiency Unlocked by Pātratā Underwriting
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Required Collateral (PatraFi 95% LTV)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-primary)' }} className="font-mono">
                      {collateralRequired.toLocaleString()} tCTC
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Standard Overcollateralized DeFi (150%)</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ef4444', textDecoration: 'line-through' }} className="font-mono">
                      {standardDefiCollateral.toLocaleString()} tCTC
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  🚀 You save <strong style={{ color: '#ffffff' }}>{capitalSaved.toLocaleString()} tCTC</strong> in locked capital thanks to cross-chain cryptographic attestation.
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleSignOrder}
                disabled={isSigning}
                className="btn-lime"
                style={{ width: '100%', padding: '14px', fontSize: '0.98rem' }}
              >
                {isSigning ? (
                  <span>Requesting Wallet Signature...</span>
                ) : !wallet.isConnected ? (
                  <>
                    <FileSignature size={16} />
                    <span>Connect Wallet to Sign Loan Order</span>
                  </>
                ) : (
                  <>
                    <FileSignature size={16} />
                    <span>Sign &amp; Register CC3 Loan Order ({borrowAmount.toLocaleString()} tCTC)</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Term Sheet & Signature Confirmation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Term Sheet Card */}
              <div className="card-glass" style={{ padding: '26px' }}>
                <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px' }}>
                  Loan Order Term Sheet
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Borrow Principal:</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }} className="font-mono">{borrowAmount.toLocaleString()} tCTC</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Fixed APR:</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lime-primary)' }} className="font-mono">3.80%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Expected Total Repayment:</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }} className="font-mono">{totalRepayment.toLocaleString()} tCTC</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Maturity Term:</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>{loanDurationDays} Days</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>Settlement Network:</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--lime-primary)' }}>Creditcoin CC3 Testnet</span>
                  </div>
                </div>
              </div>

              {/* Signed Order Confirmation Box */}
              {signedOrder && (
                <div className="card-glass" style={{
                  padding: '22px',
                  border: '1.5px solid var(--lime-primary)',
                  background: 'rgba(7, 24, 16, 0.95)',
                  boxShadow: '0 0 30px rgba(187, 251, 59, 0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lime-primary)', marginBottom: '8px' }}>
                    <CheckCircle2 size={17} />
                    <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Loan Order Cryptographically Signed!</span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                    Conforms to <code style={{ color: 'var(--lime-primary)' }}>ASCLoanManager.sol</code> order parameters on CC3.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Order ID: </span>
                      <span style={{ color: '#ffffff', fontWeight: 700 }}>#{signedOrder.loanId}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Due Date: </span>
                      <span style={{ color: '#ffffff' }}>{signedOrder.dueDate}</span>
                    </div>
                    <div style={{ wordBreak: 'break-all' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Message Hash: </span>
                      <span style={{ color: 'var(--lime-hover)' }}>{signedOrder.messageHash.slice(0, 22)}...</span>
                    </div>
                    <div style={{ wordBreak: 'break-all' }}>
                      <span style={{ color: 'var(--text-muted)' }}>EIP-191 Signature: </span>
                      <span style={{ color: 'var(--emerald-verified)' }}>{signedOrder.signature.slice(0, 28)}...</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleViewInInspector(signedOrder.loanId)}
                      className="btn-lime"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <span>Track Order #{signedOrder.loanId} in Inspector</span>
                      <ArrowRight size={13} />
                    </button>
                    <a
                      href={`${NETWORKS.CREDITCOIN_CC3.blockExplorerUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="badge-pill badge-lime"
                      style={{ textDecoration: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Explorer</span>
                      <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          /* Console Mode 2: CC3 On-Chain Loan Inspector */
          <div className="card-glass" style={{ padding: '30px' }}>
            <div style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Creditcoin CC3 On-Chain Loan Inspector & Solvency Engine
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                Directly inspects <code style={{ color: 'var(--lime-primary)' }}>ASCLoanManager.getLoanOrder(loanId)</code> and verifies settlement proofs via Native Precompile <code style={{ color: '#ffffff' }}>0x0FD2</code>.
              </p>
            </div>

            {/* Loan Search Bar & Quick Order Selectors */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  className="input-dark"
                  value={inspectLoanId}
                  onChange={(e) => setInspectLoanId(e.target.value)}
                  placeholder="Enter Loan ID (e.g. 1, 7, 42)..."
                  style={{ paddingLeft: '40px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <button
                onClick={() => handleInspectLoan(Number(inspectLoanId))}
                disabled={isInspecting}
                className="btn-lime"
                style={{ padding: '10px 22px' }}
              >
                {isInspecting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin-slow" />
                    <span>Querying CC3 EVM...</span>
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    <span>Inspect On-Chain</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {recentOrders.slice(0, 6).map((order) => (
                  <button
                    key={order.loanId}
                    onClick={() => {
                      setInspectLoanId(order.loanId.toString());
                      handleInspectLoan(order.loanId);
                    }}
                    className="badge-pill"
                    style={{
                      background: inspectLoanId === order.loanId.toString() ? 'rgba(187, 251, 59, 0.2)' : 'rgba(18, 38, 28, 0.8)',
                      color: order.status === 'Repaid' ? 'var(--emerald-verified)' : order.status === 'Funded' ? 'var(--lime-primary)' : '#38bdf8',
                      border: inspectLoanId === order.loanId.toString() ? '1px solid var(--lime-primary)' : '1px solid var(--lime-border)',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>#{order.loanId}</span>
                    <span style={{ opacity: 0.8, fontSize: '0.68rem' }}>({order.status})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inspection Results Display */}
            {inspectionResult && (
              <div style={{
                background: 'rgba(7, 20, 14, 0.95)',
                border: '1px solid var(--lime-border)',
                borderRadius: '14px',
                padding: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge-pill badge-lime" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                      Loan Order #{inspectionResult.loanId}
                    </span>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: inspectionResult.status === 'Repaid' ? 'var(--emerald-verified)' : inspectionResult.status === 'Funded' ? 'var(--lime-primary)' : '#38bdf8',
                    }}>
                      Status: {inspectionResult.status.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Settlement Layer: Creditcoin CC3 EVM
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                }}>
                  <div style={{ background: 'rgba(10, 25, 17, 0.7)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Lender (FundFlow.from)</div>
                    <div style={{ color: '#ffffff', wordBreak: 'break-all', marginTop: '4px' }}>{inspectionResult.from}</div>
                  </div>

                  <div style={{ background: 'rgba(10, 25, 17, 0.7)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Borrower (FundFlow.to)</div>
                    <div style={{ color: 'var(--lime-primary)', wordBreak: 'break-all', marginTop: '4px' }}>{inspectionResult.to}</div>
                  </div>

                  <div style={{ background: 'rgba(10, 25, 17, 0.7)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Principal Amount</div>
                    <div style={{ color: '#ffffff', fontWeight: 700, marginTop: '4px' }}>{inspectionResult.loanAmountFormatted} tCTC</div>
                  </div>

                  <div style={{ background: 'rgba(10, 25, 17, 0.7)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Expected Repayment</div>
                    <div style={{ color: 'var(--emerald-verified)', fontWeight: 700, marginTop: '4px' }}>{inspectionResult.expectedRepaymentFormatted} tCTC</div>
                  </div>

                  <div style={{ background: 'rgba(10, 25, 17, 0.7)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Deadline Block Height</div>
                    <div style={{ color: '#ffffff', marginTop: '4px' }}>#{inspectionResult.deadlineBlock.toLocaleString()}</div>
                  </div>

                  <div style={{ background: 'rgba(10, 25, 17, 0.7)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Settlement Verification</div>
                    <div style={{ color: 'var(--lime-primary)', marginTop: '4px' }}>Precompile 0x0FD2 Attested</div>
                  </div>
                </div>

                {/* Interactive Lifecycle Transition Actions */}
                {inspectionResult.status === 'Created' && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px 20px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}>
                    <div>
                      <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.88rem' }}>
                        ⚡ Step 2: Disburse / Fund Loan Order on Ethereum Sepolia
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', marginTop: '4px' }}>
                        The borrower signed the EIP-191 terms. The counterparty vault can now disburse liquidity on Sepolia.
                      </div>
                    </div>
                    <button
                      onClick={() => handleFundLoan(inspectionResult.loanId)}
                      disabled={isFunding}
                      className="btn-lime"
                      style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                    >
                      {isFunding ? 'Disbursing on Sepolia...' : 'Disburse & Fund on Sepolia'}
                    </button>
                  </div>
                )}

                {inspectionResult.status === 'Funded' && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px 20px',
                    background: 'rgba(187, 251, 59, 0.08)',
                    border: '1px solid rgba(187, 251, 59, 0.3)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}>
                    <div>
                      <div style={{ color: 'var(--lime-primary)', fontWeight: 700, fontSize: '0.88rem' }}>
                        🔒 Step 3: Repay & Settle via Attestcoin Precompile 0x0FD2
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', marginTop: '4px' }}>
                        Funded on Sepolia ({inspectionResult.fundingTxHash ? `${inspectionResult.fundingTxHash.slice(0, 16)}...` : 'Verified'}). Repay to trigger cryptographic verification against Creditcoin CC3 precompile!
                      </div>
                    </div>
                    <button
                      onClick={() => handleRepayLoan(inspectionResult.loanId)}
                      disabled={isRepaying}
                      className="btn-lime"
                      style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                    >
                      {isRepaying ? 'Verifying Precompile 0x0FD2...' : 'Repay & Settle via 0x0FD2'}
                    </button>
                  </div>
                )}

                {inspectionResult.status === 'Repaid' && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px 20px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-verified)', fontWeight: 700, fontSize: '0.88rem' }}>
                      <CheckCircle2 size={16} />
                      <span>Order Cryptographically Settled & Repaid on Creditcoin CC3</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Repayment verified on Creditcoin CC3 via native precompile <code style={{ color: 'var(--lime-primary)' }}>0x0FD2</code> without reliance on centralized oracles.
                    </div>
                    {inspectionResult.settlementTxHash && (
                      <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                        Settlement Digest: {inspectionResult.settlementTxHash}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 960px) {
          .console-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

