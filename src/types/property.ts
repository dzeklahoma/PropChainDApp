export interface PropertyMetadata {
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  images: string[];
}

export interface Property extends PropertyMetadata {
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