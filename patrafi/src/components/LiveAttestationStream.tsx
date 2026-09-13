import React, { useState, useEffect } from 'react';
import { Check, Radio, ExternalLink } from 'lucide-react';
import { fetchLiveChainEvents, type LiveAttestationItem } from '../services/web3Service';
import { NETWORKS } from '../contracts/config';

export const LiveAttestationStream: React.FC = () => {
  const [items, setItems] = useState<LiveAttestationItem[]>([
    {
      id: 'init-1',
      source: 'CC3 EVM #5,482,929',
      action: 'LoanRegistered Order #2',
      proof: '0x395ed0...72b8',
      status: 'On-Chain Validated',
      time: 'Just now',
      blockNumber: 5482929,
      txHash: '0x395ed02d8ee98551e6caa9e75a634abcc9ad0df2d29f70884cf4c9c104fc72b8',
      chain: 'CC3',
    },
    {
      id: 'init-2',
      source: 'CC3 EVM #5,482,928',
      action: 'LoanRepaid Order #1 Settled',
      proof: '0x4f6419...3c96',
      status: 'Attested via 0x0FD2',
      time: 'Just now',
      blockNumber: 5482928,
      txHash: '0x4f6419741a09e4c35e5fcf97bf3089190c2d001a079be19d2f8fa154b23e3c96',
      chain: 'CC3',
    },
    {
      id: 'init-3',
      source: 'CC3 EVM #5,482,927',
      action: 'LoanFunded Order #1 Confirmed',
      proof: '0xf33ceb...3438',
      status: 'Disbursed On-Chain',
      time: '1m ago',
      blockNumber: 5482927,
      txHash: '0xf33cebad77cfe52864adf532ba119faa4e3538dfbeb43a8701a087f9aedd3438',
      chain: 'CC3',
    },
  ]);

  // Periodically fetch real mined blocks & events from RPCs
  useEffect(() => {
    let isMounted = true;

    const refreshEvents = async () => {
      try {
        const liveEvents = await fetchLiveChainEvents();
        if (isMounted && liveEvents && liveEvents.length > 0) {
          setItems(liveEvents);
        }
      } catch (e) {
        console.warn('Attestation stream live update note:', e);
      }
    };

    refreshEvents();
    const interval = setInterval(refreshEvents, 14000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{
      borderTop: '1px solid var(--lime-border)',
      borderBottom: '1px solid var(--lime-border)',
      background: 'rgba(5, 14, 9, 0.96)',
      padding: '10px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Left/Right Edge Fades */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '60px',
        background: 'linear-gradient(to right, #060d09, transparent)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '60px',
        background: 'linear-gradient(to left, #060d09, transparent)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          animation: 'tickerTape 42s linear infinite',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}
        className="ticker-container"
      >
        {/* Double array to create seamless infinite ticker tape */}
        {[...items, ...items].map((item, index) => {
          const explorerUrl = item.chain === 'CC3' 
            ? `${NETWORKS.CREDITCOIN_CC3.blockExplorerUrl}/tx/${item.txHash}`
            : `${NETWORKS.SEPOLIA.blockExplorerUrl}/tx/${item.txHash}`;

          return (
            <a
              key={`${item.id}-${index}`}
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                padding: '6px 14px',
                background: 'rgba(12, 30, 20, 0.75)',
                borderRadius: '9999px',
                border: '1px solid var(--lime-border)',
                fontSize: '0.78rem',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: item.chain === 'CC3' ? 'var(--lime-primary)' : '#38bdf8',
                boxShadow: `0 0 6px ${item.chain === 'CC3' ? 'var(--lime-primary)' : '#38bdf8'}`,
                display: 'inline-block',
              }} />
              <span style={{ color: item.chain === 'CC3' ? 'var(--lime-primary)' : '#38bdf8', fontWeight: 700 }} className="font-mono">
                {item.source}
              </span>
              <span style={{ color: '#ffffff', fontWeight: 500 }}>{item.action}</span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[{item.proof}]</span>
              <span className="badge-pill badge-emerald" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                <Check size={10} />
                {item.status}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{item.time}</span>
            </a>
          );
        })}
      </div>

      <style>{`
        .ticker-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
