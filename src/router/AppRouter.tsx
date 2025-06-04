import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Properties from '../pages/Properties';
import PropertyDetail from '../pages/PropertyDetail';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Transactions from '../pages/Transactions';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;