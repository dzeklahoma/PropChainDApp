import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Wallet, Coins } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/ui/Button';

const Home = () => {
  const { properties, loading } = useProperties();
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    // Get featured or random properties for the showcase
    const featured = properties.filter(p => p.featured).slice(0, 3);
    setFeaturedProperties(featured.length ? featured : properties.slice(0, 3));
  }, [properties]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        </div>
        
        <div className="relative py-20 px-6 sm:px-12 max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Real Estate on the <span className="text-primary-200">Blockchain</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Buy, sell, and invest in properties with complete transparency and security through blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button variant="default" size="lg">
                Browse Properties
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Featured Properties
          </h2>
          <Link 
            to="/properties" 
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <div className="aspect-video"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mt-24 bg-gray-50 dark:bg-gray-800/50 py-16 px-4 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose PropChain?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our blockchain-based platform revolutionizes the way you buy, sell, and invest in real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tokenized Properties</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Each property is represented as a unique token on the blockchain, providing proof of ownership.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Secure Transactions</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Smart contracts ensure secure, transparent transactions without intermediaries.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Digital Ownership</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your property portfolio digitally with complete ownership records.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Coins className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Reduced Fees</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lower transaction costs by eliminating traditional real estate fees and commissions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Join the Real Estate Revolution?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Connect your wallet and start exploring blockchain-powered property transactions today.
          </p>
          <Link to="/properties">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;