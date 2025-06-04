import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Property } from "../types/property";
import { useWallet } from "./WalletContext";
import { getUserProperties } from "../lib/contracts";

interface PropertyContextType {
  properties: Property[];
  userProperties: Property[];
  loading: boolean;
  fetchProperties: () => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
}

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider = ({ children }: PropertyProviderProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { signer, walletAddress } = useWallet();

  useEffect(() => {
    if (signer && walletAddress) {
      fetchProperties();
    }
  }, [signer, walletAddress]);

  const fetchProperties = async () => {
    if (!signer || !walletAddress) return;
    
    setLoading(true);
    try {
      const props = await getUserProperties(signer, walletAddress);
      setProperties(props);
      setUserProperties(props);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = (id: string) => {
    return properties.find((property) => property.id === id);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        userProperties,
        loading,
        fetchProperties,
        getPropertyById,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};