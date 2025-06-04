import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <div className="absolute bg-primary-600 dark:bg-primary-500 px-2 py-1 text-sm rounded rotate-12 text-white">
        Page Not Found
      </div>
      <div className="mt-5">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Oops! The page you're looking for doesn't exist.
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;