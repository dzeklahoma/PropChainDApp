import KYCRegistryJSON from "./contracts/KYCRegistry.json";
import TitleRegistryJSON from "./contracts/TitleRegistry.json";
import LienRegistryJSON from "./contracts/LienRegistry.json";
import DocumentRegistryJSON from "./contracts/DocumentRegistry.json";
import FeeSplitterJSON from "./contracts/FeeSplitter.json";
import MarketplaceJSON from "./contracts/Marketplace.json";
import EscrowMultiSigJSON from "./contracts/EscrowMultiSig.json";

export const KYC_REGISTRY_ADDRESS =
  "0x1622A1eb537D0D9E63eD2e3475E500bb056eE480";
export const TITLE_REGISTRY_ADDRESS =
  "0xcb7c6714fe31228e0eE09bcE58ACF4a9B6A98473";
export const LIEN_REGISTRY_ADDRESS =
  "0xAcF07E7B798c83A39a877c696e3A8AdCbed7506B";
export const DOCUMENT_REGISTRY_ADDRESS =
  "0x582dbc16640DA26f26D9c85AE9c932A0ee42CD4a";
export const FEE_SPLITTER_ADDRESS =
  "0x6d262134F85DcD4ed4e96a9ae012A9D34fEb3699";
export const MARKETPLACE_ADDRESS = "0x1Ca0BB5d6F51345da8B3c252FAe7B2ad28Aa34fE";

export const KYCRegistryABI = KYCRegistryJSON.abi;
export const TitleRegistryABI = TitleRegistryJSON.abi;
export const LienRegistryABI = LienRegistryJSON.abi;
export const DocumentRegistryABI = DocumentRegistryJSON.abi;
export const FeeSplitterABI = FeeSplitterJSON.abi;
export const MarketplaceABI = MarketplaceJSON.abi;
export const EscrowMultiSigABI = EscrowMultiSigJSON.abi;
