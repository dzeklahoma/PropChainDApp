import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

type Web3ContextType = {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | null;
  connectWallet: () => Promise<void>;
};

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  connectWallet: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask");
      return;
    }
    const web3Provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await web3Provider.send("eth_requestAccounts", []);
    const web3Signer = web3Provider.getSigner();
    const addr = await web3Signer.getAddress();
    setProvider(web3Provider);
    setSigner(web3Signer);
    setAddress(addr);
  };

  useEffect(() => {
    if ((window as any).ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      web3Provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          const web3Signer = web3Provider.getSigner();
          setProvider(web3Provider);
          setSigner(web3Signer);
          setAddress(accounts[0]);
        }
      });
      // Listen for account changes
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
          setSigner(null);
        } else {
          setAddress(accounts[0]);
          setSigner(web3Provider.getSigner());
        }
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, address, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
