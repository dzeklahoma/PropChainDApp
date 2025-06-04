export interface Property {
  id: string;
  ipfsHash: string;
  status: "Pending" | "Verified" | "Rejected" | "Withdrawn";
  tokenId: string;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  propertyId: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: number;
  status: "pending" | "completed" | "failed";
  txHash: string;
}
