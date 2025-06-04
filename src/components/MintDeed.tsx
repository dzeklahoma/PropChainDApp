import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { TITLE_REGISTRY_ADDRESS, TitleRegistryABI } from "../constants";

const MintDeed: React.FC = () => {
  const { signer, address } = useWeb3();
  const [status, setStatus] = useState<string>("");

  const mint = async () => {
    if (!signer) {
      alert("Connect wallet first");
      return;
    }
    setStatus("Minting deed...");
    try {
      const titleRegistry = new ethers.Contract(
        TITLE_REGISTRY_ADDRESS,
        TitleRegistryABI,
        signer
      );
      const tx = await titleRegistry.mintDeed(address);
      await tx.wait();
      setStatus(`Deed minted (check ownerOf). TxHash: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Mint failed");
    }
  };

  return (
    <div className="card">
      <h3>Mint a New Deed</h3>
      <button onClick={mint} disabled={!address}>
        Mint Deed
      </button>
      <p>{status}</p>
    </div>
  );
};

export default MintDeed;
