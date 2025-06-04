import React from "react";
import ConnectWallet from "./components/ConnectWallet";
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
      <div className="container">
        <h1>On‐Chain Real‐Estate DApp</h1>
        <ConnectWallet />

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
