import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRouter from './router/AppRouter';
import { WalletProvider } from './context/WalletContext';
import { PropertyProvider } from './context/PropertyContext';
import { Toaster } from './components/ui/Toaster';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ThemeProvider>
      <WalletProvider>
        <PropertyProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-[70vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <AppRouter />
              )}
            </main>
            <Footer />
            <Toaster />
          </div>
        </PropertyProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;