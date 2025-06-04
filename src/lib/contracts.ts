import { ethers } from "ethers";
import PropChainABI from "../contracts/PropChain.json";
import PropertyRegistryABI from "../contracts/PropertyRegistry.json";
import { getFromIPFS } from "./ipfs";

export const PROPCHAIN_ADDRESS = "0x3a04BA623197c9394B75A26f93868a6200c0c4A8";
export const PROPERTY_REGISTRY_ADDRESS = "0x8149CD89e2376Cb4bF852609d782B3d23C541560";

export const getContracts = async (signer: ethers.Signer) => {
  const propChain = new ethers.Contract(
    PROPCHAIN_ADDRESS,
    PropChainABI.abi,
    signer
  );

  const propertyRegistry = new ethers.Contract(
    PROPERTY_REGISTRY_ADDRESS,
    PropertyRegistryABI.abi,
    signer
  );

  return {
    propChain,
    propertyRegistry,
  };
};

export const requestProperty = async (
  signer: ethers.Signer,
  ipfsHash: string,
  fee: bigint
) => {
  const { propertyRegistry } = await getContracts(signer);
  const tx = await propertyRegistry.requestProperty(ipfsHash, { value: fee });
  return tx.wait();
};

export const getUserProperties = async (
  signer: ethers.Signer,
  address: string
) => {
  const { propertyRegistry } = await getContracts(signer);
  const requestIds = await propertyRegistry.getUserRequests(address);

  const properties = await Promise.all(
    requestIds.map(async (id: number) => {
      const request = await propertyRegistry.getPropertyRequest(id);
      const metadata = await getFromIPFS(request.ipfsHash);
      
      return {
        id: id.toString(),
        ipfsHash: request.ipfsHash,
        status: ["Pending", "Verified", "Rejected", "Withdrawn"][request.status],
        tokenId: request.tokenId.toString(),
        timestamp: new Date(Number(request.timestamp) * 1000),
        ...metadata // This will include title, description, price, etc.
      };
    })
  );

  return properties;
};

export const verifyProperty = async (
  signer: ethers.Signer,
  requestId: number
) => {
  const { propertyRegistry } = await getContracts(signer);
  const tx = await propertyRegistry.verifyProperty(requestId);
  return tx.wait();
};

export const rejectProperty = async (
  signer: ethers.Signer,
  requestId: number
) => {
  const { propertyRegistry } = await getContracts(signer);
  const tx = await propertyRegistry.rejectProperty(requestId);
  return tx.wait();
};

export const withdrawRequest = async (
  signer: ethers.Signer,
  requestId: number
) => {
  const { propertyRegistry } = await getContracts(signer);
  const tx = await propertyRegistry.withdrawRequest(requestId);
  return tx.wait();
};