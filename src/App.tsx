// src/App.tsx

import React from "react";
import ConnectWallet from "./components/ConnectWallet";
import AdminMint from "./components/AdminMint";
import MintDeed from "./components/MintDeed";
import ApproveKYC from "./components/ApproveKYC";
import ListSale from "./components/ListSale";
import BuySale from "./components/BuySale";
import ApproveEscrow from "./components/ApproveEscrow";
import { Web3Provider } from "./contexts/Web3Context";
import "./index.css";

function App() {
  return (
    <Web3Provider>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">PropChain</h1>

        {/* Always connect wallet first */}
        <ConnectWallet />

        {/* Admin‐only mint form (checks GOVERNMENT_ROLE internally) */}
        <AdminMint />

        {/* Regular user flows */}
        <MintDeed />
        <ApproveKYC />
        <ListSale />
        <BuySale />
        <ApproveEscrow />
      </div>
    </Web3Provider>
  );
}

export default App;
