import { ethers } from "ethers";
import PropChainABI from "../contracts/PropChain.json";
import PropertyRegistryABI from "../contracts/PropertyRegistry.json";

export const PROPCHAIN_ADDRESS = "0x3a04BA623197c9394B75A26f93868a6200c0c4A8"; // Replace with actual deployed contract address
export const PROPERTY_REGISTRY_ADDRESS =
  "0x8149CD89e2376Cb4bF852609d782B3d23C541560"; // Replace with actual deployed contract address

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
  fee: ethers.BigNumber
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
      return {
        id: id.toString(),
        ipfsHash: request.ipfsHash,
        status: ["Pending", "Verified", "Rejected", "Withdrawn"][
          request.status
        ],
        tokenId: request.tokenId.toString(),
        timestamp: new Date(request.timestamp * 1000),
      };
    })
  );

  return properties;
};
