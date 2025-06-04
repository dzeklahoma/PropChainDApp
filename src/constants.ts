import KYCRegistryJSON from "./contracts/KYCRegistry.json";
import TitleRegistryJSON from "./contracts/TitleRegistry.json";
import LienRegistryJSON from "./contracts/LienRegistry.json";
import DocumentRegistryJSON from "./contracts/DocumentRegistry.json";
import FeeSplitterJSON from "./contracts/FeeSplitter.json";
import MarketplaceJSON from "./contracts/Marketplace.json";
import EscrowMultiSigJSON from "./contracts/EscrowMultiSig.json";

export const KYC_REGISTRY_ADDRESS        = "0xYOUR_KYCREGISTRY_ADDRESS";
export const TITLE_REGISTRY_ADDRESS      = "0xYOUR_TITLEREGISTRY_ADDRESS";
export const LIEN_REGISTRY_ADDRESS       = "0xYOUR_LIENREGISTRY_ADDRESS";
export const DOCUMENT_REGISTRY_ADDRESS   = "0xYOUR_DOCUMENTREGISTRY_ADDRESS";
export const FEE_SPLITTER_ADDRESS        = "0xYOUR_FEESPLITTER_ADDRESS";
export const MARKETPLACE_ADDRESS         = "0xYOUR_MARKETPLACE_ADDRESS";

export const KYCRegistryABI = KYCRegistryJSON.abi;
export const TitleRegistryABI = TitleRegistryJSON.abi;
export const LienRegistryABI = LienRegistryJSON.abi;
export const DocumentRegistryABI = DocumentRegistryJSON.abi;
export const FeeSplitterABI = FeeSplitterJSON.abi;
export const MarketplaceABI = MarketplaceJSON.abi;
export const EscrowMultiSigABI = EscrowMultiSigJSON.abi;
