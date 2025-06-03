/*import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Property } from "../types/property";

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

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch data from the blockchain or API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProperties(mockProperties);

      // Filter some properties as user's properties for demo
      setUserProperties(mockProperties.slice(0, 2));
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
*/
