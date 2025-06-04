import { useProperties } from '../context/PropertyContext';
import PropertyGrid from '../components/property/PropertyGrid';

const Properties = () => {
  const { properties, loading } = useProperties();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          All Properties
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse our curated selection of tokenized properties available on the blockchain.
        </p>
      </div>

      <PropertyGrid properties={properties} loading={loading} />
    </div>
  );
};

export default Properties;