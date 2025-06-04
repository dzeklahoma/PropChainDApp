import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { MarketplaceABI, MARKETPLACE_ADDRESS } from "../constants";

const ListSale: React.FC = () => {
  const { signer, address } = useWeb3();
  const [deedId, setDeedId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const listForSale = async () => {
    if (!signer) {
      alert("Connect wallet");
      return;
    }
    try {
      setStatus("Listing for sale...");
      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MarketplaceABI,
        signer
      );
      const priceWei = ethers.parseEther(price); // expects a string in ether
      const tx = await marketplace.listForSale(Number(deedId), priceWei);
      await tx.wait();
      setStatus(`Deed ${deedId} listed at ${price} ETH. Tx: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed to list");
    }
  };

  const unlist = async () => {
    if (!signer) {
      alert("Connect wallet");
      return;
    }
    try {
      setStatus("Removing from sale...");
      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MarketplaceABI,
        signer
      );
      const tx = await marketplace.unlist(Number(deedId));
      await tx.wait();
      setStatus(`Deed ${deedId} removed from sale. Tx: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed to unlist");
    }
  };

  return (
    <div className="card">
      <h3>List / Unlist a Deed</h3>
      <label>
        Deed ID:
        <input
          type="number"
          value={deedId}
          onChange={(e) => setDeedId(e.target.value)}
        />
      </label>
      <label>
        Price (in ETH):
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.5"
        />
      </label>
      <button onClick={listForSale} disabled={!address || !deedId || !price}>
        List for Sale
      </button>
      <button onClick={unlist} disabled={!address || !deedId}>
        Remove from Sale
      </button>
      <p>{status}</p>
    </div>
  );
};

export default ListSale;
