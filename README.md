# PropChainDApp Frontend

This React/TypeScript application provides a UI for interacting with your Sepolia‐deployed PropChain smart contracts. Using this DApp, you can:

1. Connect MetaMask (Sepolia)
2. Mint new property deeds (ERC-721 NFTs) as the “government” address
3. Approve or revoke KYC for seller/buyer addresses
4. List a deed for sale on the Marketplace
5. Purchase a deed (which automatically creates a multisig escrow)
6. Approve and execute the escrow (2-of-3 multisig) to finalize ownership transfer and funds distribution

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Project Structure](#project-structure)  
3. [Installation](#installation)  
4. [Configuration](#configuration)  
   - [Updating Contract Addresses](#updating-contract-addresses)  
5. [Running the App](#running-the-app)  
6. [How to Use the UI](#how-to-use-the-ui)  
7. [License](#license)  

---

## Prerequisites

- **Node.js** (v16.x or v18.x recommended)  
- **npm** (v8.x or v9.x)  
- **MetaMask** browser extension configured for Sepolia Test Network  
- Some **Sepolia ETH** in each testing account (request from a Sepolia faucet: https://faucet.sepolia.dev/)  
- Deployed on-chain contract addresses for:
  - `KYCRegistry`
  - `TitleRegistry`
  - `LienRegistry`
  - `DocumentRegistry`
  - `FeeSplitter`
  - `Marketplace`

---

## Project Structure

PropChainDApp/
├─ package.json
├─ tsconfig.json
├─ public/
│ └─ index.html
├─ src/
│ ├─ constants.ts
│ ├─ index.tsx
│ ├─ App.tsx
│ ├─ index.css
│ ├─ contexts/
│ │ └─ Web3Context.tsx
│ ├─ components/
│ │ ├─ ConnectWallet.tsx
│ │ ├─ MintDeed.tsx
│ │ ├─ ApproveKYC.tsx
│ │ ├─ ListSale.tsx
│ │ ├─ BuySale.tsx
│ │ └─ ApproveEscrow.tsx
│ └─ contracts/
│ ├─ KYCRegistry.json
│ ├─ TitleRegistry.json
│ ├─ LienRegistry.json
│ ├─ DocumentRegistry.json
│ ├─ FeeSplitter.json
│ ├─ Marketplace.json
│ └─ EscrowMultiSig.json
└─ README.md
- **`constants.ts`** – Holds contract addresses and imports of compiled ABIs.  
- **`contexts/Web3Context.tsx`** – React Context to manage `ethers.providers.Web3Provider`, `Signer`, and connected wallet address.  
- **`components/`** – UI panels for each on‐chain action (connect, mint, KYC, list, buy, escrow).  
- **`contracts/*.json`** – Compiled ABI + metadata for each Solidity contract. Used by `ethers.Contract` in the frontend.

---

## Installation

1. **Open a terminal** and navigate to the project root (where `package.json` lives):
   ```bash
   cd /path/to/PropChainDApp
2. npm install
3. 
## Configuration

## Updating Contract Addresses
Open src/constants.ts and replace the placeholder strings with your actual Sepolia addresses:


// src/constants.ts

export const KYC_REGISTRY_ADDRESS        = "0xYOUR_KYCREGISTRY_ADDRESS";
export const TITLE_REGISTRY_ADDRESS      = "0xYOUR_TITLEREGISTRY_ADDRESS";
export const LIEN_REGISTRY_ADDRESS       = "0xYOUR_LIENREGISTRY_ADDRESS";
export const DOCUMENT_REGISTRY_ADDRESS   = "0xYOUR_DOCUMENTREGISTRY_ADDRESS";
export const FEE_SPLITTER_ADDRESS        = "0xYOUR_FEESPLITTER_ADDRESS";
export const MARKETPLACE_ADDRESS         = "0xYOUR_MARKETPLACE_ADDRESS";

import KYCRegistryJSON        from "./contracts/KYCRegistry.json";
import TitleRegistryJSON      from "./contracts/TitleRegistry.json";
import LienRegistryJSON       from "./contracts/LienRegistry.json";
import DocumentRegistryJSON   from "./contracts/DocumentRegistry.json";
import FeeSplitterJSON        from "./contracts/FeeSplitter.json";
import MarketplaceJSON        from "./contracts/Marketplace.json";
import EscrowMultiSigJSON     from "./contracts/EscrowMultiSig.json";

export const KYCRegistryABI        = KYCRegistryJSON.abi;
export const TitleRegistryABI      = TitleRegistryJSON.abi;
export const LienRegistryABI       = LienRegistryJSON.abi;
export const DocumentRegistryABI   = DocumentRegistryJSON.abi;
export const FeeSplitterABI        = FeeSplitterJSON.abi;
export const MarketplaceABI        = MarketplaceJSON.abi;
export const EscrowMultiSigABI     = EscrowMultiSigJSON.abi;
Be sure each 0x… address exactly matches the deployed contract on Sepolia.

Save constants.ts after updating.

## Running the App

Confirm MetaMask is on Sepolia and you have some Sepolia ETH in:
+ Government / KYC admin account
+ Seller account
+ Buyer account
+ Escrow signer accounts
+ Start the Dev Server:
+ npm start

This runs react-scripts start with NODE_OPTIONS=--openssl-legacy-provider (needed on Node ≥ 17 to avoid OpenSSL errors).
Your default browser should open at http://localhost:3000. If not, open it manually.
Watch the terminal for any compile errors. Once it finishes, you’ll see six panels in the UI:
+ Connected: 0x…
+ Mint a New Deed
+ Approve / Revoke KYC
+ List / Unlist a Deed
+ Buy a Listed Deed
+ Approve & Execute Escrow

## How to Use the UI

Note: Always keep MetaMask set to Sepolia Test Network.

## 1. Connect Wallet
Click Connect MetaMask (upper card).
Approve the MetaMask prompt.
The UI will display:
Connected: 0xYourAddress
indicating your current wallet.

## 2. Mint a New Deed
Role: Only the Government address (used in TitleRegistry’s constructor) can mint.
Switch MetaMask to your government address (e.g., 0x24EFD4…).
In “Mint a New Deed”, click Mint Deed.
MetaMask will prompt to call mintDeed(governmentAddress). Confirm it.
UI status:
+ Sending mint transaction…
+ Wait 30s–2min for Sepolia confirmation.
Once mined, the UI shows:
✅ Deed minted! TxHash: 0xABC123…
Verify on Sepolia Etherscan that titleRegistry.ownerOf(0) === governmentAddress.

## 3. Approve / Revoke KYC
Role: Only the KYC Admin (by default, same as the government) can grant or revoke KYC.
Ensure MetaMask is on KYC admin (e.g., 0x24EFD4…).
Under “Approve / Revoke KYC”, enter an address to whitelist (e.g., 0x73005b9… for Buyer).
Click Approve KYC. Confirm MetaMask: approveKYC(0x73005b9…).
UI shows:
+ Approved KYC for 0x73005b9…. Tx: 0xDEF456…
+ Repeat for Seller (0x24EFD4…) if not already KYCed.
To revoke, enter the same address and click Revoke KYC.
Tip: In the browser console, you can verify:
await kycRegistry.isKYCed("0x73005b9…");  // true/false

## 4. List / Unlist a Deed
Role: Only the deed owner (and KYCed) can list on the Marketplace.
Prerequisite: Deed #0 must exist (from Step 2) and have no active liens.
Switch MetaMask to Seller (0x24EFD4…).
Under “List / Unlist a Deed”, enter:
Deed ID: 0
Price (in ETH): 1.0
Click List for Sale. Confirm listForSale(0, ethers.utils.parseEther("1.0")).
UI shows “Listing for sale…”. After confirmation, it displays:
+ Deed 0 listed at 1.0 ETH. Tx: 0xABC789…
To remove from sale, click Remove from Sale with Deed ID still set to 0. Confirm unlist(0).
Once mined, Deed #0 is no longer active (active = false).

## 5. Buy a Listed Deed
Role: Any KYC-approved address (≠ current owner) can buy.
Prerequisite: Deed #0 must be actively listed.
Switch MetaMask to Buyer (0x73005b9…).
Under “Buy a Listed Deed”, enter Deed ID: 0.
Click Buy Deed. A browser prompt asks for the exact price in wei. Since listing is 1 ETH, enter:
1000000000000000000
MetaMask will prompt buy(0, { value: 1000000000000000000 }). Confirm.

UI shows “Purchasing deed…”. On Sepolia Etherscan, watch for:
+ 0.01 ETH → FeeSplitter
+ 0.99 ETH → new EscrowMultiSig
Once mined, UI displays:
+ Purchase submitted. Tx: 0xDEF012…
The new EscrowMultiSig address is returned by:
const escrowAddr = await marketplace.escrowForDeed(0);
console.log("Escrow for Deed 0: ", escrowAddr);

## 6. Approve & Execute Escrow
Role: Any of the three escrow signer addresses can approve. You set threshold = 2 (2-of-3).
Prerequisite: Buyer just called buy(0) (Step 5) → new escrow exists.
Switch MetaMask to Escrow Signer #1 (e.g., 0x24EFD4…).
Under “Approve & Execute Escrow”, enter Deed ID: 0.
Click Approve + Execute:
Calls:
+ await escrow.approveTx(0);      // first approval
+ await escrow.executeTx(0);      // this reverts until two approvals exist
Combined flow:
First signer’s approveTx(0) records approval.
executeTx(0) will revert (since only 1-of-2). That’s expected.
Switch MetaMask to Escrow Signer #2 (e.g., 0x73005b9…).
Enter Deed ID: 0 again, click Approve + Execute:
Now 2-of-3 approvals exist → executeTx(0) succeeds:
+ titleRegistry.transferFrom(seller, buyer, 0) → ownership moves to Buyer.
Escrow sends 0.99 ETH to Seller.
Emits TxExecuted(0).
Verify final state:
TitleRegistry: ownerOf(0) returns Buyer (0x73005b9…).
Seller (0x24EFD4…) balance increased by ~0.99 ETH (minus gas).
FeeSplitter recipients each received their share of 0.01 ETH.

## License

This frontend and its accompanying smart-contract code are released under the MIT License.
Feel free to fork, modify, and adapt for your own use.
