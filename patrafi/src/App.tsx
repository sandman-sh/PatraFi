import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveAttestationStream } from './components/LiveAttestationStream';
import { FinancialOverviewCard } from './components/FinancialOverviewCard';
import { PatrataScoreEngine } from './components/PatrataScoreEngine';
import { LiveProtocolConsole } from './components/LiveProtocolConsole';
import { AttestcoinVisualizer } from './components/AttestcoinVisualizer';
import { FlashShieldMonitor } from './components/FlashShieldMonitor';
import { Footer } from './components/Footer';
import type { WalletState } from './services/web3Service';
import {
  connectWeb3Wallet,
  switchToCreditcoinCC3,
  fetchLiveNetworkStatus,
} from './services/web3Service';

export const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    creditcoinBalance: '0.00',
    sepoliaBalance: '0.00',
    isCorrectNetwork: false,
  });

  const [cc3Block, setCc3Block] = useState<number>(5482929);
  const [sepoliaBlock, setSepoliaBlock] = useState<number>(11698572);

  // Poll live blockchain heights from RPCs
  useEffect(() => {
    let isMounted = true;

    const updateBlocks = async () => {
      try {
        const status = await fetchLiveNetworkStatus();
        if (isMounted) {
          if (status.creditcoinBlock > 0) setCc3Block(status.creditcoinBlock);
          if (status.sepoliaBlock > 0) setSepoliaBlock(status.sepoliaBlock);
        }
      } catch (err) {
        console.warn('Network sync poll warning', err);
      }
    };

    updateBlocks();
    const interval = setInterval(updateBlocks, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Check if wallet is already connected
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;

      ethereum.on?.('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWeb3Wallet().then(setWallet).catch(console.error);
        } else {
          setWallet({
            isConnected: false,
            address: null,
            chainId: null,
            creditcoinBalance: '0.00',
            sepoliaBalance: '0.00',
            isCorrectNetwork: false,
          });
        }
      });

      ethereum.on?.('chainChanged', () => {
        connectWeb3Wallet().then(setWallet).catch(console.error);
      });
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const res = await connectWeb3Wallet();
      setWallet(res);
    } catch (e: any) {
      console.warn('Wallet connection note:', e.message);
      alert(e.message || 'Unable to connect wallet');
    }
  };

  const handleSwitchNetwork = async () => {
    const success = await switchToCreditcoinCC3();
    if (success) {
      handleConnectWallet();
    }
  };

  return (
    <div className="app-wrapper">
      {/* Sticky Top Navbar */}
      <Navbar
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onSwitchNetwork={handleSwitchNetwork}
        networkBlockCC3={cc3Block}
        networkBlockSepolia={sepoliaBlock}
      />

      {/* Real-time verified attestation ticker tape */}
      <LiveAttestationStream />

      {/* Main Content Sections */}
      <main className="main-content">
        <HeroSection />
        
        <FinancialOverviewCard wallet={wallet} />

        <PatrataScoreEngine connectedAddress={wallet.address} />

        <LiveProtocolConsole wallet={wallet} onConnectWallet={handleConnectWallet} />

        <AttestcoinVisualizer />

        <FlashShieldMonitor
          creditcoinBalance={wallet.creditcoinBalance}
          sepoliaBalance={wallet.sepoliaBalance}
          walletAddress={wallet.address}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
