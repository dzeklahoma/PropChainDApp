import { ReceiptText, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types/property';
import { formatCurrency, formatDate, truncateAddress } from '../../lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionList = ({ transactions, loading = false }: TransactionListProps) => {
  if (loading) {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800">
        <ReceiptText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No transactions yet</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Your transaction history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {transactions.map((transaction) => {
        const statusColors = {
          pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };

        return (
          <div key={transaction.id} className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <ReceiptText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      From: {truncateAddress(transaction.fromAddress)}
                    </span>
                    <span className="mx-1">→</span>
                    <span>
                      To: {truncateAddress(transaction.toAddress)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-auto">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[transaction.status]}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.timestamp)}
                </span>
                <a 
                  href={`https://etherscan.io/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;