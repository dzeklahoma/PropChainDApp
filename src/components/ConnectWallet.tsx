import React from "react";
import { useWeb3 } from "../contexts/Web3Context";

const ConnectWallet: React.FC = () => {
  const { address, connectWallet } = useWeb3();

  return (
    <div className="card">
      {address ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default ConnectWallet;
