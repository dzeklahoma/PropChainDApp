import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '../hooks/useToast';

// Add type declarations for Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  balance: string;
  signer: ethers.Signer | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedWallet = localStorage.getItem('walletConnected');
    if (savedWallet === 'true') {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      const signerInstance = await provider.getSigner();
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);

      setWalletAddress(address);
      setBalance(Number(balanceEth).toFixed(4));
      setIsConnected(true);
      setSigner(signerInstance);
      
      localStorage.setItem('walletConnected', 'true');
      
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been successfully connected.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setBalance('0');
    setSigner(null);
    localStorage.removeItem('walletConnected');
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
      variant: 'default',
    });
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      connectWallet,
      disconnectWallet,
      balance,
      signer
    }}>
      {children}
    </WalletContext.Provider>
  );
};