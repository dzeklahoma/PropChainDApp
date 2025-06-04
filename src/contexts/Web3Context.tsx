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
    // Use ethers v5 Web3Provider
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

      // On mount, fetch connected accounts
      web3Provider.listAccounts().then(async (accounts: string[]) => {
        if (accounts.length > 0) {
          const web3Signer = web3Provider.getSigner(accounts[0]);
          setProvider(web3Provider);
          setSigner(web3Signer);
          setAddress(accounts[0]);
        }
      });

      // Account change handler
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
          setSigner(null);
        } else {
          setAddress(accounts[0]);
          const web3Signer = web3Provider.getSigner(accounts[0]);
          setSigner(web3Signer);
        }
      };

      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        (window as any).ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, address, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
