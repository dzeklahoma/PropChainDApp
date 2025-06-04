import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { TITLE_REGISTRY_ADDRESS, TitleRegistryABI } from "../constants";

export default function AdminMint() {
  // Track whether this wallet holds GOVERNMENT_ROLE:
  const [isGovernment, setIsGovernment] = useState<boolean>(false);
  const [loadingRole, setLoadingRole] = useState<boolean>(true);

  // State for the mint form:
  const [cid, setCid] = useState<string>("");
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [metadata, setMetadata] = useState<any>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [minting, setMinting] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1) On mount, check if connected wallet has GOVERNMENT_ROLE
  useEffect(() => {
    async function checkGovRole() {
      const anyWindow = window as any;
      if (!anyWindow.ethereum) {
        setLoadingRole(false);
        return;
      }
      try {
        await anyWindow.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(anyWindow.ethereum);
        const signer = provider.getSigner();
        const myAddress = (await signer.getAddress()).toLowerCase();

        const titleRegistry = new ethers.Contract(
          TITLE_REGISTRY_ADDRESS,
          TitleRegistryABI,
          provider
        );

        const GOVERNMENT_ROLE = ethers.utils.id("GOVERNMENT_ROLE");
        const hasGov: boolean = await titleRegistry.hasRole(
          GOVERNMENT_ROLE,
          myAddress
        );
        setIsGovernment(hasGov);
      } catch (e) {
        console.error("Error checking GOVERNMENT_ROLE:", e);
        setIsGovernment(false);
      } finally {
        setLoadingRole(false);
      }
    }

    checkGovRole();
  }, []);

  // 2) Whenever CID changes, fetch JSON from IPFS (for preview)
  useEffect(() => {
    if (!cid) {
      setMetadata(null);
      setFetchError(null);
      return;
    }

    const fetchFromIPFS = async () => {
      setFetching(true);
      setFetchError(null);
      try {
        const url = `https://ipfs.io/ipfs/${cid}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json(); // try to parse as JSON
        setMetadata(json);
      } catch (err: any) {
        console.warn("Failed to fetch/parse JSON from IPFS:", err);
        setMetadata(null);
        setFetchError("Not JSON or fetch failed. View raw file below.");
      } finally {
        setFetching(false);
      }
    };

    fetchFromIPFS();
  }, [cid]);

  // 3) Mint handler
  async function handleMint() {
    setError(null);
    if (!ethers.utils.isAddress(targetAddress)) {
      setError("Invalid wallet address");
      return;
    }
    try {
      setMinting(true);
      const anyWindow = window as any;
      if (!anyWindow.ethereum) {
        throw new Error("MetaMask not found");
      }
      await anyWindow.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(anyWindow.ethereum);
      const signer = provider.getSigner(); // must be government
      const titleRegistry = new ethers.Contract(
        TITLE_REGISTRY_ADDRESS,
        TitleRegistryABI,
        signer
      );
      const tx = await titleRegistry.mintDeed(targetAddress);
      setTxHash(tx.hash);
      await tx.wait();
      setMinting(false);
      alert(`✅ Minted successfully! Tx: ${tx.hash}`);
      setTargetAddress("");
      setCid("");
      setMetadata(null);
      setFetchError(null);
    } catch (e: any) {
      console.error("Mint error:", e);
      setError(e.message || "Minting failed");
      setMinting(false);
    }
  }

  // 4) If we’re still figuring out the role, show a loading state:
  if (loadingRole) {
    return <div className="p-4">Checking government role…</div>;
  }

  // 5) If not government, show “access denied” and skip the mint form:
  if (!isGovernment) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
        ❌ You do NOT hold the GOVERNMENT_ROLE. Access denied.
      </div>
    );
  }

  // 6) Otherwise, render the mint form (with IPFS preview, etc.)
  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold">🖋️ Mint Title NFT (Government)</h2>

      {/* CID input */}
      <div>
        <label className="block text-sm font-medium">
          User’s Registration CID (IPFS)
        </label>
        <input
          type="text"
          placeholder="QmXyz123abc456…"
          className="mt-1 w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500"
          value={cid}
          onChange={(e) => setCid(e.target.value.trim())}
          disabled={minting}
        />
      </div>

      {/* IPFS json preview or view‐raw link */}
      {fetching && (
        <div className="text-gray-600">⏳ Fetching data from IPFS…</div>
      )}
      {metadata && (
        <div className="mt-2 p-3 bg-gray-50 rounded border">
          <h3 className="font-medium">📄 Parsed Metadata from IPFS</h3>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
      {fetchError && (
        <div className="mt-2 p-3 bg-gray-50 rounded border">
          <p className="font-medium text-sm text-gray-800">🌐 {fetchError}</p>
          <a
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View raw IPFS file
          </a>
        </div>
      )}

      {/* Target wallet input */}
      <div>
        <label className="block text-sm font-medium">User Wallet Address</label>
        <input
          type="text"
          placeholder="0x1234…abcd"
          className="mt-1 w-full border rounded px-2 py-1 focus:outline-none focus:border-blue-500"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value.trim())}
          disabled={minting}
        />
      </div>

      {/* Show any error messages */}
      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      {/* Mint button */}
      <button
        disabled={minting}
        onClick={handleMint}
        className={`w-full py-2 px-4 rounded text-white ${
          minting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {minting ? "Minting…" : "Mint NFT to User"}
      </button>

      {/* Display last transaction hash */}
      {txHash && (
        <div className="text-green-700 text-sm">
          Last transaction:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {txHash.slice(0, 10)}…{txHash.slice(-10)}
          </a>
        </div>
      )}
    </div>
  );
}
