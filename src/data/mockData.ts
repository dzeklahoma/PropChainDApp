import { Transaction } from "../types/property";

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    propertyId: "prop-3",
    fromAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    toAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    amount: 875000,
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    status: "completed",
    txHash:
      "0x8c3f27bf5ded69a68e8fc926831f8cf8ee9e24a32b17ff1c919e4d34dfd3c615",
  },
];
