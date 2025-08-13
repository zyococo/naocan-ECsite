import React, { useState } from 'react';
import { User, Heart, ShoppingCart, Menu, X, LogOut, UserCircle, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { state: cartState } = useCart();
  const { state: favoritesState } = useFavorites();
  const { state: authState, logout } = useAuth();

  const navigationItems = [
    { name: 'プリザーブド仏花', href: '/buddhist-flowers' },
    { name: 'プリザーブドフラワー', href: '/preserved-flowers' },
    { name: 'お問い合わせ', href: '/contact' },
    { name: '予約', href: '/reservation' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Header Image Banner */}
      <div className="w-full">
        <img 
          src="/header.png" 
          alt="なおかん ヘッダー画像" 
          className="w-full h-120 object-cover"
        />
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-border-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Small version for navigation */}
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-primary-dark-green tracking-wider">なおかん</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-12">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`font-medium transition-colors duration-300 tracking-wide text-base ${
                        isActive(item.href)
                          ? 'text-primary-dark-green border-b border-primary-dark-green pb-1'
                          : 'text-text-charcoal hover:text-primary-dark-green'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative">
                {authState.isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center p-2 text-text-charcoal hover:text-primary-dark-green transition-colors duration-300"
                    >
                      {authState.user?.avatar ? (
                        <img
                          src={authState.user.avatar}
                          alt={authState.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-dark-green flex items-center justify-center">
                          <UserCircle size={24} className="text-white" />
                        </div>
                      )}
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-border-light py-2 z-50">
                        <div className="px-4 py-3 border-b border-border-light">
                          <p className="text-sm font-medium text-text-dark">{authState.user?.name}</p>
                          <p className="text-xs text-text-gray">{authState.user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-sm text-text-charcoal hover:bg-soft-green transition-colors duration-300"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          プロフィール
                        </Link>
                        <Link
                          to="/reservation"
                          className="block px-4 py-3 text-sm text-text-charcoal hover:bg-soft-green transition-colors duration-300 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Calendar size={18} className="mr-2" />
                          予約管理
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-primary-dark-green hover:bg-soft-green transition-colors duration-300 flex items-center"
                        >
                          <LogOut size={18} className="mr-2" />
                          ログアウト
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-text-charcoal hover:text-primary-dark-green transition-colors duration-300"
                  >
                    <User size={24} />
                  </Link>
                )}
              </div>

              <Link 
                to="/favorites"
                className="p-2 text-text-charcoal hover:text-primary-dark-green transition-colors duration-300 relative"
              >
                <Heart size={24} />
                {favoritesState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-sakura text-text-dark text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {favoritesState.itemCount}
                  </span>
                )}
              </Link>
              <Link 
                to="/cart"
                className="p-2 text-text-charcoal hover:text-primary-dark-green transition-colors duration-300 relative"
              >
                <ShoppingCart size={24} />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-gold text-text-dark text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-text-charcoal hover:text-primary-dark-green transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border-light bg-white">
              <nav className="py-6">
                <ul className="space-y-4">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`block px-6 py-3 font-medium transition-colors duration-300 tracking-wide ${
                          isActive(item.href)
                            ? 'text-primary-dark-green bg-soft-green'
                            : 'text-text-charcoal hover:text-primary-dark-green hover:bg-soft-green'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {!authState.isAuthenticated && (
                    <li>
                      <Link
                        to="/login"
                        className="block px-6 py-3 font-medium text-text-charcoal hover:text-primary-dark-green hover:bg-soft-green transition-colors duration-300 tracking-wide"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ログイン
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* Click outside to close user menu */}
        {isUserMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;