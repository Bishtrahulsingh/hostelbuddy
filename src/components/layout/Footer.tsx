import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Home className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">RoomBuddy</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Find your perfect hostel or roommate with ease. RoomBuddy connects you with affordable accommodations and compatible roommates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/hostels" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Find Hostels
                </Link>
              </li>
              <li>
                <Link to="/roommates" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Find Roommates
                </Link>
              </li>
              <li>
                <Link to="/register-hostel" className="text-gray-400 hover:text-white transition-colors text-sm">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/register-roommate" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Register as Roommate
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">support@roombuddy.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RoomBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;