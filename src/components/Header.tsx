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
      {/* Brand Logo Banner */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="block">
            <img 
              src="/Capture-2025-06-14-095519.png" 
              alt="NAOCAN - PRESERVED BUDDHA FLOWER" 
              className="w-full h-[300px] object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Small version for navigation */}
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src="/naocan-logo-copy.jpeg" 
                    alt="なおかん logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`font-medium transition-colors duration-200 flex items-center gap-2 ${
                        isActive(item.href)
                          ? 'text-primary-purple border-b-2 border-primary-purple'
                          : 'text-charcoal hover:text-primary-purple'
                      }`}
                    >
                      {item.name === '予約' && <Calendar size={16} />}
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
                      className="flex items-center p-2 text-charcoal hover:text-primary-purple transition-colors duration-200"
                    >
                      {authState.user?.avatar ? (
                        <img
                          src={authState.user.avatar}
                          alt={authState.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircle size={20} />
                      )}
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-charcoal">{authState.user?.name}</p>
                          <p className="text-xs text-gray-500">{authState.user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          プロフィール
                        </Link>
                        <Link
                          to="/reservation"
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-50 transition-colors duration-200 flex items-center"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Calendar size={16} className="mr-2" />
                          予約管理
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                        >
                          <LogOut size={16} className="mr-2" />
                          ログアウト
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-charcoal hover:text-primary-purple transition-colors duration-200"
                  >
                    <User size={20} />
                  </Link>
                )}
              </div>

              <Link 
                to="/favorites"
                className="p-2 text-charcoal hover:text-primary-purple transition-colors duration-200 relative"
              >
                <Heart size={20} />
                {favoritesState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesState.itemCount}
                  </span>
                )}
              </Link>
              <Link 
                to="/cart"
                className="p-2 text-charcoal hover:text-primary-purple transition-colors duration-200 relative"
              >
                <ShoppingCart size={20} />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-charcoal hover:text-primary-purple transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border-light bg-white">
              <nav className="py-4">
                <ul className="space-y-3">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`block px-4 py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${
                          isActive(item.href)
                            ? 'text-primary-purple bg-bg-cream'
                            : 'text-charcoal hover:text-primary-purple hover:bg-bg-cream'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name === '予約' && <Calendar size={16} />}
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {!authState.isAuthenticated && (
                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-2 font-medium text-charcoal hover:text-primary-purple hover:bg-bg-cream transition-colors duration-200"
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