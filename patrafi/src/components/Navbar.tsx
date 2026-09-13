import React, { useState } from 'react';
import { Shield, RefreshCw, Menu, X, ArrowUpRight, ExternalLink, Check, Copy } from 'lucide-react';
import { NETWORKS } from '../contracts/config';
import type { WalletState } from '../services/web3Service';

interface NavbarProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onSwitchNetwork: () => void;
  networkBlockCC3: number;
  networkBlockSepolia: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnectWallet,
  onSwitchNetwork,
  networkBlockCC3,
  networkBlockSepolia,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Pātratā Score', href: '#patrata-score' },
    { label: 'Borrowing Facility', href: '#protocol-console' },
    { label: 'Precompile 0x0FD2', href: '#architecture' },
    { label: 'Flash-Shield', href: '#flash-shield' },
  ];

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(8, 10, 15, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        padding: '12px 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Brand Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #101c26 0%, #080d14 100%)',
              border: '1.5px solid var(--lime-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 245, 155, 0.2)',
            }}>
              <Shield size={22} color="var(--lime-primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}>
                  Patra<span style={{ color: 'var(--lime-primary)' }}>FI</span>
                </span>
                <span className="badge-pill badge-lime" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>
                  CC3
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Sovereign Credit Underwriting
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="desktop-nav">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Live Network Status & Wallet Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Live RPC Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(14, 19, 28, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
            }} className="network-telemetry-pill">
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--status-emerald)',
                boxShadow: '0 0 6px var(--status-emerald)',
                display: 'inline-block',
              }} />
              <span className="font-mono">CC3 #{networkBlockCC3 > 0 ? networkBlockCC3.toLocaleString() : '1,845,209'}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span className="font-mono">Sepolia #{networkBlockSepolia > 0 ? networkBlockSepolia.toLocaleString() : '7,612,940'}</span>
            </div>

            {/* Web3 Wallet Button */}
            {wallet.isConnected && wallet.address ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!wallet.isCorrectNetwork && (
                  <button
                    onClick={onSwitchNetwork}
                    className="btn-dark"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.76rem',
                      color: 'var(--status-amber)',
                      borderColor: 'var(--status-amber)',
                    }}
                    title="Switch to Creditcoin CC3 Testnet"
                  >
                    <RefreshCw size={12} />
                    Switch CC3
                  </button>
                )}
                <div
                  onClick={() => handleCopyAddress(wallet.address || '')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(16, 22, 32, 0.9)',
                    border: '1px solid var(--lime-border)',
                    borderRadius: '9999px',
                    padding: '5px 12px',
                    cursor: 'pointer',
                  }}
                  title="Click to copy address"
                >
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--lime-primary)',
                  }} className="font-mono">
                    {wallet.creditcoinBalance} tCTC
                  </span>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {copiedAddr ? 'Copied!' : `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                  </span>
                </div>
              </div>
            ) : (
              <button onClick={onConnectWallet} className="btn-lime" style={{ padding: '8px 18px', fontSize: '0.84rem' }}>
                <Shield size={14} />
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-dark mobile-menu-toggle"
              style={{
                padding: '6px',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'none',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-nav-drawer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Patra<span style={{ color: 'var(--lime-primary)' }}>FI</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!wallet.isConnected ? (
                <button
                  onClick={() => {
                    onConnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-lime"
                  style={{ width: '100%' }}
                >
                  <Shield size={15} />
                  Connect Wallet
                </button>
              ) : (
                <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--lime-primary)' }}>
                  Connected: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .network-telemetry-pill {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
