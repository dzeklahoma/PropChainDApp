import { ThemeProvider } from "./context/ThemeContext";
import { WalletProvider } from "./context/WalletContext";
import { PropertyProvider } from "./context/PropertyContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRouter from "./router/AppRouter";
import { Toaster } from "./components/ui/Toaster";

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <PropertyProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AppRouter />
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
