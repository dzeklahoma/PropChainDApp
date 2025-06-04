import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { KYC_REGISTRY_ADDRESS, KYCRegistryABI } from "../constants";

const ApproveKYC: React.FC = () => {
  const { signer, address } = useWeb3();
  const [inputAddress, setInputAddress] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const approve = async () => {
    if (!signer) {
      alert("Connect wallet");
      return;
    }
    setStatus("Submitting KYC approval...");
    try {
      const kyc = new ethers.Contract(
        KYC_REGISTRY_ADDRESS,
        KYCRegistryABI,
        signer
      );
      const tx = await kyc.approveKYC(inputAddress);
      await tx.wait();
      setStatus(`Approved KYC for ${inputAddress}. Tx: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed");
    }
  };

  const revoke = async () => {
    if (!signer) {
      alert("Connect wallet");
      return;
    }
    setStatus("Revoking KYC...");
    try {
      const kyc = new ethers.Contract(
        KYC_REGISTRY_ADDRESS,
        KYCRegistryABI,
        signer
      );
      const tx = await kyc.revokeKYC(inputAddress);
      await tx.wait();
      setStatus(`Revoked KYC for ${inputAddress}. Tx: ${tx.hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || "Failed");
    }
  };

  return (
    <div className="card">
      <h3>Approve / Revoke KYC</h3>
      <label>
        Address to (re)approve:
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="0x..."
        />
      </label>
      <button onClick={approve} disabled={!address || !inputAddress}>
        Approve KYC
      </button>
      <button onClick={revoke} disabled={!address || !inputAddress}>
        Revoke KYC
      </button>
      <p>{status}</p>
    </div>
  );
};

export default ApproveKYC;
