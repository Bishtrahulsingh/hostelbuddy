import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Search, Users, User, LogIn, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Home className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">RoomBuddy</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/hostels" className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                Find Hostels
              </Link>
              <Link to="/roommates" className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                Find Roommates
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center ml-4 md:ml-6">
                <Link to="/register-hostel" className="btn btn-secondary text-xs mr-2">
                  <PlusCircle className="mr-1 h-4 w-4" />
                  List Property
                </Link>
                <Link to="/profile" className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium">
                  <User className="inline mr-1 h-4 w-4" />
                  {user.name}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-900 hover:text-primary-500 px-3 py-2 text-sm font-medium"
                >
                  <LogOut className="inline mr-1 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link to="/login" className="btn btn-outline mr-2">
                  <LogIn className="mr-1 h-4 w-4" />
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg animate-enter">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <Home className="inline mr-2 h-5 w-5" />
              Home
            </Link>
            <Link to="/hostels" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <Search className="inline mr-2 h-5 w-5" />
              Find Hostels
            </Link>
            <Link to="/roommates" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              <Users className="inline mr-2 h-5 w-5" />
              Find Roommates
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-2 space-y-1">
                <Link to="/register-hostel" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle className="inline mr-2 h-5 w-5" />
                  List Property
                </Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                  <User className="inline mr-2 h-5 w-5" />
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="inline mr-2 h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-5 py-3 flex flex-col space-y-3">
                <Link to="/login" className="w-full btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </Link>
                <Link to="/register" className="w-full btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;