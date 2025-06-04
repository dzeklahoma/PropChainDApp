import { useEffect, useState } from 'react';
import { mockTransactions } from '../data/mockData';
import TransactionList from '../components/transactions/TransactionList';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Transaction History
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        View and manage your property transactions on the blockchain.
      </p>

      <TransactionList transactions={transactions} loading={loading} />
    </div>
  );
};

export default Transactions;