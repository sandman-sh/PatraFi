import React from 'react';
import { ExternalLink, Shield } from 'lucide-react';
import { NETWORKS, PROTOCOL_CONTRACTS } from '../contracts/config';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: '#05070b',
      padding: '52px 0 26px 0',
      position: 'relative',
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1.1fr 1.1fr',
          gap: '36px',
          marginBottom: '44px',
        }} className="footer-grid">
          
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #101c26 0%, #080d14 100%)',
                border: '1.5px solid var(--lime-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={18} color="var(--lime-primary)" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Patra<span style={{ color: 'var(--lime-primary)' }}>FI</span>
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '340px', marginBottom: '16px' }}>
              Decentralized sovereign credit underwriting and real-time liquidation shield protocol. 
              Bridging cryptographically verified debt history natively to Creditcoin CC3.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              <span>Target Precompile:</span>
              <code style={{ color: 'var(--lime-primary)' }} className="font-mono">0x00...0FD2</code>
            </div>
          </div>

          {/* Col 2: Protocol In-Page Links */}
          <div>
            <h5 style={{ fontSize: '0.86rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
              Protocol
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <li>
                <a href="#overview" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  Financial Overview
                </a>
              </li>
              <li>
                <a href="#patrata-score" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  Pātratā Underwriting
                </a>
              </li>
              <li>
                <a href="#protocol-console" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  Borrowing Facility
                </a>
              </li>
              <li>
                <a href="#architecture" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  Precompile 0x0FD2 Pipeline
                </a>
              </li>
              <li>
                <a href="#flash-shield" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                  Flash-Shield Guardian
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Ecosystem & Docs */}
          <div>
            <h5 style={{ fontSize: '0.86rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
              Ecosystem &amp; Docs
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <li>
                <a
                  href="https://docs.attestcoin.org/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Attestcoin Documentation</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href={NETWORKS.CREDITCOIN_CC3.blockExplorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Creditcoin CC3 Explorer</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.creditcoin.org/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Creditcoin L1 Docs</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href={NETWORKS.SEPOLIA.blockExplorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Sepolia Explorer</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contracts */}
          <div>
            <h5 style={{ fontSize: '0.86rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
              Verified Contracts
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>ASCLoanManager (CC3):</div>
                <div style={{ color: 'var(--lime-primary)' }}>{PROTOCOL_CONTRACTS.PATRA_CREDIT_MANAGER.slice(0, 16)}...</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Block Prover Precompile:</div>
                <div style={{ color: 'var(--status-cyan)' }}>0x0000...0FD2</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Chain ID:</div>
                <div style={{ color: '#ffffff' }}>102031 (Creditcoin CC3)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.76rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          <div>
            &copy; {new Date().getFullYear()} PatraFi Protocol. All rights reserved. Sovereign Cross-Chain Credit.
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>Zero Oracle Trust Assumption</span>
            <span>Synchronous Merkle Proofs</span>
            <span>Precompile 0x0FD2 Spec</span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
