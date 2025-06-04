import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building2, LayoutDashboard, ReceiptText, Moon, Sun, Wallet } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import { truncateAddress } from '../../lib/utils';

const NavLink = ({ to, children, currentPath }: { to: string; children: React.ReactNode; currentPath: string }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-primary-100 text-primary-700 dark:bg-gray-800 dark:text-primary-400' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isConnected, walletAddress, connectWallet, disconnectWallet, balance } = useWallet();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
            <Building2 className="h-7 w-7" />
            <span>PropChain</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" currentPath={location.pathname}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/properties" currentPath={location.pathname}>
              <Building2 className="h-4 w-4" />
              <span>Properties</span>
            </NavLink>
            {isConnected && (
              <>
                <NavLink to="/dashboard" currentPath={location.pathname}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/transactions" currentPath={location.pathname}>
                  <ReceiptText className="h-4 w-4" />
                  <span>Transactions</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm bg-primary-50 dark:bg-gray-800 rounded-full px-3 py-1 text-primary-700 dark:text-primary-300">
                  {balance} ETH
                </div>
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-primary-100 dark:bg-gray-800 text-primary-700 dark:text-primary-300 rounded-full px-4 py-1.5 text-sm font-medium">
                    <Wallet className="h-4 w-4" />
                    {truncateAddress(walletAddress || '')}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={disconnectWallet}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="hidden md:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-30 bg-gray-900/50 dark:bg-black/50 transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        } transition-all duration-300`}
        onClick={closeMenu}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <NavLink to="/" currentPath={location.pathname}>
                <Home className="h-4 w-4" />
                <span>Home</span>
              </NavLink>
              <NavLink to="/properties" currentPath={location.pathname}>
                <Building2 className="h-4 w-4" />
                <span>Properties</span>
              </NavLink>
              {isConnected && (
                <>
                  <NavLink to="/dashboard" currentPath={location.pathname}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink to="/transactions" currentPath={location.pathname}>
                    <ReceiptText className="h-4 w-4" />
                    <span>Transactions</span>
                  </NavLink>
                </>
              )}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wallet</p>
                    <span className="text-sm bg-primary-50 dark:bg-gray-800 rounded-full px-2 py-0.5 text-primary-700 dark:text-primary-300">
                      {balance} ETH
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 break-all">
                    {truncateAddress(walletAddress || '', 10)}
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-lg px-4 py-2 text-sm font-medium"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;