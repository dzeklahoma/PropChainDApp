import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Wallet, ArrowRight } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useProperties } from '../context/PropertyContext';
import { mockTransactions } from '../data/mockData';
import PropertyCard from '../components/property/PropertyCard';
import TransactionList from '../components/transactions/TransactionList';
import { formatCurrency } from '../lib/utils';

const Dashboard = () => {
  const { walletAddress, balance } = useWallet();
  const { userProperties, loading } = useProperties();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    // Calculate total value of owned properties
    if (userProperties.length > 0) {
      const total = userProperties.reduce((sum, property) => sum + property.price, 0);
      setPortfolioValue(total);
    }

    // Get recent transactions
    setRecentTransactions(mockTransactions.slice(0, 3));
  }, [userProperties]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        My Dashboard
      </h1>

      {/* Account Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
              <Wallet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Balance</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{balance} ETH</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
              <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Properties Owned</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProperties.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mr-4">
              <svg 
                className="h-6 w-6 text-accent-600 dark:text-accent-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio Value</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(portfolioValue)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Properties */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Properties
          </h2>
          <Link 
            to="/properties" 
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center"
          >
            Browse more
            <ArrowRight className="ml-1 h-4 w-4" />
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : userProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No properties yet</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by browsing our available properties.</p>
            <Link to="/properties" className="mt-6 inline-block">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Browse Properties
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <Link 
            to="/transactions" 
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <TransactionList transactions={recentTransactions} loading={loading} />
      </section>
    </div>
  );
};

export default Dashboard;