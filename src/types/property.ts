export interface Property {
  id: string;
  ipfsHash: string;
  status: string;
  tokenId: string;
  timestamp: Date;
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  images?: string[];
  owner?: string;
}

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  location?: string;
  status?: string;
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