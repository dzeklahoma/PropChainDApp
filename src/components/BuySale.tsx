import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { MarketplaceABI, MARKETPLACE_ADDRESS } from "../constants";

const BuySale: React.FC = () => {
  const { signer, address } = useWeb3();
  const [deedId, setDeedId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const buy = async () => {
    if (!signer) {
      alert("Connect wallet");
      return;
    }
    try {
      setStatus("Purchasing deed...");
      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MarketplaceABI,
        signer
      );

      // First, you might want to fetch the listing price from a separate "listings" getter
      // but since our ABI fragment doesn't include a read method for price, assume user enters exact price manually.
      const priceWei = prompt("Enter the exact sale price (in wei):");
      if (!priceWei) {
        setStatus("Purchase cancelled");
        return;
      }

      const tx = await marketplace.buy(Number(deedId), {
        value: ethers.parseUnits(priceWei, 0),
      });
      await tx.wait();
      setStatus(`Purchase submitted. Tx: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed to buy");
    }
  };

  return (
    <div className="card">
      <h3>Buy a Listed Deed</h3>
      <label>
        Deed ID:
        <input
          type="number"
          value={deedId}
          onChange={(e) => setDeedId(e.target.value)}
        />
      </label>
      <button onClick={buy} disabled={!address || !deedId}>
        Buy Deed
      </button>
      <p>{status}</p>
    </div>
  );
};

export default BuySale;
