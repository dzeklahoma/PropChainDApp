import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import {
  MarketplaceABI,
  MARKETPLACE_ADDRESS,
  EscrowMultiSigABI,
} from "../constants";

const ApproveEscrow: React.FC = () => {
  const { provider, signer, address } = useWeb3();
  const [deedId, setDeedId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const approveAndExecute = async () => {
    if (!provider || !signer) {
      alert("Connect wallet");
      return;
    }
    try {
      setStatus("Fetching escrow address...");
      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MarketplaceABI,
        provider
      );
      const escrowAddress = await marketplace.escrowForDeed(Number(deedId));
      if (escrowAddress === ethers.ZeroAddress) {
        setStatus("No escrow found for that deed");
        return;
      }

      // Each signer must call approveTx(0), then one calls executeTx(0).
      setStatus("Approving escrow Tx...");
      const escrowContract = new ethers.Contract(
        escrowAddress,
        EscrowMultiSigABI,
        signer
      );
      const approveTx = await escrowContract.approveTx(0);
      await approveTx.wait();

      setStatus("Approval submitted. Now attempt to execute...");
      const executeTx = await escrowContract.executeTx(0);
      await executeTx.wait();

      setStatus("Escrow executed; deed should have transferred!");
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Escrow approval/execution failed");
    }
  };

  return (
    <div className="card">
      <h3>Approve & Execute Escrow</h3>
      <label>
        Deed ID (to find its escrow):
        <input
          type="number"
          value={deedId}
          onChange={(e) => setDeedId(e.target.value)}
        />
      </label>
      <button onClick={approveAndExecute} disabled={!address || !deedId}>
        Approve + Execute
      </button>
      <p>{status}</p>
    </div>
  );
};

export default ApproveEscrow;
